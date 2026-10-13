"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDiscovery } from "@/context/discovery-context";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { Button } from "@/components/ui/Button";
import { Scale, ArrowLeft, RotateCcw, Plus } from "lucide-react";
import { MOCK_DISCOVER_RESPONSE } from "@/lib/mock-data";

export default function ComparePage() {
  const router = useRouter();
  const {
    results,
    selectedForCompare,
    toggleCompare,
    clearCompare,
    getCandidate,
    loadMockData,
  } = useDiscovery();

  // Resolve candidates selected for comparison
  const comparedCandidates = useMemo(() => {
    // If user has specific selected candidates in context
    if (selectedForCompare.length > 0) {
      const list = selectedForCompare
        .map((username) => {
          let c = getCandidate(username);
          if (!c) {
            c = MOCK_DISCOVER_RESPONSE.shortlist.find((m) => m.username === username);
          }
          return c;
        })
        .filter(Boolean);

      if (list.length > 0) return list as any[];
    }

    // Default to top 3 shortlist if available
    if (results?.shortlist && results.shortlist.length > 0) {
      return results.shortlist.slice(0, 3);
    }

    // Fallback to mock shortlist if nothing active
    return MOCK_DISCOVER_RESPONSE.shortlist.slice(0, 3);
  }, [selectedForCompare, results, getCandidate]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Link
            href="/discover/results"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Back to Results"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                HEAD-TO-HEAD COMPARISON
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs font-mono text-zinc-400">
                {comparedCandidates.length} Selected (Max 3)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mt-0.5">
              Candidate Signal Evaluation
            </h1>
          </div>
        </div>

        {/* Clear / Return actions */}
        <div className="flex items-center gap-2">
          {selectedForCompare.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompare}
              className="text-xs font-mono text-zinc-400 border-zinc-800 gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Selection</span>
            </Button>
          )}

          <Link href="/discover/results">
            <Button variant="secondary" size="sm" className="text-xs font-mono">
              View All Results
            </Button>
          </Link>
        </div>
      </div>

      {/* Comparison Table */}
      <ComparisonTable
        candidates={comparedCandidates}
        onRemove={(username) => toggleCompare(username)}
      />

      {/* Comparison Guidance note */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 text-xs font-mono text-zinc-400 space-y-1">
        <div className="text-zinc-300 font-semibold">
          Shortlist Decision Support
        </div>
        <p className="text-zinc-500 leading-relaxed font-sans">
          The highest overall match is highlighted based on the Dual-Tower neural embedding and verified repository depth. All signals remain objective indicators to assist technical hiring committees.
        </p>
      </div>
    </div>
  );
}
