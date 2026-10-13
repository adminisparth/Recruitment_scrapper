from __future__ import annotations

import asyncio
import os

from langgraph.graph import END, StateGraph

from app.github.client import (
    GitHubClient,
    GitHubError,
)

from app.graph.state import (
    DiscoverState,
)

from app.schemas import (
    Candidate,
    JobRequirements,
    ScoredCandidate,
    )

from app.services.documents import (
    build_candidate_text,
    build_job_text,
    evidence_text,
    evidence_tokens,
    top_repos,
    years_active,
)

from app.services.embeddings import (
    EmbeddingService,
    cosine_similarity,
    similarity_to_score,
)

from app.services.job_extractor import (
    extract_job_requirements,
)

from app.services.skills import (
    LANGUAGES,
    match_skills,
)


# ============================================================
# HELPERS
# ============================================================

def _topic(skill: str) -> str:
    """
    Convert a skill into a GitHub topic/search-friendly form.
    """

    return (
        skill
        .strip()
        .lower()
        .replace(" ", "-")
    )


# ============================================================
# SEMANTIC + SKILL + EXPERIENCE RANKING
# ============================================================

def semantic_score_candidate(
    candidate: Candidate,
    job_embedding,
    embedding_service: EmbeddingService,
    requirements: JobRequirements,
    two_tower=None,
    job_text: str = "",
) -> ScoredCandidate:

    # ========================================================
    # 1. BUILD CANDIDATE TEXT
    # ========================================================

    candidate_text = build_candidate_text(
        candidate
    )

    # ========================================================
    # 2. CREATE CANDIDATE EMBEDDING
    # ========================================================

    candidate_embedding = (
        embedding_service.encode(
            candidate_text
        )
    )

    # ========================================================
    # 3. SEMANTIC SCORE
    #
    # Prefer Two-Tower if available.
    # Otherwise use USE cosine similarity.
    # ========================================================

    if two_tower is not None:

        try:

            semantic_score = float(
                two_tower.score_single(
                    job_text,
                    candidate_text,
                )
            )

        except Exception:

            similarity = cosine_similarity(
                job_embedding,
                candidate_embedding,
            )

            semantic_score = (
                similarity_to_score(
                    similarity
                )
            )

    else:

        similarity = cosine_similarity(
            job_embedding,
            candidate_embedding,
        )

        semantic_score = (
            similarity_to_score(
                similarity
            )
        )

    # ========================================================
    # 4. SKILL MATCHING
    # ========================================================

    tokens = evidence_tokens(
        candidate
    )

    evidence = evidence_text(
        candidate
    )

    matched, missing = match_skills(
        requirements.skills,
        tokens,
        evidence,
    )

    if requirements.skills:

        skill_coverage = (
            len(matched)
            / len(requirements.skills)
        )

    else:

        skill_coverage = 0.0

    # ========================================================
    # 5. EXPERIENCE SCORE
    # ========================================================

    years = years_active(
        candidate
    )

    if requirements.min_years_experience:

        experience_score = min(
            years
            / requirements.min_years_experience,
            1.0,
        )

    else:

        experience_score = 0.5

    # ========================================================
    # 6. FINAL SCORE
    #
    # Current weighting:
    #
    # Semantic       65%
    # Skills         25%
    # Experience     10%
    # ========================================================

    final_score = (
        0.65 * semantic_score
        + 0.25 * skill_coverage
        + 0.10 * experience_score
    )

    # ========================================================
    # 7. HUGGING FACE EVIDENCE
    #
    # Internal objects:
    #
    # HFCandidate
    #     ├── HFModel
    #     ├── HFDataset
    #     └── HFSpace
    #
    # API schema:
    #
    # #     ├── HFModelInfo
    #     ├── HFDatasetInfo
    #     └── HFSpaceInfo
    #
    # We explicitly convert all nested objects.
    # ========================================================


    top_repo_models = []
    if getattr(candidate, "repos", None):
        sorted_repos = sorted(candidate.repos, key=lambda r: getattr(r, "stargazers_count", 0), reverse=True)[:8]
        for r in sorted_repos:
            top_repo_models.append(
                {
                    "name": r.name,
                    "description": r.description,
                    "language": r.language,
                    "url": getattr(r, "url", ""),
                    "stargazers_count": getattr(r, "stargazers_count", 0),
                    "forks_count": getattr(r, "forks_count", 0),
                }
            )

    return ScoredCandidate(

        username=candidate.username,

        name=candidate.name,

        profile_url=candidate.profile_url,

        avatar_url=candidate.avatar_url,

        bio=candidate.bio,

        location=candidate.location,

        followers=candidate.followers,

        public_repos=candidate.public_repos,

        top_languages=candidate.top_languages,

        top_repos=top_repo_models,


        score=round(
            final_score,
            4,
        ),

        semantic_score=round(
            semantic_score,
            4,
        ),

        skill_coverage=round(
            skill_coverage,
            4,
        ),

        experience_score=round(
            experience_score,
            4,
        ),

        years_active=years,

        matched_skills=matched,

        missing_skills=missing,
    )


# ============================================================
# BUILD DISCOVER LANGGRAPH
# ============================================================

def build_discover_graph(
    github: GitHubClient,
    embedding_service: EmbeddingService | None = None,
    two_tower=None,
):

    # ========================================================
    # CONFIGURATION
    # ========================================================

    max_candidates = int(
        os.getenv(
            "MAX_CANDIDATES",
            "200",
        )
    )

    if embedding_service is None:

        embedding_service = (
            EmbeddingService()
        )


    # ========================================================
    # NODE 1
    # EXTRACT JOB REQUIREMENTS
    # ========================================================

    async def extract_job_node(
        state: DiscoverState,
    ):

        requirements = (
            await extract_job_requirements(
                state["job_description"]
            )
        )

        return {
            "requirements": requirements,
            "warnings": [],
        }

    # ========================================================
    # NODE 2
    # SEARCH GITHUB CANDIDATES
    # ========================================================

    async def search_node(
        state: DiscoverState,
    ):

        requirements = (
            state["requirements"]
        )

        warnings = list(
            state.get(
                "warnings",
                [],
            )
        )

        # ====================================================
        # SPLIT LANGUAGES AND OTHER SKILLS
        # ====================================================

        languages = [
            skill
            for skill in requirements.skills
            if skill.lower()
            in LANGUAGES
        ]

        other_skills = [
            skill
            for skill in requirements.skills
            if skill.lower()
            not in LANGUAGES
        ]

        # ====================================================
        # LOCATION
        # ====================================================

        location = ""

        if requirements.location:

            location = (
                f" location:"
                f"{requirements.location}"
            )

        # ====================================================
        # BUILD SEARCHES
        # ====================================================

        searches = []

        # ----------------------------------------------------
        # Language searches
        # ----------------------------------------------------

        for language in languages:

            searches.append(
                github.search_users(
                    f"language:{language}"
                    f"{location}"
                    f" repos:>3"
                    f" followers:>5"
                )
            )

        # ----------------------------------------------------
        # Skill/topic searches
        # ----------------------------------------------------

        for skill in other_skills:

            searches.append(
                github.search_repo_owners(
                    _topic(skill),
                    languages[0]
                    if languages
                    else None,
                )
            )

        # ====================================================
        # NO SEARCHES
        # ====================================================

        if not searches:

            warnings.append(
                "No GitHub search queries "
                "could be generated from "
                "the extracted requirements."
            )

            return {
                "candidate_logins": [],
                "warnings": warnings,
            }

        # ====================================================
        # RUN SEARCHES CONCURRENTLY
        # ====================================================

        results = await asyncio.gather(
            *searches,
            return_exceptions=True,
        )

        # username -> number of search queries matched
        seen: dict[str, int] = {}

        # ====================================================
        # MERGE RESULTS
        # ====================================================

        for result in results:

            if isinstance(
                result,
                Exception,
            ):

                warnings.append(
                    str(result)
                )

                continue

            for login in result:

                seen[login] = (
                    seen.get(
                        login,
                        0,
                    )
                    + 1
                )

        # ====================================================
        # RANK SEARCH RESULTS
        # ====================================================

        ordered = sorted(
            seen,
            key=seen.get,
            reverse=True,
        )[:max_candidates]

        return {
            "candidate_logins": ordered,

            "warnings": list(
                dict.fromkeys(
                    warnings
                )
            ),
        }

    # ========================================================
    # NODE 3
    # ENRICH CANDIDATES
    # ========================================================

    async def enrich_node(
        state: DiscoverState,
    ):

        warnings = list(
            state.get(
                "warnings",
                [],
            )
        )

        # ====================================================
        # GITHUB CONCURRENCY
        # ====================================================

        github_semaphore = asyncio.Semaphore(
            50
        )

        # ====================================================
        # FETCH GITHUB PROFILE
        # ====================================================

        async def fetch_github(
            username: str,
        ):

            async with github_semaphore:

                return await (
                    github.get_candidate(
                        username
                    )
                )

        # ====================================================
        # FETCH ALL GITHUB CANDIDATES
        # ====================================================

        github_results = (
            await asyncio.gather(
                *[
                    fetch_github(
                        username
                    )
                    for username
                    in state.get(
                        "candidate_logins",
                        [],
                    )
                ],
                return_exceptions=True,
            )
        )

        candidates: list[
            Candidate
        ] = []

        # ====================================================
        # PROCESS GITHUB RESULTS
        # ====================================================

        for result in github_results:

            if isinstance(
                result,
                GitHubError,
            ):

                warnings.append(
                    str(result)
                )

            elif isinstance(
                result,
                Exception,
            ):

                warnings.append(
                    "GitHub profile fetch "
                    f"failed: {result}"
                )

            else:

                candidates.append(
                    result
                )

        return {
            "candidates": candidates,

            "warnings": list(
                dict.fromkeys(
                    warnings
                )
            ),
        }

    # ========================================================
    # NODE 4
    # RANK CANDIDATES
    # ========================================================

    async def rank_node(
        state: DiscoverState,
    ):

        requirements = (
            state["requirements"]
        )

        # ====================================================
        # BUILD JOB TEXT
        # ====================================================

        job_text = build_job_text(
            state["job_description"],
            requirements,
        )

        # ====================================================
        # JOB EMBEDDING
        # ====================================================

        job_embedding = (
            embedding_service.encode(
                job_text
            )
        )

        ranked: list[
            ScoredCandidate
        ] = []

        # ====================================================
        # SCORE EVERY CANDIDATE
        # ====================================================

        for candidate in state.get(
            "candidates",
            [],
        ):

            scored = (
                semantic_score_candidate(
                    candidate=(
                        candidate
                    ),

                    job_embedding=(
                        job_embedding
                    ),

                    embedding_service=(
                        embedding_service
                    ),

                    requirements=(
                        requirements
                    ),

                    two_tower=(
                        two_tower
                    ),

                    job_text=(
                        job_text
                    ),
                )
            )

            ranked.append(
                scored
            )

        # ====================================================
        # SORT BY FINAL SCORE
        # ====================================================

        ranked.sort(
            key=lambda candidate:
                candidate.score,

            reverse=True,
        )

        # ====================================================
        # TOP N
        # ====================================================

        top_n = state.get(
            "top_n",
            10,
        )

        shortlist_n = state.get(
            "shortlist_n",
            3,
        )

        top_candidates = (
            ranked[:top_n]
        )

        shortlist = (
            top_candidates[
                :shortlist_n
            ]
        )

        # ====================================================
        # SEMANTIC MODEL NAME
        # ====================================================

        semantic_model = (

            two_tower.version

            if two_tower is not None

            else
            "universal-sentence-encoder-cosine"
        )

        return {
            "ranked": top_candidates,

            "shortlist": shortlist,

            "semantic_model": (
                semantic_model
            ),
        }

    # ========================================================
    # LANGGRAPH DEFINITION
    # ========================================================

    graph = StateGraph(
        DiscoverState
    )

    # ========================================================
    # ADD NODES
    # ========================================================

    graph.add_node(
        "extract_job",
        extract_job_node,
    )

    graph.add_node(
        "search_candidates",
        search_node,
    )

    graph.add_node(
        "enrich_candidates",
        enrich_node,
    )

    graph.add_node(
        "rank",
        rank_node,
    )

    # ========================================================
    # ENTRY POINT
    # ========================================================

    graph.set_entry_point(
        "extract_job"
    )

    # ========================================================
    # EDGES
    # ========================================================

    graph.add_edge(
        "extract_job",
        "search_candidates",
    )

    graph.add_edge(
        "search_candidates",
        "enrich_candidates",
    )

    graph.add_edge(
        "enrich_candidates",
        "rank",
    )

    graph.add_edge(
        "rank",
        END,
    )

    # ========================================================
    # COMPILE
    # ========================================================

    return graph.compile()