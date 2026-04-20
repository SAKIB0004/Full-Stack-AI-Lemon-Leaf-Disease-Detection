"use client";

// components/Header.tsx
// Top navigation bar with branding and backend health badge

import { HealthResponse } from "@/types/api";

interface HeaderProps {
  health: HealthResponse | null;
  healthLoading: boolean;
}

export default function Header({ health, healthLoading }: HeaderProps) {
  const isHealthy = health?.status === "healthy" && health?.model_loaded;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-grove-600 flex items-center justify-center shadow-grove-sm">
            <LeafIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg text-stone-900 tracking-tight">
            LeafScan
          </span>
        </div>

        {/* Backend status */}
        <div className="flex items-center gap-3">
          {healthLoading ? (
            <div className="h-7 w-32 rounded-full shimmer-bg" />
          ) : (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition-all ${
                isHealthy
                  ? "bg-grove-50 border-grove-200 text-grove-700"
                  : health === null
                  ? "bg-stone-100 border-stone-200 text-stone-500"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isHealthy
                    ? "bg-grove-500 animate-pulse"
                    : health === null
                    ? "bg-stone-400"
                    : "bg-rose-500"
                }`}
              />
              {isHealthy
                ? "Model Ready"
                : health === null
                ? "Connecting…"
                : "Backend Offline"}
            </div>
          )}

          {health?.num_classes && (
            <span className="hidden sm:block text-xs text-stone-400 font-mono">
              {health.num_classes} classes
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
