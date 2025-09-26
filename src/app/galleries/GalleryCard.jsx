// app/galleries/GalleryCard.jsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

function GalleryCardInner({ gallery, isVisible, href, priority = false }) {
  const { title, year, description, cover } = gallery || {};
  const coverSrc = typeof cover === "string" ? cover : cover?.src || null;
  const lqip = typeof cover === "object" ? cover?.lqip : null;

  const baseCard =
    "relative w-full h-auto md:h-[80svh] rounded-3xl overflow-hidden " +
    "bg-white ring-1 ring-neutral-200/80 shadow-2xl transition-all duration-500 ease-out " +
    "hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)]";

  const anim = isVisible
    ? "translate-y-0 opacity-100 scale-100"
    : "translate-y-6 opacity-0 scale-[0.98]";

  return (
    <div className={`${baseCard} ${anim} cursor-pointer`}>
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">
        {/* Left: Cover */}
        <div className="md:col-span-7 relative aspect-[16/10] md:aspect-auto w-full md:h-full">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={title || "Gallery cover"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 58vw, 900px"
              placeholder={lqip ? "blur" : "empty"}
              blurDataURL={lqip || undefined}
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-neutral-400 bg-neutral-50">
              No image
            </div>
          )}
        </div>

        {/* Right: content */}
        <div className="md:col-span-5 flex flex-col h-auto md:h-full bg-white">
          {/* Heading + description together */}
          <div className="flex-1 flex flex-col px-5 sm:px-6 md:px-8 pt-5 md:pt-6 pb-4 md:pb-4 overflow-y-auto">
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-semibold tracking-tight text-center">
              {title || "Untitled Gallery"}
            </h2>
            {year ? (
              <div className="text-sm text-neutral-500 mt-2 text-center">
                {year}
              </div>
            ) : null}

            <p className="mt-4 text-neutral-700 leading-relaxed text-base sm:text-[17px]">
              {description || "No description provided."}
            </p>
          </div>

          {/* Footer */}
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
}

const GalleryCard = React.memo(GalleryCardInner);

export default function WrappedCard(props) {
  return props.href ? (
    <Link href={props.href} className="block w-full focus:outline-none">
      <GalleryCard {...props} />
    </Link>
  ) : (
    <GalleryCard {...props} />
  );
}
