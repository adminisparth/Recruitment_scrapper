"use client";

import React from "react";
import { ArrowUpDown, Filter, Search, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOption = "best_match" | "semantic" | "skills" | "experience";

interface FilterBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  locationFilter: string;
  onLocationChange: (loc: string) => void;
  uniqueLocations: string[];
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
}

export function FilterBar({
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  locationFilter,
  onLocationChange,
  uniqueLocations,
  totalCount,
  filteredCount,
  onReset,
}: FilterBarProps) {
  const isFiltered = searchQuery !== "" || locationFilter !== "" || sortBy !== "best_match";

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0e1017] border border-zinc-800 text-xs font-mono">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by candidate name, username, or skills..."
          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Location selector */}
        {uniqueLocations.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={locationFilter}
              onChange={(e) => onLocationChange(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="py-1.5 px-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-indigo-500 text-xs"
          >
            <option value="best_match">Sort: Best Match</option>
            <option value="semantic">Sort: Semantic Similarity</option>
            <option value="skills">Sort: Skill Coverage</option>
            <option value="experience">Sort: Experience</option>
          </select>
        </div>

        {/* Counts & Reset */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800 text-zinc-400">
          <span>
            {filteredCount} of {totalCount}
          </span>
          {isFiltered && (
            <button
              onClick={onReset}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              title="Reset filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
