import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Compass,
  ArrowRight,
  BookOpen,
  Sparkles,
  GitPullRequest,
  Target,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GrowPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-zinc-800 pb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          <span>MODULE 3 • PRODUCT PREVIEW</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          GROW: Employee Skill Intelligence & Growth
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-sans leading-relaxed">
          Turn organizational skill gaps into personalized growth paths. Empowers engineers with tailored learning trajectories derived from real project code bases.
        </p>
      </div>

      {/* Conceptual Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-200 font-mono">
            Granular Skill Gaps
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Automatically maps individual engineers against target staff competencies, highlighting concrete delta areas such as Triton kernels or distributed tracing.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-200 font-mono">
            Personalized Learning Paths
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Generates curated reading, open-source repositories to study, and internal code modules to review based on semantic code embeddings.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-200 font-mono">
            Internal Peer Mentorship
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Connects junior builders with in-house subject matter experts whose repository evidence proves deep mastery in the desired technology stack.
          </p>
        </div>
      </div>

      {/* Conceptual Interface Mockup */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#0e1017] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>GROWTH TRAJECTORY CONCEPT (ENGINEER PROFILE SIMULATION)</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 uppercase">
            Trajectory Preview
          </span>
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 font-bold">Target Role: Principal ML Systems Engineer</span>
              <span className="text-indigo-400 font-semibold">78% Readiness</span>
            </div>

            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="w-[78%] h-full bg-indigo-500 rounded-full" />
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                ✓ PyTorch Distributed
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                ✓ CUDA C++
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40">
                ▲ Triton Custom Ops (Suggested Path)
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-400 border border-rose-800/40">
                ✗ Kubernetes Operator Development
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-500 font-mono text-center pt-2">
          Note: GROW will be integrated following the DISCOVER hackathon debut.
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
