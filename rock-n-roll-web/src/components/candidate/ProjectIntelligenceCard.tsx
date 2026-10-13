import React from "react";
import { ProjectAnalysis } from "@/lib/types";
import { formatScore, cn } from "@/lib/utils";
import { ExternalLink, Cpu, GitCommit, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

interface ProjectIntelligenceCardProps {
  project: ProjectAnalysis;
}

export function ProjectIntelligenceCard({ project }: ProjectIntelligenceCardProps) {
  const techScore = formatScore(project.technical_score);
  const ownershipScore = formatScore(project.ownership_score);
  const depthScore = formatScore(project.development_depth_score);
  const relevanceScore = formatScore(project.relevance_score);

  return (
    <div className="p-5 rounded-xl bg-[#0e1017] border border-zinc-800 shadow-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <a
            href={project.repository_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm font-bold text-zinc-100 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
          >
            <span>{project.repository_name}</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </a>
        </div>

        {/* AI assistance signal (labeled responsibly as indicators) */}
        {project.ai_assistance_signal && project.ai_assistance_signal !== "unknown" && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>AI assistance signals: {project.ai_assistance_signal}</span>
          </div>
        )}
      </div>

      {/* Summary */}
      {project.summary && (
        <p className="text-xs text-zinc-300/90 leading-relaxed font-sans">
          {project.summary}
        </p>
      )}

      {/* Scores Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 font-mono text-xs">
        <div>
          <div className="text-zinc-500 text-[10px] uppercase">Technical Depth</div>
          <div className="text-base font-bold text-zinc-100 mt-0.5">{techScore}%</div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${techScore}%` }} />
          </div>
        </div>

        <div>
          <div className="text-zinc-500 text-[10px] uppercase">Code Ownership</div>
          <div className="text-base font-bold text-zinc-100 mt-0.5">{ownershipScore}%</div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${ownershipScore}%` }} />
          </div>
        </div>

        <div>
          <div className="text-zinc-500 text-[10px] uppercase">Development Depth</div>
          <div className="text-base font-bold text-zinc-100 mt-0.5">{depthScore}%</div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${depthScore}%` }} />
          </div>
        </div>

        <div>
          <div className="text-zinc-500 text-[10px] uppercase">Job Relevance</div>
          <div className="text-base font-bold text-zinc-100 mt-0.5">{relevanceScore}%</div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${relevanceScore}%` }} />
          </div>
        </div>
      </div>

      {/* Verified Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
            Verified Technologies in Project
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Concrete Evidence Points */}
      {project.evidence && project.evidence.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/60">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
            Technical Evidence Observations
          </div>
          <ul className="space-y-1.5 text-xs text-zinc-400 font-sans">
            {project.evidence.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
