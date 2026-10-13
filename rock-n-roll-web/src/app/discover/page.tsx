"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDiscovery } from "@/context/discovery-context";
import { JobInput } from "@/components/discover/JobInput";
import { DiscoveryPipeline } from "@/components/discover/DiscoveryPipeline";
import { ErrorState } from "@/components/ui/ErrorState";
import { Compass, Sparkles, AlertCircle, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DiscoverPage() {
  const router = useRouter();
  const {
    runDiscovery,
    runResumeDiscovery,
    isLoading,
    pipelineStep,
    error,
    clearError,
    results,
    loadMockData,
    lastJobDescription,
  } = useDiscovery();

  const [activeSource, setActiveSource] = useState<"github" | "uploaded_resumes">("github");

  const handleStartDiscovery = async ({
    mode,
    jobDescription,
    files,
    topN,
    shortlistN,
  }: {
    mode: "github" | "resumes";
    jobDescription: string;
    files: File[];
    topN: number;
    shortlistN: number;
  }) => {
    setActiveSource(mode === "resumes" ? "uploaded_resumes" : "github");
    let success = false;

    if (mode === "github") {
      success = await runDiscovery({
        job_description: jobDescription,
        top_n: topN,
        shortlist_n: shortlistN,
      });
    } else {
      success = await runResumeDiscovery(jobDescription, files, topN, shortlistN);
    }

    if (success) {
      router.push("/discover/results");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800/80 pb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-indigo-950/40 border border-indigo-800/40 text-xs font-mono text-indigo-400">
            <Compass className="w-3.5 h-3.5" />
            <span>DISCOVER MODULE</span>
          </div>

          {/* Quick jump to results if data already exists */}
          {results && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/discover/results")}
              className="text-xs font-mono text-indigo-400 border-indigo-900/60"
            >
              View Active Results ({results.top_candidates?.length || 0}) →
            </Button>
          )}
        </div>

        <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
          Find the right talent for the work.
        </h1>
        <p className="text-sm text-zinc-400 font-sans max-w-2xl leading-relaxed">
          Describe the role. We will analyze requirements, discover candidates from technical evidence, and rank them using our neural two-tower model.
        </p>
      </div>

      {/* Error state if API call failed */}
      {error && (
        <ErrorState
          message={error}
          onRetry={() => {
            clearError();
          }}
        />
      )}

      {/* Main Container: Input or Live Loading Pipeline */}
      {isLoading ? (
        <div className="py-8">
          <DiscoveryPipeline currentStep={pipelineStep} source={activeSource} />
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800/90 bg-[#0e1017] p-6 sm:p-8 shadow-xl">
          <JobInput
            onDiscover={handleStartDiscovery}
            isLoading={isLoading}
            initialJobDescription={lastJobDescription}
          />
        </div>
      )}

      {/* Fallback Demo helper banner if backend is not yet started */}
      {!isLoading && !results && (
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              Evaluating without a running local FastAPI server? Load the realistic ML Engineer benchmark:
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadMockData();
              router.push("/discover/results");
            }}
            className="text-xs shrink-0 text-zinc-300"
          >
            Load Benchmark Dataset
          </Button>
        </div>
      )}
    </div>
  );
}
