import { DiscoverRequest, DiscoverResponse, ServiceHealth } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

function getHeaders(isJson = true): HeadersInit {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  if (API_KEY) {
    headers["X-API-Key"] = API_KEY;
  }
  return headers;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Health check for the backend service
 */
export async function checkBackendHealth(): Promise<ServiceHealth> {
  const start = performance.now();
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      cache: "no-store",
    });

    const latencyMs = Math.round(performance.now() - start);

    if (res.ok) {
      // Try ready to get model info
      try {
        const readyRes = await fetch(`${API_BASE_URL}/api/ready`, {
          method: "GET",
          cache: "no-store",
        });
        if (readyRes.ok) {
          const readyData = await readyRes.json();
          return {
            status: "ready",
            semantic_model: readyData.semantic_model || "Dual-Tower Active",
            latencyMs,
          };
        }
      } catch {
        // fallback to ok
      }

      return {
        status: "ok",
        latencyMs,
      };
    }

    return {
      status: "error",
      latencyMs,
    };
  } catch {
    return {
      status: "offline",
    };
  }
}

/**
 * Main candidate discovery endpoint via GitHub & HuggingFace
 */
export async function discoverCandidates(
  request: DiscoverRequest,
  signal?: AbortSignal
): Promise<DiscoverResponse> {
  const response = await fetch(`${API_BASE_URL}/api/discover`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({
      job_description: request.job_description,
      top_n: request.top_n ?? 10,
      shortlist_n: request.shortlist_n ?? 3,
    }),
    signal,
  });

  if (!response.ok) {
    let errorDetail = "Discovery request failed";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      // ignore
    }
    throw new ApiError(errorDetail, response.status);
  }

  const data = await response.json();
  return {
    ...data,
    source: "github",
  } as DiscoverResponse;
}

/**
 * Resume-based discovery endpoint
 */
export async function discoverFromResumes(
  jobDescription: string,
  files: File[],
  topN = 10,
  shortlistN = 3,
  signal?: AbortSignal
): Promise<DiscoverResponse> {
  const formData = new FormData();
  formData.append("job_description", jobDescription);
  formData.append("top_n", topN.toString());
  formData.append("shortlist_n", shortlistN.toString());

  for (const file of files) {
    formData.append("files", file);
  }

  const headers = getHeaders(false);

  const response = await fetch(`${API_BASE_URL}/api/discover-resumes`, {
    method: "POST",
    headers,
    body: formData,
    signal,
  });

  if (!response.ok) {
    let errorDetail = "Resume discovery failed";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      // ignore
    }
    throw new ApiError(errorDetail, response.status);
  }

  const data = await response.json();
  return {
    ...data,
    source: "uploaded_resumes",
  } as DiscoverResponse;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
