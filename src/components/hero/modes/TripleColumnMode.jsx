"use client";
import React from "react";

export default function TripleColumnMode({
  slides = [],
  activeIndex = 0,
  active = false,
  stepSize = 3, // how many new images per transition
}) {
  // Normalize slides (strings still work)
  const norm = (it, i) =>
    typeof it === "string"
      ? { id: `s-${i}`, src: it, alt: "Column slide" }
      : {
          id: it.id || `s-${i}`,
          src: it.src,
          alt: it.alt || "Column slide",
          description: it.description || "",
        };

  const S = (slides || []).map(norm);
  const len = S.length || 1;

  // Advance in "pages" of 3 so each transition shows 3 new images.
  // Example: page 0 -> [0,1,2], page 1 -> [3,4,5], etc., wrapping cleanly.
  const page = Math.floor(activeIndex / stepSize);
  const start = (page * stepSize) % len;

  // Build up to 3 unique indices for the columns, wrapping and skipping dups
  const colIdx = [];
  for (let k = 0; k < Math.min(3, len); k++) {
    colIdx.push((start + k) % len);
  }

  return (
    <div
      className={`absolute inset-y-8 right-0 md:right-4 lg:right-6 hidden md:flex items-center transform transition-transform duration-700 ease-out ${
        active ? "translate-x-0" : "translate-x-[120%]"
      }`}
      aria-hidden={!active}
    >
      <div
        className={[
          "relative h-[75vh]",
          "w-[min(70vw,calc(100vw-2rem))]",
          "md:w-[min(62vw,calc(100vw-3rem))]",
          "lg:w-[min(58vw,calc(100vw-3.5rem))]",
          "xl:w-[min(54vw,calc(100vw-4rem))]",
          "overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10 bg-black/10 p-3",
        ].join(" ")}
      >
        <div
          className={`grid h-full w-full ${len >= 3 ? "grid-cols-3" : len === 2 ? "grid-cols-2" : "grid-cols-1"} gap-3`}
        >
          {colIdx.map((idx, col) => {
            const current = S[idx] || { alt: "" };
            return (
              <div
                key={col}
                className="group relative overflow-hidden rounded-2xl bg-black/20"
              >
                {/* We still render all images per column to keep your fade, but only the 'idx' is visible */}
                {S.map((s, i) => {
                  const isActive = i === idx;
                  return (
                    <img
                      key={`${col}-${s.id}`}
                      src={s.src}
                      alt={s.alt}
                      className={[
                        "absolute inset-0 h-full w-full object-cover object-center",
                        "hero-slide",
                        isActive ? "opacity-100" : "opacity-0",
                        isActive ? `kb-col-${col}` : "",
                      ].join(" ")}
                      loading={i === 0 ? "eager" : "lazy"}
                      style={{
                        transitionDelay: isActive ? `${col * 120}ms` : "0ms",
                      }}
                    />
                  );
                })}

                {/* Hover caption */}
                {current.alt ? (
                  <div className="pointer-events-none absolute left-2 bottom-2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {current.alt}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const usesPlainBackground = true;
