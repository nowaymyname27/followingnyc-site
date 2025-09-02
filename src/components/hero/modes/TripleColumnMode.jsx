"use client";
import React from "react";

export default function TripleColumnMode({
  slides = [],
  activeIndex = 0,
  active = false,
}) {
  // Normalize slides so strings still work
  const norm = (it, i) => {
    if (typeof it === "string")
      return { id: `s-${i}`, src: it, alt: "Column slide" };
    return {
      id: it.id || `s-${i}`,
      src: it.src,
      alt: it.alt || "Column slide",
      description: it.description || "",
    };
  };
  const S = slides.map(norm);

  const len = S.length || 1;
  const colIdx = [
    activeIndex % len,
    (activeIndex + 1) % len,
    (activeIndex + 2) % len,
  ];

  return (
    <div
      className={`absolute inset-y-8 right-0 md:right-4 lg:right-6 hidden md:flex items-center transform transition-transform duration-700 ease-out
      ${active ? "translate-x-0" : "translate-x-[120%]"}`}
      aria-hidden={!active}
    >
      <div
        className={[
          "relative h-[75vh]",
          // Safe widths: keep a gutter so the card never bleeds offscreen
          "w-[min(70vw,calc(100vw-2rem))]",
          "md:w-[min(62vw,calc(100vw-3rem))]",
          "lg:w-[min(58vw,calc(100vw-3.5rem))]",
          "xl:w-[min(54vw,calc(100vw-4rem))]",
          "overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10 bg-black/10 p-3",
        ].join(" ")}
      >
        <div className="grid h-full w-full grid-cols-3 gap-3">
          {[0, 1, 2].map((col) => {
            const current = S[colIdx[col]] || { alt: "" };

            return (
              <div
                key={col}
                className="group relative overflow-hidden rounded-2xl bg-black/20"
              >
                {S.map((s, i) => {
                  const isActive = i === colIdx[col];
                  return (
                    <img
                      key={`${col}-${s.id}`}
                      src={s.src}
                      alt={s.alt}
                      title={s.alt}
                      className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      loading={i === 0 ? "eager" : "lazy"}
                      style={{
                        animation: isActive
                          ? `${
                              ["kbRight", "kbLeft", "kbUp"][col]
                            } ${["16s", "18s", "20s"][col]} ease-in-out infinite alternate`
                          : "none",
                        willChange: "transform, opacity",
                        transitionDelay: isActive ? `${col * 120}ms` : "0ms",
                      }}
                    />
                  );
                })}

                {/* Hover caption */}
                {current.alt ? (
                  <div className="pointer-events-none absolute left-2 bottom-2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                    {current.alt}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes kbRight {
          0% {
            transform: scale(1) translateX(0px) translateY(0px);
          }
          100% {
            transform: scale(1.08) translateX(14px) translateY(-6px);
          }
        }
        @keyframes kbLeft {
          0% {
            transform: scale(1) translateX(0px) translateY(0px);
          }
          100% {
            transform: scale(1.08) translateX(-14px) translateY(6px);
          }
        }
        @keyframes kbUp {
          0% {
            transform: scale(1) translateY(0px);
          }
          100% {
            transform: scale(1.08) translateY(-12px);
          }
        }
      `}</style>
    </div>
  );
}

export const usesPlainBackground = true;
