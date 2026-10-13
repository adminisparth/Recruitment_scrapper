"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Circle, Sparkles, Terminal } from "lucide-react";
import { PipelineStepId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DiscoveryPipelineProps {
  currentStep: PipelineStepId;
  source?: "github" | "uploaded_resumes";
}

interface StepConfig {
  id: PipelineStepId;
  label: string;
  description: string;
}

export function DiscoveryPipeline({
  currentStep,
  source = "github",
}: DiscoveryPipelineProps) {
  const steps: StepConfig[] = [
    {
      id: "extract_job",
      label: "Understanding Job Requirements",
      description: "Extracting core competencies, seniority, and location constraints",
    },
    {
      id: "search_candidates",
      label: source === "uploaded_resumes" ? "Parsing Candidate Resumes" : "Discovering Relevant Candidates",
      description: source === "uploaded_resumes" ? "Extracting skills and timeline from document batch" : "Querying developer graph via GitHub technical signals",
    },
    {
      id: "enrich_candidates",
      label: "Enriching Technical Evidence",
      description: "Fetching repository depth, commits, and optional Hugging Face models",
    },
    {
      id: "rank_candidates",
      label: "Neural Two-Tower Ranking",
      description: "Computing semantic alignment & skill coverage vector distances",
    },
  ];

  const getStepStatus = (stepId: PipelineStepId) => {
    const stepOrder: PipelineStepId[] = [
      "extract_job",
      "search_candidates",
      "enrich_candidates",
      "rank_candidates",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "in_progress";
    return "pending";
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-2xl bg-[#0e1017] border border-zinc-800/80 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider font-mono">
              AI Analysis Pipeline
            </h3>
            <p className="text-xs text-zinc-400">
              Evaluating candidate candidates against technical criteria
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
          <Terminal className="w-3 h-3 text-indigo-400" />
          <span>LIVE AGENT</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const status = getStepStatus(step.id);

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "flex items-start gap-3.5 p-3 rounded-xl transition-colors",
                status === "in_progress"
                  ? "bg-indigo-950/20 border border-indigo-800/40"
                  : status === "completed"
                  ? "bg-zinc-900/30 border border-zinc-800/40"
                  : "opacity-40"
              )}
            >
              {/* Icon Status */}
              <div className="mt-0.5 shrink-0">
                {status === "completed" && (
                  <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                {status === "in_progress" && (
                  <div className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-500/60 flex items-center justify-center text-indigo-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                  </div>
                )}
                {status === "pending" && (
                  <div className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-600">
                    <Circle className="w-2 h-2" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-wide",
                      status === "completed"
                        ? "text-zinc-300"
                        : status === "in_progress"
                        ? "text-indigo-300 font-bold"
                        : "text-zinc-500"
                    )}
                  >
                    {step.label}
                  </span>
                  {status === "in_progress" && (
                    <span className="text-[10px] font-mono text-indigo-400 animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pipeline note */}
      <div className="text-[11px] font-mono text-zinc-400 text-center pt-2 border-t border-zinc-800/60">
        AI recommends, humans decide. Validating repository ownership & commit integrity.
      </div>
    </div>
  );
}
