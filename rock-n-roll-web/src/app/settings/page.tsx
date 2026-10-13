"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/providers";
import { checkBackendHealth, getApiBaseUrl } from "@/lib/api";
import { ServiceHealth } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import {
  Settings,
  Activity,
  Server,
  Sun,
  Moon,
  Info,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [health, setHealth] = useState<ServiceHealth>({ status: "offline" });
  const [isChecking, setIsChecking] = useState(false);

  const fetchHealth = async () => {
    setIsChecking(true);
    const res = await checkBackendHealth();
    setHealth(res);
    setIsChecking(false);
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1.5 border-b border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
          <Settings className="w-3.5 h-3.5" />
          <span>CONFIGURATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
          Settings & Environment
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans">
          Manage application themes, verify API connectivity, and inspect backend models.
        </p>
      </div>

      <div className="space-y-6">
        {/* Backend Status Section */}
        <div className="rounded-xl border border-zinc-800 bg-[#0e1017] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-zinc-200 font-mono uppercase tracking-wide">
                FastAPI Backend Service
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchHealth}
              isLoading={isChecking}
              className="text-xs font-mono gap-1.5 h-8 text-zinc-300"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Ping Health</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="text-zinc-500 text-[10px]">API ENDPOINT</div>
              <div className="text-zinc-200 truncate">{getApiBaseUrl()}</div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="text-zinc-500 text-[10px]">CONNECTION STATE</div>
              <div className="flex items-center gap-1.5 font-bold">
                {health.status === "ready" || health.status === "ok" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Online & Ready</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400">Offline / Not Reachable</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="text-zinc-500 text-[10px]">LATENCY</div>
              <div className="text-zinc-200">
                {health.latencyMs !== undefined ? `${health.latencyMs} ms` : "N/A"}
              </div>
            </div>
          </div>

          {health.semantic_model && (
            <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-800/40 text-xs font-mono text-indigo-300 flex items-center justify-between">
              <span>Loaded Semantic Model:</span>
              <span className="font-bold text-zinc-100">{health.semantic_model}</span>
            </div>
          )}
        </div>

        {/* Theme Settings */}
        <div className="rounded-xl border border-zinc-800 bg-[#0e1017] p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <Sun className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-zinc-200 font-mono uppercase tracking-wide">
              Appearance & Theme
            </h2>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all border ${
                theme === "dark"
                  ? "bg-indigo-950/60 text-indigo-300 border-indigo-700/80 font-bold"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark Theme (Default)</span>
            </button>

            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all border ${
                theme === "light"
                  ? "bg-indigo-950/60 text-indigo-300 border-indigo-700/80 font-bold"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light Theme</span>
            </button>
          </div>
        </div>

        {/* App Information */}
        <div className="rounded-xl border border-zinc-800 bg-[#0e1017] p-6 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-300 font-bold uppercase">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>Product Specifications</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-zinc-400">
            <div>Product Name: <span className="text-zinc-200 font-bold">ROCK N ROLL</span></div>
            <div>Core Engine: <span className="text-zinc-200">LangGraph + Two-Tower Neural Ranking</span></div>
            <div>Frontend Architecture: <span className="text-zinc-200">Next.js App Router (TypeScript)</span></div>
            <div>Deployment Environment: <span className="text-zinc-200">Hackathon Edition (Local/Cloud)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
