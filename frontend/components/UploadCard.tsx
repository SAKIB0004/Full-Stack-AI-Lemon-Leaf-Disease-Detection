"use client";

// components/UploadCard.tsx
// Drag-and-drop + click-to-upload image area with preview

import { useRef, useState, useCallback } from "react";

interface UploadCardProps {
  file: File | null;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function UploadCard({
  file,
  previewUrl,
  onFileSelect,
  onFileRemove,
  disabled = false,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);

  const handleFile = useCallback(
    (incoming: File) => {
      setDragError(null);
      if (!ACCEPTED_TYPES.includes(incoming.type)) {
        setDragError("Please upload a JPG, PNG, or WebP image.");
        return;
      }
      onFileSelect(incoming);
    },
    [onFileSelect]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = ""; // reset so same file can be re-selected
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  // ── Preview state (image already selected) ──────────────────────────────────
  if (previewUrl && file) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white shadow-card overflow-hidden animate-fade-in">
        <div className="relative aspect-[4/3] w-full bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Selected leaf"
            className="w-full h-full object-cover"
          />
          {/* Remove button */}
          <button
            onClick={onFileRemove}
            disabled={disabled}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/80 transition-colors backdrop-blur-sm disabled:opacity-50"
            aria-label="Remove image"
          >
            <XIcon className="w-4 h-4" />
          </button>
          {/* File name chip */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/60 text-white text-xs font-mono backdrop-blur-sm max-w-[calc(100%-3.5rem)] truncate">
            {file.name}
          </div>
        </div>
        <div className="px-5 py-3.5 flex items-center justify-between border-t border-stone-100">
          <div className="text-xs text-stone-500 font-mono">
            {(file.size / 1024).toFixed(0)} KB · {file.type.split("/")[1].toUpperCase()}
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="text-xs text-grove-600 hover:text-grove-700 font-medium transition-colors disabled:opacity-50"
          >
            Change image
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      </div>
    );
  }

  // ── Empty / drag-and-drop state ─────────────────────────────────────────────
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`
        relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
        flex flex-col items-center justify-center gap-4 py-16 px-8 text-center
        ${isDragging
          ? "border-grove-400 bg-grove-50 scale-[0.99]"
          : "border-stone-300 bg-white hover:border-grove-300 hover:bg-grove-50/40"
        }
      `}
    >
      {/* Upload icon */}
      <div className={`
        w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200
        ${isDragging ? "bg-grove-100 scale-110" : "bg-stone-100"}
      `}>
        <UploadIcon className={`w-7 h-7 transition-colors ${isDragging ? "text-grove-600" : "text-stone-400"}`} />
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-stone-700">
          {isDragging ? "Drop your image here" : "Drag & drop a leaf image"}
        </p>
        <p className="text-xs text-stone-400">
          or{" "}
          <span className="text-grove-600 font-medium underline-offset-2 hover:underline">
            click to browse
          </span>
        </p>
        <p className="text-xs text-stone-400 font-mono mt-2">
          JPG · PNG · WebP
        </p>
      </div>

      {dragError && (
        <p className="text-xs text-rose-500 font-medium bg-rose-50 px-3 py-1.5 rounded-lg">
          {dragError}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
