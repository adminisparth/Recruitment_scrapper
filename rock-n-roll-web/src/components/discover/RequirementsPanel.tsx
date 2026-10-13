"use client";

import React from "react";
import { JobRequirements } from "@/lib/types";
import { SkillBadge } from "./SkillBadge";
import { Briefcase, MapPin, Clock, FileText, CheckCircle2 } from "lucide-react";

interface RequirementsPanelProps {
  requirements: JobRequirements;
  semanticModel?: string;
  highlightedSkill: string | null;
  onSkillClick: (skill: string) => void;
  candidateCount?: number;
}

export function RequirementsPanel({
  requirements,
  semanticModel,
  highlightedSkill,
  onSkillClick,
  candidateCount = 10,
}: RequirementsPanelProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0e1017] p-5 shadow-lg space-y-4">
      {/* Title & Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-950/50 border border-indigo-800/40">
              Extracted Criteria
            </span>
            {semanticModel && (
              <span className="text-[10px] font-mono text-zinc-400">
                Model: <span className="text-zinc-300">{semanticModel}</span>
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mt-1">
            {requirements.title || "Target Technical Role"}
          </h2>
        </div>

        {/* Quick badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono">
          {requirements.min_years_experience !== null && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{requirements.min_years_experience}+ Yrs Exp</span>
            </div>
          )}

          {(requirements.location || requirements.city || requirements.country) && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                {requirements.location ||
                  [requirements.city, requirements.country]
                    .filter(Boolean)
                    .join(", ")}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-950/30 text-indigo-300 border border-indigo-800/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{candidateCount} Candidates Analyzed</span>
          </div>
        </div>
      </div>

      {/* Summary if available */}
      {requirements.summary && (
        <div className="text-xs text-zinc-300/90 leading-relaxed font-sans bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/40">
          <span className="text-zinc-500 font-mono font-medium mr-2">ROLE SUMMARY:</span>
          {requirements.summary}
        </div>
      )}

      {/* Skills list with interactive highlight */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
            Required Technical Skills (Click to filter & highlight)
          </span>
          {highlightedSkill && (
            <button
              onClick={() => onSkillClick(highlightedSkill)}
              className="text-[10px] font-mono text-indigo-400 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {requirements.skills && requirements.skills.length > 0 ? (
            requirements.skills.map((skill) => (
              <SkillBadge
                key={skill}
                skill={skill}
                isInteractive
                isSelected={highlightedSkill === skill}
                onClick={() => onSkillClick(skill)}
              />
            ))
          ) : (
            <span className="text-xs text-zinc-500 italic">
              Extracted from job context dynamically
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
