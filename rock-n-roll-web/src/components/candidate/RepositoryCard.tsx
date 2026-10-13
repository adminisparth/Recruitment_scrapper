import React from "react";
import { RepoSummary } from "@/lib/types";
import { ExternalLink, Star, Code2 } from "lucide-react";

interface RepositoryCardProps {
  repo: RepoSummary;
}

export function RepositoryCard({ repo }: RepositoryCardProps) {
  return (
    <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 truncate group"
          >
            <span className="truncate">{repo.name}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0" />
          </a>
          {repo.stars > 0 && (
            <div className="flex items-center gap-1 text-xs font-mono text-amber-400/90 shrink-0 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/40">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{repo.stars.toLocaleString()}</span>
            </div>
          )}
        </div>

        {repo.description ? (
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-3">
            {repo.description}
          </p>
        ) : (
          <p className="text-xs text-zinc-600 italic mb-3">No repository description provided.</p>
        )}
      </div>

      {repo.language && (
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>{repo.language}</span>
        </div>
      )}
    </div>
  );
}
