"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  Layers,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  GitBranch,
  Terminal,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20 sm:space-y-28">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 sm:pt-8">
        {/* Brand Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-800/40 text-xs font-mono text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>ROCK N ROLL • AI-POWERED TALENT & WORKFORCE INTELLIGENCE</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-100 tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Find the people who{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-300">
            actually fit the work.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
          AI-powered talent discovery, workforce planning, and skill intelligence grounded in concrete technical evidence rather than buzzword resumes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/discover">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-sm px-6 py-3 font-semibold shadow-lg shadow-indigo-950/50">
              <Compass className="w-4 h-4" />
              <span>Discover Talent</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="#modules">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-sm px-6 py-3">
              Explore the Platform
            </Button>
          </a>
        </div>

        {/* Subtle Animated Visual: Role Analysis & Ranking Demonstration */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-zinc-800/90 bg-[#0e1017] p-5 sm:p-7 shadow-2xl text-left space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-40 bg-indigo-600/5 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>ACTIVE PIPELINE PREVIEW</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>NEURAL RANKING ACTIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 font-mono text-xs">
                <div className="text-[10px] text-zinc-500 uppercase">Input Requirements</div>
                <div className="font-semibold text-zinc-200">Senior ML Engineer</div>
                <div className="text-[11px] text-zinc-400">
                  PyTorch • Transformers • CUDA • Distributed Training
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 font-mono text-xs">
                <div className="text-[10px] text-zinc-500 uppercase">Evidence Extraction</div>
                <div className="font-semibold text-indigo-300">GitHub AST + HF Models</div>
                <div className="text-[11px] text-zinc-400">
                  Validating 1,850+ stars, custom CUDA kernels & LoRA weights
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-800/40 space-y-2 font-mono text-xs">
                <div className="text-[10px] text-indigo-400 uppercase">Rank #1 Match Result</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-100">Arjun Verma</span>
                  <span className="font-bold text-emerald-400">95.4%</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  High semantic match & 92.5% verified skill coverage
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Modules */}
      <section id="modules" className="space-y-10 pt-8 border-t border-zinc-900">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
            Platform Architecture
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Three pillars of workforce intelligence.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1: DISCOVER */}
          <div className="rounded-2xl border border-indigo-700/40 bg-gradient-to-b from-[#12131f] to-[#0e1017] p-6 sm:p-7 shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-zinc-100 font-mono">
                    1. DISCOVER
                  </h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                    Live
                  </span>
                </div>
                <p className="text-xs text-indigo-300 font-mono mt-1 font-semibold">
                  Find high-signal candidates from technical evidence.
                </p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Translates unstructured job descriptions into vector criteria. Discovers engineers via GitHub & Hugging Face, evaluates repository depth, and ranks candidates with a custom two-tower neural network.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <Link href="/discover">
                <Button variant="primary" size="sm" className="w-full gap-1.5 text-xs font-mono">
                  <span>Launch Discover</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Module 2: PLAN */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0e1017] p-6 sm:p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-center text-zinc-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-zinc-100 font-mono">
                    2. PLAN
                  </h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                    Preview
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-1 font-semibold">
                  Understand workforce demand before it becomes a problem.
                </p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Forecast engineering capacity, model attrition risks, and project skill shortages across quarters to plan strategic hiring pipelines ahead of schedule.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <Link href="/plan">
                <Button variant="secondary" size="sm" className="w-full gap-1.5 text-xs font-mono">
                  <span>View Plan Concept</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Module 3: GROW */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0e1017] p-6 sm:p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-center text-zinc-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-zinc-100 font-mono">
                    3. GROW
                  </h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                    Preview
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-1 font-semibold">
                  Turn skill gaps into personalized growth paths.
                </p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Analyze internal employee code contributions and recommend targeted learning journeys, internal mobility tracks, and mentor pairings.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <Link href="/grow">
                <Button variant="secondary" size="sm" className="w-full gap-1.5 text-xs font-mono">
                  <span>View Grow Concept</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Methodology Principles */}
      <section className="rounded-2xl border border-zinc-800/90 bg-[#0a0b11] p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Core Engineering Principles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-200">
              Evidence Over Claims
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We score developers by AST code parsing, dependency graphs, and authentic commit volume—not LinkedIn resume keywords.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-200">
              AI Recommends, Humans Decide
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every ranking score provides a transparent, deterministic rationale with verifiable links to GitHub repositories and HF models.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-200">
              Dual-Tower Neural Embeddings
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Universal Sentence Encoder combined with trained job & candidate neural towers for high-dimensional semantic matching.
            </p>
          </div>
        </div>
      </section>

      {/* Strong Final CTA */}
      <section className="text-center space-y-6 py-6 border-t border-zinc-900">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
          Ready to discover high-signal technical talent?
        </h3>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Start by describing any software engineering, ML, or infrastructure role.
        </p>
        <Link href="/discover">
          <Button size="lg" className="gap-2 px-8 py-3 font-semibold text-sm">
            <Compass className="w-4 h-4" />
            <span>Start Candidate Discovery</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
