"use client";

import * as React from "react";
import styles from "../desktopCarousel.module.css";
import { useCarousel } from "../hooks/useCarousel";
import { useKeyNav } from "../hooks/useKeyNav";
import Painting from "./components/Painting";
import { useImageAspect } from "./hooks/useImageAspect";
import { useHostSize } from "./hooks/useHostSize";
import { fitWithin, GAP_PX, MIN_PEEK } from "./lib/layout";

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

  // host size
  const [hostRef, { w: hostW, h: hostH }] = useHostSize();

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

  // aspect ratios
  const curR = useImageAspect(current?.url);
  const leftR = useImageAspect(photos[leftIndex]?.url);
  const rightR = useImageAspect(photos[rightIndex]?.url);

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

  // describe slots once, render via map
  const slots = React.useMemo(
    () =>
      [
        {
          key: "left",
          variant: "side",
          rotateDeg: -0.6,
          photo: photos[leftIndex],
          box: leftBox,
          pos: leftPos,
          onClick: goPrev,
          aria: "Show previous",
          animClass: null,
          touchHandlers: null,
        },
        {
          key: "center",
          variant: "center",
          rotateDeg: 0,
          photo: current,
          box: curBox,
          pos: centerPos,
          onClick: () => current && onExpand?.(current),
          aria: "Open artwork view",
          animClass,
          touchHandlers: { onTouchStart, onTouchEnd },
        },
        {
          key: "right",
          variant: "side",
          rotateDeg: 0.6,
          photo: photos[rightIndex],
          box: rightBox,
          pos: rightPos,
          onClick: goNext,
          aria: "Show next",
          animClass: null,
          touchHandlers: null,
        },
      ].filter((s) => s.photo && s.box && s.pos),
    [
      photos,
      leftIndex,
      rightIndex,
      leftBox,
      rightBox,
      curBox,
      leftPos,
      rightPos,
      centerPos,
      goPrev,
      goNext,
      current,
      onExpand,
      animClass,
      onTouchStart,
      onTouchEnd,
    ]
  );

  return (
    <div
      ref={hostRef}
      className="relative w-full h-[85vh] min-h-[520px] overflow-hidden"
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

      {slots.map(({ key, ...slotProps }) => (
        <Painting key={key} {...slotProps} />
      ))}
    </div>
  );
});

export default DesktopCarousel;
