"use client";

import React from "react";

function Painting({
  variant, // "center" | "side"
  rotateDeg = 0,
  photo,
  box,
  pos,
  onClick,
  aria,
  animClass,
  touchHandlers, // only used for center
}) {
  const isCenter = variant === "center";

  const frameClass = isCenter
    ? "absolute overflow-hidden rounded-xl border border-black/10 shadow-xl bg-transparent"
    : "absolute hidden md:block overflow-hidden rounded-lg border border-black/10 shadow-lg";

  return (
    <button
      onClick={onClick}
      aria-label={aria}
      className={frameClass}
      style={{ width: box.w, height: box.h, ...pos }}
      {...(isCenter && touchHandlers ? touchHandlers : {})}
    >
      {/* Rotated content for sides; scale slightly so corners stay filled */}
      <div
        className="h-full w-full"
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
        <img
          src={photo.url}
          alt={photo.alt || (isCenter ? "Artwork" : "Peek")}
          className={`${isCenter ? `h-full w-full object-cover ${animClass ?? ""}` : "h-full w-full object-cover"} block`}
          draggable={false}
          {...(isCenter ? { loading: "eager", fetchPriority: "high" } : {})}
        />
      </div>

      {/* Darken/soften sides using your chosen overlay (white looks nice) */}
      {!isCenter && (
        <div className="pointer-events-none absolute inset-0 bg-white/50" />
      )}
    </button>
  );
}

export default React.memo(Painting);
