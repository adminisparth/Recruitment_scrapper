import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Loading data...",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-zinc-800 bg-[#0e1017]">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mb-3" />
      <p className="text-xs font-mono text-zinc-400">{message}</p>
    </div>
  );
}
