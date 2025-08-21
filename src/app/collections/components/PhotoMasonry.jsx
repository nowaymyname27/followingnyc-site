// app/collections/components/PhotoMasonry.jsx
"use client";

import PhotoCell from "./PhotoCell";

export default function PhotoMasonry({ photos = [], onOpen }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
      {photos.map((p, i) => (
        <PhotoCell
          key={p.id ?? `${i}-${p.url}`}
          src={p.url}
          alt={p.alt}
          i={i}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
