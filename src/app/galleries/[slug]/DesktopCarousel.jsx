// app/galleries/[slug]/DesktopCarousel.jsx
"use client";

import * as React from "react";
import styles from "./desktopCarousel.module.css";
import { useCarousel } from "./hooks/useCarousel";
import { useKeyNav } from "./hooks/useKeyNav";

/**
 * DesktopCarousel
 * - Renders the main image + peeking side frames.
 * - No embedded nav buttons anymore.
 * - Exposes goPrev/goNext via ref.
 * - Notifies parent of index changes via onIndexChange.
 */
const DesktopCarousel = React.forwardRef(function DesktopCarousel(
  { photos = [], onExpand, onIndexChange },
  ref
) {
  const {
    index,
    setIndex,
    dir,
    goPrev,
    goNext,
    current,
    leftIndex,
    rightIndex,
    count,
  } = useCarousel(photos, 0);

  // Expose controls to parent
  React.useImperativeHandle(
    ref,
    () => ({
      goPrev,
      goNext,
      index,
      count,
      current,
      setIndex,
    }),
    [goPrev, goNext, index, count, current, setIndex]
  );

  // Notify parent when index changes
  React.useEffect(() => {
    onIndexChange?.(index, count);
  }, [index, count, onIndexChange]);

  // Keyboard: prev/next + open info
  useKeyNav({
    onPrev: goPrev,
    onNext: goNext,
    onOpen: () => current && onExpand?.(current),
    enabled: true,
  });

  // Swipe
  const startX = React.useRef(0);
  const tracking = React.useRef(false);
  const onTouchStart = (e) => {
    tracking.current = true;
    startX.current = e.touches?.[0]?.clientX ?? 0;
  };
  const onTouchEnd = (e) => {
    if (!tracking.current) return;
    tracking.current = false;
    const endX = e.changedTouches?.[0]?.clientX ?? startX.current;
    const dx = endX - startX.current;
    if (dx > 40) goPrev();
    else if (dx < -40) goNext();
  };

  const animClass = dir >= 0 ? styles.fadeSlideInRight : styles.fadeSlideInLeft;

  return (
    <div className="relative w-full flex justify-center">
      {/* Peeking frames (clickable) */}
      {count > 1 && (
        <>
          <SideFrame
            side="left"
            src={photos[leftIndex]?.url}
            onClick={goPrev}
          />
          <SideFrame
            side="right"
            src={photos[rightIndex]?.url}
            onClick={goNext}
          />
        </>
      )}

      {/* Tight image frame with thin black border */}
      <div
        className="relative inline-block border border-black"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {current ? (
          <button
            onClick={() => onExpand?.(current)}
            aria-label="Open artwork view with description"
            className="block"
          >
            <img
              key={current.id || current.url || index} // re-mount for animation
              alt={current.alt || "Artwork"}
              src={current.url}
              className={`block max-h-[80vh] max-w-[90vw] object-contain ${animClass}`}
              draggable={false}
              loading="eager"
            />
          </button>
        ) : (
          <div className="grid h-[40vh] w-[60vw] place-items-center text-neutral-500">
            No image
          </div>
        )}
      </div>
    </div>
  );
});

export default DesktopCarousel;

function SideFrame({ side, src, onClick }) {
  const isLeft = side === "left";
  if (!src) return null;

  return (
    <button
      onClick={onClick}
      aria-label={isLeft ? "Show previous" : "Show next"}
      className={`absolute top-1/2 hidden -translate-y-1/2 md:block ${
        isLeft ? "-left-20" : "-right-20"
      }`}
    >
      <div
        className={`pointer-events-none w-40 border border-black bg-white shadow-md ${
          isLeft ? "origin-right" : "origin-left"
        }`}
        style={{
          transform: isLeft ? "rotate(-1.2deg)" : "rotate(1.2deg)",
        }}
      >
        <img
          src={src}
          alt="Peek"
          className="h-28 w-full object-cover opacity-70 transition-opacity duration-200"
        />
      </div>
    </button>
  );
}
