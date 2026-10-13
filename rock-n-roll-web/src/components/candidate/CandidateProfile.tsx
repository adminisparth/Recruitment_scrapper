"use client";

import React from "react";
import Link from "next/link";
import { ScoredCandidate, JobRequirements } from "@/lib/types";
import { MatchScore } from "@/components/discover/MatchScore";
import { SkillBadge } from "@/components/discover/SkillBadge";
import { AIExplanation } from "@/components/discover/AIExplanation";
import { RepositoryCard } from "./RepositoryCard";
import { HuggingFaceEvidenceCard } from "./HuggingFaceEvidenceCard";
import { ProjectIntelligenceCard } from "./ProjectIntelligenceCard";
import { Button } from "@/components/ui/Button";
import { useDiscovery } from "@/context/discovery-context";
import {
  ExternalLink,
  MapPin,
  GitBranch,
  Users,
  Calendar,
  Code,
  ArrowLeft,
  Scale,
  Check,
  Plus,
  ShieldCheck,
  FolderGit2,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

interface CandidateProfileProps {
  candidate: ScoredCandidate;
  requirements?: JobRequirements | null;
}

export function CandidateProfile({
  candidate,
  requirements,
}: CandidateProfileProps) {
  const { selectedForCompare, toggleCompare } = useDiscovery();
  const isSelected = selectedForCompare.includes(candidate.username);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Navigation Top Row */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/discover/results"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Candidate Results</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant={isSelected ? "primary" : "secondary"}
            size="sm"
            onClick={() => toggleCompare(candidate.username)}
            className="text-xs font-mono gap-1.5"
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Selected for Compare</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Compare</span>
              </>
            )}
          </Button>

          {selectedForCompare.length > 0 && (
            <Link href="/discover/compare">
              <Button variant="outline" size="sm" className="text-xs font-mono gap-1.5">
                <Scale className="w-3.5 h-3.5 text-indigo-400" />
                <span>Compare Table ({selectedForCompare.length})</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Candidate Hero Card */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0e1017] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Identity & Bio */}
          <div className="flex items-start gap-5 min-w-0">
            {candidate.avatar_url ? (
              <img
                src={candidate.avatar_url}
                alt={candidate.name || candidate.username}
                className="w-20 h-20 rounded-2xl border border-zinc-700/80 object-cover shrink-0 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-mono font-bold text-zinc-200 shrink-0">
                {(candidate.name || candidate.username).slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                  {candidate.name || candidate.username}
                </h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  @{candidate.username}
                </span>
              </div>

              {candidate.location && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{candidate.location}</span>
                </div>
              )}

              {candidate.bio && (
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl pt-1">
                  {candidate.bio}
                </p>
              )}

              {/* External Profile Links */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {candidate.profile_url && (
                  <a
                    href={candidate.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-mono transition-colors"
                  >
                    <span>GitHub Profile</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                )}

                {candidate.huggingface_url && (
                  <a
                    href={candidate.huggingface_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 border border-amber-800/40 text-xs font-mono transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Hugging Face ({candidate.huggingface_username})</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Overall Match Score Block */}
          <div className="w-full lg:w-72 shrink-0 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800/90 shadow-md">
            <MatchScore
              score={candidate.score}
              semanticScore={candidate.semantic_score}
              skillCoverage={candidate.skill_coverage}
              experienceScore={candidate.experience_score}
              locationScore={candidate.location_score}
              size="lg"
              showBreakdown
            />
          </div>
        </div>

        {/* Public Activity Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-zinc-800/80 font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-zinc-500 text-[10px]">PUBLIC REPOSITORIES</div>
              <div className="text-sm font-bold text-zinc-200">
                {candidate.public_repos || 0}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-zinc-500 text-[10px]">FOLLOWERS</div>
              <div className="text-sm font-bold text-zinc-200">
                {candidate.followers || 0}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-zinc-500 text-[10px]">ACTIVE HISTORY</div>
              <div className="text-sm font-bold text-zinc-200">
                {candidate.years_active
                  ? `${candidate.years_active.toFixed(1)} Years`
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-zinc-500 text-[10px]">SIGNAL INTEGRITY</div>
              <div className="text-sm font-bold text-emerald-400">
                AST Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grounded AI Rationale */}
      <AIExplanation candidate={candidate} requirements={requirements} />

      {/* Skills Matrix */}
      <div className="rounded-xl border border-zinc-800 bg-[#0e1017] p-6 space-y-4">
        <h3 className="text-sm font-bold text-zinc-200 font-mono uppercase tracking-wider flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-400" />
          <span>Technical Skills & Competency Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Matched */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>
                Verified Matched Skills ({candidate.matched_skills?.length || 0})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {candidate.matched_skills && candidate.matched_skills.length > 0 ? (
                candidate.matched_skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} variant="matched" />
                ))
              ) : (
                <span className="text-xs text-zinc-500 italic">None matched</span>
              )}
            </div>
          </div>

          {/* Missing / Unverified */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-rose-400 font-semibold">
              Unverified / Missing from Profile ({candidate.missing_skills?.length || 0})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {candidate.missing_skills && candidate.missing_skills.length > 0 ? (
                candidate.missing_skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} variant="missing" />
                ))
              ) : (
                <span className="text-xs text-emerald-500/80 font-mono">
                  All target role skills verified in candidate evidence.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Primary Languages */}
        {candidate.top_languages && candidate.top_languages.length > 0 && (
          <div className="pt-4 border-t border-zinc-800/80">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Primary Programming Languages
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.top_languages.map((lang) => (
                <span
                  key={lang}
                  className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GitHub Repository Evidence */}
      {candidate.top_repos && candidate.top_repos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200 font-mono uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              <span>Public GitHub Repositories ({candidate.top_repos.length})</span>
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              Ranked by stars and relevance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidate.top_repos.map((repo) => (
              <RepositoryCard key={repo.name} repo={repo} />
            ))}
          </div>
        </div>
      )}

      {/* Optional Hugging Face Evidence */}
      <HuggingFaceEvidenceCard
        evidence={candidate.huggingface}
        hfUrl={candidate.huggingface_url}
        hfUsername={candidate.huggingface_username}
      />

      {/* Project Intelligence Section */}
      {candidate.project_intelligence && candidate.project_intelligence.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200 font-mono uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Deep Project Intelligence</span>
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              Codebase depth, ownership & implementation complexity
            </span>
          </div>

          <div className="space-y-4">
            {candidate.project_intelligence.map((project) => (
              <ProjectIntelligenceCard
                key={project.repository_name}
                project={project}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
