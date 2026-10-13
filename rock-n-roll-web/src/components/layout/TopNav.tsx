"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Moon,
  Sun,
  Scale,
  Sparkles,
  ArrowRight,
  Database,
} from "lucide-react";
import { useTheme } from "@/components/providers";
import { useDiscovery } from "@/context/discovery-context";
import { Button } from "@/components/ui/Button";

interface TopNavProps {
  onOpenMobile: () => void;
}

export function TopNav({ onOpenMobile }: TopNavProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { selectedForCompare, results, loadMockData } = useDiscovery();

  // Determine breadcrumb / title
  const getHeaderInfo = () => {
    if (pathname === "/") return { title: "Overview", tag: "Platform" };
    if (pathname === "/discover") return { title: "Discover", tag: "Talent Sourcing" };
    if (pathname === "/discover/results") return { title: "Discover Results", tag: "Ranking Pipeline" };
    if (pathname.startsWith("/discover/candidate")) return { title: "Candidate Profile", tag: "Deep Intelligence" };
    if (pathname === "/discover/compare") return { title: "Candidate Comparison", tag: "Shortlist" };
    if (pathname === "/plan") return { title: "Workforce Planning", tag: "Forecasting" };
    if (pathname === "/grow") return { title: "Skill Development", tag: "Intelligence" };
    if (pathname === "/settings") return { title: "System & API Settings", tag: "Configuration" };
    return { title: "Rock N Roll", tag: "AI Platform" };
  };

  const info = getHeaderInfo();

  return (
    <header className="h-14 border-b border-[#1a1c26] bg-[#0c0d13]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hidden sm:inline-block">
            {info.tag}
          </span>
          <span className="text-zinc-600 hidden sm:inline-block">/</span>
          <h1 className="text-sm font-semibold text-zinc-200 tracking-tight">
            {info.title}
          </h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Demo Preload for judges/evaluators */}
        {!results && (
          <Button
            variant="outline"
            size="sm"
            onClick={loadMockData}
            className="text-xs py-1 h-8 text-zinc-400 hover:text-zinc-200 border-zinc-800 hidden sm:flex items-center gap-1.5"
            title="Load realistic candidate evaluation benchmark for testing"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Load Demo Benchmark</span>
          </Button>
        )}

        {/* Compare Shortlist Button */}
        {selectedForCompare.length > 0 && (
          <Link href="/discover/compare">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs py-1 h-8 bg-indigo-950/40 text-indigo-300 border-indigo-800/40 hover:bg-indigo-900/60 gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare ({selectedForCompare.length})</span>
            </Button>
          </Link>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-zinc-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-400" />
          )}
        </button>
      </div>
    </header>
  );
}
