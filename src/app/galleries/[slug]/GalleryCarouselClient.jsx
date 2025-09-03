// app/galleries/[slug]/GalleryCarouselClient.jsx
"use client";

import * as React from "react";
import Link from "next/link";
import DesktopCarousel from "./DesktopCarousel/DesktopCarousel";
import MobileScroller from "./MobileScroller";
import ArtWallOverlay from "./ArtWallOverlay";

export default function GalleryCarouselClient({ gallery }) {
  const { photos = [] } = gallery || {};

  // Art Wall
  const [wallOpen, setWallOpen] = React.useState(false);
  const [wallIndex, setWallIndex] = React.useState(0);

  const openWall = React.useCallback(
    (photo) => {
      if (!photos?.length) return;
      const idx =
        photos.findIndex((p) => p.id === photo?.id) >= 0
          ? photos.findIndex((p) => p.id === photo?.id)
          : 0;
      setWallIndex(idx);
      setWallOpen(true);
    },
    [photos]
  );
  const closeWall = React.useCallback(() => setWallOpen(false), []);

  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeWall();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeWall]);

  // Desktop carousel external nav state
  const desktopRef = React.useRef(null);
  const [deskIndex, setDeskIndex] = React.useState(0);
  const [deskCount, setDeskCount] = React.useState(photos.length);
  const handleIndexChange = React.useCallback((idx, cnt) => {
    setDeskIndex(idx);
    setDeskCount(cnt);
  }, []);

  return (
    <div className="min-h-screen bg-background text-neutral-900">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/galleries"
          className="inline-flex items-center gap-2 rounded-full border border-black/20 px-3 py-1 text-sm text-black bg-white hover:bg-black/5"
        >
          <span aria-hidden>←</span>
          <span>Back to Galleries</span>
        </Link>
      </header>

      {/* Mobile */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-6 md:hidden">
        <MobileScroller photos={photos} onExpand={openWall} />
      </main>

      {/* Desktop / Tablet — FULL BLEED */}
      <section className="hidden md:block w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="w-screen">
          <DesktopCarousel
            ref={desktopRef}
            photos={photos}
            onExpand={openWall}
            onIndexChange={handleIndexChange}
          />

          {/* External controls */}
          {deskCount > 1 && (
            <div className="mt-3 mb-10 flex items-center justify-between px-6">
              <button
                aria-label="Previous"
                onClick={() => desktopRef.current?.goPrev?.()}
                className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-black px-3 py-1 text-sm shadow hover:bg-white"
              >
                ‹ Prev
              </button>
              <span className="text-xs text-neutral-600">
                {deskIndex + 1} / {deskCount}
              </span>
              <button
                aria-label="Next"
                onClick={() => desktopRef.current?.goNext?.()}
                className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-black px-3 py-1 text-sm shadow hover:bg-white"
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Art Wall Overlay */}
      <ArtWallOverlay
        open={wallOpen}
        photos={photos}
        index={wallIndex}
        setIndex={setWallIndex}
        onClose={closeWall}
      />
    </div>
  );
}
