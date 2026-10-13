"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDiscovery } from "@/context/discovery-context";
import { CandidateProfile } from "@/components/candidate/CandidateProfile";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { MOCK_DISCOVER_RESPONSE } from "@/lib/mock-data";
import { UserX } from "lucide-react";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function CandidateDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const username = decodeURIComponent(resolvedParams.username);

  const { getCandidate, results, loadMockData } = useDiscovery();

  // Try to find candidate from active context
  let candidate = getCandidate(username);

  // If not found in active session, check the benchmark dataset
  if (!candidate) {
    const fromMock =
      MOCK_DISCOVER_RESPONSE.shortlist.find(
        (c) => c.username.toLowerCase() === username.toLowerCase()
      ) ||
      MOCK_DISCOVER_RESPONSE.top_candidates.find(
        (c) => c.username.toLowerCase() === username.toLowerCase()
      );
    if (fromMock) {
      candidate = fromMock;
    }
  }

  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={UserX}
          title={`Candidate "@${username}" not found`}
          description="This candidate was not found in the current discovery session. You can return to results or load our benchmark evaluation dataset."
          actionLabel="Load Benchmark Dataset"
          onAction={() => {
            loadMockData();
            router.push("/discover/results");
          }}
        />
      </div>
    );
  }

  return (
    <CandidateProfile
      candidate={candidate}
      requirements={results?.requirements || MOCK_DISCOVER_RESPONSE.requirements}
    />
  );
}
