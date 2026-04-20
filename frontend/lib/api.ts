// lib/api.ts
// All communication with the FastAPI backend lives here.

import type { HealthResponse, PredictResponse, RootResponse } from "@/types/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

// GET /health
export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BASE_URL}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

// GET /
export async function fetchRoot(): Promise<RootResponse> {
  const res = await fetch(`${BASE_URL}/`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Root check failed: ${res.status}`);
  return res.json();
}

// POST /predict  — sends image as multipart/form-data with field name "file"
export async function predictDisease(file: File): Promise<PredictResponse> {
  const formData = new FormData();
  formData.append("file", file); // field name must be "file" — required by FastAPI

  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type header manually — browser sets it with boundary
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody?.detail || `Prediction failed with status ${res.status}`
    );
  }

  return res.json();
}
