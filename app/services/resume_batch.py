from __future__ import annotations

import asyncio
import logging
from typing import Any

from app.services.resume_parser import (
    ResumeParseError,
    parse_resume,
)
from app.services.resume_extractor import (
    extract_resume_candidate,
)

log = logging.getLogger(__name__)


# ============================================================
# DEFAULT CONFIGURATION
# ============================================================

DEFAULT_CONCURRENCY = 4


# ============================================================
# PROCESS ONE RESUME
# ============================================================

async def process_single_resume(
    uploaded_file: Any,
    semaphore: asyncio.Semaphore,
) -> tuple[Any | None, str | None]:
    """
    Process a single uploaded resume.

    Pipeline:

        UploadFile
            ↓
        Read bytes
            ↓
        Parse PDF/DOCX
            ↓
        Extract candidate information using LLM
            ↓
        Candidate object

    Returns:

        (candidate, None)

    OR:

        (None, warning)
    """

    filename = (
        uploaded_file.filename
        or "unknown_resume.pdf"
    )

    log.info(
        "Starting resume processing: %s",
        filename,
    )

    # ========================================================
    # STEP 1 — READ FILE
    # ========================================================

    try:

        data = await uploaded_file.read()

    except Exception as exc:

        warning = (
            f"{filename}: could not read file: "
            f"{exc}"
        )

        log.warning(warning)

        return None, warning

    # ========================================================
    # STEP 2 — CHECK EMPTY FILE
    # ========================================================

    if not data:

        warning = (
            f"{filename}: uploaded file is empty."
        )

        log.warning(warning)

        return None, warning

    # ========================================================
    # STEP 3 — PARSE PDF / DOCX
    #
    # Parsing is local.
    #
    # We run it in a worker thread so that CPU/file
    # processing does not block FastAPI's event loop.
    # ========================================================

    try:

        resume_text = await asyncio.to_thread(
            parse_resume,
            filename,
            data,
        )

    except ResumeParseError as exc:

        warning = (
            f"{filename}: {exc}"
        )

        log.warning(warning)

        return None, warning

    except Exception as exc:

        warning = (
            f"{filename}: unexpected parsing error: "
            f"{exc}"
        )

        log.exception(
            "Unexpected resume parsing error: %s",
            filename,
        )

        return None, warning

    # ========================================================
    # STEP 4 — LLM CANDIDATE EXTRACTION
    #
    # This is the expensive part.
    #
    # Semaphore limits the number of simultaneous
    # Hugging Face requests.
    # ========================================================

    async with semaphore:

        log.info(
            "Extracting candidate information: %s",
            filename,
        )

        try:

            candidate = (
                await extract_resume_candidate(
                    resume_text,
                    filename,
                )
            )

        except Exception as exc:

            warning = (
                f"{filename}: candidate extraction "
                f"failed: {exc}"
            )

            log.exception(
                "Resume extraction failed: %s",
                filename,
            )

            return None, warning

    # ========================================================
    # SUCCESS
    # ========================================================

    log.info(
        "Resume successfully processed: %s",
        filename,
    )

    return candidate, None


# ============================================================
# PROCESS MULTIPLE RESUMES
# ============================================================

async def process_resumes(
    files: list[Any],
    concurrency: int = DEFAULT_CONCURRENCY,
) -> tuple[list[Any], list[str]]:
    """
    Process multiple resumes concurrently.

    Example:

        candidates, warnings = await process_resumes(
            files,
            concurrency=4,
        )

    The resumes are processed concurrently, while the
    semaphore limits the number of simultaneous LLM calls.
    """

    if not files:

        return [], []

    # Prevent invalid concurrency values.

    concurrency = max(
        1,
        int(concurrency),
    )

    semaphore = asyncio.Semaphore(
        concurrency
    )

    log.info(
        "Processing %d resumes with concurrency=%d",
        len(files),
        concurrency,
    )

    # ========================================================
    # CREATE ALL TASKS
    # ========================================================

    tasks = [
        process_single_resume(
            uploaded_file=file,
            semaphore=semaphore,
        )
        for file in files
    ]

    # ========================================================
    # RUN CONCURRENTLY
    # ========================================================

    results = await asyncio.gather(
        *tasks,
        return_exceptions=True,
    )

    # ========================================================
    # COLLECT RESULTS
    # ========================================================

    candidates: list[Any] = []
    warnings: list[str] = []

    for index, result in enumerate(results):

        # ----------------------------------------------------
        # Unexpected task failure
        # ----------------------------------------------------

        if isinstance(
            result,
            Exception,
        ):

            filename = (
                files[index].filename
                or f"resume_{index + 1}"
            )

            warning = (
                f"{filename}: unexpected processing "
                f"failure: {result}"
            )

            warnings.append(warning)

            log.error(
                "Unexpected batch processing error "
                "for %s: %s",
                filename,
                result,
            )

            continue

        candidate, warning = result

        # ----------------------------------------------------
        # Successful candidate
        # ----------------------------------------------------

        if candidate is not None:

            candidates.append(
                candidate
            )

        # ----------------------------------------------------
        # Warning
        # ----------------------------------------------------

        if warning:

            warnings.append(
                warning
            )

    # ========================================================
    # SUMMARY
    # ========================================================

    log.info(
        "Resume batch complete: "
        "%d/%d successful",
        len(candidates),
        len(files),
    )

    return candidates, warnings