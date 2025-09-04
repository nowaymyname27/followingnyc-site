// app/collections/components/CollectionCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

function Card({ album, priority = false }) {
  const { id, slug, title, cover, count } = album || {};
  const c = typeof cover === "string" ? { src: cover } : cover || null;

  const image = c?.src ? (
    <Image
      src={c.src}
      alt={title || "Collection cover"}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      className="object-cover"
      // Blur-up placeholder if available
      placeholder={c?.lqip ? "blur" : "empty"}
      blurDataURL={c?.lqip || undefined}
      // Loading hints
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  ) : (
    <div className="absolute inset-0 grid place-items-center text-sm text-black/50 bg-black/5">
      No cover
    </div>
  );

  const CardInner = (
    <div
      className="rounded-2xl overflow-hidden border border-black/10 hover:border-black/20
                 transition-transform duration-200 will-change-transform
                 group-hover:-translate-y-1 group-hover:shadow-md bg-white"
    >
      <div className="relative aspect-[4/3]">
        {image}

        {Number.isFinite(count) && (
          <div className="absolute right-2 bottom-2 rounded-full bg-white/90 border border-black/10 px-2 py-0.5 text-[11px] leading-none text-black shadow-sm">
            {count} photo{count === 1 ? "" : "s"}
          </div>
        )}
      </div>

      <div className="px-2 py-2 text-sm text-center truncate">{title}</div>
    </div>
  );

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

export default React.memo(function CollectionCard(props) {
  return <Card {...props} />;
});
