import operator
from typing import Annotated, TypedDict

from app.schemas import Candidate, JobRequirements, ScoredCandidate


class DiscoverState(TypedDict, total=False):
    # inputs
    job_description: str
    top_n: int
    shortlist_n: int
    # produced by nodes
    requirements: JobRequirements
    candidate_logins: list[str]
    candidates: list[Candidate]
    ranked: list[ScoredCandidate]
    shortlist: list[ScoredCandidate]
    semantic_model: str
    # nodes return only NEW warnings; LangGraph concatenates them
    warnings: Annotated[list[str], operator.add]