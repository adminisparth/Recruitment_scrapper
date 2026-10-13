// ============================================================================
// ROCK N ROLL - Talent & Workforce Intelligence
// Core TypeScript Definitions
// Strictly mapped to backend FastAPI schemas (app/schemas.py)
// ============================================================================

export interface JobRequirements {
  title: string;
  skills: string[];
  min_years_experience: number | null;
  location: string | null;
  city: string | null;
  country: string | null;
  summary: string | null;
}

export interface RepoSummary {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
}

export interface HFModelInfo {
  id: string;
  pipeline_tag: string | null;
  downloads: number;
  likes: number;
  tags: string[];
  url: string;
}

export interface HFDatasetInfo {
  id: string;
  downloads: number;
  likes: number;
  tags: string[];
  url: string;
}

export interface HFSpaceInfo {
  id: string;
  sdk: string | null;
  likes: number;
  tags: string[];
  url: string;
}

export interface HFEvidence {
  username: string;
  profile_url: string;
  name: string | null;
  bio: string | null;
  models: HFModelInfo[];
  datasets: HFDatasetInfo[];
  spaces: HFSpaceInfo[];
  skills: string[];
}

export interface ProjectAnalysis {
  repository_name: string;
  repository_url: string;
  technical_score: number;
  ownership_score: number;
  development_depth_score: number;
  relevance_score: number;
  ai_assistance_signal: string;
  technologies: string[];
  evidence: string[];
  summary: string;
}

export interface ScoredCandidate {
  username: string;
  name: string | null;
  profile_url: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  followers: number;
  public_repos: number;
  top_languages: string[];
  top_repos: RepoSummary[];
  
  // Hugging Face optional enrichment
  huggingface_username: string | null;
  huggingface_url: string | null;
  huggingface: HFEvidence | null;

  // Ranking & Scores (normalized 0.0-1.0 or 0-100)
  score: number;
  semantic_score: number;
  skill_coverage: number;
  experience_score: number;
  location_score: number;
  years_active: number;

  // Skills
  matched_skills: string[];
  missing_skills: string[];

  // Deep project analysis
  project_intelligence: ProjectAnalysis[];
}

export interface DiscoverRequest {
  job_description: string;
  top_n?: number;
  shortlist_n?: number;
}

export interface DiscoverResponse {
  semantic_model: string;
  requirements: JobRequirements;
  top_candidates: ScoredCandidate[];
  shortlist: ScoredCandidate[];
  warnings: string[];
  disclaimer?: string;
  source?: 'github' | 'uploaded_resumes';
  processed_resumes?: number;
  total_uploaded?: number;
}

export interface ServiceHealth {
  status: 'ok' | 'ready' | 'offline' | 'error';
  semantic_model?: string;
  latencyMs?: number;
}

// Discovery pipeline state for visual feedback
export type PipelineStepId = 'extract_job' | 'search_candidates' | 'enrich_candidates' | 'rank_candidates';

export interface PipelineStep {
  id: PipelineStepId;
  label: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}
