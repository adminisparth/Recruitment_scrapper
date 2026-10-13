import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ScoredCandidate, JobRequirements } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes score to a 0-100 percentage float or integer.
 * Handles inputs in 0.0-1.0 range or 0-100 range.
 */
export function formatScore(score: number | undefined | null, decimals = 1): number {
  if (score === undefined || score === null || isNaN(score)) return 0;
  const normalized = score <= 1.0 && score > 0 ? score * 100 : score;
  return Number(Math.min(100, Math.max(0, normalized)).toFixed(decimals));
}

export function formatScorePercent(score: number | undefined | null, decimals = 1): string {
  return `${formatScore(score, decimals)}%`;
}

/**
 * Color badge utility based on match score
 */
export function getScoreBadgeStyle(score: number) {
  const norm = formatScore(score);
  if (norm >= 85) {
    return {
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      bar: "bg-emerald-500",
      accent: "text-emerald-400",
      label: "Excellent",
    };
  }
  if (norm >= 70) {
    return {
      bg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      bar: "bg-sky-500",
      accent: "text-sky-400",
      label: "Strong",
    };
  }
  if (norm >= 50) {
    return {
      bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      bar: "bg-amber-500",
      accent: "text-amber-400",
      label: "Moderate",
    };
  }
  return {
    bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    bar: "bg-zinc-500",
    accent: "text-zinc-400",
    label: "Low",
  };
}

/**
 * Deterministically generates "Why this candidate?" explanation using ONLY backend evidence.
 * NEVER fabricates education, unlisted jobs, or imaginary claims.
 */
export function generateAIExplanation(candidate: ScoredCandidate, requirements?: JobRequirements | null): string {
  const matched = candidate.matched_skills || [];
  const missing = candidate.missing_skills || [];
  const overall = formatScore(candidate.score);
  const semantic = formatScore(candidate.semantic_score);
  const skillCoverage = formatScore(candidate.skill_coverage);
  
  const reasons: string[] = [];

  // Skill signal
  if (matched.length > 0) {
    const topSkills = matched.slice(0, 4).join(", ");
    reasons.push(
      `Demonstrates verified competence in ${matched.length} required skill${matched.length > 1 ? "s" : ""} (${topSkills}) across repositories.`
    );
  }

  // Semantic similarity signal
  if (semantic >= 80) {
    reasons.push(
      `High semantic alignment (${semantic}%) between candidate technical profile and role objectives.`
    );
  }

  // Experience signal
  if (candidate.years_active && candidate.years_active > 0) {
    reasons.push(
      `${candidate.years_active.toFixed(1)} years of documented active GitHub history with ${candidate.public_repos} public repositories.`
    );
  }

  // Hugging Face signal
  if (candidate.huggingface && (candidate.huggingface.models.length > 0 || candidate.huggingface.spaces.length > 0)) {
    const modelCount = candidate.huggingface.models.length;
    const spaceCount = candidate.huggingface.spaces.length;
    reasons.push(
      `Verified AI/ML artifact contributions on Hugging Face (${modelCount} model${modelCount !== 1 ? "s" : ""}, ${spaceCount} space${spaceCount !== 1 ? "s" : ""}).`
    );
  }

  // Project intelligence signal
  if (candidate.project_intelligence && candidate.project_intelligence.length > 0) {
    const topProject = candidate.project_intelligence[0];
    if (topProject.technical_score >= 0.7 || topProject.technical_score >= 70) {
      reasons.push(
        `High technical depth identified in project '${topProject.repository_name}'.`
      );
    }
  }

  // Tradeoff / missing skills
  let caution = "";
  if (missing.length > 0) {
    caution = `Note: Technical evidence did not explicitly verify ${missing.slice(0, 3).join(", ")}.`;
  }

  if (reasons.length === 0) {
    return `Evaluated with ${overall}% match based on public repository code analysis and keyword alignment. ${caution}`.trim();
  }

  return `${reasons.join(" ")} ${caution}`.trim();
}
