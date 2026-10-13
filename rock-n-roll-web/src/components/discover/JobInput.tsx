"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ResumeUpload } from "./ResumeUpload";
import { SAMPLE_JOB_PRESETS } from "@/lib/mock-data";
import {
  Sparkles,
  GitPullRequest,
  FileText,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JobInputProps {
  onDiscover: (params: {
    mode: "github" | "resumes";
    jobDescription: string;
    files: File[];
    topN: number;
    shortlistN: number;
  }) => void;
  isLoading: boolean;
  initialJobDescription?: string;
}

export function JobInput({
  onDiscover,
  isLoading,
  initialJobDescription = "",
}: JobInputProps) {
  const [mode, setMode] = useState<"github" | "resumes">("github");
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [files, setFiles] = useState<File[]>([]);
  const [topN, setTopN] = useState(100);
  const [shortlistN, setShortlistN] = useState(5);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim() || jobDescription.trim().length < 20) return;
    if (mode === "resumes" && files.length === 0) return;

    onDiscover({
      mode,
      jobDescription,
      files,
      topN,
      shortlistN,
    });
  };

  const handleApplyPreset = (presetText: string) => {
    setJobDescription(presetText);
  };

  const handleAddFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const isSubmitDisabled =
    isLoading ||
    jobDescription.trim().length < 20 ||
    (mode === "resumes" && files.length === 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab Switcher: GitHub Discovery vs Resume Upload */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800/80 w-fit">
        <button
          type="button"
          onClick={() => setMode("github")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all",
            mode === "github"
              ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60"
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" />
          <span>GitHub & HF Discovery</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("resumes")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all",
            mode === "resumes"
              ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60"
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Resume Batch Upload</span>
        </button>
      </div>

      {/* Realistic Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>ROLE TEMPLATES (ONE-CLICK FILL)</span>
          <span className="text-zinc-600">Quick Hackathon Evaluation</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_JOB_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset.description)}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="space-y-1.5">
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          Job Description / Role Requirements
        </label>
        <div className="relative">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={mode === "resumes" ? 5 : 8}
            placeholder="Paste a job description or describe the role you're hiring for (minimum 20 characters)..."
            className="w-full p-4 rounded-xl bg-[#0b0d14] border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-sans leading-relaxed resize-y"
          />
          <div className="absolute right-3 bottom-3 text-[10px] font-mono text-zinc-500">
            {jobDescription.length} chars
          </div>
        </div>
      </div>

      {/* Resume Upload Box if in Resume Mode */}
      {mode === "resumes" && (
        <div className="space-y-2 pt-2 border-t border-zinc-800/80">
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Batch Resumes to Evaluate
          </label>
          <ResumeUpload
            files={files}
            onFilesSelected={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            onClearAll={() => setFiles([])}
          />
        </div>
      )}

      {/* Controls & Submit Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        {/* Advanced parameters trigger */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
            <span>Parameters: Top {topN} / Shortlist {shortlistN}</span>
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-transform duration-200",
                showAdvanced && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          isLoading={isLoading}
          variant="primary"
          size="lg"
          className="w-full sm:w-auto px-6 py-2.5 font-medium"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>Discover Candidates</span>
        </Button>
      </div>

      {/* Advanced Parameters Panel */}
      {showAdvanced && (
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="block text-zinc-400 mb-1">
              Top Candidates to Analyze (top_n: {topN})
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={topN}
              onChange={(e) => setTopN(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">
              Shortlist Size (shortlist_n: {shortlistN})
            </label>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={shortlistN}
              onChange={(e) => setShortlistN(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>
      )}
    </form>
  );
}
