"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface SkillBadgeProps {
  skill: string;
  variant?: "matched" | "missing" | "neutral" | "highlighted";
  isInteractive?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  count?: number;
}

export function SkillBadge({
  skill,
  variant = "neutral",
  isInteractive = false,
  isSelected = false,
  onClick,
  count,
}: SkillBadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all select-none";

  const variants = {
    matched:
      "bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/50",
    missing:
      "bg-rose-950/30 text-rose-400/90 border border-rose-900/40 hover:bg-rose-950/50",
    neutral:
      "bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 hover:border-zinc-500",
    highlighted:
      "bg-indigo-950 text-indigo-300 border border-indigo-500 shadow-sm shadow-indigo-500/20 font-semibold",
  };

  const currentVariant = isSelected ? "highlighted" : variant;

  return (
    <button
      type="button"
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      className={cn(
        base,
        variants[currentVariant],
        isInteractive ? "cursor-pointer active:scale-95" : "cursor-default"
      )}
    >
      {currentVariant === "matched" && <Check className="w-3 h-3 text-emerald-400" />}
      {currentVariant === "missing" && <X className="w-3 h-3 text-rose-400" />}
      <span>{skill}</span>
      {count !== undefined && (
        <span className="text-[10px] text-zinc-500 ml-0.5">({count})</span>
      )}
    </button>
  );
}
