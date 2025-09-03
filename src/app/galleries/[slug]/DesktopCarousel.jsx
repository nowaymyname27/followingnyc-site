// app/galleries/[slug]/DesktopCarousel.jsx
"use client";

import * as React from "react";
import styles from "./desktopCarousel.module.css";
import { useCarousel } from "./hooks/useCarousel";
import { useKeyNav } from "./hooks/useKeyNav";

/* --- intrinsic aspect ratio (w/h) --- */
function useImageAspect(url) {
  const [ratio, setRatio] = React.useState(null);
  React.useEffect(() => {
    if (!url) return;
    let active = true;
    const img = new Image();
    img.onload = () => {
      if (!active) return;
      const r =
        img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : 1;
      setRatio(r);
    };
    img.onerror = () => active && setRatio(1);
    img.src = url;
    return () => {
      active = false;
    };
  }, [url]);
  return ratio;
}

/* --- fit a ratio inside hostW x hostH --- */
function fitWithin(hostW, hostH, ratio) {
  if (!hostW || !hostH || !ratio) return null;
  let w = hostW; // use all available width
  let h = w / ratio;
  if (h > hostH) {
    h = hostH;
    w = h * ratio;
  }
  return { w, h };
}

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

  React.useImperativeHandle(
    ref,
    () => ({ goPrev, goNext, index, count, current, setIndex }),
    [goPrev, goNext, index, count, current, setIndex]
  );

  React.useEffect(() => {
    onIndexChange?.(index, count);
  }, [index, count, onIndexChange]);

  useKeyNav({
    onPrev: goPrev,
    onNext: goNext,
    onOpen: () => current && onExpand?.(current),
    enabled: true,
  });

  // host size (full-width within parent)
  const hostRef = React.useRef(null);
  const [hostSize, setHostSize] = React.useState({ w: 0, h: 0 });
  React.useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setHostSize({ w: el.clientWidth, h: el.clientHeight })
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // swipe
  const startX = React.useRef(0);
  const tracking = React.useRef(false);
  const onTouchStart = (e) => {
    tracking.current = true;
    startX.current = e.touches?.[0]?.clientX ?? 0;
  };
  const onTouchEnd = (e) => {
    if (!tracking.current) return;
    tracking.current = false;
    const dx =
      (e.changedTouches?.[0]?.clientX ?? startX.current) - startX.current;
    if (dx > 40) goPrev();
    else if (dx < -40) goNext();
  };

  const animClass = dir >= 0 ? styles.fadeSlideInRight : styles.fadeSlideInLeft;

  // layout constants
  const gapPx = 32; // CONSTANT edge-to-edge spacing between frames
  const minPeek = 48; // ensure at least this much visible on edges (for nice feel)

  const { w: hostW, h: hostH } = hostSize;

  // ratios
  const curR = useImageAspect(current?.url);
  const leftR = useImageAspect(photos[leftIndex]?.url);
  const rightR = useImageAspect(photos[rightIndex]?.url);

  // sized frames using full width/height constraints
  const curBox = curR && fitWithin(hostW, hostH, curR);
  const leftBox = leftR && fitWithin(hostW, hostH, leftR);
  const rightBox = rightR && fitWithin(hostW, hostH, rightR);

  // positions (centered current; neighbors placed exactly gapPx away)
  const centerPos = curBox
    ? { left: (hostW - curBox.w) / 2, top: (hostH - curBox.h) / 2 }
    : { left: 0, top: 0 };

  const leftPos =
    leftBox && centerPos
      ? {
          left: centerPos.left - gapPx - leftBox.w,
          top: (hostH - leftBox.h) / 2,
        }
      : null;

  const rightPos =
    rightBox && centerPos
      ? {
          left: centerPos.left + curBox.w + gapPx,
          top: (hostH - rightBox.h) / 2,
        }
      : null;

  // current visible peek (for symmetric edge fades)
  const leftPeek = Math.max(0, (leftPos?.left ?? 0) + (leftBox?.w ?? 0));
  const rightPeek = Math.max(0, hostW - (rightPos?.left ?? hostW));
  const leftFadeW = Math.max(minPeek, leftPeek);
  const rightFadeW = Math.max(minPeek, rightPeek);

  return (
    <div
      ref={hostRef}
      className="relative w-full h-[85vh] min-h-[520px] overflow-hidden"
    >
      {/* edge fades sized to current peek */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 bg-gradient-to-r from-background/95 to-transparent"
        style={{ width: `${Math.round(leftFadeW)}px` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 bg-gradient-to-l from-background/95 to-transparent"
        style={{ width: `${Math.round(rightFadeW)}px` }}
      />

      {/* LEFT neighbor */}
      {count > 1 && photos[leftIndex] && leftBox && leftPos && (
        <button
          onClick={goPrev}
          aria-label="Show previous"
          className="absolute hidden md:block"
          style={{ width: leftBox.w, height: leftBox.h, ...leftPos }}
        >
          <div
            className="h-full w-full overflow-hidden rounded-lg border border-black/10 shadow-lg"
            style={{ transform: "rotate(-0.6deg)" }}
          >
            <img
              src={photos[leftIndex].url}
              alt={photos[leftIndex].alt || "Peek"}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        </button>
      )}

      {/* CENTER frame */}
      <div
        className="absolute overflow-hidden rounded-xl border border-black/10 shadow-xl bg-transparent"
        style={
          curBox
            ? { width: curBox.w, height: curBox.h, ...centerPos }
            : { left: 0, top: 0, width: 960, height: 540 }
        }
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {current ? (
          <button
            onClick={() => onExpand?.(current)}
            aria-label="Open artwork view"
            className="block h-full w-full"
          >
            <img
              key={current.id || current.url || index}
              alt={current.alt || "Artwork"}
              src={current.url}
              className={`h-full w-full object-cover ${animClass}`}
              draggable={false}
              loading="eager"
            />
          </button>
        ) : (
          <div className="grid h-full w-full place-items-center text-neutral-500">
            Loading…
          </div>
        )}
      </div>

      {/* RIGHT neighbor */}
      {count > 1 && photos[rightIndex] && rightBox && rightPos && (
        <button
          onClick={goNext}
          aria-label="Show next"
          className="absolute hidden md:block"
          style={{ width: rightBox.w, height: rightBox.h, ...rightPos }}
        >
          <div
            className="h-full w-full overflow-hidden rounded-lg border border-black/10 shadow-lg"
            style={{ transform: "rotate(0.6deg)" }}
          >
            <img
              src={photos[rightIndex].url}
              alt={photos[rightIndex].alt || "Peek"}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        </button>
      )}
    </div>
  );
});

export default DesktopCarousel;
