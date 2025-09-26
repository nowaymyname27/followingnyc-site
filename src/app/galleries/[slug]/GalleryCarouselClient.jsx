// app/galleries/[slug]/GalleryCarouselClient.jsx
"use client";

import * as React from "react";
import Link from "next/link";
import FullscreenGallery from "./FullscreenGallery";

export default function GalleryCarouselClient({ gallery }) {
  const { photos = [], title } = gallery || {};
  const count = photos.length;

  // start at 0; you can hydrate from a query param later if you want
  const [index, setIndex] = React.useState(0);

  const goPrev = React.useCallback(() => {
    if (!count) return;
    setIndex((n) => (n - 1 + count) % count);
  }, [count]);

  const goNext = React.useCallback(() => {
    if (!count) return;
    setIndex((n) => (n + 1) % count);
  }, [count]);

  // Keyboard: ← / → and Esc to go back
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") window.history.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  return (
    <div className="min-h-screen bg-background text-neutral-900">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
        <Link
          href="/galleries"
          className="inline-flex items-center gap-2 rounded-full border border-black/20 px-3 py-1 text-sm text-black bg-white hover:bg-black/5"
        >
          <span aria-hidden>←</span>
          <span>Back to Galleries</span>
        </Link>
        {count > 0 && (
          <div className="text-xs text-neutral-600">
            {title ? <span className="mr-2">{title} •</span> : null}
            {index + 1} / {count}
          </div>
        )}
      </header>

      {/* Fullscreen viewer (replaces carousel entirely) */}
      <FullscreenGallery
        photos={photos}
        index={index}
        setIndex={setIndex}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}
