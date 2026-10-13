"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DiscoverRequest,
  DiscoverResponse,
  ScoredCandidate,
  PipelineStepId,
} from "@/lib/types";
import { discoverCandidates, discoverFromResumes } from "@/lib/api";
import { MOCK_DISCOVER_RESPONSE } from "@/lib/mock-data";

interface DiscoveryContextType {
  results: DiscoverResponse | null;
  setResults: (results: DiscoverResponse | null) => void;
  isLoading: boolean;
  pipelineStep: PipelineStepId;
  pipelineProgress: number; // 0 to 100 for visual staging
  error: string | null;
  clearError: () => void;
  highlightedSkill: string | null;
  setHighlightedSkill: (skill: string | null) => void;
  selectedForCompare: string[];
  toggleCompare: (username: string) => void;
  clearCompare: () => void;
  getCandidate: (username: string) => ScoredCandidate | undefined;
  runDiscovery: (req: DiscoverRequest) => Promise<boolean>;
  runResumeDiscovery: (jobDesc: string, files: File[], topN?: number, shortlistN?: number) => Promise<boolean>;
  loadMockData: () => void;
  lastJobDescription: string;
  setLastJobDescription: (desc: string) => void;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

const STORAGE_KEY = "rock_n_roll_discover_data";

export function DiscoveryProvider({ children }: { children: React.ReactNode }) {
  const [results, setResultsState] = useState<DiscoverResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<PipelineStepId>("extract_job");
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [lastJobDescription, setLastJobDescription] = useState<string>("");

  // Hydrate from sessionStorage if available
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setResultsState(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const setResults = (data: DiscoverResponse | null) => {
    setResultsState(data);
    try {
      if (data) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  };

  const clearError = () => setError(null);

  const toggleCompare = (username: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(username)) {
        return prev.filter((u) => u !== username);
      }
      if (prev.length >= 3) {
        // keep max 3
        return [...prev.slice(1), username];
      }
      return [...prev, username];
    });
  };

  const clearCompare = () => setSelectedForCompare([]);

  const getCandidate = (username: string): ScoredCandidate | undefined => {
    if (!results) return undefined;
    const fromShortlist = results.shortlist?.find((c) => c.username === username);
    if (fromShortlist) return fromShortlist;
    return results.top_candidates?.find((c) => c.username === username);
  };

  const loadMockData = () => {
    setResults(MOCK_DISCOVER_RESPONSE);
    setLastJobDescription(MOCK_DISCOVER_RESPONSE.requirements.summary || "");
  };

  // Run discovery with smooth visual staging for the AI pipeline
  const runDiscovery = async (req: DiscoverRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setPipelineStep("extract_job");
    setPipelineProgress(15);
    setLastJobDescription(req.job_description);

    // Staging intervals to communicate authentic pipeline work without fake percent precision
    const t1 = setTimeout(() => {
      setPipelineStep("search_candidates");
      setPipelineProgress(40);
    }, 1800);

    const t2 = setTimeout(() => {
      setPipelineStep("enrich_candidates");
      setPipelineProgress(70);
    }, 4500);

    const t3 = setTimeout(() => {
      setPipelineStep("rank_candidates");
      setPipelineProgress(90);
    }, 8000);

    try {
      const data = await discoverCandidates(req);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setPipelineProgress(100);
      setResults(data);
      // Auto-select top 3 for comparison convenience
      if (data.shortlist && data.shortlist.length > 0) {
        setSelectedForCompare(data.shortlist.slice(0, 3).map((c) => c.username));
      }
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setIsLoading(false);

      const errorMsg =
        err instanceof Error
          ? err.message
          : "Discovery failed. Ensure the FastAPI backend is running at http://localhost:8000.";
      
      setError(errorMsg);
      return false;
    }
  };

  const runResumeDiscovery = async (
    jobDesc: string,
    files: File[],
    topN = 10,
    shortlistN = 3
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setPipelineStep("extract_job");
    setPipelineProgress(20);
    setLastJobDescription(jobDesc);

    const t1 = setTimeout(() => {
      setPipelineStep("enrich_candidates"); // parsing resumes
      setPipelineProgress(55);
    }, 2000);

    const t2 = setTimeout(() => {
      setPipelineStep("rank_candidates");
      setPipelineProgress(85);
    }, 6000);

    try {
      const data = await discoverFromResumes(jobDesc, files, topN, shortlistN);
      clearTimeout(t1);
      clearTimeout(t2);
      setPipelineProgress(100);
      setResults(data);
      if (data.shortlist && data.shortlist.length > 0) {
        setSelectedForCompare(data.shortlist.slice(0, 3).map((c) => c.username));
      }
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsLoading(false);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Resume analysis failed. Please verify uploaded files and backend status.";
      setError(errorMsg);
      return false;
    }
  };

  return (
    <DiscoveryContext.Provider
      value={{
        results,
        setResults,
        isLoading,
        pipelineStep,
        pipelineProgress,
        error,
        clearError,
        highlightedSkill,
        setHighlightedSkill,
        selectedForCompare,
        toggleCompare,
        clearCompare,
        getCandidate,
        runDiscovery,
        runResumeDiscovery,
        loadMockData,
        lastJobDescription,
        setLastJobDescription,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error("useDiscovery must be used within a DiscoveryProvider");
  }
  return context;
}
