"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  GitPullRequest,
  TrendingUp,
  Settings,
  Scale,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDiscovery } from "@/context/discovery-context";
import { checkBackendHealth } from "@/lib/api";
import { ServiceHealth } from "@/lib/types";

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const { selectedForCompare, results } = useDiscovery();
  const [health, setHealth] = useState<ServiceHealth>({ status: "offline" });

  useEffect(() => {
    checkBackendHealth().then(setHealth);
    const interval = setInterval(() => {
      checkBackendHealth().then(setHealth);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      label: "DISCOVER",
      href: "/discover",
      icon: Compass,
      badge: results ? `${results.top_candidates?.length || 0}` : undefined,
      description: "Talent search & neural ranking",
    },
    {
      label: "PLAN",
      href: "/plan",
      icon: Layers,
      badge: "Preview",
      description: "Workforce demand forecasting",
    },
    {
      label: "GROW",
      href: "/grow",
      icon: TrendingUp,
      badge: "Preview",
      description: "Skill intelligence & growth",
    },
  ];

  return (
    <aside className="w-64 flex flex-col h-full bg-[#0c0d13] border-r border-[#1a1c26] text-zinc-300 select-none">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-[#1a1c26]">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:border-indigo-400 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-widest text-zinc-100 flex items-center gap-1.5">
              ROCK N ROLL
            </div>
            <div className="text-[10px] text-zinc-500 font-mono tracking-tight uppercase">
              Talent Intelligence
            </div>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
          Core Modules
        </div>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                isActive
                  ? "bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-indigo-400"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                />
                <span className="tracking-wide">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] rounded font-mono font-medium",
                    isActive
                      ? "bg-indigo-900/60 text-indigo-300 border border-indigo-700/50"
                      : "bg-zinc-800/60 text-zinc-500 border border-zinc-700/40"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Shortlist Comparison shortcut if items are selected */}
        {selectedForCompare.length > 0 && (
          <div className="pt-2">
            <Link
              href="/discover/compare"
              onClick={onCloseMobile}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all",
                pathname === "/discover/compare"
                  ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                  : "bg-emerald-950/20 text-emerald-400/90 border border-emerald-900/30 hover:bg-emerald-950/30"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Compare Shortlist</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] rounded font-mono font-bold bg-emerald-900/50 text-emerald-300 border border-emerald-700/40">
                {selectedForCompare.length}
              </span>
            </Link>
          </div>
        )}

        <div className="pt-4 pb-2 px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
          System
        </div>

        <Link
          href="/settings"
          onClick={onCloseMobile}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
            pathname === "/settings"
              ? "bg-zinc-800/60 text-zinc-100 border border-zinc-700/50"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
          )}
        >
          <Settings className="w-4 h-4 text-zinc-500" />
          <span>Settings & API</span>
        </Link>
      </div>

      {/* Backend & Environment Status */}
      <div className="p-3 border-t border-[#1a1c26] bg-[#090a0f]/60 space-y-2.5">
        <div className="flex items-center justify-between px-2 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                health.status === "ready" || health.status === "ok"
                  ? "bg-emerald-400 shadow-sm shadow-emerald-500/50"
                  : "bg-amber-400"
              )}
            />
            <span className="text-zinc-400">
              {health.status === "ready" || health.status === "ok"
                ? "API Active"
                : "API Offline"}
            </span>
          </div>
          {health.latencyMs !== undefined && (
            <span className="text-zinc-500 text-[10px]">
              {health.latencyMs}ms
            </span>
          )}
        </div>

        {health.semantic_model && (
          <div className="px-2 py-1 rounded bg-zinc-900/80 border border-zinc-800/60 text-[10px] text-zinc-400 font-mono truncate">
            Model: <span className="text-zinc-300">{health.semantic_model}</span>
          </div>
        )}

        {/* User / Workspace Badge */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
          <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-[11px] font-bold text-indigo-300">
            H
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-zinc-200 truncate">
              Hackathon Workspace
            </div>
            <div className="text-[10px] text-zinc-500 truncate">
              Production Demo
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
