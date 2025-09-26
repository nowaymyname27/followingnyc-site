// app/galleries/[slug]/FullscreenGallery.jsx
"use client";

import * as React from "react";
import Image from "next/image";

export default function FullscreenGallery({
  photos = [],
  index = 0,
  setIndex,
  onPrev,
  onNext,
}) {
  const count = photos.length;
  if (!count) return null;
  const photo = photos[index];

  // Touch swipe (mobile)
  const touch = React.useRef({ x: 0, y: 0 });
  const onTouchStart = (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) onNext?.();
      else onPrev?.();
    }
  };

  return (
    <section
      className="w-full"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px] gap-6 md:gap-8 md:items-center md:min-h-[calc(100vh-160px)]">
          {/* Artwork */}
          <div className="relative flex justify-center md:h-[calc(100vh-160px)] md:items-center">
            <figure className="relative inline-flex md:max-h-[calc(100vh-160px)]">
              {/* Tight wrapper so border/shadow hug image */}
              <div className="inline-block max-w-full max-h-[calc(100vh-160px)] rounded-xl border border-neutral-300 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden">
                <Image
                  src={photo.url}
                  alt={photo.alt || "Artwork"}
                  width={photo.width || 1600}
                  height={photo.height || 1000}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 65vw, 900px"
                  placeholder={photo.lqip ? "blur" : "empty"}
                  blurDataURL={photo.lqip || undefined}
                  priority
                  // ↓ Slightly lower quality for speed with minimal visual change
                  quality={70}
                  className="object-contain w-auto h-auto max-w-full max-h-[calc(100vh-160px)] align-middle"
                />
              </div>

              {/* Mobile index badge */}
              {count > 1 && (
                <figcaption className="md:hidden absolute bottom-2 right-2 rounded-full bg-white/90 border border-neutral-300 px-2 py-0.5 text-[11px]">
                  {index + 1} / {count}
                </figcaption>
              )}
            </figure>

            {/* ---- Prefetch neighbors (off-screen) ---- */}
            <PreloadNeighbors photos={photos} index={index} />
          </div>

          {/* Placard */}
          <aside className="relative">
            <div className="rounded-2xl border border-neutral-300 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.10)] p-5 md:p-6 max-h-[calc(100vh-160px)] overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-lg font-semibold">
                  {photo.title || "Untitled"}
                </h1>
              </div>

              {photo.description ? (
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                  {photo.description}
                </p>
              ) : (
                <p className="mt-3 text-sm italic text-neutral-500">
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
                    onClick={onPrev}
                    className="rounded-full border border-neutral-300 px-3 py-1 text-sm bg-white shadow active:translate-y-[1px]"
                  >
                    ‹ Prev
                  </button>
                  <button
                    onClick={onNext}
                    className="rounded-full border border-neutral-300 px-3 py-1 text-sm bg-white shadow active:translate-y-[1px]"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>

            {/* Desktop external controls */}
            {count > 1 && (
              <div className="hidden md:flex mt-4 items-center justify-between">
                <button
                  aria-label="Previous"
                  onClick={onPrev}
                  className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-neutral-300 px-3 py-1 text-sm shadow hover:bg-white"
                >
                  ‹ Prev
                </button>
                <span className="text-xs text-neutral-600">
                  {index + 1} / {count}
                </span>
                <button
                  aria-label="Next"
                  onClick={onNext}
                  className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-neutral-300 px-3 py-1 text-sm shadow hover:bg-white"
                >
                  Next ›
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

/** Preload the next/prev images through Next's optimizer.
 * Renders tiny, off-screen <Image> tags with loading="eager"
 * so their optimized variants are fetched & cached ahead of time.
 */
function PreloadNeighbors({ photos, index }) {
  const count = photos.length;
  if (count <= 1) return null;

  // how many ahead/behind to warm (tweak to 2 if you want deeper prefetch)
  const span = 1;

  const idxs = React.useMemo(() => {
    const arr = [];
    for (let d = 1; d <= span; d++) {
      arr.push((index + d) % count);
      arr.push((index - d + count) % count);
    }
    // make unique
    return Array.from(new Set(arr)).filter((i) => i !== index);
  }, [count, index]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden"
    >
      {idxs.map((i) => {
        const p = photos[i];
        return (
          <Image
            key={p.id || i}
            src={p.url}
            alt=""
            width={p.width || 1600}
            height={p.height || 1000}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 65vw, 900px"
            // Force eager load even off-screen to warm the cache
            priority={false}
            loading="eager"
            decoding="async"
            fetchPriority="low"
            quality={70}
            className="opacity-0"
          />
        );
      })}
    </div>
  );
}
