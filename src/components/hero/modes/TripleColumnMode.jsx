"use client";
import React from "react";

export default function TripleColumnMode({
  slides = [],
  activeIndex = 0,
  active = false,
}) {
  const len = slides.length || 1;
  const colIdx = [
    activeIndex % len,
    (activeIndex + 1) % len,
    (activeIndex + 2) % len,
  ];
  const objPos = ["object-left", "object-center", "object-right"];

  return (
    <div
      className={`absolute inset-y-8 left-1/2 hidden md:flex items-center transform transition-transform duration-700 ease-out
      ${active ? "translate-x-0" : "translate-x-[120%]"}`}
      aria-hidden={!active}
    >
      <div className="relative h-[75vh] w-[70vw] md:w-[62vw] lg:w-[58vw] xl:w-[54vw] -translate-x-[8vw] rounded-3xl shadow-2xl ring-1 ring-black/10 bg-black/10 p-3">
        <div className="grid h-full w-full grid-cols-3 gap-3">
          {[0, 1, 2].map((col) => {
            const item = slides[colIdx[col]] || {};
            const title = typeof item === "object" ? item.title : "";
            return (
              <div
                key={col}
                className="group relative overflow-hidden rounded-2xl bg-black/20"
              >
                {slides.map((it, i) => {
                  const src = typeof it === "string" ? it : it.src;
                  const isActive = i === colIdx[col];
                  return (
                    <img
                      key={`${col}-${
                        typeof it === "object" ? it.id || src : src
                      }`}
                      src={src}
                      alt={
                        typeof it === "object"
                          ? it.title || "Column slide"
                          : "Column slide"
                      }
                      className={`absolute inset-0 h-full w-full object-cover ${
                        objPos[col]
                      } transition-opacity duration-700 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      loading={i === 0 ? "eager" : "lazy"}
                      style={{
                        animation: isActive
                          ? `${["kbRight", "kbLeft", "kbUp"][col]} ${
                              ["16s", "18s", "20s"][col]
                            } ease-in-out infinite alternate`
                          : "none",
                        willChange: "transform, opacity",
                        transitionDelay: isActive ? `${col * 120}ms` : "0ms",
                      }}
                    />
                  );
                })}
                {title ? (
                  <div className="pointer-events-none absolute left-2 bottom-2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                    {title}
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
