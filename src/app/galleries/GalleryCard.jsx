// app/galleries/GalleryCard.jsx
"use client";

import * as React from "react";
import Link from "next/link";

export default function GalleryCard({ gallery, isVisible, href }) {
  const { title, year, description, cover } = gallery || {};

  const baseCard =
    "relative w-full h-[80svh] rounded-3xl overflow-hidden " +
    "bg-white ring-1 ring-neutral-200/80 shadow-2xl transition-all duration-500 ease-out " +
    "hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)]";

  const anim = isVisible
    ? "translate-y-0 opacity-100 scale-100"
    : "translate-y-6 opacity-0 scale-[0.98]";

  const CardInner = (
    <div className={`${baseCard} ${anim} cursor-pointer`}>
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">
        {/* Left: BIG cover */}
        <div className="md:col-span-7 relative h-[48vh] md:h-full">
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
        <div className="md:col-span-5 flex flex-col h-full bg-white">
          {/* Title block ~ 1/3 height */}
          <div className="flex flex-col justify-center items-center flex-[1] text-center px-6">
            <h2 className="text-4xl font-semibold tracking-tight">
              {title || "Untitled Gallery"}
            </h2>
            {year ? (
              <div className="text-sm text-neutral-500 mt-2">{year}</div>
            ) : null}
          </div>

          {/* Description */}
          <div className="flex-[2] px-8 py-4 overflow-y-auto">
            <p className="text-neutral-700 leading-relaxed">
              {description || "No description provided."}
            </p>
          </div>

          {/* Visual CTA (card itself is clickable) */}
          {href && (
            <div className="px-8 pb-6">
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
