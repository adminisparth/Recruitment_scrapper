import React from "react";
import Link from "next/link";
import {
  Layers,
  TrendingUp,
  Users,
  Compass,
  ArrowRight,
  Clock,
  Sparkles,
  BarChart3,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PlanPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-zinc-800 pb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>MODULE 2 • PRODUCT PREVIEW</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          PLAN: Workforce Planning & Forecasting
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-sans leading-relaxed">
          Understand workforce demand before it becomes an operational bottleneck. Model capacity, attrition patterns, and multi-quarter hiring roadmaps.
        </p>
      </div>

      {/* Conceptual Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-200 font-mono">
            Forecast Technical Demand
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Correlate incoming engineering roadmap initiatives with required technology specializations (CUDA, Distributed Systems, ML Ops) across upcoming quarters.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-200 font-mono">
            Identify Skill Gaps Early
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Automatically detect internal dependency bottlenecks where project delivery hinges on a small number of specialized domain practitioners.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-200 font-mono">
            Dynamic Hiring Roadmaps
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Seamlessly feeds prioritized headcount requirements directly into the <strong>DISCOVER</strong> engine to proactively source candidates before requisitions open.
          </p>
        </div>
      </div>

      {/* Conceptual Interface Mockup */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#0e1017] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Q3–Q4 AI INFRASTRUCTURE CAPACITY PROJECTION</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 uppercase">
            Simulation Concept
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <div className="text-zinc-200 font-bold">Distributed Training Cluster Operations</div>
              <div className="text-zinc-500 text-[11px] mt-0.5">Required: 4 Senior ML Ops • Current: 1 Engineer</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="px-2 py-1 rounded bg-rose-950/40 text-rose-400 border border-rose-800/50 text-[11px]">
                Deficit: -3 Engineers
              </span>
              <Link href="/discover">
                <Button size="sm" variant="primary" className="text-xs py-1 h-7 font-mono">
                  Sourced via Discover →
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <div className="text-zinc-200 font-bold">Agentic Evaluation & Safety Guardrails</div>
              <div className="text-zinc-500 text-[11px] mt-0.5">Required: 2 Applied AI Devs • Current: 2 Engineers</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="px-2 py-1 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 text-[11px]">
                Balanced Capacity
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-500 font-mono text-center pt-2">
          Note: PLAN will be fully released in the post-hackathon enterprise tier.
        </div>
      </div>

      {/* Cross link to DISCOVER */}
      <div className="text-center pt-4">
        <Link href="/discover">
          <Button size="lg" className="gap-2 font-mono text-xs">
            <Compass className="w-4 h-4" />
            <span>Switch to Active DISCOVER Module</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
