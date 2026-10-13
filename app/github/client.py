import asyncio
import base64
import logging
import os
import time

import httpx

from app.schemas import Candidate, RepoInfo

log = logging.getLogger(__name__)

RATE_RESERVE = 100  # stop optional README calls when fewer than this many requests remain


class GitHubError(Exception):
    pass


class GitHubNotFound(GitHubError):
    pass


async def _empty() -> str:
    return ""


class GitHubClient:
    BASE = "https://api.github.com"

    def __init__(
        self,
        token: str | None = None,
        concurrency: int | None = None,
        readme_repos: int | None = None,
        cache_ttl_s: int = 6 * 3600,
        cache_max: int = 500,
    ):
        token = token or os.getenv("GITHUB_TOKEN")
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "rock-n-roll-discover",
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"
        self._http = httpx.AsyncClient(base_url=self.BASE, headers=headers, timeout=20)
        # ONE global cap on in-flight requests (not per-candidate semaphores that multiply)
        self._sem = asyncio.Semaphore(concurrency or int(os.getenv("GITHUB_CONCURRENCY", "5")))
        self.readme_repos = readme_repos if readme_repos is not None else int(os.getenv("README_REPOS", "3"))
        self._cache: dict[str, tuple[float, Candidate]] = {}
        self._cache_ttl = cache_ttl_s
        self._cache_max = cache_max
        self.rate_remaining: int | None = None
        self.readme_skipped = 0  # READMEs not fetched (rate limit / errors); surfaced as a warning

    async def aclose(self) -> None:
        await self._http.aclose()

    # ------------------------------------------------------------------ core
    async def _get(self, path: str, params: dict | None = None):
        last = "unknown"
        for attempt in range(4):
            try:
                async with self._sem:
                    resp = await self._http.get(path, params=params)
            except httpx.TransportError as e:
                last = f"transport error: {e}"
                await asyncio.sleep(2**attempt)
                continue

            rem = resp.headers.get("x-ratelimit-remaining")
            if rem and rem.isdigit():
                self.rate_remaining = int(rem)

            if resp.status_code == 200:
                return resp.json()
            if resp.status_code == 404:
                raise GitHubNotFound(path)
            if resp.status_code in (403, 429):
                retry_after = resp.headers.get("retry-after")
                reset_time = resp.headers.get("x-ratelimit-reset")
                
                if retry_after and retry_after.isdigit() and int(retry_after) <= 60:
                    await asyncio.sleep(int(retry_after))
                    continue
                elif reset_time and reset_time.isdigit():
                    sleep_time = int(reset_time) - time.time()
                    if 0 < sleep_time <= 65:
                        log.warning(f"GitHub search rate limit reached. Sleeping {sleep_time:.1f}s...")
                        await asyncio.sleep(sleep_time + 1)
                        continue
                raise GitHubError(f"GitHub rate limit reached. Set GITHUB_TOKEN or retry later. Details: {resp.text[:200]}")
            if resp.status_code >= 500:
                last = f"HTTP {resp.status_code}"
                await asyncio.sleep(2**attempt)
                continue
            raise GitHubError(f"GitHub {resp.status_code} on {path}: {resp.text[:200]}")
        raise GitHubError(f"GitHub request failed after retries ({last}): {path}")

    # ---------------------------------------------------------------- search
    async def search_users(self, query: str, per_page: int = 100) -> list[str]:
        # No sort=followers: that only ever surfaces famous developers. Default is best-match.
        data = await self._get("/search/users", {"q": f"{query} type:user", "per_page": per_page})
        return [u["login"] for u in data.get("items", [])]

    async def search_repo_owners(self, topic: str, language: str | None = None, per_page: int = 100) -> list[str]:
        query = f"topic:{topic}" + (f" language:{language}" if language else "")
        data = await self._get("/search/repositories", {"q": query, "sort": "stars", "per_page": per_page})
        return [r["owner"]["login"] for r in data.get("items", []) if r.get("owner", {}).get("type") == "User"]

    # ---------------------------------------------------------------- README
    async def get_readme(self, username: str, repo_name: str, max_chars: int = 3000) -> str:
        """Best-effort. 404 -> ''. Rate-limit/other errors are counted (not silently lost)."""
        if self.rate_remaining is not None and self.rate_remaining < RATE_RESERVE:
            self.readme_skipped += 1
            return ""
        try:
            data = await self._get(f"/repos/{username}/{repo_name}/readme")
        except GitHubNotFound:
            return ""
        except GitHubError as e:
            self.readme_skipped += 1
            log.warning("README fetch failed for %s/%s: %s", username, repo_name, e)
            return ""
        content = data.get("content")
        if not content:
            return ""
        return base64.b64decode(content).decode("utf-8", errors="ignore")[:max_chars]

    # -------------------------------------------------------------- candidate
    async def get_candidate(self, username: str, repo_limit: int = 15) -> Candidate:
        key = username.lower()
        hit = self._cache.get(key)
        if hit and time.monotonic() - hit[0] < self._cache_ttl:
            return hit[1]

        user, repos = await asyncio.gather(
            self._get(f"/users/{username}"),
            self._get(f"/users/{username}/repos", {"per_page": 30, "sort": "pushed", "type": "owner"}),
        )
        repos = [r for r in repos if not r.get("fork")][:repo_limit]

        # README only for the top-N repos by stars: ~(2 + N) API calls per candidate instead of ~17
        targets = {
            r["name"]
            for r in sorted(repos, key=lambda r: r.get("stargazers_count", 0), reverse=True)[: self.readme_repos]
        }
        readmes = await asyncio.gather(
            *[self.get_readme(username, r["name"]) if r["name"] in targets else _empty() for r in repos]
        )

        repo_models = [
            RepoInfo(
                name=r["name"],
                description=r.get("description"),
                language=r.get("language"),
                topics=r.get("topics", []),
                stars=r.get("stargazers_count", 0),
                created_at=r.get("created_at"),
                pushed_at=r.get("pushed_at"),
                url=r["html_url"],
                readme=readme or None,
            )
            for r, readme in zip(repos, readmes)
        ]

        counts: dict[str, int] = {}
        for r in repo_models:
            if r.language:
                counts[r.language] = counts.get(r.language, 0) + 1

        cand = Candidate(
            username=user["login"],
            name=user.get("name"),
            profile_url=user["html_url"],
            avatar_url=user.get("avatar_url"),
            bio=user.get("bio"),
            location=user.get("location"),
            followers=user.get("followers", 0),
            public_repos=user.get("public_repos", 0),
            account_created=user.get("created_at"),
            top_languages=sorted(counts, key=counts.get, reverse=True)[:5],
            repos=repo_models,
        )

        if len(self._cache) >= self._cache_max:
            del self._cache[min(self._cache, key=lambda k: self._cache[k][0])]
        self._cache[key] = (time.monotonic(), cand)
        return cand