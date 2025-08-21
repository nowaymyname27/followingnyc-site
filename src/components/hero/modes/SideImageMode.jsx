"use client";
import React from "react";

export default function SideImageMode({
  slides = [],
  activeIndex = 0,
  active = false,
}) {
  const current = slides[activeIndex] || {};
  const currentTitle = typeof current === "object" ? current.title : "";

  return (
    <div
      className={`group absolute inset-y-8 left-1/2 hidden md:flex items-center transform transition-transform duration-700 ease-out
      ${active ? "translate-x-0" : "translate-x-[120%]"}`}
      aria-hidden={!active}
    >
      <div className="relative h-[75vh] w-[70vw] md:w-[62vw] lg:w-[58vw] xl:w-[54vw] -translate-x-[8vw] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10 bg-black/10">
        {slides.map((it, i) => {
          const src = typeof it === "string" ? it : it.src;
          return (
            <img
              key={typeof it === "object" ? it.id || src : src}
              src={src}
              alt={
                typeof it === "object"
                  ? it.title || "Side panel slide"
                  : "Side panel slide"
              }
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              loading={i === 0 ? "eager" : "lazy"}
            />
          );
        })}

        {currentTitle ? (
          <div className="pointer-events-none absolute left-3 bottom-3 rounded-lg bg-black/55 px-2.5 py-1 text-[11px] text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            {currentTitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const usesPlainBackground = true;
