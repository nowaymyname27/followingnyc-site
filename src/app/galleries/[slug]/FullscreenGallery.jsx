// app/galleries/[slug]/FullscreenGallery.jsx
"use client";

import * as React from "react";
import Image from "next/image";

// HELPER: Limits Sanity images to ~1440p (2560px width)
// This dramatically speeds up loading for large uploads (e.g. 6000px raw photos)
function getOptimizedUrl(url, width = 2560) {
  if (!url) return "";
  // Only apply to Sanity CDN URLs
  if (!url.includes("cdn.sanity.io")) return url;

  // If params exist, append with &, otherwise ?
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}w=${width}&fit=max&auto=format`;
}

export default function FullscreenGallery({
  photos = [],
  index = 0,
  setIndex,
  onPrev,
  onNext,
}) {
  const count = photos.length;
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
  }, [index]);

  if (!count) return null;
  const photo = photos[index];

  // Optimize the source URL immediately
  const optimizedSrc = getOptimizedUrl(photo.url);

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
            {/* Spinner */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-800" />
              </div>
            )}

            <figure className="relative inline-flex md:max-h-[calc(100vh-160px)]">
              <div className="inline-block max-w-full max-h-[calc(100vh-160px)] rounded-xl border border-neutral-300 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden">
                <Image
                  key={optimizedSrc} // Update Key to match new URL
                  src={optimizedSrc} // Use the optimized URL
                  alt={photo.alt || "Artwork"}
                  // We still pass original dimensions for Aspect Ratio calculations,
                  // but the actual file loaded is capped by getOptimizedUrl
                  width={photo.width || 1600}
                  height={photo.height || 1000}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 65vw, 900px"
                  placeholder={photo.lqip ? "blur" : "empty"}
                  blurDataURL={photo.lqip || undefined}
                  priority
                  quality={75} // 75 is a sweet spot for web galleries
                  onLoad={() => setIsLoading(false)}
                  className={`object-contain w-auto h-auto max-w-full max-h-[calc(100vh-160px)] align-middle transition-opacity duration-300 ease-in-out ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                />
              </div>

              {/* Mobile index badge */}
              {count > 1 && (
                <figcaption className="md:hidden absolute bottom-2 right-2 rounded-full bg-white/90 border border-neutral-300 px-2 py-0.5 text-[11px]">
                  {index + 1} / {count}
                </figcaption>
              )}
            </figure>

            {/* Prefetch neighbors */}
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

/** Preload neighbors with the SAME optimization logic */
function PreloadNeighbors({ photos, index }) {
  const count = photos.length;
  if (count <= 1) return null;

  const span = 1;

  const idxs = React.useMemo(() => {
    const arr = [];
    for (let d = 1; d <= span; d++) {
      arr.push((index + d) % count);
      arr.push((index - d + count) % count);
    }
    return Array.from(new Set(arr)).filter((i) => i !== index);
  }, [count, index]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden"
    >
      {idxs.map((i) => {
        const p = photos[i];
        // Must match the main image optimization so browser cache works
        const src = getOptimizedUrl(p.url);
        return (
          <Image
            key={p.id || i}
            src={src}
            alt=""
            width={p.width || 1600}
            height={p.height || 1000}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 65vw, 900px"
            priority={false}
            loading="eager"
            decoding="async"
            fetchPriority="low"
            quality={75}
            className="opacity-0"
          />
        );
      })}
    </div>
  );
}
