"use client";
import React from "react";

export default function FullscreenMode({
  slides = [],
  activeIndex = 0,
  active = true,
}) {
  const current = slides[activeIndex] || {};
  const currentSrc = typeof current === "string" ? current : current.src;
  const currentTitle = typeof current === "object" ? current.title : "";

  return (
    <div
      className={`group absolute inset-0 transition-opacity duration-700 ${
        active ? "opacity-100" : "md:opacity-0"
      }`}
    >
      {slides.map((it, i) => {
        const src = typeof it === "string" ? it : it.src;
        return (
          <img
            key={typeof it === "object" ? it.id || src : src}
            src={src}
            alt={
              typeof it === "object"
                ? it.title || "Fullscreen slide"
                : "Fullscreen slide"
            }
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
              i === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        );
      })}

      {/* hover caption (only if we have a title) */}
      {currentTitle ? (
        <div className="pointer-events-none absolute left-4 bottom-4 rounded-xl bg-black/55 px-3 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          {currentTitle}
        </div>
      ) : null}
    </div>
  );
}
