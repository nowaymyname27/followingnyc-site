// app/galleries/GalleryCard.jsx
"use client";

import * as React from "react";
import Link from "next/link";

export default function GalleryCard({ gallery, isVisible, href }) {
  const { title, year, description, cover } = gallery || {};

  // Card: auto-height on mobile; fixed 80svh on md+
  const baseCard =
    "relative w-full h-auto md:h-[80svh] rounded-3xl overflow-hidden " +
    "bg-white ring-1 ring-neutral-200/80 shadow-2xl transition-all duration-500 ease-out " +
    "hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)]";

  const anim = isVisible
    ? "translate-y-0 opacity-100 scale-100"
    : "translate-y-6 opacity-0 scale-[0.98]";

  const CardInner = (
    <div className={`${baseCard} ${anim} cursor-pointer`}>
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">
        {/* Left: Cover */}
        <div
          className="
            md:col-span-7 relative
            aspect-[16/10] md:aspect-auto           /* Mobile: fixed aspect; Desktop: fill */
            w-full
            md:h-full
          "
        >
          {cover ? (
            <img
              src={cover}
              alt={title || "Gallery cover"}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-neutral-400 bg-neutral-50">
              No image
            </div>
          )}
        </div>

        {/* Right: content */}
        <div className="md:col-span-5 flex flex-col h-auto md:h-full bg-white">
          {/* Title block */}
          <div className="flex flex-col justify-center items-center flex-none md:flex-[1] text-center px-5 sm:px-6 md:px-6 pt-5 md:pt-0">
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-semibold tracking-tight">
              {title || "Untitled Gallery"}
            </h2>
            {year ? (
              <div className="text-sm text-neutral-500 mt-2">{year}</div>
            ) : null}
          </div>

          {/* Description: no scroll on mobile, scroll on md+ */}
          <div className="flex-1 px-5 sm:px-6 md:px-8 pb-4 md:py-4 overflow-visible md:overflow-y-auto">
            <p className="text-neutral-700 leading-relaxed text-base sm:text-[17px]">
              {description || "No description provided."}
            </p>
          </div>

          {/* CTA */}
          {href && (
            <div className="px-5 sm:px-6 md:px-8 pb-6 flex-none">
              <span className="inline-flex items-center px-4 py-2 rounded-xl border border-neutral-300 bg-white/70 text-sm font-medium pointer-events-none">
                View gallery →
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block w-full focus:outline-none">
      {CardInner}
    </Link>
  ) : (
    CardInner
  );
}
