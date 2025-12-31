// app/collections/components/LightboxOverlay.jsx
"use client";

import * as React from "react";
import styles from "../lightbox.module.css";
import { useKeyNav } from "../hooks/useKeyNav";

// Helper to format YYYY-MM-DD
function formatPlainDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map((n) => parseInt(n, 10));
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Robust scroll lock: toggles both <html> and <body>
function useScrollLock(locked) {
  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    if (locked) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [locked]);
}

export default function LightboxOverlay({
  open,
  photos = [],
  index,
  setIndex,
  onClose,
  meta, // { title, year }
}) {
  const dialogRef = React.useRef(null);
  const count = photos.length;
  const current = count ? photos[index] : null;

  const goPrev = React.useCallback(() => {
    setIndex((n) => (n - 1 + count) % count);
  }, [count, setIndex]);

  const goNext = React.useCallback(() => {
    setIndex((n) => (n + 1) % count);
  }, [count, setIndex]);

  // Focus + scroll lock
  React.useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
  }, [open]);
  useScrollLock(open);

  // Keyboard nav
  useKeyNav({
    onPrev: open ? goPrev : undefined,
    onNext: open ? goNext : undefined,
    onClose: open ? onClose : undefined,
    enabled: open,
  });

  // Filename for downloads
  const fileName = React.useMemo(() => {
    if (!current) return "photo.jpg";
    const safeTitle = (meta?.title || "collection")
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-");
    const n = String(index + 1).padStart(3, "0");
    const extMatch = current.url?.match(/\.(jpe?g|png|webp|gif|tiff?)($|\?)/i);
    const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : ".jpg";
    return `${safeTitle}-${n}${ext}`;
  }, [meta?.title, index, current]);

  const [downloading, setDownloading] = React.useState(false);
  const downloadImage = React.useCallback(async () => {
    if (!current?.url) return;
    try {
      setDownloading(true);
      const res = await fetch(current.url, { mode: "cors", cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(current.url, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  }, [current?.url, fileName]);

  if (!open || !count || !current) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Collection photo viewer"
      tabIndex={-1}
      className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm ${styles.backdrop}`}
      onClick={onClose} // clicking the backdrop closes
    >
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-[1fr_360px]">
        {/* Left: image area — clicking outside the image closes; clicking the image doesn't */}
        <div className="relative flex items-center justify-center p-3 sm:p-6">
          <img
            src={current.url}
            alt={current.alt || "Photo"}
            className={`max-h-[85vh] max-w-[92vw] md:max-w-[calc(100%-360px)] object-contain rounded-2xl shadow-2xl ${styles.imagePop}`}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Right: placard (desktop) */}
        <aside
          className="hidden md:flex min-h-0 flex-col border-l border-white/10 bg-black/40 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable content */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Collection meta + close */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/80">
                {meta?.title}
                {meta?.year ? (
                  <span className="text-white/50"> • {meta.year}</span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/20 px-3 py-1 text-sm hover:bg-white/10"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Index */}
            <div className="text-xs text-white/60">
              {index + 1} / {count}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={downloadImage}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
              >
                {downloading ? "Downloading…" : "Download"}
              </button>
            </div>

            {/* ---------- NEW: Captured Date ---------- */}
            {current.capturedAt && (
              <div className="text-sm text-white/50">
                Captured: {formatPlainDate(current.capturedAt)}
              </div>
            )}
            {/* --------------------------------------- */}

            {/* Photo title & description */}
            {(current.title || current.description) && (
              <div className="space-y-2">
                {current.title && (
                  <div className="text-base font-medium text-white/90">
                    {current.title}
                  </div>
                )}
                {current.description && (
                  <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                    {current.description}
                  </p>
                )}
              </div>
            )}

            {/* Optional: Alt text */}
            {current.alt ? (
              <div className="text-xs text-white/60">Alt: {current.alt}</div>
            ) : null}
          </div>

          {/* Desktop external controls pinned at bottom */}
          {count > 1 && (
            <div className="p-4 sm:p-6 mt-2 flex items-center justify-between">
              <button
                aria-label="Previous"
                onClick={goPrev}
                className="inline-flex items-center gap-1 rounded-full bg-white/90 text-black border border-white px-3 py-1 text-sm shadow hover:bg-white"
              >
                ‹ Prev
              </button>
              <span className="text-xs text-white/60">
                {index + 1} / {count}
              </span>
              <button
                aria-label="Next"
                onClick={goNext}
                className="inline-flex items-center gap-1 rounded-full bg-white/90 text-black border border-white px-3 py-1 text-sm shadow hover:bg-white"
              >
                Next ›
              </button>
            </div>
          )}
        </aside>

        {/* Mobile bottom bar controls (unchanged) */}
        {count > 1 && (
          <div
            className="md:hidden fixed inset-x-0 bottom-0 p-3 flex items-center justify-between bg-black/60 backdrop-blur border-t border-white/10 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={goPrev}
              className="rounded-full border border-white/25 px-3 py-1 text-sm hover:bg-white/10"
            >
              ‹ Prev
            </button>
            <span className="text-xs text-white/80">
              {index + 1} / {count}
            </span>
            <button
              onClick={goNext}
              className="rounded-full border border-white/25 px-3 py-1 text-sm hover:bg-white/10"
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
