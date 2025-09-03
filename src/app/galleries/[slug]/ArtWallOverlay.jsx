// app/galleries/[slug]/ArtWallOverlay.jsx
"use client";

import * as React from "react";
import { useKeyNav } from "./hooks/useKeyNav";

export default function ArtWallOverlay({
  open,
  photos = [],
  index,
  setIndex,
  onClose,
}) {
  const dialogRef = React.useRef(null);
  const count = photos.length;

  const goPrev = React.useCallback(() => {
    setIndex((n) => (n - 1 + count) % count);
  }, [count, setIndex]);

  const goNext = React.useCallback(() => {
    setIndex((n) => (n + 1) % count);
  }, [count, setIndex]);

  React.useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Keyboard: prev/next + close via Escape
  useKeyNav({
    onPrev: open ? goPrev : undefined,
    onNext: open ? goNext : undefined,
    onClose: open ? onClose : undefined,
    enabled: open,
  });

  if (!open || !count) return null;
  const photo = photos[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Artwork and description"
      tabIndex={-1}
      ref={dialogRef}
      className="
        fixed inset-0 z-50
        flex md:items-center md:justify-center
      "
      onClick={onClose} // clicking the backdrop closes
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/95" />

      {/* Content wrapper (stop backdrop close) */}
      <div
        className="
          relative z-10 w-full
          md:max-w-6xl
          p-4 sm:p-6 md:p-8
          // On mobile, allow scrolling so the placard is reachable
          overflow-y-auto max-h-screen
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Layout: stack on mobile; centered row on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px] gap-6 md:gap-8 md:items-center">
          {/* Artwork */}
          <div className="relative flex justify-center">
            <div
              className="
                relative inline-block
                border border-neutral-300
                shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                rounded-xl
                bg-white
              "
            >
              <img
                src={photo.url}
                alt={photo.alt || "Artwork"}
                className="
                  block
                  max-w-full
                  // Mobile: keep room for placard below
                  max-h-[62vh]
                  // Desktop: larger
                  md:max-h-[78vh]
                  object-contain
                "
                draggable={false}
              />
            </div>
          </div>

          {/* Placard */}
          <div className="relative">
            <div className="rounded-2xl border border-neutral-300 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-5 md:p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-lg font-semibold">
                  {photo.title || "Untitled"}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close artwork view"
                  className="rounded-full border border-neutral-300 px-2 py-0.5 text-sm hover:bg-black/5"
                >
                  ✕
                </button>
              </div>

              {photo.description ? (
                <p className="text-sm leading-relaxed text-neutral-700">
                  {photo.description}
                </p>
              ) : (
                <p className="text-sm italic text-neutral-500">
                  No description provided.
                </p>
              )}

              {photo.alt ? (
                <p className="mt-3 text-xs text-neutral-500">
                  Alt: {photo.alt}
                </p>
              ) : null}

              {/* Mobile nav inside placard */}
              {count > 1 && (
                <div className="mt-5 flex items-center justify-between md:hidden">
                  <button
                    onClick={goPrev}
                    className="rounded-full border border-neutral-300 px-3 py-1 text-sm bg-white shadow active:translate-y-[1px]"
                  >
                    ‹ Prev
                  </button>
                  <span className="text-xs text-neutral-600">
                    {index + 1} / {count}
                  </span>
                  <button
                    onClick={goNext}
                    className="rounded-full border border-neutral-300 px-3 py-1 text-sm bg-white shadow active:translate-y-[1px]"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>

            {/* Desktop external controls under the placard */}
            {count > 1 && (
              <div className="hidden md:flex mt-4 items-center justify-between">
                <button
                  aria-label="Previous"
                  onClick={goPrev}
                  className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-neutral-300 px-3 py-1 text-sm shadow hover:bg-white"
                >
                  ‹ Prev
                </button>
                <span className="text-xs text-neutral-600">
                  {index + 1} / {count}
                </span>
                <button
                  aria-label="Next"
                  onClick={goNext}
                  className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-neutral-300 px-3 py-1 text-sm shadow hover:bg-white"
                >
                  Next ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
