// app/collections/components/PhotoCell.jsx
"use client";

export default function PhotoCell({ src, alt, i, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(i)}
      className="group block w-full text-left mb-4 break-inside-avoid rounded-2xl overflow-hidden border border-black/10 hover:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20"
      aria-label={alt || `Open photo ${i + 1}`}
    >
      <img
        src={src}
        alt={alt || `Photo ${i + 1}`}
        loading="lazy"
        className="w-full h-auto transition group-hover:opacity-95"
        draggable={false}
      />
    </button>
  );
}
