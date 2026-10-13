"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDiscovery } from "@/context/discovery-context";
import { RequirementsPanel } from "@/components/discover/RequirementsPanel";
import { Shortlist } from "@/components/discover/Shortlist";
import { CandidateCard } from "@/components/discover/CandidateCard";
import { FilterBar, SortOption } from "@/components/discover/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { formatScore } from "@/lib/utils";
import {
  Compass,
  ArrowLeft,
  Scale,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  LayoutGrid,
  List,
} from "lucide-react";

export default function DiscoverResultsPage() {
  const router = useRouter();
  const {
    results,
    highlightedSkill,
    setHighlightedSkill,
    selectedForCompare,
  } = useDiscovery();

  const [sortBy, setSortBy] = useState<SortOption>("best_match");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    requirements,
    top_candidates = [],
    shortlist = [],
    semantic_model,
    warnings = [],
    disclaimer,
  } = results || {};

  // Extract unique locations for filtering
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    top_candidates.forEach((c) => {
      if (c.location) locs.add(c.location);
    });
    return Array.from(locs);
  }, [top_candidates]);

  // Client-side filtering and sorting
  const filteredCandidates = useMemo(() => {
    return top_candidates
      .filter((candidate) => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = (candidate.name || "").toLowerCase().includes(q);
          const userMatch = candidate.username.toLowerCase().includes(q);
          const skillMatch = candidate.matched_skills?.some((s) =>
            s.toLowerCase().includes(q)
          );
          if (!nameMatch && !userMatch && !skillMatch) return false;
        }

        // Location filter
        if (locationFilter && candidate.location !== locationFilter) {
          return false;
        }

        // Highlighted skill filter (if active)
        if (highlightedSkill) {
          const hasSkill = candidate.matched_skills?.some(
            (s) => s.toLowerCase() === highlightedSkill.toLowerCase()
          );
          if (!hasSkill) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "semantic") {
          return formatScore(b.semantic_score) - formatScore(a.semantic_score);
        }
        if (sortBy === "skills") {
          return formatScore(b.skill_coverage) - formatScore(a.skill_coverage);
        }
        if (sortBy === "experience") {
          return formatScore(b.experience_score) - formatScore(a.experience_score);
        }
        // default: best_match
        return formatScore(b.score) - formatScore(a.score);
      });
  }, [
    top_candidates,
    searchQuery,
    locationFilter,
    highlightedSkill,
    sortBy,
  ]);

  // If no results exist yet in memory or session
  if (!results) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="No discovery results active"
          description="Please describe a target role and run candidate discovery to view ranked developers."
          actionLabel="Go to Discover"
          onAction={() => router.push("/discover")}
        />
      </div>
    );
  }

  const handleSkillClick = (skill: string) => {
    if (highlightedSkill === skill) {
      setHighlightedSkill(null);
    } else {
      setHighlightedSkill(skill);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setHighlightedSkill(null);
    setSortBy("best_match");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Link
            href="/discover"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Modify Role Description"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                DISCOVER RESULTS
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs font-mono text-zinc-400">
                {top_candidates.length} Profiles Ranked
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight mt-0.5">
              {requirements?.title || "Candidate Evaluation"}
            </h1>
          </div>
        </div>

        {/* Shortlist Comparison Action */}
        <div className="flex items-center gap-2">
          {selectedForCompare.length > 0 ? (
            <Link href="/discover/compare">
              <Button
                variant="primary"
                size="sm"
                className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Selected ({selectedForCompare.length})</span>
              </Button>
            </Link>
          ) : (
            <Link href="/discover/compare">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-zinc-400 hover:text-zinc-200 border-zinc-800 font-mono text-xs"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-400" />
                <span>Compare Shortlist</span>
              </Button>
            </Link>
          )}

          <Link href="/discover">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs font-mono text-zinc-300"
            >
              New Discovery
            </Button>
          </Link>
        </div>
      </div>

      {/* Warnings if any */}
      {warnings.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs font-mono text-amber-300/90 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Pipeline Notices:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-2">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Extracted Requirements Panel */}
      {requirements && (
        <RequirementsPanel
          requirements={requirements}
          semanticModel={semantic_model}
          highlightedSkill={highlightedSkill}
          onSkillClick={handleSkillClick}
          candidateCount={top_candidates.length}
        />
      )}

      {/* Dedicated Shortlist (Top 3) */}
      {shortlist && shortlist.length > 0 && (
        <Shortlist candidates={shortlist} />
      )}

      {/* Filter and Sort Toolbar */}
      <div className="space-y-4 pt-4 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-100 font-mono tracking-tight flex items-center gap-2">
            <span>ALL RANKED CANDIDATES</span>
            <span className="text-xs font-normal text-zinc-500">
              (TOP {top_candidates.length})
            </span>
          </h3>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <FilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          uniqueLocations={uniqueLocations}
          totalCount={top_candidates.length}
          filteredCount={filteredCandidates.length}
          onReset={handleResetFilters}
        />
      </div>

      {/* Candidate List / Grid */}
      {filteredCandidates.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {filteredCandidates.map((candidate, idx) => (
            <CandidateCard
              key={candidate.username}
              candidate={candidate}
              rank={idx + 1}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No candidates match your current filter"
          description="Try clearing your search query or selected skill filter."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      )}

      {/* Disclaimer */}
      {disclaimer && (
        <div className="text-center text-[11px] font-mono text-zinc-500 pt-6 border-t border-zinc-900">
          {disclaimer}
        </div>
      )}
    </div>
  );
}
