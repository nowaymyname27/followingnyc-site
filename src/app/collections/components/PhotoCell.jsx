// app/collections/components/PhotoCell.jsx
"use client";

import React from "react";
import Image from "next/image";

// Memo to avoid rerenders when scrolling
function PhotoCell({
  src,
  alt,
  i,
  onOpen,
  eager = false,
  lqip,
  width,
  height,
}) {
  const handle = () => onOpen(i);

  // If we don't have dimensions, fall back to a simple <img> (rare)
  if (!width || !height) {
    return (
      <button
        type="button"
        onClick={handle}
        className="group block w-full text-left mb-4 rounded-2xl overflow-hidden border border-black/10 hover:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20"
        aria-label={alt || `Open photo ${i + 1}`}
      >
        <img
          src={src}
          alt={alt || `Photo ${i + 1}`}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          className="w-full h-auto transition group-hover:opacity-95"
          draggable={false}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      className="group block w-full text-left mb-4 rounded-2xl overflow-hidden border border-black/10 hover:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20"
      aria-label={alt || `Open photo ${i + 1}`}
    >
      <Image
        src={src}
        alt={alt || `Photo ${i + 1}`}
        width={width}
        height={height}
        // Fill column width responsively:
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        className="w-full h-auto transition group-hover:opacity-95 object-cover"
        placeholder={lqip ? "blur" : "empty"}
        blurDataURL={lqip || undefined}
        priority={eager}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        draggable={false}
      />
    </button>
  );
}

export default React.memo(PhotoCell);
