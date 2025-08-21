// app/galleries/[slug]/MobileScroller.jsx
"use client";

export default function MobileScroller({ photos = [], onExpand }) {
  if (!photos.length) {
    return (
      <div className="grid place-items-center text-neutral-500 h-40">
        No photos
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {photos.map((p, idx) => (
        <div key={p.id || p.url || idx} className="w-full flex justify-center">
          <div className="inline-block border border-black">
            <button
              onClick={() => onExpand?.(p)}
              aria-label="Open artwork view with description"
              className="block"
            >
              <img
                src={p.url}
                alt={p.alt || `Photo ${idx + 1}`}
                className="block max-w-full object-contain"
                style={{ maxHeight: "72vh" }}
                loading="lazy"
                draggable={false}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
