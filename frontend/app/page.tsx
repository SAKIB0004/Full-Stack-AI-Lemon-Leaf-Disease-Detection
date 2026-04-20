"use client";

// app/page.tsx
// Main page — orchestrates all state and API calls

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import HealthBadge from "@/components/HealthBadge";
import Footer from "@/components/Footer";
import { fetchHealth, predictDisease } from "@/lib/api";
import type { AppState, HealthResponse, PredictResponse } from "@/types/api";

export default function Home() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [file, setFile]             = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [appState, setAppState]     = useState<AppState>("idle");
  const [result, setResult]         = useState<PredictResponse | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const [health, setHealth]               = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError]     = useState(false);

  // ── Fetch backend health on mount ──────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const h = await fetchHealth();
        if (mounted) { setHealth(h); setHealthError(false); }
      } catch {
        if (mounted) setHealthError(true);
      } finally {
        if (mounted) setHealthLoading(false);
      }
    };
    check();
    const interval = setInterval(check, 30_000); // re-check every 30s
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // ── File selection ─────────────────────────────────────────────────────────
  const handleFileSelect = useCallback((incoming: File) => {
    // Revoke old object URL to prevent memory leaks
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(incoming);
    setPreviewUrl(URL.createObjectURL(incoming));
    setAppState("ready");
    setResult(null);
    setError(null);
  }, [previewUrl]);

  // ── File removal / reset ───────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setAppState("idle");
    setResult(null);
    setError(null);
  }, [previewUrl]);

  // ── Prediction ─────────────────────────────────────────────────────────────
  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    setAppState("loading");
    setError(null);
    setResult(null);

    try {
      const res = await predictDisease(file);
      setResult(res);
      setAppState("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setAppState("error");
    }
  }, [file]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const isLoading = appState === "loading";

  return (
    <div className="min-h-screen flex flex-col">
      <Header health={health} healthLoading={healthLoading} />

      <main className="flex-1">
        {/* ── Background decorations ─────────────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-grove-100/40 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-100/30 blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12 space-y-16">
          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <section className="text-center space-y-6 animate-fade-up">
            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["FastAPI", "Deep Learning", "Ensemble Model", "PyTorch"].map((b) => (
                <span
                  key={b}
                  className="text-xs font-mono px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-500 shadow-card"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.1] tracking-tight">
              Lemon Leaf
              <br />
              <span className="text-grove-600">Disease</span> Classification
            </h1>

            {/* Subtitle */}
            <p className="text-stone-500 text-lg max-w-xl mx-auto text-balance leading-relaxed">
              Upload a lemon leaf image and get an instant AI-powered diagnosis
              from a weighted ensemble of four deep learning models.
            </p>

            {/* Model info strip */}
            <div className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-2 shadow-card text-xs font-mono text-stone-500">
              <span className="w-1.5 h-1.5 rounded-full bg-grove-500 animate-pulse" />
              ResNet50 · EfficientNet-B0 · MobileNetV2 · DenseNet121
            </div>
          </section>

          {/* ── Main workspace ────────────────────────────────────────────── */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left column: upload + analyze */}
            <div className="space-y-4 animate-fade-up animation-delay-200">
              <SectionLabel>Upload Leaf Image</SectionLabel>

              <UploadCard
                file={file}
                previewUrl={previewUrl}
                onFileSelect={handleFileSelect}
                onFileRemove={handleReset}
                disabled={isLoading}
              />

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={!file || isLoading}
                className={`
                  w-full py-4 rounded-2xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-3
                  ${!file || isLoading
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200"
                    : "bg-grove-600 hover:bg-grove-700 active:scale-[0.98] text-white shadow-grove-md hover:shadow-grove-lg"
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon className="w-4 h-4 animate-spin" />
                    Analyzing leaf…
                  </>
                ) : (
                  <>
                    <ScanIcon className="w-4 h-4" />
                    Analyze Leaf
                  </>
                )}
              </button>

              {/* Error state */}
              {appState === "error" && error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 animate-fade-in">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">⚠</span>
                    <div>
                      <p className="font-medium">Analysis failed</p>
                      <p className="text-rose-500 text-xs mt-0.5 font-mono">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    className="mt-3 text-xs text-rose-600 font-medium hover:text-rose-800 underline underline-offset-2"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty state hint */}
              {appState === "idle" && (
                <p className="text-center text-xs text-stone-400 font-mono animate-fade-in">
                  Select or drag a leaf image to begin
                </p>
              )}
            </div>

            {/* Right column: results or health info */}
            <div className="space-y-4 animate-fade-up animation-delay-300">
              {appState === "success" && result ? (
                <>
                  <SectionLabel>Analysis Result</SectionLabel>
                  <ResultCard result={result} />
                  <button
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl text-sm text-stone-500 hover:text-stone-700 border border-stone-200 hover:border-stone-300 bg-white transition-all hover:shadow-card"
                  >
                    Analyze another leaf
                  </button>
                </>
              ) : isLoading ? (
                <>
                  <SectionLabel>Analyzing…</SectionLabel>
                  <LoadingSkeleton />
                </>
              ) : (
                <>
                  <SectionLabel>System Status</SectionLabel>
                  <HealthBadge
                    health={health}
                    loading={healthLoading}
                    error={healthError}
                  />
                  <InfoCard />
                </>
              )}
            </div>
          </section>

          {/* ── Disease classes info strip ─────────────────────────────── */}
          {health?.num_classes && !result && (
            <section className="animate-fade-up animation-delay-400">
              <SectionLabel>Detectable Conditions</SectionLabel>
              <ClassesStrip classes={health.model_names ?? []} />
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">
      {children}
    </p>
  );
}

function InfoCard() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-card p-5 space-y-4">
      <h3 className="font-display text-lg text-stone-800">How it works</h3>
      <div className="space-y-3">
        {[
          { step: "01", label: "Upload", desc: "Choose a clear, close-up photo of a lemon leaf." },
          { step: "02", label: "Analyze", desc: "The ensemble of 4 CNN models processes your image." },
          { step: "03", label: "Diagnose", desc: "Receive a predicted disease class with confidence score." },
        ].map(({ step, label, desc }) => (
          <div key={step} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-md bg-grove-100 flex items-center justify-center text-[10px] font-mono font-medium text-grove-700 flex-shrink-0 mt-0.5">
              {step}
            </span>
            <div>
              <p className="text-sm font-medium text-stone-700">{label}</p>
              <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassesStrip({ classes: _ }: { classes: string[] }) {
  // Show the known disease classes from our model
  const diseases = [
    "Anthracnose", "Bacterial Blight", "Citrus Canker",
    "Curl Virus", "Deficiency Leaf", "Dry Leaf",
    "Healthy Leaf", "Sooty Mould", "Spider Mites",
  ];
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {diseases.map((d) => (
        <span
          key={d}
          className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-colors
            ${d === "Healthy Leaf"
              ? "bg-grove-50 border-grove-200 text-grove-700"
              : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
            }`}
        >
          {d}
        </span>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl border border-stone-200 bg-white shadow-card p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl shimmer-bg" />
          <div className="w-24 h-6 rounded-full shimmer-bg" />
        </div>
        <div className="w-48 h-7 rounded shimmer-bg" />
        <div className="w-full h-4 rounded shimmer-bg" />
        <div className="w-3/4 h-4 rounded shimmer-bg" />
        <div className="space-y-2 pt-2">
          <div className="flex justify-between">
            <div className="w-20 h-3 rounded shimmer-bg" />
            <div className="w-10 h-3 rounded shimmer-bg" />
          </div>
          <div className="w-full h-2.5 rounded-full shimmer-bg" />
        </div>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white shadow-card p-5 space-y-3">
        <div className="w-32 h-3 rounded shimmer-bg" />
        {[80, 60, 40, 30, 20].map((w) => (
          <div key={w} className="space-y-1">
            <div className="flex justify-between">
              <div className="w-28 h-3 rounded shimmer-bg" />
              <div className="w-10 h-3 rounded shimmer-bg" />
            </div>
            <div className="w-full h-1.5 rounded-full shimmer-bg" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
    </svg>
  );
}

function ScanIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  );
}
