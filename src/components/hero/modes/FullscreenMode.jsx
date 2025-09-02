"use client";
import React from "react";

export default function FullscreenMode({
  slides = [],
  activeIndex = 0,
  active = true,
}) {
  // Defensive normalization for string/object slides
  const norm = (it, i) => {
    if (typeof it === "string") {
      return { id: `s-${i}`, src: it, alt: "Fullscreen slide" };
    }
    return {
      id: it.id || `s-${i}`,
      src: it.src,
      alt: it.alt || "Fullscreen slide",
      description: it.description || "",
    };
  };

  const normalized = slides.map(norm);
  const current = normalized[activeIndex] || { src: "", alt: "" };

  return (
    <div
      className={`group absolute inset-0 transition-opacity duration-700 ${
        active ? "opacity-100" : "md:opacity-0"
      }`}
      tabIndex={0} // enable keyboard focus for caption a11y
      aria-hidden={!active}
    >
      {normalized.map((s, i) => (
        <img
          key={s.id}
          src={s.src}
          alt={s.alt} // keep alt, remove title to avoid native tooltip
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}

      {/* Hover/focus caption from ALT */}
      {current.alt ? (
        <div className="pointer-events-none absolute left-4 bottom-4 rounded-xl bg-black/55 px-3 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          {current.alt}
        </div>
      ) : null}
    </div>
  );
}
