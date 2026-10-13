// ============================================================================
// ISOLATED MOCK DATA
// Used strictly for UI preview, offline fallback, or instant demonstration.
// The production app communicates directly with the FastAPI backend.
// ============================================================================

import { DiscoverResponse } from "./types";

export const MOCK_DISCOVER_RESPONSE: DiscoverResponse = {
  semantic_model: "job_tower_improved_v2-use-cosine",
  requirements: {
    title: "Senior Machine Learning Engineer",
    skills: [
      "python",
      "pytorch",
      "transformers",
      "fastapi",
      "docker",
      "distributed training",
      "langchain",
      "kubernetes"
    ],
    min_years_experience: 3.5,
    location: "Bengaluru, India / Remote",
    city: "Bengaluru",
    country: "India",
    summary: "Senior ML Engineer to architect high-throughput LLM fine-tuning pipelines, low-latency model inference microservices, and agentic workflows."
  },
  disclaimer: "AI recommends. Humans make the final decision.",
  warnings: [],
  shortlist: [
    {
      username: "arjun-ml-dev",
      name: "Arjun Verma",
      profile_url: "https://github.com/arjun-ml-dev",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      bio: "Staff AI Researcher & Open-Source Contributor. Building scalable LLM inference and synthetic data generation tooling.",
      location: "Bengaluru, India",
      followers: 1240,
      public_repos: 48,
      top_languages: ["Python", "C++", "CUDA", "TypeScript"],
      top_repos: [
        {
          name: "llm-stream-server",
          description: "High-throughput speculative decoding inference engine in PyTorch & C++ bindings.",
          language: "Python",
          stars: 1850,
          url: "https://github.com/arjun-ml-dev/llm-stream-server"
        },
        {
          name: "vector-indexer-fast",
          description: "SIMD-accelerated HNSW indexer with FastAPI orchestration and Docker Compose setups.",
          language: "C++",
          stars: 940,
          url: "https://github.com/arjun-ml-dev/vector-indexer-fast"
        },
        {
          name: "transformer-distill",
          description: "Knowledge distillation framework for encoder-decoder models on multi-GPU nodes.",
          language: "Python",
          stars: 620,
          url: "https://github.com/arjun-ml-dev/transformer-distill"
        }
      ],
      huggingface_username: "arjun-v",
      huggingface_url: "https://huggingface.co/arjun-v",
      huggingface: {
        username: "arjun-v",
        profile_url: "https://huggingface.co/arjun-v",
        name: "Arjun Verma",
        bio: "Efficient transformer architectures and quantized quantized representations.",
        models: [
          {
            id: "arjun-v/llama-3-8b-instruct-quantized-4bit",
            pipeline_tag: "text-generation",
            downloads: 14200,
            likes: 188,
            tags: ["pytorch", "transformers", "text-generation", "awq"],
            url: "https://huggingface.co/arjun-v/llama-3-8b-instruct-quantized-4bit"
          },
          {
            id: "arjun-v/reranker-mini-multilingual",
            pipeline_tag: "feature-extraction",
            downloads: 8740,
            likes: 92,
            tags: ["sentence-transformers", "embeddings"],
            url: "https://huggingface.co/arjun-v/reranker-mini-multilingual"
          }
        ],
        datasets: [
          {
            id: "arjun-v/code-reasoning-synthetic-10k",
            downloads: 2400,
            likes: 45,
            tags: ["code", "synthetic", "reasoning"],
            url: "https://huggingface.co/datasets/arjun-v/code-reasoning-synthetic-10k"
          }
        ],
        spaces: [
          {
            id: "arjun-v/live-speculative-demo",
            sdk: "gradio",
            likes: 67,
            tags: ["llm", "speedup"],
            url: "https://huggingface.co/spaces/arjun-v/live-speculative-demo"
          }
        ],
        skills: ["pytorch", "transformers", "quantization", "distributed training"]
      },
      score: 95.4,
      semantic_score: 96.8,
      skill_coverage: 92.5,
      experience_score: 94.0,
      location_score: 100.0,
      years_active: 5.2,
      matched_skills: ["python", "pytorch", "transformers", "fastapi", "docker", "distributed training", "langchain"],
      missing_skills: ["kubernetes"],
      project_intelligence: [
        {
          repository_name: "llm-stream-server",
          repository_url: "https://github.com/arjun-ml-dev/llm-stream-server",
          technical_score: 94.0,
          ownership_score: 98.0,
          development_depth_score: 92.0,
          relevance_score: 97.0,
          ai_assistance_signal: "low (authentic commit cadence & custom algorithmic kernels)",
          technologies: ["Python", "PyTorch", "CUDA", "FastAPI", "Docker"],
          evidence: [
            "Authored 87% of core inference loops and memory pooling algorithms",
            "Implemented custom CUDA kernels for KV-cache acceleration",
            "Comprehensive pytest integration tests and CI benchmark suite"
          ],
          summary: "Demonstrates production-grade distributed AI systems engineering with deep understanding of memory bandwidth constraints."
        }
      ]
    },
    {
      username: "priya-k-systems",
      name: "Priya Kulkarni",
      profile_url: "https://github.com/priya-k-systems",
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      bio: "Senior Infrastructure & ML Ops Engineer. Kubernetes operator developer, Ray enthusiast, cloud-native architect.",
      location: "Pune, India / Remote",
      followers: 890,
      public_repos: 36,
      top_languages: ["Python", "Go", "Rust", "Shell"],
      top_repos: [
        {
          name: "k8s-ray-gpu-scheduler",
          description: "Custom Kubernetes operator for dynamic elastic scaling of PyTorch GPU clusters.",
          language: "Go",
          stars: 1220,
          url: "https://github.com/priya-k-systems/k8s-ray-gpu-scheduler"
        },
        {
          name: "model-deploy-mesh",
          description: "FastAPI inference microservice wrapper with Envoy sidecars and Prometheus metrics.",
          language: "Python",
          stars: 780,
          url: "https://github.com/priya-k-systems/model-deploy-mesh"
        }
      ],
      huggingface_username: null,
      huggingface_url: null,
      huggingface: null,
      score: 91.8,
      semantic_score: 89.2,
      skill_coverage: 94.0,
      experience_score: 93.5,
      location_score: 95.0,
      years_active: 4.8,
      matched_skills: ["python", "pytorch", "fastapi", "docker", "kubernetes", "distributed training"],
      missing_skills: ["transformers", "langchain"],
      project_intelligence: [
        {
          repository_name: "k8s-ray-gpu-scheduler",
          repository_url: "https://github.com/priya-k-systems/k8s-ray-gpu-scheduler",
          technical_score: 91.0,
          ownership_score: 94.0,
          development_depth_score: 89.0,
          relevance_score: 90.0,
          ai_assistance_signal: "low (rigorous commit cadence over 24 months)",
          technologies: ["Go", "Kubernetes", "Docker", "Python", "Ray"],
          evidence: [
            "Created custom CRDs for deep learning spot instance preemption recovery",
            "Extensive helm charts and production cluster health monitors"
          ],
          summary: "Exceptional mastery of Kubernetes infrastructure, containerization, and distributed GPU compute pipelines."
        }
      ]
    },
    {
      username: "rohit-sharma-ai",
      name: "Rohit Sharma",
      profile_url: "https://github.com/rohit-sharma-ai",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      bio: "Applied AI Engineer specializing in agentic workflows, LangGraph, RAG evaluation, and FastAPI backends.",
      location: "Bengaluru, India",
      followers: 640,
      public_repos: 42,
      top_languages: ["Python", "TypeScript", "HTML"],
      top_repos: [
        {
          name: "agentic-rag-router",
          description: "Multi-agent conversational router using LangChain, LangGraph, and hybrid vector/lexical search.",
          language: "Python",
          stars: 960,
          url: "https://github.com/rohit-sharma-ai/agentic-rag-router"
        },
        {
          name: "fastapi-llm-observability",
          description: "OpenTelemetry middleware for tracking token latency and model hallucination metrics.",
          language: "Python",
          stars: 540,
          url: "https://github.com/rohit-sharma-ai/fastapi-llm-observability"
        }
      ],
      huggingface_username: "rohit-s-evals",
      huggingface_url: "https://huggingface.co/rohit-s-evals",
      huggingface: {
        username: "rohit-s-evals",
        profile_url: "https://huggingface.co/rohit-s-evals",
        name: "Rohit Sharma",
        bio: "RAG benchmark datasets and domain specific fine-tunes.",
        models: [
          {
            id: "rohit-s-evals/mistral-rag-eval-lora",
            pipeline_tag: "text-generation",
            downloads: 3120,
            likes: 38,
            tags: ["transformers", "mistral", "lora"],
            url: "https://huggingface.co/rohit-s-evals/mistral-rag-eval-lora"
          }
        ],
        datasets: [],
        spaces: [],
        skills: ["transformers", "langchain", "python", "evaluation"]
      },
      score: 89.6,
      semantic_score: 93.4,
      skill_coverage: 88.0,
      experience_score: 85.0,
      location_score: 100.0,
      years_active: 3.8,
      matched_skills: ["python", "pytorch", "transformers", "fastapi", "langchain", "docker"],
      missing_skills: ["distributed training", "kubernetes"],
      project_intelligence: [
        {
          repository_name: "agentic-rag-router",
          repository_url: "https://github.com/rohit-sharma-ai/agentic-rag-router",
          technical_score: 88.0,
          ownership_score: 95.0,
          development_depth_score: 86.0,
          relevance_score: 93.0,
          ai_assistance_signal: "moderate (high boilerplate velocity, verified complex test coverage)",
          technologies: ["Python", "LangChain", "FastAPI", "ChromaDB"],
          evidence: [
            "Demonstrated robust cyclic graph state execution with LangGraph",
            "Implemented fallback mechanisms for LLM tool call failures"
          ],
          summary: "Solid execution on agentic application architectures, API integration, and vector search pipelines."
        }
      ]
    }
  ],
  top_candidates: [
    // Top 3 are candidates 1, 2, 3
    // Candidates 4-10 provide realistic breadth for the Top 10 view
    {
      username: "arjun-ml-dev",
      name: "Arjun Verma",
      profile_url: "https://github.com/arjun-ml-dev",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      bio: "Staff AI Researcher & Open-Source Contributor. Building scalable LLM inference and synthetic data generation tooling.",
      location: "Bengaluru, India",
      followers: 1240,
      public_repos: 48,
      top_languages: ["Python", "C++", "CUDA", "TypeScript"],
      top_repos: [
        {
          name: "llm-stream-server",
          description: "High-throughput speculative decoding inference engine in PyTorch & C++ bindings.",
          language: "Python",
          stars: 1850,
          url: "https://github.com/arjun-ml-dev/llm-stream-server"
        }
      ],
      huggingface_username: "arjun-v",
      huggingface_url: "https://huggingface.co/arjun-v",
      huggingface: null, // Will use detailed mock in shortlist
      score: 95.4,
      semantic_score: 96.8,
      skill_coverage: 92.5,
      experience_score: 94.0,
      location_score: 100.0,
      years_active: 5.2,
      matched_skills: ["python", "pytorch", "transformers", "fastapi", "docker", "distributed training", "langchain"],
      missing_skills: ["kubernetes"],
      project_intelligence: []
    },
    {
      username: "priya-k-systems",
      name: "Priya Kulkarni",
      profile_url: "https://github.com/priya-k-systems",
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      bio: "Senior Infrastructure & ML Ops Engineer. Kubernetes operator developer, Ray enthusiast, cloud-native architect.",
      location: "Pune, India / Remote",
      followers: 890,
      public_repos: 36,
      top_languages: ["Python", "Go", "Rust", "Shell"],
      top_repos: [
        {
          name: "k8s-ray-gpu-scheduler",
          description: "Custom Kubernetes operator for dynamic elastic scaling of PyTorch GPU clusters.",
          language: "Go",
          stars: 1220,
          url: "https://github.com/priya-k-systems/k8s-ray-gpu-scheduler"
        }
      ],
      huggingface_username: null,
      huggingface_url: null,
      huggingface: null,
      score: 91.8,
      semantic_score: 89.2,
      skill_coverage: 94.0,
      experience_score: 93.5,
      location_score: 95.0,
      years_active: 4.8,
      matched_skills: ["python", "pytorch", "fastapi", "docker", "kubernetes", "distributed training"],
      missing_skills: ["transformers", "langchain"],
      project_intelligence: []
    },
    {
      username: "rohit-sharma-ai",
      name: "Rohit Sharma",
      profile_url: "https://github.com/rohit-sharma-ai",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      bio: "Applied AI Engineer specializing in agentic workflows, LangGraph, RAG evaluation, and FastAPI backends.",
      location: "Bengaluru, India",
      followers: 640,
      public_repos: 42,
      top_languages: ["Python", "TypeScript", "HTML"],
      top_repos: [
        {
          name: "agentic-rag-router",
          description: "Multi-agent conversational router using LangChain, LangGraph, and hybrid vector/lexical search.",
          language: "Python",
          stars: 960,
          url: "https://github.com/rohit-sharma-ai/agentic-rag-router"
        }
      ],
      huggingface_username: "rohit-s-evals",
      huggingface_url: "https://huggingface.co/rohit-s-evals",
      huggingface: null,
      score: 89.6,
      semantic_score: 93.4,
      skill_coverage: 88.0,
      experience_score: 85.0,
      location_score: 100.0,
      years_active: 3.8,
      matched_skills: ["python", "pytorch", "transformers", "fastapi", "langchain", "docker"],
      missing_skills: ["distributed training", "kubernetes"],
      project_intelligence: []
    },
    {
      username: "neha-ai-research",
      name: "Neha Sundaram",
      profile_url: "https://github.com/neha-ai-research",
      avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      bio: "NLP Engineer & LLM Fine-Tuning enthusiast. Transformer optimization on low-resource hardware.",
      location: "Hyderabad, India",
      followers: 430,
      public_repos: 28,
      top_languages: ["Python", "Jupyter Notebook"],
      top_repos: [
        {
          name: "lora-indic-nlp",
          description: "Parameter-efficient fine-tuning scripts for multilingual Indic LLMs.",
          language: "Python",
          stars: 410,
          url: "https://github.com/neha-ai-research/lora-indic-nlp"
        }
      ],
      huggingface_username: "neha-indic",
      huggingface_url: "https://huggingface.co/neha-indic",
      huggingface: null,
      score: 86.2,
      semantic_score: 89.0,
      skill_coverage: 82.0,
      experience_score: 81.0,
      location_score: 95.0,
      years_active: 3.2,
      matched_skills: ["python", "pytorch", "transformers", "fastapi"],
      missing_skills: ["docker", "kubernetes", "distributed training", "langchain"],
      project_intelligence: []
    },
    {
      username: "dev-siddharth",
      name: "Siddharth Nair",
      profile_url: "https://github.com/dev-siddharth",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      bio: "Backend & ML Platform developer. Scaling high-throughput data processing systems.",
      location: "Bengaluru, India",
      followers: 380,
      public_repos: 31,
      top_languages: ["Python", "Rust", "SQL"],
      top_repos: [
        {
          name: "stream-feature-store",
          description: "Real-time streaming feature store integration with Redis and Kafka.",
          language: "Python",
          stars: 320,
          url: "https://github.com/dev-siddharth/stream-feature-store"
        }
      ],
      huggingface_username: null,
      huggingface_url: null,
      huggingface: null,
      score: 84.7,
      semantic_score: 82.5,
      skill_coverage: 85.0,
      experience_score: 88.0,
      location_score: 100.0,
      years_active: 4.1,
      matched_skills: ["python", "fastapi", "docker", "kubernetes"],
      missing_skills: ["pytorch", "transformers", "distributed training", "langchain"],
      project_intelligence: []
    },
    {
      username: "ananya-mlops",
      name: "Ananya Iyer",
      profile_url: "https://github.com/ananya-mlops",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      bio: "MLOps Engineer | CI/CD for AI models | Docker, K8s, DVC",
      location: "Chennai, India",
      followers: 290,
      public_repos: 24,
      top_languages: ["Python", "YAML", "Shell"],
      top_repos: [
        {
          name: "automated-model-registry",
          description: "Automated MLflow pipeline trigger on GitHub Actions with container builds.",
          language: "Python",
          stars: 280,
          url: "https://github.com/ananya-mlops/automated-model-registry"
        }
      ],
      huggingface_username: null,
      huggingface_url: null,
      huggingface: null,
      score: 82.3,
      semantic_score: 79.0,
      skill_coverage: 83.0,
      experience_score: 86.0,
      location_score: 90.0,
      years_active: 3.5,
      matched_skills: ["python", "docker", "kubernetes", "fastapi"],
      missing_skills: ["pytorch", "transformers", "distributed training", "langchain"],
      project_intelligence: []
    },
    {
      username: "vikram-codes",
      name: "Vikram Sen",
      profile_url: "https://github.com/vikram-codes",
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      bio: "Data Scientist turned ML Engineer. Predictive modeling & API microservices.",
      location: "Delhi NCR, India",
      followers: 210,
      public_repos: 34,
      top_languages: ["Python", "R"],
      top_repos: [
        {
          name: "tabular-ensemble-pipeline",
          description: "Automated hyperparameter tuning for XGBoost and PyTorch neural nets.",
          language: "Python",
          stars: 190,
          url: "https://github.com/vikram-codes/tabular-ensemble-pipeline"
        }
      ],
      huggingface_username: null,
      huggingface_url: null,
      huggingface: null,
      score: 79.5,
      semantic_score: 78.0,
      skill_coverage: 78.0,
      experience_score: 82.0,
      location_score: 88.0,
      years_active: 3.0,
      matched_skills: ["python", "pytorch", "fastapi", "docker"],
      missing_skills: ["transformers", "kubernetes", "distributed training", "langchain"],
      project_intelligence: []
    },
    {
      username: "tanvi-ds",
      name: "Tanvi Saxena",
      profile_url: "https://github.com/tanvi-ds",
      avatar_url: "https://images.unsplash.com/photo-1534751516642-a171ed277174?w=150&auto=format&fit=crop&q=80",
      bio: "Deep Learning Enthusiast & Computer Vision builder.",
      location: "Bengaluru, India",
      followers: 180,
      public_repos: 19,
      top_languages: ["Python", "C++"],
      top_repos: [
        {
          name: "yolo-object-tracker",
          description: "Real-time edge object detection with TensorRT optimizations.",
          language: "Python",
          stars: 160,
          url: "https://github.com/tanvi-ds/yolo-object-tracker"
        }
      ],
      huggingface_username: null,
      huggingface_url: null,
      huggingface: null,
      score: 76.8,
      semantic_score: 74.0,
      skill_coverage: 75.0,
      experience_score: 79.0,
      location_score: 100.0,
      years_active: 2.8,
      matched_skills: ["python", "pytorch", "docker"],
      missing_skills: ["transformers", "fastapi", "kubernetes", "distributed training", "langchain"],
      project_intelligence: []
    },
    {
      username: "kunal-gupta-dev",
      name: "Kunal Gupta",
      profile_url: "https://github.com/kunal-gupta-dev",
      avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      bio: "Full Stack Engineer venturing into Generative AI wrappers and RAG apps.",
      location: "Mumbai, India",
      followers: 160,
      public_repos: 27,
      top_languages: ["TypeScript", "Python"],
      top_repos: [
        {
          name: "ai-document-chat",
          description: "Simple document Q&A using OpenAI API and FastAPI backend.",
          language: "TypeScript",
          stars: 140,
          url: "https://github.com/kunal-gupta-dev/ai-document-chat"
        }
      ],
      huggingface_username: null,
      huggingface_url: null,
      huggingface: null,
      score: 74.1,
      semantic_score: 72.0,
      skill_coverage: 71.0,
      experience_score: 75.0,
      location_score: 85.0,
      years_active: 2.5,
      matched_skills: ["python", "fastapi", "docker", "langchain"],
      missing_skills: ["pytorch", "transformers", "kubernetes", "distributed training"],
      project_intelligence: []
    },
    {
      username: "deepak-ai-engineer",
      name: "Deepak Menon",
      profile_url: "https://github.com/deepak-ai-engineer",
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      bio: "Junior AI developer working with PyTorch neural nets and computer vision.",
      location: "Kochi, India",
      followers: 120,
      public_repos: 15,
      top_languages: ["Python"],
      top_repos: [
        {
          name: "image-classifier-resnet",
          description: "ResNet fine-tuning for medical imaging diagnostics.",
          language: "Python",
          stars: 90,
          url: "https://github.com/deepak-ai-engineer/image-classifier-resnet"
        }
      ],
      huggingface_username: null,
      huggingface_url: null,
      huggingface: null,
      score: 71.4,
      semantic_score: 70.0,
      skill_coverage: 68.0,
      experience_score: 70.0,
      location_score: 80.0,
      years_active: 2.0,
      matched_skills: ["python", "pytorch"],
      missing_skills: ["transformers", "fastapi", "docker", "kubernetes", "distributed training", "langchain"],
      project_intelligence: []
    }
  ]
};

export const SAMPLE_JOB_PRESETS = [
  {
    title: "Senior Machine Learning Engineer",
    category: "AI / ML Core",
    description: `We are looking for a Senior Machine Learning Engineer with 3+ years of experience to lead our inference optimization and model fine-tuning initiatives.

Key Requirements:
- Strong programming background in Python and familiarity with C++ / CUDA.
- Deep hands-on experience with PyTorch, Hugging Face Transformers, and PEFT / LoRA.
- Proven experience deploying low-latency microservices with FastAPI and Docker.
- Experience with distributed training and GPU orchestration on Kubernetes or Ray.
- Experience building agentic workflows and tool-calling systems using LangChain or LangGraph is a huge plus.
- Based in India or available for remote collaboration.`
  },
  {
    title: "Cloud-Native Infrastructure & MLOps Engineer",
    category: "Infrastructure",
    description: `Looking for an MLOps / Infrastructure Engineer to design scalable GPU compute clusters and continuous deployment pipelines for deep learning models.

Requirements:
- 3+ years experience with Kubernetes operators, Helm, and containerization with Docker.
- Strong proficiency in Go and Python for automation and tooling.
- Hands-on experience scaling distributed AI training frameworks (Ray, TorchElastic).
- Observability and monitoring with Prometheus, Grafana, and OpenTelemetry.
- Knowledge of model serving architectures (Triton, vLLM, or FastAPI sidecars).`
  },
  {
    title: "Applied AI & Agentic Systems Developer",
    category: "Agentic AI",
    description: `Seeking an Applied AI Engineer to build reliable multi-agent systems and retrieval-augmented generation (RAG) architectures.

Requirements:
- 2+ years of software engineering experience with strong proficiency in Python and FastAPI.
- Deep familiarity with modern agentic frameworks: LangGraph, LangChain, or AutoGen.
- Experience with vector databases (Qdrant, Pinecone, Chroma) and hybrid semantic search.
- Knowledge of automated evaluation benchmarks for LLM outputs.
- Strong open source contribution record or demonstrated project ownership.`
  }
];
