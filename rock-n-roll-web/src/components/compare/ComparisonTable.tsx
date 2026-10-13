"use client";

import React from "react";
import Link from "next/link";
import { ScoredCandidate } from "@/lib/types";
import { formatScore, cn } from "@/lib/utils";
import { SkillBadge } from "@/components/discover/SkillBadge";
import {
  ExternalLink,
  Award,
  Check,
  X,
  Sparkles,
  ArrowRight,
  FolderGit2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ComparisonTableProps {
  candidates: ScoredCandidate[];
  onRemove: (username: string) => void;
}

export function ComparisonTable({
  candidates,
  onRemove,
}: ComparisonTableProps) {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="p-12 text-center rounded-xl border border-zinc-800 bg-[#0e1017]">
        <p className="text-sm text-zinc-400 font-mono mb-4">
          No candidates selected for comparison yet.
        </p>
        <Link href="/discover/results">
          <Button variant="secondary" size="sm">
            Browse Results to Select Candidates
          </Button>
        </Link>
      </div>
    );
  }

  // Find candidate with highest overall score to subtly highlight as top match
  const highestScore = Math.max(...candidates.map((c) => formatScore(c.score)));

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-800 bg-[#0e1017] shadow-xl">
      <table className="w-full border-collapse text-left font-sans text-xs">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-950/60">
            <th className="p-4 w-44 font-mono font-semibold text-zinc-400 uppercase tracking-wider text-[11px] sticky left-0 bg-zinc-950/90 backdrop-blur z-10">
              Metric / Signal
            </th>
            {candidates.map((c) => {
              const isTop = formatScore(c.score) === highestScore;
              return (
                <th
                  key={c.username}
                  className={cn(
                    "p-4 min-w-[280px] align-top transition-colors border-l border-zinc-800/60",
                    isTop ? "bg-indigo-950/20" : ""
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {c.avatar_url ? (
                        <img
                          src={c.avatar_url}
                          alt={c.name || c.username}
                          className="w-10 h-10 rounded-full border border-zinc-700 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-mono font-bold text-zinc-300">
                          {(c.name || c.username).slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-zinc-100 truncate">
                            {c.name || c.username}
                          </span>
                          {isTop && (
                            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-500 truncate">
                          @{c.username}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemove(c.username)}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-800/80 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Link href={`/discover/candidate/${c.username}`}>
                      <button className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        <span>Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-800/60">
          {/* Row 1: Overall Match Score */}
          <tr className="hover:bg-zinc-900/30">
            <td className="p-4 font-mono font-semibold text-zinc-300 sticky left-0 bg-[#0e1017] z-10 border-r border-zinc-800/40">
              Overall Match
            </td>
            {candidates.map((c) => {
              const score = formatScore(c.score);
              const isTop = score === highestScore;
              return (
                <td
                  key={c.username}
                  className={cn(
                    "p-4 border-l border-zinc-800/60",
                    isTop ? "bg-indigo-950/10" : ""
                  )}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xl font-bold text-zinc-100">
                      {score}%
                    </span>
                    {isTop && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        Highest Match
                      </span>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        isTop ? "bg-indigo-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </td>
              );
            })}
          </tr>

          {/* Row 2: Semantic Alignment */}
          <tr className="hover:bg-zinc-900/30">
            <td className="p-4 font-mono text-zinc-400 sticky left-0 bg-[#0e1017] z-10 border-r border-zinc-800/40">
              Semantic Alignment
            </td>
            {candidates.map((c) => (
              <td key={c.username} className="p-4 font-mono text-zinc-200 border-l border-zinc-800/60">
                <span className="font-semibold text-sm">
                  {formatScore(c.semantic_score)}%
                </span>
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full"
                    style={{ width: `${formatScore(c.semantic_score)}%` }}
                  />
                </div>
              </td>
            ))}
          </tr>

          {/* Row 3: Skill Coverage */}
          <tr className="hover:bg-zinc-900/30">
            <td className="p-4 font-mono text-zinc-400 sticky left-0 bg-[#0e1017] z-10 border-r border-zinc-800/40">
              Skill Coverage
            </td>
            {candidates.map((c) => (
              <td key={c.username} className="p-4 font-mono text-zinc-200 border-l border-zinc-800/60">
                <span className="font-semibold text-sm">
                  {formatScore(c.skill_coverage)}%
                </span>
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${formatScore(c.skill_coverage)}%` }}
                  />
                </div>
              </td>
            ))}
          </tr>

          {/* Row 4: Experience Score & Active Years */}
          <tr className="hover:bg-zinc-900/30">
            <td className="p-4 font-mono text-zinc-400 sticky left-0 bg-[#0e1017] z-10 border-r border-zinc-800/40">
              Experience & History
            </td>
            {candidates.map((c) => (
              <td key={c.username} className="p-4 font-mono text-zinc-200 border-l border-zinc-800/60">
                <div className="text-sm font-semibold">
                  {formatScore(c.experience_score)}%
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  {c.years_active ? `${c.years_active.toFixed(1)} yrs active` : "N/A"} •{" "}
                  {c.public_repos} repos
                </div>
              </td>
            ))}
          </tr>

          {/* Row 5: Location */}
          <tr className="hover:bg-zinc-900/30">
            <td className="p-4 font-mono text-zinc-400 sticky left-0 bg-[#0e1017] z-10 border-r border-zinc-800/40">
              Location
            </td>
            {candidates.map((c) => (
              <td key={c.username} className="p-4 font-mono text-xs text-zinc-300 border-l border-zinc-800/60">
                {c.location || "Not specified / Remote"}
              </td>
            ))}
          </tr>

          {/* Row 6: Matched Skills */}
          <tr className="hover:bg-zinc-900/30">
            <td className="p-4 font-mono text-zinc-400 sticky left-0 bg-[#0e1017] z-10 border-r border-zinc-800/40">
              Verified Skills
            </td>
            {candidates.map((c) => (
              <td key={c.username} className="p-4 border-l border-zinc-800/60 align-top">
                <div className="flex flex-wrap gap-1">
                  {c.matched_skills && c.matched_skills.length > 0 ? (
                    c.matched_skills.map((s) => (
                      <SkillBadge key={s} skill={s} variant="matched" />
                    ))
                  ) : (
                    <span className="text-zinc-600 italic">None</span>
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* Row 7: Missing Skills */}
          <tr className="hover:bg-zinc-900/30">
            <td className="p-4 font-mono text-zinc-400 sticky left-0 bg-[#0e1017] z-10 border-r border-zinc-800/40">
              Missing Skills
            </td>
            {candidates.map((c) => (
              <td key={c.username} className="p-4 border-l border-zinc-800/60 align-top">
                <div className="flex flex-wrap gap-1">
                  {c.missing_skills && c.missing_skills.length > 0 ? (
                    c.missing_skills.map((s) => (
                      <SkillBadge key={s} skill={s} variant="missing" />
                    ))
                  ) : (
                    <span className="text-emerald-500 text-[11px] font-mono">
                      Full coverage
                    </span>
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* Row 8: Key Repositories */}
          <tr className="hover:bg-zinc-900/30">
            <td className="p-4 font-mono text-zinc-400 sticky left-0 bg-[#0e1017] z-10 border-r border-zinc-800/40">
              Key Repositories
            </td>
            {candidates.map((c) => (
              <td key={c.username} className="p-4 border-l border-zinc-800/60 align-top space-y-1.5">
                {c.top_repos && c.top_repos.length > 0 ? (
                  c.top_repos.slice(0, 2).map((r) => (
                    <div
                      key={r.name}
                      className="p-2 rounded bg-zinc-900/60 border border-zinc-800 text-xs font-mono"
                    >
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline flex items-center gap-1 font-semibold truncate"
                      >
                        <span className="truncate">{r.name}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                      </a>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                        <span>{r.language || "Code"}</span>
                        <span>★ {r.stars}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-zinc-600 italic">No public repos</span>
                )}
              </td>
            ))}
          </tr>

          {/* Row 9: Hugging Face Evidence */}
          <tr className="hover:bg-zinc-900/30">
            <td className="p-4 font-mono text-zinc-400 sticky left-0 bg-[#0e1017] z-10 border-r border-zinc-800/40">
              Hugging Face Evidence
            </td>
            {candidates.map((c) => (
              <td key={c.username} className="p-4 border-l border-zinc-800/60 align-top font-mono text-xs">
                {c.huggingface ? (
                  <div className="p-2 rounded bg-amber-950/20 border border-amber-800/40 text-amber-300 space-y-1">
                    <div className="flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>@{c.huggingface.username}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {c.huggingface.models?.length || 0} Models •{" "}
                      {c.huggingface.spaces?.length || 0} Spaces
                    </div>
                  </div>
                ) : (
                  <span className="text-zinc-600 italic text-[11px]">
                    No external HF profile
                  </span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
