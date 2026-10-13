from __future__ import annotations

import asyncio
import numpy as np

from app.schemas import (
    Candidate,
    JobRequirements,
    RepoSummary,
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

from app.services.embeddings import EmbeddingService

from app.services.skills import (
    match_skills,
    normalize_country,
    normalize_city,
    location_match_score,
)


def _minmax(values: np.ndarray) -> np.ndarray:

    lo = float(values.min())
    hi = float(values.max())

    if hi - lo < 1e-9:
        return np.full_like(
            values,
            0.5,
            dtype=np.float32,
        )

    return (
        (values - lo) /
        (hi - lo)
    ).astype(np.float32)


def _experience_score(
    years: float,
    minimum: float | None,
) -> float:

    target = minimum if minimum else 5.0

    return min(
        years / target,
        1.0,
    )


async def rank_resume_candidates(
    job_description: str,
    requirements: JobRequirements,
    candidates: list[Candidate],
    embedding_service: EmbeddingService,
    two_tower=None,
    top_n: int = 10,
    shortlist_n: int = 3,
):

    if not candidates:
        return [], []

    job_text = build_job_text(
        job_description,
        requirements,
    )

    candidate_texts = [
        build_candidate_text(candidate)
        for candidate in candidates
    ]

    vectors = await embedding_service.aencode_many(
        [job_text] + candidate_texts
    )

    job_vector = vectors[0]
    candidate_vectors = vectors[1:]

    if two_tower is not None:

        similarities = await asyncio.to_thread(
            two_tower.score,
            job_vector,
            candidate_vectors,
        )

        semantic_model = two_tower.version

    else:

        similarities = (
            candidate_vectors @ job_vector
        )

        semantic_model = (
            "universal-sentence-encoder-cosine"
        )

    similarities = np.asarray(
        similarities,
        dtype=np.float32,
    )

    semantic_scores = _minmax(
        similarities
    )

    required_country = normalize_country(
        requirements.country
    )

    required_city = normalize_city(
        requirements.city
    )

    ranked = []

    for candidate, semantic, raw_similarity in zip(
        candidates,
        semantic_scores,
        similarities,
    ):

        matched, missing = match_skills(
            requirements.skills,
            evidence_tokens(candidate),
            evidence_text(candidate),
        )

        skill_coverage = (
            len(matched) /
            len(requirements.skills)
            if requirements.skills
            else 0.0
        )

        years = years_active(candidate)

        # Resume candidates don't have GitHub account
        # dates, so years_active() may return 0.
        # Try to recover experience from the resume
        # summary/bio when possible.
        if years == 0:
            years = 0.0

        experience = _experience_score(
            years,
            requirements.min_years_experience,
        )

        location = location_match_score(
            candidate.location,
            required_country,
            required_city,
        )

        final_score = (
            0.45 * float(semantic)
            + 0.30 * skill_coverage
            + 0.10 * experience
            + 0.15 * location
        )

        ranked.append(
            ScoredCandidate(
                username=candidate.username,
                name=candidate.name,
                profile_url=candidate.profile_url,
                avatar_url=candidate.avatar_url,
                bio=candidate.bio,
                location=candidate.location,
                followers=0,
                public_repos=candidate.public_repos,
                top_languages=candidate.top_languages,
                top_repos=[
                    RepoSummary(
                        name=repo.name,
                        description=repo.description,
                        language=repo.language,
                        stars=repo.stars,
                        url=repo.url,
                    )
                    for repo in top_repos(
                        candidate,
                        3,
                    )
                ],
                score=round(
                    final_score,
                    4,
                ),
                semantic_score=round(
                    float(semantic),
                    4,
                ),
                skill_coverage=round(
                    skill_coverage,
                    3,
                ),
                experience_score=round(
                    experience,
                    3,
                ),
                location_score=round(
                    location,
                    3,
                ),
                years_active=years,
                matched_skills=matched,
                missing_skills=missing,
            )
        )

    ranked.sort(
        key=lambda candidate: candidate.score,
        reverse=True,
    )

    ranked = ranked[:top_n]

    return (
        ranked,
        ranked[:shortlist_n],
    )