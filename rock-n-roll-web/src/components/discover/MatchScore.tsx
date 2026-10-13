import React from "react";
import { formatScore, getScoreBadgeStyle, cn } from "@/lib/utils";

interface MatchScoreProps {
  score: number;
  semanticScore?: number;
  skillCoverage?: number;
  experienceScore?: number;
  locationScore?: number;
  size?: "sm" | "md" | "lg";
  showBreakdown?: boolean;
  className?: string;
}

export function MatchScore({
  score,
  semanticScore,
  skillCoverage,
  experienceScore,
  locationScore,
  size = "md",
  showBreakdown = false,
  className,
}: MatchScoreProps) {
  const normScore = formatScore(score);
  const badgeStyle = getScoreBadgeStyle(normScore);

  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-2xl font-bold tracking-tight",
    lg: "text-3xl font-extrabold tracking-tight",
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("font-mono text-zinc-100", sizeClasses[size])}>
            {normScore}
          </span>
          <span className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
            Match
          </span>
        </div>
        <span
          className={cn(
            "text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-medium",
            badgeStyle.bg
          )}
        >
          {badgeStyle.label}
        </span>
      </div>

      {/* Main score bar */}
      <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", badgeStyle.bar)}
          style={{ width: `${normScore}%` }}
        />
      </div>

      {/* Optional horizontal breakdown */}
      {showBreakdown && (
        <div className="pt-2 space-y-2 border-t border-zinc-800/60">
          {semanticScore !== undefined && (
            <MetricBar
              label="Semantic Match"
              value={formatScore(semanticScore)}
              color="bg-indigo-500"
            />
          )}
          {skillCoverage !== undefined && (
            <MetricBar
              label="Skill Coverage"
              value={formatScore(skillCoverage)}
              color="bg-emerald-500"
            />
          )}
          {experienceScore !== undefined && (
            <MetricBar
              label="Experience"
              value={formatScore(experienceScore)}
              color="bg-amber-500"
            />
          )}
          {locationScore !== undefined && (
            <MetricBar
              label="Location Fit"
              value={formatScore(locationScore)}
              color="bg-sky-500"
            />
          )}
        </div>
      )}
    </div>
  );
}

function MetricBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-mono">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-200 font-semibold">{value}%</span>
      </div>
      <div className="w-full h-1 bg-zinc-800/80 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
