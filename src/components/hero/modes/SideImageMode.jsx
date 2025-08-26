"use client";
import React from "react";

export default function SideImageMode({
  slides = [],
  activeIndex = 0,
  active = false,
}) {
  // Normalize slides so strings still work
  const norm = (it, i) => {
    if (typeof it === "string")
      return { id: `s-${i}`, src: it, alt: "Side panel slide" };
    return {
      id: it.id || `s-${i}`,
      src: it.src,
      alt: it.alt || "Side panel slide",
      description: it.description || "",
    };
  };
  const normalized = slides.map(norm);
  const current = normalized[activeIndex] || { alt: "" };

  return (
    <div
      className={`group absolute inset-y-8 left-1/2 hidden md:flex items-center transform transition-transform duration-700 ease-out
      ${active ? "translate-x-0" : "translate-x-[120%]"}`}
      aria-hidden={!active}
    >
      <div className="relative h-[75vh] w-[70vw] md:w-[62vw] lg:w-[58vw] xl:w-[54vw] -translate-x-[8vw] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10 bg-black/10">
        {normalized.map((s, i) => (
          <img
            key={s.id}
            src={s.src}
            alt={s.alt}
            title={s.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}

        {/* Hover caption from ALT */}
        {current.alt ? (
          <div className="pointer-events-none absolute left-3 bottom-3 rounded-lg bg-black/55 px-2.5 py-1 text-[11px] text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            {current.alt}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const usesPlainBackground = true;
