"""
ROCK N ROLL - DISCOVER SERVICE

FastAPI entry point.

Loads:
- Universal Sentence Encoder
- Qwen job extraction
- GitHub candidate discovery
- Hugging Face enrichment
- Trained Two-Tower model
- LangGraph discovery pipeline
"""

from __future__ import annotations

import asyncio
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv

# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

# Reduce TensorFlow console noise
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")


# ============================================================
# FASTAPI
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# ============================================================
# PROJECT IMPORTS
# ============================================================

from app.api.routes import router
from app.github.client import GitHubClient
from app.graph.discover_graph import build_discover_graph
from app.services.embeddings import EmbeddingService


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

log = logging.getLogger("rock-n-roll-discover")


# ============================================================
# LIFESPAN
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    log.info("=" * 70)
    log.info("STARTING ROCK N ROLL DISCOVER SERVICE")
    log.info("=" * 70)

    # ========================================================
    # 1. API KEYS
    # ========================================================

    api_keys = {
        key.strip()
        for key in os.getenv("API_KEYS", "").split(",")
        if key.strip()
    }

    if api_keys:

        log.info(
            "API key protection enabled: %d key(s) configured",
            len(api_keys),
        )

    else:

        log.warning(
            "API_KEYS is empty. "
            "/api/discover is OPEN for local development."
        )

    # IMPORTANT:
    # routes.py accesses:
    #
    # request.app.state.api_keys
    #
    # so this MUST be set before requests arrive.

    app.state.api_keys = api_keys


    # ========================================================
    # 2. CONCURRENCY CONTROL
    # ========================================================

    max_concurrent_runs = int(
        os.getenv(
            "MAX_CONCURRENT_RUNS",
            "3",
        )
    )

    app.state.run_sem = asyncio.Semaphore(
        max_concurrent_runs
    )

    log.info(
        "Maximum concurrent discovery runs: %d",
        max_concurrent_runs,
    )


    # ========================================================
    # 3. REQUEST TIMEOUT
    # ========================================================

    request_timeout = int(
        os.getenv(
            "REQUEST_TIMEOUT_S",
            "180",
        )
    )

    app.state.request_timeout = request_timeout

    log.info(
        "Discovery request timeout: %d seconds",
        request_timeout,
    )


    # ========================================================
    # 4. EMBEDDING SERVICE
    # ========================================================

    log.info(
        "Loading Universal Sentence Encoder..."
    )


    try:
        embedding_service = await asyncio.to_thread(
            EmbeddingService
        )

        log.info(
            "Universal Sentence Encoder loaded successfully."
        )

    except Exception:

        log.exception(
            "Failed to load embedding service."
        )

        raise


    # ========================================================
    # 5. JOB EXTRACTOR
    # ========================================================


    try:
        from app.services.job_extractor import (
            extract_job_requirements,
        )

        app.state.job_extractor = (
            extract_job_requirements
        )

        log.info(
            "Qwen job extractor loaded successfully."
        )

    except Exception:

        log.exception(
            "Failed to load job extractor."
        )

        raise


    # ========================================================
    # 6. GITHUB CLIENT
    # ========================================================

    log.info(
        "Initializing GitHub client..."
    )


    try:
        # GitHubClient already reads GITHUB_TOKEN
        # from the environment if token is not supplied.

        github = GitHubClient()

        app.state.github_client = github

        log.info(
            "GitHub client initialized successfully."
        )

    except Exception:

        log.exception(
            "Failed to initialize GitHub client."
        )

        raise


    # ========================================================
    # 8. TRAINED TWO-TOWER
    # ========================================================

    two_tower = None

    # Your current TwoTowerScorer expects ONE prefix:
    #
    # TwoTowerScorer(prefix)
    #
    # Example:
    #
    # models/two_tower
    #
    # which expects:
    #
    # models/two_tower.json
    # models/two_tower.weights.h5
    #
    # However your trained model currently uses:
    #
    # models/job_tower_improved.weights.h5
    # models/candidate_tower_improved.weights.h5
    # models/two_tower_config.json
    #
    # Therefore we first try the newer saved model format.
    # If that does not exist, we keep USE as fallback.

    two_tower_prefix = os.getenv(
        "TWO_TOWER_PATH",
        "models/two_tower",
    )

    log.info(
        "Checking Two-Tower model at prefix: %s",
        two_tower_prefix,
    )

    two_tower_json = Path(
        f"{two_tower_prefix}.json"
    )

    two_tower_weights = Path(
        f"{two_tower_prefix}.weights.h5"
    )

    if (
        two_tower_json.exists()
        and two_tower_weights.exists()
    ):

        try:
            from app.services.two_tower import (
                TwoTowerScorer,
            )

            log.info(
                "Loading trained Two-Tower..."
            )

            two_tower = await asyncio.to_thread(
                TwoTowerScorer,
                two_tower_prefix,
            )

            log.info(
                "Two-Tower loaded successfully."
            )

            log.info(
                "Two-Tower version: %s",
                two_tower.version,
            )

        except Exception:

            log.exception(
                "Two-Tower loading failed."
            )

            two_tower = None

    else:

        log.warning(
            "Two-Tower prefix files not found:"
        )

        log.warning(
            "JSON: %s",
            two_tower_json,
        )

        log.warning(
            "Weights: %s",
            two_tower_weights,
        )

        log.warning(
            "Falling back to Universal Sentence Encoder cosine ranking."
        )


    # ========================================================
    # 9. BUILD LANGGRAPH
    # ========================================================

    log.info(
        "Building DISCOVER LangGraph..."
    )

    try:
        graph = build_discover_graph(
            github=github,
            embedding_service=embedding_service,
            two_tower=two_tower,
        )
        app.state.graph = graph
        app.state.github_client = github
    except Exception as exc:
        log.error("Failed to build graph", exc_info=exc)
        raise

    # ========================================================
    # 10. SEMANTIC MODEL NAME
    # ========================================================

    if two_tower is not None:

        semantic_model = getattr(
            two_tower,
            "version",
            "two-tower",
        )

    else:

        semantic_model = (
            "universal-sentence-encoder-cosine"
        )

    # IMPORTANT:
    # routes.py accesses:
    #
    # request.app.state.semantic_model

    app.state.semantic_model = semantic_model

    log.info(
        "Semantic ranking model: %s",
        semantic_model,
    )


    # ========================================================
    # 11. OTHER STATE
    # ========================================================

    app.state.embedding_service = (
        embedding_service
    )

    app.state.two_tower = (
        two_tower
    )


    # ========================================================
    # STARTUP COMPLETE
    # ========================================================

    log.info("=" * 70)
    log.info(
        "ROCK N ROLL DISCOVER SERVICE READY"
    )
    log.info("=" * 70)

    log.info(
        "API: http://localhost:8000"
    )

    log.info(
        "Docs: http://localhost:8000/docs"
    )

    log.info(
        "Health: http://localhost:8000/api/health"
    )

    log.info(
        "Ready: http://localhost:8000/api/ready"
    )

    log.info("=" * 70)


    # ========================================================
    # APPLICATION RUNNING
    # ========================================================

    yield


    # ========================================================
    # SHUTDOWN
    # ========================================================

    log.info(
        "Shutting down ROCK N ROLL DISCOVER..."
    )


    # --------------------------------------------------------
    # GitHub
    # --------------------------------------------------------


    try:
        if github is not None:

            await github.aclose()

            log.info(
                "GitHub client closed."
            )

    except Exception:

        log.exception(
            "Error while closing GitHub client."
        )


    # --------------------------------------------------------
    # Hugging Face
    # --------------------------------------------------------


    log.info("ROCK N ROLL DISCOVER shutdown complete.")

app = FastAPI(
    title="ROCK N ROLL DISCOVER",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
