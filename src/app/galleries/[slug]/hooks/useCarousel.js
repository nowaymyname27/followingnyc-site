// app/galleries/[slug]/hooks/useCarousel.js
import * as React from "react";

/**
 * Local carousel state & helpers for a photo array.
 * Uncontrolled by default; pass an initialIndex if you want.
 */
export function useCarousel(photos = [], initialIndex = 0) {
  const count = photos.length;
  const [index, setIndex] = React.useState(
    count ? Math.min(Math.max(initialIndex, 0), count - 1) : 0
  );
  const [dir, setDir] = React.useState(0); // -1 = prev, 1 = next

  const goPrev = React.useCallback(() => {
    if (!count) return;
    setDir(-1);
    setIndex((n) => (n - 1 + count) % count);
  }, [count]);

  const goNext = React.useCallback(() => {
    if (!count) return;
    setDir(1);
    setIndex((n) => (n + 1) % count);
  }, [count]);

  const current = count ? photos[index] : null;
  const leftIndex = count ? (index - 1 + count) % count : 0;
  const rightIndex = count ? (index + 1) % count : 0;

  return {
    index,
    setIndex,
    dir,
    goPrev,
    goNext,
    current,
    leftIndex,
    rightIndex,
    count,
  };
}
