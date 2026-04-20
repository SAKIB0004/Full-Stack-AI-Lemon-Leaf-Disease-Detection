"use client";

// components/ResultCard.tsx
// Shows predicted class, confidence, and probability bars

import { PredictResponse } from "@/types/api";

interface ResultCardProps {
  result: PredictResponse;
}

// Diseases that are NOT "Healthy" get a severity colour
const SEVERITY_COLORS: Record<string, { bar: string; badge: string; dot: string }> = {
  default: {
    bar:   "bg-rose-400",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot:   "bg-rose-500",
  },
  healthy: {
    bar:   "bg-grove-500",
    badge: "bg-grove-50 text-grove-700 border-grove-200",
    dot:   "bg-grove-500",
  },
};

function getColors(cls: string) {
  return cls.toLowerCase().includes("healthy")
    ? SEVERITY_COLORS.healthy
    : SEVERITY_COLORS.default;
}

export default function ResultCard({ result }: ResultCardProps) {
  const { predicted_class, confidence, class_probabilities, filename } = result;
  const colors = getColors(predicted_class);
  const isHealthy = predicted_class.toLowerCase().includes("healthy");
  const pct = (confidence * 100).toFixed(1);

  // Sort probabilities descending
  const sorted = Object.entries(class_probabilities).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <div className="space-y-4 animate-fade-up">
      {/* ── Main result card ─────────────────────────────────────────────── */}
      <div className={`
        relative rounded-2xl border overflow-hidden shadow-card-lg
        ${isHealthy
          ? "bg-gradient-to-br from-grove-50 to-white border-grove-200"
          : "bg-gradient-to-br from-rose-50 to-white border-rose-200"
        }
      `}>
        {/* Decorative circle */}
        <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 ${isHealthy ? "bg-grove-500" : "bg-rose-500"}`} />

        <div className="relative p-6">
          {/* Icon + label */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isHealthy ? "bg-grove-100" : "bg-rose-100"}`}>
              {isHealthy ? (
                <CheckIcon className="w-6 h-6 text-grove-600" />
              ) : (
                <AlertIcon className="w-6 h-6 text-rose-600" />
              )}
            </div>
            <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full border ${colors.badge}`}>
              {isHealthy ? "No Disease" : "Disease Detected"}
            </span>
          </div>

          {/* Predicted class */}
          <h3 className="font-display text-2xl text-stone-900 mb-1 leading-tight">
            {predicted_class}
          </h3>

          {/* Summary sentence */}
          <p className="text-sm text-stone-500 mb-5 text-balance">
            {isHealthy
              ? `This leaf appears healthy with ${pct}% confidence. No disease signs were detected.`
              : `The model predicts this leaf is affected by ${predicted_class} with ${pct}% confidence.`
            }
          </p>

          {/* Confidence bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Confidence</span>
              <span className="font-mono font-medium text-stone-800">{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-stone-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${colors.bar} transition-all duration-1000 ease-out`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Filename */}
          <p className="mt-4 text-xs text-stone-400 font-mono truncate">
            File: {filename}
          </p>
        </div>
      </div>

      {/* ── Class probabilities ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-card p-5">
        <h4 className="text-xs font-mono font-medium text-stone-500 uppercase tracking-wider mb-4">
          All Class Probabilities
        </h4>
        <div className="space-y-3">
          {sorted.map(([cls, prob], i) => {
            const isPredicted = cls === predicted_class;
            const widthPct = (prob * 100).toFixed(1);
            const barColor = cls.toLowerCase().includes("healthy")
              ? "bg-grove-400"
              : isPredicted
              ? "bg-rose-400"
              : "bg-stone-300";

            return (
              <div key={cls} className="space-y-1" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {isPredicted && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    )}
                    <span className={`font-medium ${isPredicted ? "text-stone-800" : "text-stone-500"}`}>
                      {cls}
                    </span>
                    {isPredicted && (
                      <span className="text-[10px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                        top
                      </span>
                    )}
                  </div>
                  <span className={`font-mono ${isPredicted ? "text-stone-800 font-medium" : "text-stone-400"}`}>
                    {(prob * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
                    style={{ width: `${widthPct}%`, transitionDelay: `${i * 60 + 200}ms` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
