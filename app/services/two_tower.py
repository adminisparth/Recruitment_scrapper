from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers


class TwoTowerScorer:

    def __init__(
        self,
        job_weights_path: str = "models/job_tower_improved.weights.h5",
        candidate_weights_path: str = "models/candidate_tower_improved.weights.h5",
        config_path: str = "models/two_tower_config.json",
    ):

        self.job_weights_path = Path(
            job_weights_path
        )

        self.candidate_weights_path = Path(
            candidate_weights_path
        )

        self.config_path = Path(
            config_path
        )

        # --------------------------------------------------------
        # Check model files
        # --------------------------------------------------------

        if not self.job_weights_path.exists():
            raise FileNotFoundError(
                f"Job tower weights not found: "
                f"{self.job_weights_path}"
            )

        if not self.candidate_weights_path.exists():
            raise FileNotFoundError(
                f"Candidate tower weights not found: "
                f"{self.candidate_weights_path}"
            )

        # --------------------------------------------------------
        # Default architecture
        #
        # 512 → 512 → 256
        # --------------------------------------------------------

        config = {
            "embedding_dim": 512,
            "hidden_dim": 512,
            "output_dim": 256,
            "dropout": 0.1,
        }

        # --------------------------------------------------------
        # Load config
        # --------------------------------------------------------

        if self.config_path.exists():

            try:

                with open(
                    self.config_path,
                    "r",
                    encoding="utf-8",
                ) as f:

                    saved_config = json.load(f)

                config.update(
                    saved_config
                )

            except Exception as exc:

                print(
                    f"Warning: could not load "
                    f"Two-Tower config: {exc}"
                )

        # --------------------------------------------------------
        # Architecture parameters
        # --------------------------------------------------------

        self.embedding_dim = int(
            config.get(
                "embedding_dim",
                512,
            )
        )

        self.hidden_dim = int(
            config.get(
                "hidden_dim",
                512,
            )
        )

        self.output_dim = int(
            config.get(
                "output_dim",
                256,
            )
        )

        self.dropout = float(
            config.get(
                "dropout",
                0.1,
            )
        )

        # --------------------------------------------------------
        # Build towers
        # --------------------------------------------------------

        self.job_tower = self._build_tower(
            "job_tower"
        )

        self.candidate_tower = self._build_tower(
            "candidate_tower"
        )

        # --------------------------------------------------------
        # Build model weights
        #
        # Keras needs the model built before loading weights.
        # --------------------------------------------------------

        dummy_input = np.zeros(
            (
                1,
                self.embedding_dim,
            ),
            dtype=np.float32,
        )

        self.job_tower(
            dummy_input,
            training=False,
        )

        self.candidate_tower(
            dummy_input,
            training=False,
        )

        # --------------------------------------------------------
        # Load trained weights
        # --------------------------------------------------------

        self.job_tower.load_weights(
            self.job_weights_path
        )

        self.candidate_tower.load_weights(
            self.candidate_weights_path
        )

        # --------------------------------------------------------
        # Create model version
        # --------------------------------------------------------

        job_hash = hashlib.md5(
            self.job_weights_path.read_bytes()
        ).hexdigest()[:8]

        candidate_hash = hashlib.md5(
            self.candidate_weights_path.read_bytes()
        ).hexdigest()[:8]

        self.version = (
            f"two-tower-improved:"
            f"{job_hash}-"
            f"{candidate_hash}"
        )

    # ============================================================
    # BUILD TOWER
    # ============================================================

    def _build_tower(
        self,
        name: str,
    ):

        inputs = keras.Input(
            shape=(
                self.embedding_dim,
            ),
            name=f"{name}_input",
        )

        # 512 → 512
        x = layers.Dense(
            self.hidden_dim,
            activation="relu",
            name=f"{name}_dense_1",
        )(inputs)

        # Dropout
        x = layers.Dropout(
            self.dropout,
            name=f"{name}_dropout",
        )(x)

        # 512 → 256
        x = layers.Dense(
            self.output_dim,
            name=f"{name}_dense_2",
        )(x)

        # L2 normalization
        outputs = layers.UnitNormalization(
            axis=1,
            name=f"{name}_normalize",
        )(x)

        return keras.Model(
            inputs=inputs,
            outputs=outputs,
            name=name,
        )

    # ============================================================
    # ENCODE JOB
    # ============================================================

    def encode_job(
        self,
        job_vec,
    ):

        job_vec = np.asarray(
            job_vec,
            dtype=np.float32,
        )

        if job_vec.ndim == 1:

            job_vec = job_vec.reshape(
                1,
                -1,
            )

        if job_vec.shape[1] != self.embedding_dim:

            raise ValueError(
                f"Expected job embedding dimension "
                f"{self.embedding_dim}, "
                f"got {job_vec.shape[1]}"
            )

        return self.job_tower(
            job_vec,
            training=False,
        ).numpy()

    # ============================================================
    # ENCODE CANDIDATES
    # ============================================================

    def encode_candidates(
        self,
        candidate_vecs,
    ):

        candidate_vecs = np.asarray(
            candidate_vecs,
            dtype=np.float32,
        )

        if candidate_vecs.ndim == 1:

            candidate_vecs = candidate_vecs.reshape(
                1,
                -1,
            )

        if candidate_vecs.shape[1] != self.embedding_dim:

            raise ValueError(
                f"Expected candidate embedding dimension "
                f"{self.embedding_dim}, "
                f"got {candidate_vecs.shape[1]}"
            )

        return self.candidate_tower(
            candidate_vecs,
            training=False,
        ).numpy()

    # ============================================================
    # SCORE
    # ============================================================

    def score(
        self,
        job_vec,
        candidate_vecs,
    ):

        # Encode job
        job_embedding = self.encode_job(
            job_vec
        )[0]

        # Encode candidates
        candidate_embeddings = (
            self.encode_candidates(
                candidate_vecs
            )
        )

        # Because both towers use UnitNormalization,
        # dot product = cosine similarity.
        scores = (
            candidate_embeddings
            @ job_embedding
        )

        return scores.astype(
            np.float32
        )

    # ============================================================
    # SCORE SINGLE CANDIDATE
    # ============================================================

    def score_single(
        self,
        job_vec,
        candidate_vec,
    ):

        candidate_vec = np.asarray(
            candidate_vec,
            dtype=np.float32,
        )

        scores = self.score(
            job_vec,
            candidate_vec.reshape(
                1,
                -1,
            ),
        )

        return float(
            scores[0]
        )

    # ============================================================
    # MODEL INFORMATION
    # ============================================================

    def info(self):

        return {
            "version": self.version,

            "embedding_dimension":
                self.embedding_dim,

            "hidden_dimension":
                self.hidden_dim,

            "output_dimension":
                self.output_dim,

            "dropout":
                self.dropout,

            "architecture":
                (
                    f"{self.embedding_dim}"
                    f" -> "
                    f"{self.hidden_dim}"
                    f" -> "
                    f"{self.output_dim}"
                ),

            "job_weights":
                str(
                    self.job_weights_path
                ),

            "candidate_weights":
                str(
                    self.candidate_weights_path
                ),

            "config":
                str(
                    self.config_path
                ),
        }