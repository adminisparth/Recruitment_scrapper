"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ScoredCandidate } from "@/lib/types";
import { MatchScore } from "./MatchScore";
import { SkillBadge } from "./SkillBadge";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  GitBranch,
  Users,
  Check,
  Plus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FolderGit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDiscovery } from "@/context/discovery-context";

interface CandidateCardProps {
  candidate: ScoredCandidate;
  rank: number;
  isShortlist?: boolean;
}

export function CandidateCard({
  candidate,
  rank,
  isShortlist = false,
}: CandidateCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { highlightedSkill, selectedForCompare, toggleCompare } = useDiscovery();

  const isSelectedForCompare = selectedForCompare.includes(candidate.username);
  const matchesHighlightedSkill =
    highlightedSkill &&
    candidate.matched_skills?.some(
      (s) => s.toLowerCase() === highlightedSkill.toLowerCase()
    );

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200 bg-[#0e1017] p-5 flex flex-col justify-between group",
        isShortlist
          ? "border-indigo-500/40 shadow-md shadow-indigo-950/20 bg-gradient-to-b from-[#11131f] to-[#0e1017]"
          : "border-zinc-800/80 hover:border-zinc-700",
        matchesHighlightedSkill &&
          "ring-1 ring-indigo-500 bg-indigo-950/20 border-indigo-500/60"
      )}
    >
      <div>
        {/* Top Header: Rank, Avatar, Name, Username, Compare Check */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Rank badge */}
            <div
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 select-none",
                rank === 1
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : rank === 2
                  ? "bg-zinc-700/40 text-zinc-300 border border-zinc-600/50"
                  : rank === 3
                  ? "bg-amber-900/30 text-amber-400 border border-amber-800/40"
                  : "bg-zinc-800/60 text-zinc-400 border border-zinc-800"
              )}
            >
              #{rank}
            </div>

            {/* Avatar */}
            {candidate.avatar_url ? (
              <img
                src={candidate.avatar_url}
                alt={candidate.name || candidate.username}
                className="w-10 h-10 rounded-full border border-zinc-700/80 object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono font-semibold text-zinc-300 shrink-0">
                {(candidate.name || candidate.username).substring(0, 2).toUpperCase()}
              </div>
            )}

            {/* Identity */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/discover/candidate/${candidate.username}`}
                  className="font-semibold text-sm text-zinc-100 hover:text-indigo-300 transition-colors truncate"
                >
                  {candidate.name || candidate.username}
                </Link>
                {isShortlist && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                    Top 3
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mt-0.5">
                <span>@{candidate.username}</span>
                {candidate.location && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="flex items-center gap-1 truncate text-zinc-400">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      {candidate.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action: Select for Comparison */}
          <button
            onClick={() => toggleCompare(candidate.username)}
            className={cn(
              "p-1.5 rounded-lg border text-xs font-mono transition-colors shrink-0 flex items-center gap-1",
              isSelectedForCompare
                ? "bg-indigo-600 text-white border-indigo-500"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60"
            )}
            title={isSelectedForCompare ? "Remove from comparison" : "Add to comparison"}
          >
            {isSelectedForCompare ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline text-[10px]">Compare</span>
          </button>
        </div>

        {/* Bio if available */}
        {candidate.bio && (
          <p className="text-xs text-zinc-300/80 line-clamp-2 mb-4 leading-relaxed font-sans">
            {candidate.bio}
          </p>
        )}

        {/* Match Score Display */}
        <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80 mb-4">
          <MatchScore
            score={candidate.score}
            semanticScore={candidate.semantic_score}
            skillCoverage={candidate.skill_coverage}
            experienceScore={candidate.experience_score}
            locationScore={candidate.location_score}
            showBreakdown={expanded}
          />
        </div>

        {/* Skills Section */}
        <div className="space-y-2 mb-4">
          {candidate.matched_skills && candidate.matched_skills.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Verified Matched Skills ({candidate.matched_skills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {candidate.matched_skills.slice(0, expanded ? 15 : 5).map((skill) => (
                  <SkillBadge
                    key={skill}
                    skill={skill}
                    variant={
                      highlightedSkill &&
                      highlightedSkill.toLowerCase() === skill.toLowerCase()
                        ? "highlighted"
                        : "matched"
                    }
                  />
                ))}
                {!expanded && candidate.matched_skills.length > 5 && (
                  <span className="text-[10px] font-mono text-zinc-500 self-center px-1">
                    +{candidate.matched_skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {candidate.missing_skills && candidate.missing_skills.length > 0 && (
            <div className="pt-1">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                Unverified / Missing Skills
              </div>
              <div className="flex flex-wrap gap-1">
                {candidate.missing_skills.slice(0, expanded ? 10 : 3).map((skill) => (
                  <SkillBadge key={skill} skill={skill} variant="missing" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Repositories and Evidence preview */}
        {candidate.top_repos && candidate.top_repos.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <FolderGit2 className="w-3 h-3 text-zinc-400" />
              <span>Key Repository Evidence</span>
            </div>
            <div className="space-y-1.5">
              {candidate.top_repos.slice(0, expanded ? 3 : 1).map((repo) => (
                <div
                  key={repo.name}
                  className="p-2 rounded bg-zinc-900/40 border border-zinc-800/60 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-indigo-400 hover:underline flex items-center gap-1 truncate"
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="w-3 h-3 text-zinc-500" />
                    </a>
                    {repo.stars > 0 && (
                      <span className="text-[10px] font-mono text-zinc-400">
                        ★ {repo.stars}
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                      {repo.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hugging Face Evidence Pill if available */}
        {candidate.huggingface && (
          <div className="mb-4 p-2 rounded-lg bg-amber-950/20 border border-amber-800/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hugging Face: {candidate.huggingface.models?.length || 0} Models</span>
            </div>
            {candidate.huggingface_url && (
              <a
                href={candidate.huggingface_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
              >
                Profile <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Footer: Expand Toggle + View Intelligence CTA */}
      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
        >
          {expanded ? (
            <>
              <span>Less</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Details</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          {candidate.profile_url && (
            <a
              href={candidate.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              title="View GitHub profile"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <Link href={`/discover/candidate/${candidate.username}`}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <span>View Intelligence</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
