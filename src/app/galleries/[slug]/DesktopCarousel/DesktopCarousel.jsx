// app/galleries/[slug]/DesktopCarousel/DesktopCarousel.jsx
"use client";

import * as React from "react";
import Image from "next/image";
import styles from "../desktopCarousel.module.css";
import { useHostSize } from "./hooks/useHostSize";
import { fitWithin, GAP_PX, MIN_PEEK } from "./lib/layout";

const DesktopCarousel = React.forwardRef(function DesktopCarousel(
  { photos = [], onExpand, onIndexChange },
  ref
) {
  const count = photos.length || 0;
  const [index, setIndex] = React.useState(0);
  const [dir, setDir] = React.useState(1); // 1 = next, -1 = prev

  const goPrev = React.useCallback(() => {
    if (!count) return;
    setDir(-1);
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = React.useCallback(() => {
    if (!count) return;
    setDir(1);
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const current = photos[index] || null;
  const leftIndex = (index - 1 + count) % count;
  const rightIndex = (index + 1) % count;

  React.useImperativeHandle(
    ref,
    () => ({ goPrev, goNext, index, count, current, setIndex }),
    [goPrev, goNext, index, count, current]
  );

  React.useEffect(() => {
    onIndexChange?.(index, count);
  }, [index, count, onIndexChange]);

  // keyboard nav
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if ((e.key === "Enter" || e.key === " ") && current) onExpand?.(current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, onExpand, current]);

  // host size
  const [hostRef, { w: hostW, h: hostH }] = useHostSize();

  // prefer provided ratios from Sanity
  const curR =
    current?.ratio ||
    (current?.width && current?.height ? current.width / current.height : null);
  const leftR =
    photos[leftIndex]?.ratio ||
    (photos[leftIndex]?.width && photos[leftIndex]?.height
      ? photos[leftIndex].width / photos[leftIndex].height
      : null);
  const rightR =
    photos[rightIndex]?.ratio ||
    (photos[rightIndex]?.width && photos[rightIndex]?.height
      ? photos[rightIndex].width / photos[rightIndex].height
      : null);

  // sized frames
  const curBox = curR && fitWithin(hostW, hostH, curR);
  const leftBox = leftR && fitWithin(hostW, hostH, leftR);
  const rightBox = rightR && fitWithin(hostW, hostH, rightR);

  // positions
  const centerPos = curBox
    ? { left: (hostW - curBox.w) / 2, top: (hostH - curBox.h) / 2 }
    : { left: 0, top: 0 };

  const leftPos =
    leftBox && centerPos
      ? {
          left: centerPos.left - GAP_PX - leftBox.w,
          top: (hostH - leftBox.h) / 2,
        }
      : null;

  const rightPos =
    rightBox && centerPos
      ? {
          left: centerPos.left + (curBox?.w ?? 0) + GAP_PX,
          top: (hostH - rightBox.h) / 2,
        }
      : null;

  // edge fades sized to visible peeks — BACKGROUND -> transparent
  const leftPeek = Math.max(0, (leftPos?.left ?? 0) + (leftBox?.w ?? 0));
  const rightPeek = Math.max(0, hostW - (rightPos?.left ?? hostW));
  const leftFadeW = Math.max(MIN_PEEK, leftPeek);
  const rightFadeW = Math.max(MIN_PEEK, rightPeek);

  const animClass = dir >= 0 ? styles.fadeSlideInRight : styles.fadeSlideInLeft;

  // swipe (pointer & touch)
  const startX = React.useRef(0);
  const onPointerDown = (e) => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  };
  const onPointerUp = (e) => {
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX ?? startX.current;
    const dx = x - startX.current;
    if (dx > 40) goPrev();
    else if (dx < -40) goNext();
  };

  // Inline "Painting"
  function Painting({
    variant,
    rotateDeg,
    photo,
    box,
    pos,
    onClick,
    aria,
    priority,
    anim,
  }) {
    if (!photo?.url || !box || !pos) return null;
    const isCenter = variant === "center";
    const frameClass = isCenter
      ? "absolute overflow-hidden rounded-xl border border-black/10 shadow-xl bg-transparent"
      : "absolute hidden md:block overflow-hidden rounded-lg border border-black/10 shadow-lg";

    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={aria}
        className={frameClass}
        style={{
          width: Math.round(box.w),
          height: Math.round(box.h),
          left: Math.round(pos.left),
          top: Math.round(pos.top),
        }}
        {...(isCenter
          ? {
              onPointerDown,
              onPointerUp,
              onTouchStart: onPointerDown,
              onTouchEnd: onPointerUp,
            }
          : {})}
      >
        <div
          className="relative h-full w-full"
          style={
            isCenter
              ? undefined
              : {
                  transform: `rotate(${rotateDeg}deg) scale(1.02)`,
                  transformOrigin: "50% 50%",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  willChange: "transform",
                }
          }
        >
          <Image
            src={photo.url}
            alt={photo.alt || (isCenter ? "Artwork" : "Peek")}
            fill
            sizes={`${Math.round(box.w)}px`}
            className={`object-cover ${isCenter ? anim : ""}`}
            placeholder={photo.lqip ? "blur" : "empty"}
            blurDataURL={photo.lqip || undefined}
            priority={!!priority}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            draggable={false}
          />
        </div>
        {!isCenter && (
          <div className="pointer-events-none absolute inset-0 bg-white/50" />
        )}
      </button>
    );
  }

  return (
    <div
      ref={hostRef}
      className="relative w-full h-[85vh] min-h-[520px] overflow-hidden"
      style={{ contentVisibility: "auto", containIntrinsicSize: "800px" }}
    >
      {/* edge fades — BACKGROUND -> transparent */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 bg-gradient-to-r from-background/95 to-transparent"
        style={{ width: `${Math.round(leftFadeW)}px` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 bg-gradient-to-l from-background/95 to-transparent"
        style={{ width: `${Math.round(rightFadeW)}px` }}
      />

      {/* LEFT */}
      {photos.length > 1 && (
        <Painting
          variant="side"
          rotateDeg={-0.6}
          photo={photos[leftIndex]}
          box={leftBox}
          pos={leftPos}
          onClick={goPrev}
          aria="Show previous"
          priority={false}
        />
      )}

      {/* CENTER */}
      {current && (
        <Painting
          variant="center"
          rotateDeg={0}
          photo={current}
          box={curBox}
          pos={centerPos}
          onClick={() => current && onExpand?.(current)}
          aria="Open artwork view"
          priority={index === 0}
          anim={animClass}
        />
      )}

      {/* RIGHT */}
      {photos.length > 1 && (
        <Painting
          variant="side"
          rotateDeg={0.6}
          photo={photos[rightIndex]}
          box={rightBox}
          pos={rightPos}
          onClick={goNext}
          aria="Show next"
          priority={false}
        />
      )}
    </div>
  );
});

export default DesktopCarousel;
