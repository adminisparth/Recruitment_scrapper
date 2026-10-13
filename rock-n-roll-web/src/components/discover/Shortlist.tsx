"use client";

import React from "react";
import Link from "next/link";
import { ScoredCandidate } from "@/lib/types";
import { CandidateCard } from "./CandidateCard";
import { Scale, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ShortlistProps {
  candidates: ScoredCandidate[];
}

export function Shortlist({ candidates }: ShortlistProps) {
  if (!candidates || candidates.length === 0) return null;

  const top3 = candidates.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Shortlist Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-transparent border border-indigo-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Award className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-100 tracking-tight">
                TOP SHORTLIST
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60 uppercase font-semibold">
                High Signal Matches
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Top recommended candidates demonstrating verified technical evidence
            </p>
          </div>
        </div>

        {/* Action: Compare Shortlist */}
        <Link href="/discover/compare">
          <Button
            variant="primary"
            size="sm"
            className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare Shortlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Grid of 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((candidate, idx) => (
          <CandidateCard
            key={candidate.username}
            candidate={candidate}
            rank={idx + 1}
            isShortlist
          />
        ))}
      </div>
    </div>
  );
}
