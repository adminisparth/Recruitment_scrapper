import React from "react";
import { HFEvidence } from "@/lib/types";
import { ExternalLink, Sparkles, Box, Database, Layout, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface HuggingFaceEvidenceCardProps {
  evidence: HFEvidence | null;
  hfUrl?: string | null;
  hfUsername?: string | null;
}

export function HuggingFaceEvidenceCard({
  evidence,
  hfUrl,
  hfUsername,
}: HuggingFaceEvidenceCardProps) {
  if (!evidence) {
    return (
      <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-950/40 text-xs font-mono text-zinc-500">
        Additional AI/ML open-source registry evidence unavailable for this candidate.
      </div>
    );
  }

  const { models = [], datasets = [], spaces = [], skills = [] } = evidence;

  return (
    <div className="rounded-xl border border-amber-800/40 bg-gradient-to-b from-[#14120e] to-[#0e1017] p-5 shadow-lg space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-100 font-mono tracking-wide">
                HUGGING FACE EVIDENCE
              </h3>
              <Badge variant="warning" size="sm">
                Optional Enrichment
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Candidate profile: @{evidence.username}
            </p>
          </div>
        </div>

        {evidence.profile_url && (
          <a
            href={evidence.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/50 hover:bg-amber-900/40 text-xs font-mono transition-colors self-start sm:self-auto"
          >
            <span>View HF Profile</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Identity Notice */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] font-mono text-zinc-400">
        <ShieldAlert className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
        <span>
          Note: Hugging Face enrichment is evaluated as technical and project evidence. Verified identity correlation is determined by technical handle alignment.
        </span>
      </div>

      {/* Models Section */}
      {models.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
            <Box className="w-4 h-4 text-amber-400" />
            <span>Published Models ({models.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {models.map((model) => (
              <div
                key={model.id}
                className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs font-mono space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={model.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-amber-300 hover:underline truncate"
                  >
                    {model.id}
                  </a>
                  <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                </div>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                  {model.pipeline_tag && (
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                      {model.pipeline_tag}
                    </span>
                  )}
                  {model.downloads > 0 && (
                    <span>↓ {model.downloads.toLocaleString()}</span>
                  )}
                  {model.likes > 0 && <span>♥ {model.likes}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Datasets & Spaces Grid */}
      {(datasets.length > 0 || spaces.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {datasets.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Datasets ({datasets.length})</span>
              </div>
              <div className="space-y-2">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs font-mono flex items-center justify-between"
                  >
                    <a
                      href={dataset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-200 hover:text-amber-300 truncate"
                    >
                      {dataset.id}
                    </a>
                    {dataset.downloads > 0 && (
                      <span className="text-zinc-500 text-[10px]">
                        ↓ {dataset.downloads}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {spaces.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <Layout className="w-4 h-4 text-amber-400" />
                <span>Interactive Spaces ({spaces.length})</span>
              </div>
              <div className="space-y-2">
                {spaces.map((space) => (
                  <div
                    key={space.id}
                    className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs font-mono flex items-center justify-between"
                  >
                    <a
                      href={space.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-200 hover:text-amber-300 truncate"
                    >
                      {space.id}
                    </a>
                    {space.sdk && (
                      <span className="text-zinc-500 text-[10px] px-1.5 py-0.5 rounded bg-zinc-800">
                        {space.sdk}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* HF Skills */}
      {skills.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/60">
          <div className="text-[11px] font-mono text-zinc-400 mb-1.5">
            HF Domain Competencies:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
