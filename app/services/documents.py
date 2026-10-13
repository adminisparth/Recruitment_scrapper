from __future__ import annotations

from datetime import datetime, timezone

from app.schemas import (
    Candidate,
    JobRequirements,
    RepoInfo,
)


# ============================================================
# JOB TEXT
# ============================================================

def build_job_text(
    job_description: str,
    requirements: JobRequirements,
) -> str:

    skills = ", ".join(
        requirements.skills
    )

    parts = [
        f"Job title: {requirements.title}",
        f"Required skills: {skills}",
    ]

    if requirements.min_years_experience is not None:

        parts.append(
            "Minimum experience: "
            f"{requirements.min_years_experience} years"
        )

    if requirements.location:

        parts.append(
            f"Location: {requirements.location}"
        )

    if requirements.summary:

        parts.append(
            f"Summary: {requirements.summary}"
        )

    parts.append(
        f"Job description: {job_description}"
    )

    return "\n".join(parts)


# ============================================================
# CANDIDATE TEXT
# ============================================================

def build_candidate_text(
    candidate: Candidate,
) -> str:

    parts: list[str] = []

    # --------------------------------------------------------
    # GitHub profile
    # --------------------------------------------------------

    if candidate.name:

        parts.append(
            f"Name: {candidate.name}"
        )

    parts.append(
        f"Username: {candidate.username}"
    )

    if candidate.bio:

        parts.append(
            f"Bio: {candidate.bio}"
        )

    if candidate.location:

        parts.append(
            f"Location: {candidate.location}"
        )

    if candidate.top_languages:

        parts.append(
            "Programming Languages: "
            + ", ".join(
                candidate.top_languages
            )
        )

    # --------------------------------------------------------
    # GitHub repositories
    # --------------------------------------------------------

    for repo in top_repos(
        candidate,
        limit=8
    ):

        repo_parts = [
            f"Repository: {repo.name}"
        ]

        if repo.description:

            repo_parts.append(
                f"Description: {repo.description}"
            )

        if repo.language:

            repo_parts.append(
                f"Language: {repo.language}"
            )

        if repo.topics:

            repo_parts.append(
                "Topics: "
                + ", ".join(
                    repo.topics
                )
            )

        parts.append(
            " | ".join(repo_parts)
        )

        if repo.readme:

            readme = repo.readme[:3000]

            parts.append(
                f"README: {readme}"
            )



    return "\n".join(parts)


# ============================================================
# EVIDENCE TEXT
# ============================================================

def evidence_text(
    candidate: Candidate,
) -> str:

    parts: list[str] = []

    # --------------------------------------------------------
    # GitHub
    # --------------------------------------------------------

    if candidate.name:

        parts.append(
            candidate.name
        )

    if candidate.bio:

        parts.append(
            candidate.bio
        )

    if candidate.location:

        parts.append(
            candidate.location
        )

    parts.extend(
        candidate.top_languages
    )

    for repo in candidate.repos:

        parts.append(
            repo.name
        )

        if repo.description:

            parts.append(
                repo.description
            )

        if repo.language:

            parts.append(
                repo.language
            )

        parts.extend(
            repo.topics
        )

        if repo.readme:

            parts.append(
                repo.readme
            )

    return " ".join(parts)


def evidence_tokens(candidate) -> list[str]:
    import re
    text = evidence_text(candidate)
    return [t.lower() for t in re.split(r"\W+", text) if t]



def top_repos(candidate, limit=3):
    if getattr(candidate, 'repos', None) is None:
        return []
    sorted_repos = sorted(candidate.repos, key=lambda r: getattr(r, 'stargazers_count', 0), reverse=True)
    return sorted_repos[:limit]

def years_active(candidate):
    return getattr(candidate, 'years_active', 1)

