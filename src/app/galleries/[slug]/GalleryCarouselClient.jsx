// app/galleries/[slug]/GalleryCarouselClient.jsx
"use client";

import * as React from "react";
import FullscreenGallery from "./FullscreenGallery";
import BackButton from "@/components/BackButton"; // Use your new component

export default function GalleryCarouselClient({ gallery }) {
  const { photos = [], title } = gallery || {};
  const count = photos.length;

  const [index, setIndex] = React.useState(0);

  // 1. Navigation Logic
  const goPrev = React.useCallback(() => {
    if (!count) return;
    setIndex((n) => (n - 1 + count) % count);
  }, [count]);

  const goNext = React.useCallback(() => {
    if (!count) return;
    setIndex((n) => (n + 1) % count);
  }, [count]);

  // 2. Keyboard Support
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      // Let the BackButton handle the history, but if you want Escape to go back:
      if (e.key === "Escape") window.history.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // 3. THE FIX: Smart Preloading
  React.useEffect(() => {
    if (!photos || photos.length === 0) return;

    // Calculate neighbors (Next 2 images and Previous 1 image)
    const next1 = (index + 1) % count;
    const next2 = (index + 2) % count;
    const prev1 = (index - 1 + count) % count;

    // Create a list of URLs to preload
    const preloadList = [
      photos[next1]?.url,
      photos[next2]?.url,
      photos[prev1]?.url,
    ].filter(Boolean);

    // Force browser to cache them using the Image object
    preloadList.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [index, count, photos]);

  return (
    <div className="min-h-screen bg-background text-neutral-900">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
        {/* Replaced generic Link with your scroll-restoring button */}
        <BackButton>Back to Galleries</BackButton>

        {count > 0 && (
          <div className="text-xs text-neutral-600">
            {title ? <span className="mr-2">{title} •</span> : null}
            {index + 1} / {count}
          </div>
        )}
      </header>

      {/* Fullscreen viewer */}
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
