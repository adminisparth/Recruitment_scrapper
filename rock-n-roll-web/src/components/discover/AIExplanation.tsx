"use client";

import React, { useState } from "react";
import { ScoredCandidate, JobRequirements } from "@/lib/types";
import { generateAIExplanation } from "@/lib/utils";
import { Sparkles, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

interface AIExplanationProps {
  candidate: ScoredCandidate;
  requirements?: JobRequirements | null;
  defaultExpanded?: boolean;
}

export function AIExplanation({
  candidate,
  requirements,
  defaultExpanded = true,
}: AIExplanationProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const explanation = generateAIExplanation(candidate, requirements);

  return (
    <div className="rounded-xl border border-indigo-900/40 bg-gradient-to-r from-indigo-950/30 via-zinc-900/40 to-transparent p-4 shadow-sm">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-100 font-mono tracking-wide">
              WHY THIS CANDIDATE?
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">
              Deterministic ranking rationale from repository signals
            </span>
          </div>
        </div>

        <button
          type="button"
          className="p-1 rounded text-zinc-400 hover:text-zinc-200"
          aria-label={expanded ? "Collapse explanation" : "Expand explanation"}
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2">
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {explanation}
          </p>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              Evaluation is grounded exclusively in public commit activity, AST parsing, and verified repository languages.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
