from datetime import datetime

from pydantic import BaseModel, Field


DISCLAIMER = "AI recommends. Humans make the final decision."


# ============================================================================
# JOB REQUIREMENTS
# ============================================================================

class JobRequirements(BaseModel):
    """
    Structured requirements extracted from a free-text job description.
    """

    title: str = Field(
        description="Job title, e.g. 'Machine Learning Engineer'"
    )

    skills: list[str] = Field(
        default_factory=list,
        description=(
            "Core technical skills, lowercase and normalised, "
            "e.g. ['python', 'machine learning', 'aws']"
        ),
    )

    min_years_experience: float | None = Field(
        default=None,
        description="Minimum years of experience required, if stated",
    )

    location: str | None = Field(
        default=None,
        description="Full preferred location, if stated",
    )

    city: str | None = Field(
        default=None,
        description="Preferred city, if stated",
    )

    country: str | None = Field(
        default=None,
        description="Preferred country, if stated",
    )

    summary: str | None = Field(
        default=None,
        description="One-line summary of the role",
    )


# ============================================================================
# GITHUB REPOSITORY
# ============================================================================

class RepoInfo(BaseModel):
    """
    Internal GitHub repository representation.

    README is kept internally for embeddings/project analysis but is excluded
    from API responses.
    """

    name: str

    description: str | None = None

    language: str | None = None

    topics: list[str] = Field(
        default_factory=list
    )

    stars: int = 0

    created_at: datetime | None = None

    pushed_at: datetime | None = None

    url: str

    readme: str | None = Field(
        default=None,
        exclude=True,
    )


# CANDIDATE
# ============================================================================

class Candidate(BaseModel):
    """
    Internal unified candidate representation.

    Candidate can originate from GitHub and optionally be enriched with
    Hugging Face evidence.
    """

    username: str

    name: str | None = None

    profile_url: str

    avatar_url: str | None = None

    bio: str | None = None

    location: str | None = None

    followers: int = 0

    public_repos: int = 0

    account_created: datetime | None = None

    top_languages: list[str] = Field(
        default_factory=list
    )

    repos: list[RepoInfo] = Field(
        default_factory=list
    )




# ============================================================================
# API-FACING REPOSITORY SUMMARY
# ============================================================================

class RepoSummary(BaseModel):
    """
    Lightweight repository representation returned to the frontend.
    """

    name: str

    description: str | None = None

    language: str | None = None

    stars: int = 0

    url: str


# ============================================================================
# PROJECT INTELLIGENCE
# ============================================================================

class ProjectAnalysis(BaseModel):
    """
    Analysis of a candidate's relevant GitHub project.

    Scores are evidence-based signals, not absolute judgments of a person.
    """

    repository_name: str

    repository_url: str

    technical_score: float = 0.0

    ownership_score: float = 0.0

    development_depth_score: float = 0.0

    relevance_score: float = 0.0

    ai_assistance_signal: str = "unknown"

    technologies: list[str] = Field(
        default_factory=list
    )

    evidence: list[str] = Field(
        default_factory=list
    )

    summary: str = ""


# ============================================================================
# SCORED CANDIDATE
# ============================================================================

class ScoredCandidate(BaseModel):
    """
    Candidate returned after semantic ranking and skill matching.
    """

    username: str

    name: str | None = None

    profile_url: str

    avatar_url: str | None = None

    bio: str | None = None

    location: str | None = None

    followers: int = 0

    public_repos: int = 0

    top_languages: list[str] = Field(
        default_factory=list
    )

    top_repos: list[RepoSummary] = Field(
        default_factory=list
    )

    # ------------------------------------------------------------------------
    # Ranking
    # ------------------------------------------------------------------------

    score: float = 0.0

    semantic_score: float = 0.0

    skill_coverage: float = 0.0

    experience_score: float = 0.0

    location_score: float = 0.0

    years_active: float = 0.0

    # ------------------------------------------------------------------------
    # Skill matching
    # ------------------------------------------------------------------------

    matched_skills: list[str] = Field(
        default_factory=list
    )

    missing_skills: list[str] = Field(
        default_factory=list
    )

    # ------------------------------------------------------------------------
    # Project intelligence
    # ------------------------------------------------------------------------

    project_intelligence: list[ProjectAnalysis] = Field(
        default_factory=list
    )


# ============================================================================
# DISCOVER REQUEST
# ============================================================================

class DiscoverRequest(BaseModel):
    """
    Request sent to /api/discover.
    """

    job_description: str = Field(
        min_length=20,
        max_length=20000,
    )

    top_n: int = Field(
        default=100,
        ge=1,
        le=500,
    )

    shortlist_n: int = Field(
        default=3,
        ge=1,
        le=500,
    )


# ============================================================================
# DISCOVER RESPONSE
# ============================================================================

class DiscoverResponse(BaseModel):
    """
    Response returned by the DISCOVER service.
    """

    semantic_model: str

    requirements: JobRequirements

    top_candidates: list[ScoredCandidate] = Field(
        default_factory=list
    )

    shortlist: list[ScoredCandidate] = Field(
        default_factory=list
    )

    warnings: list[str] = Field(
        default_factory=list
    )

    disclaimer: str = DISCLAIMER
