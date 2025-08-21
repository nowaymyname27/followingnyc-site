// app/collections/components/CollectionCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function CollectionCard({ album }) {
  const { id, slug, title, cover, count } = album || {};

  const CardInner = (
    <div
      className="rounded-2xl overflow-hidden border border-black/10 hover:border-black/20
                 transition-transform duration-200 will-change-transform
                 group-hover:-translate-y-1 group-hover:shadow-md bg-white"
    >
      <div className="relative aspect-[4/3]">
        {cover ? (
          <Image
            src={cover}
            alt={title || "Collection cover"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-black/50 bg-black/5">
            No cover
          </div>
        )}

        {/* Optional photo count pill on hover */}
        {Number.isFinite(count) && (
          <div className="absolute right-2 bottom-2 rounded-full bg-white/90 border border-black/10 px-2 py-0.5 text-[11px] leading-none text-black shadow-sm">
            {count} photo{count === 1 ? "" : "s"}
          </div>
        )}
      </div>

      <div className="px-2 py-2 text-sm text-center truncate">{title}</div>
    </div>
  );

  // If slug exists, link it; otherwise, plain card (disabled look).
  return slug ? (
    <Link
      key={id || slug}
      href={`/collections/${slug}`}
      className="block focus:outline-none group"
    >
      {CardInner}
    </Link>
  ) : (
    <div key={id} className="opacity-75 group">
      {CardInner}
    </div>
  );
}
