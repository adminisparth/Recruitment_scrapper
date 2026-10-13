import asyncio
import hashlib
import logging
import os
import threading
from collections import OrderedDict

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")  # must be set before TensorFlow is imported

import numpy as np  # noqa: E402
import tensorflow_hub as hub  # noqa: E402

log = logging.getLogger(__name__)

MODEL_URL = os.getenv("USE_MODEL_URL", "https://tfhub.dev/google/universal-sentence-encoder/4")


class EmbeddingService:
    """
    Universal Sentence Encoder -> L2-normalised float32 vectors (512-d).

    - batched, with a small in-memory cache (re-ranking the same candidates is free)
    - `aencode_many` runs in a worker thread so the event loop is never blocked
    """

    DIM = 512

    def __init__(self, model_url: str = MODEL_URL, cache_size: int = 4096):
        log.info("Loading Universal Sentence Encoder from %s", model_url)
        self.encoder = hub.load(model_url)
        self._cache: OrderedDict[str, np.ndarray] = OrderedDict()
        self._cache_size = cache_size
        self._lock = threading.Lock()
        log.info("Embedding model loaded.")

    @staticmethod
    def _key(text: str) -> str:
        return hashlib.sha1(text.encode("utf-8", errors="ignore")).hexdigest()

    def encode_many(self, texts: list[str], batch_size: int = 32) -> np.ndarray:
        texts = [t if t else "" for t in texts]
        out: list[np.ndarray | None] = [None] * len(texts)
        todo: list[int] = []
        with self._lock:
            for i, t in enumerate(texts):
                hit = self._cache.get(self._key(t))
                if hit is not None:
                    out[i] = hit
                else:
                    todo.append(i)

        for s in range(0, len(todo), batch_size):
            idx = todo[s : s + batch_size]
            vecs = self.encoder([texts[i] for i in idx]).numpy().astype(np.float32)
            vecs /= np.linalg.norm(vecs, axis=1, keepdims=True) + 1e-9
            with self._lock:
                for i, v in zip(idx, vecs):
                    out[i] = v
                    self._cache[self._key(texts[i])] = v
                while len(self._cache) > self._cache_size:
                    self._cache.popitem(last=False)

        return np.stack(out) if out else np.zeros((0, self.DIM), dtype=np.float32)

    def encode(self, text: str) -> np.ndarray:
        return self.encode_many([text])[0]

    async def aencode_many(self, texts: list[str]) -> np.ndarray:
        return await asyncio.to_thread(self.encode_many, texts)


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    a = a / (np.linalg.norm(a) + 1e-9)
    b = b / (np.linalg.norm(b) + 1e-9)
    return float(a @ b)


def similarity_to_score(similarity: float) -> float:
    """Kept for compatibility. NOTE: USE cosine values cluster in a narrow band, so this is NOT a
    'match percentage'. The pipeline min-max scales similarities within the candidate pool instead."""
    return round(max(0.0, min(1.0, (similarity + 1.0) / 2.0)), 4)