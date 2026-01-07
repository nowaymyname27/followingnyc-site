"use client";

import Link from "next/link";
import Image from "next/image";

export default function AiCollectionCard({ project }) {
  const { title, slug, original, generated } = project;

  return (
    <Link href={`/ai/${slug}`} className="group block">
      {/* Card Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 border border-black/5 isolate">
        {/* 1. BOTTOM LAYER: AI Generated */}
        {generated?.url && (
          <Image
            src={generated.url}
            alt={`${title} - AI Generated`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* 2. TOP LAYER: Original Source */}
        {original?.url && (
          <Image
            src={original.url}
            alt={`${title} - Original`}
            fill
            className="object-cover object-top transition-all duration-700 ease-in-out group-hover:opacity-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* --- BADGES (Top) --- */}
        <div className="absolute top-3 left-3 z-10 transition-opacity duration-300 group-hover:opacity-0">
          <span className="bg-white/90 text-black text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
            Original
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="bg-purple-600/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm">
            AI Generated
          </span>
        </div>

        {/* --- TITLE BAR (Bottom) --- */}
        <div className="absolute bottom-0 inset-x-0 z-20 bg-white border-t border-black/5 px-4 py-3 flex items-center justify-between">
          <h3 className="font-semibold text-sm sm:text-base text-black truncate pr-2">
            {title}
          </h3>
          {/* Arrow animation */}
          <span className="text-black/40 text-sm opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
