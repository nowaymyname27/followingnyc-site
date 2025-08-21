// app/collections/[slug]/CollectionClient.jsx
"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import PhotoMasonry from "../components/PhotoMasonry";
import LightboxOverlay from "../components/LightboxOverlay";

export default function CollectionClient({ collection }) {
  const { title, year, photos = [] } = collection || {};

  // Lightbox state
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const openAt = useCallback((i) => {
    setIdx(i);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  // Lock scroll when modal is open (defensive; overlay also locks)
  useEffect(() => {
    if (!open) return;
    const prevStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevStyle;
    };
  }, [open]);

  // Precompute (optional) suggested filename numbers
  const total = photos.length;
  const indexLabel = useMemo(
    () =>
      `${String(idx + 1).padStart(3, "0")} / ${String(total).padStart(3, "0")}`,
    [idx, total]
  );

  return (
    <div className="min-h-screen bg-background text-black">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-3">
          <Link
            href="/collections"
            className="bg-white inline-flex items-center gap-2 rounded-full border border-black/20 px-3 py-1 text-sm text-black hover:bg-black/5"
          >
            <span aria-hidden>←</span>
            <span>Back to Collections</span>
          </Link>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-5xl sm:text-6xl font-semibold leading-none">
              {title}
            </div>
            {year ? (
              <div className="mt-1 text-sm text-black/60">{year}</div>
            ) : null}
          </div>

          <div className="text-sm text-black/60">
            {total} photo{total === 1 ? "" : "s"}
            {total > 0 ? (
              <span className="ml-2 text-black/40">({indexLabel})</span>
            ) : null}
          </div>
        </div>
      </header>

      {/* Masonry stream (ALL photos) */}
      <main className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-10 pb-12">
        <PhotoMasonry photos={photos} onOpen={openAt} />
      </main>

      {/* Lightbox Overlay (no over-image arrows; external controls under placard on desktop) */}
      <LightboxOverlay
        open={open}
        photos={photos}
        index={idx}
        setIndex={setIdx}
        onClose={close}
        meta={{ title, year }}
      />
    </div>
  );
}
