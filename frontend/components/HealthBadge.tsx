"use client";

// components/HealthBadge.tsx
// Expandable backend health info panel

import { HealthResponse } from "@/types/api";

interface HealthBadgeProps {
  health: HealthResponse | null;
  loading: boolean;
  error: boolean;
}

export default function HealthBadge({ health, loading, error }: HealthBadgeProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-card">
        <div className="space-y-2">
          <div className="h-3 w-24 rounded shimmer-bg" />
          <div className="h-3 w-40 rounded shimmer-bg" />
          <div className="h-3 w-32 rounded shimmer-bg" />
        </div>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
        <div className="flex items-center gap-2 text-rose-700 text-sm">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="font-medium">Backend unreachable</span>
        </div>
        <p className="text-xs text-rose-500 mt-1 font-mono">
          Make sure FastAPI is running on {process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}
        </p>
      </div>
    );
  }

  const isReady = health.status === "healthy" && health.model_loaded;

  return (
    <div className={`rounded-xl border p-4 shadow-card ${isReady ? "border-grove-200 bg-grove-50/60" : "border-amber-200 bg-amber-50"}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-medium text-stone-500 uppercase tracking-wider">
          Backend Status
        </span>
        <div className={`flex items-center gap-1.5 text-xs font-medium ${isReady ? "text-grove-700" : "text-amber-700"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isReady ? "bg-grove-500 animate-pulse" : "bg-amber-500"}`} />
          {isReady ? "All systems ready" : "Partial"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatusRow
          label="API Status"
          value={health.status}
          ok={health.status === "healthy"}
        />
        <StatusRow
          label="Model Loaded"
          value={health.model_loaded ? "Yes" : "No"}
          ok={health.model_loaded}
        />
        {health.num_classes != null && (
          <StatusRow label="Classes" value={String(health.num_classes)} ok={true} />
        )}
        {health.model_names && (
          <StatusRow
            label="Ensemble"
            value={`${health.model_names.length} models`}
            ok={true}
          />
        )}
      </div>

      {health.model_names && (
        <div className="mt-3 pt-3 border-t border-stone-200/60">
          <p className="text-[10px] font-mono text-stone-400 mb-1.5 uppercase tracking-wider">
            Base Models
          </p>
          <div className="flex flex-wrap gap-1">
            {health.model_names.map((m) => (
              <span key={m} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${ok ? "bg-grove-500" : "bg-amber-500"}`} />
      <span className="text-xs text-stone-500">{label}:</span>
      <span className="text-xs font-mono font-medium text-stone-700">{value}</span>
    </div>
  );
}
