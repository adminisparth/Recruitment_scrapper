from __future__ import annotations

import asyncio
import logging
import os
import secrets

from typing import Annotated, List

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    Header,
    HTTPException,
    Request,
    UploadFile,
)

from app.schemas import (
    DiscoverRequest,
    DiscoverResponse,
)

from app.services.job_extractor import (
    extract_job_requirements,
)

from app.services.resume_batch import (
    process_resumes,
)

from app.services.resume_ranker import (
    rank_resume_candidates,
)


log = logging.getLogger(__name__)


router = APIRouter(
    prefix="/api"
)


# ============================================================
# API KEY AUTHENTICATION
# ============================================================

async def require_api_key(
    request: Request,
    x_api_key: str | None = Header(
        default=None
    ),
) -> None:

    keys: set[str] = (
        request.app.state.api_keys
    )

    # --------------------------------------------------------
    # Local development
    # --------------------------------------------------------

    if not keys:

        return

    # --------------------------------------------------------
    # Missing API key
    # --------------------------------------------------------

    if not x_api_key:

        raise HTTPException(
            status_code=401,
            detail="Missing X-API-Key",
        )

    # --------------------------------------------------------
    # Validate API key
    # --------------------------------------------------------

    if not any(
        secrets.compare_digest(
            x_api_key,
            key,
        )
        for key in keys
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid X-API-Key",
        )


# ============================================================
# HEALTH
# ============================================================

@router.get("/health")
async def health():

    return {
        "status": "ok",
    }


# ============================================================
# READINESS
# ============================================================

@router.get("/ready")
async def ready(
    request: Request,
):

    return {
        "status": "ready",
        "semantic_model": getattr(
            request.app.state,
            "semantic_model",
            "initializing",
        ),
    }


# ============================================================
# ORIGINAL GITHUB DISCOVERY
# ============================================================

@router.post(
    "/discover",
    response_model=DiscoverResponse,
    dependencies=[
        Depends(require_api_key)
    ],
)
async def discover(
    body: DiscoverRequest,
    request: Request,
):

    app = request.app

    payload = {
        "job_description": body.job_description,
        "top_n": body.top_n,
        "shortlist_n": min(
            body.shortlist_n,
            body.top_n,
        ),
        "warnings": [],
    }

    # ========================================================
    # RUN DISCOVER GRAPH
    # ========================================================

    try:

        async with app.state.run_sem:

            result = await asyncio.wait_for(
                app.state.graph.ainvoke(
                    payload
                ),
                timeout=app.state.request_timeout,
            )

    except asyncio.TimeoutError:

        raise HTTPException(
            status_code=504,
            detail=(
                "Candidate discovery timed out."
            ),
        )

    except Exception:

        log.exception(
            "GitHub discovery failed"
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Candidate discovery failed. "
                "See server logs."
            ),
        )

    # ========================================================
    # RETURN
    # ========================================================

    return {
        "semantic_model": (
            result.get(
                "semantic_model",
                app.state.semantic_model,
            )
        ),
        "requirements": result.get(
            "requirements"
        ),
        "top_candidates": result.get(
            "ranked",
            [],
        ),
        "shortlist": result.get(
            "shortlist",
            [],
        ),
        "warnings": result.get(
            "warnings",
            [],
        ),
        "disclaimer": (
            "AI recommends. "
            "Humans make the final decision."
        ),
    }


# ============================================================
# MULTIPLE RESUME DISCOVERY
# ============================================================

@router.post(
    "/discover-resumes",
    dependencies=[
        Depends(require_api_key)
    ],
)
async def discover_resumes(
    request: Request,
    job_description: Annotated[
        str,
        Form(...),
    ],
    files: Annotated[
        List[UploadFile],
        File(...),
    ],
    top_n: Annotated[
        int,
        Form(),
    ] = 10,
    shortlist_n: Annotated[
        int,
        Form(),
    ] = 3,
):

    app = request.app

    # ========================================================
    # STEP 0 — VALIDATE JOB DESCRIPTION
    # ========================================================

    if not job_description.strip():

        raise HTTPException(
            status_code=400,
            detail=(
                "Job description cannot be empty."
            ),
        )

    if len(
        job_description.strip()
    ) < 20:

        raise HTTPException(
            status_code=400,
            detail=(
                "Job description must contain "
                "at least 20 characters."
            ),
        )

    # ========================================================
    # VALIDATE TOP N
    # ========================================================

    if top_n < 1 or top_n > 500:

        raise HTTPException(
            status_code=400,
            detail=(
                "top_n must be between 1 and 500."
            ),
        )

    # ========================================================
    # VALIDATE SHORTLIST N
    # ========================================================

    if shortlist_n < 1:

        raise HTTPException(
            status_code=400,
            detail=(
                "shortlist_n must be at least 1."
            ),
        )

    shortlist_n = min(
        shortlist_n,
        top_n,
    )

    # ========================================================
    # VALIDATE FILES
    # ========================================================

    if not files:

        raise HTTPException(
            status_code=400,
            detail=(
                "At least one resume must "
                "be uploaded."
            ),
        )

    # --------------------------------------------------------
    # Maximum batch size
    #
    # 100 is reasonable for the hackathon.
    # The concurrency setting controls how many LLM
    # requests happen at the same time.
    # --------------------------------------------------------

    if len(files) > 100:

        raise HTTPException(
            status_code=400,
            detail=(
                "Maximum 100 resumes can be "
                "uploaded in one request."
            ),
        )

    log.info(
        "Resume discovery started: %d resumes",
        len(files),
    )

    # ========================================================
    # STEP 1
    #
    # EXTRACT JOB REQUIREMENTS
    # ========================================================

    try:

        requirements = (
            await extract_job_requirements(
                job_description
            )
        )

    except Exception:

        log.exception(
            "Job requirement extraction failed"
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Could not extract job "
                "requirements from the job "
                "description."
            ),
        )

    # ========================================================
    # STEP 2
    #
    # PROCESS RESUMES IN PARALLEL
    # ========================================================

    resume_concurrency = int(
        os.getenv(
            "RESUME_EXTRACTION_CONCURRENCY",
            "4",
        )
    )

    # Prevent accidental bad values.

    resume_concurrency = max(
        1,
        min(
            resume_concurrency,
            10,
        ),
    )

    log.info(
        "Starting parallel resume processing: "
        "%d resumes, concurrency=%d",
        len(files),
        resume_concurrency,
    )

    try:

        candidates, warnings = (
            await process_resumes(
                files=files,
                concurrency=resume_concurrency,
            )
        )

    except Exception:

        log.exception(
            "Batch resume processing failed"
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Resume processing failed. "
                "See server logs."
            ),
        )

    # ========================================================
    # NO VALID RESUMES
    # ========================================================

    if not candidates:

        return {
            "semantic_model": (
                app.state.semantic_model
            ),
            "source": "uploaded_resumes",
            "processed_resumes": 0,
            "total_uploaded": len(files),
            "requirements": requirements,
            "top_candidates": [],
            "shortlist": [],
            "warnings": list(
                dict.fromkeys(
                    warnings
                )
            ),
            "disclaimer": (
                "AI recommends. "
                "Humans make the final decision."
            ),
        }

    # ========================================================
    # STEP 3
    #
    # RANK CANDIDATES
    # ========================================================

    try:

        async with app.state.run_sem:

            ranked, shortlist = (
                await asyncio.wait_for(
                    rank_resume_candidates(
                        job_description=(
                            job_description
                        ),
                        requirements=(
                            requirements
                        ),
                        candidates=(
                            candidates
                        ),
                        embedding_service=(
                            app.state.embedding_service
                        ),
                        two_tower=(
                            app.state.two_tower
                        ),
                        top_n=top_n,
                        shortlist_n=shortlist_n,
                    ),
                    timeout=(
                        app.state.request_timeout
                    ),
                )
            )

    except asyncio.TimeoutError:

        raise HTTPException(
            status_code=504,
            detail=(
                "Resume ranking timed out. "
                "Try uploading fewer resumes."
            ),
        )

    except Exception:

        log.exception(
            "Resume ranking failed"
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Resume ranking failed. "
                "See server logs."
            ),
        )

    # ========================================================
    # STEP 4
    #
    # RETURN RESULTS
    # ========================================================

    return {
        "semantic_model": (
            app.state.semantic_model
        ),
        "source": "uploaded_resumes",
        "processed_resumes": len(
            candidates
        ),
        "total_uploaded": len(
            files
        ),
        "requirements": requirements,
        "top_candidates": ranked,
        "shortlist": shortlist,
        "warnings": list(
            dict.fromkeys(
                warnings
            )
        ),
        "disclaimer": (
            "AI recommends. "
            "Humans make the final decision."
        ),
    }