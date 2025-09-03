// app/news/TestimonialsGrid.client.jsx
"use client";

import * as React from "react";
import Image from "next/image";

/* ---------------- Grid ---------------- */

export default function TestimonialsGrid({ items }) {
  return (
    <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
      {items?.length ? (
        <Tiles items={items} />
      ) : (
        <p className="text-neutral-500">No testimonials yet.</p>
      )}
    </div>
  );
}

function Tiles({ items }) {
  const [open, setOpen] = React.useState(false);
  const [idx, setIdx] = React.useState(0);

  const onOpen = (i) => {
    setIdx(i);
    setOpen(true);
  };

  const onClose = () => setOpen(false);
  const onPrev = () => setIdx((n) => (n - 1 + items.length) % items.length);
  const onNext = () => setIdx((n) => (n + 1) % items.length);

  return (
    <>
      {items.map((t, i) => (
        <TestimonialTile key={t._id} t={t} onOpen={() => onOpen(i)} />
      ))}
      {open && items.length > 0 ? (
        <TestimonialOverlay
          t={items[idx]}
          index={idx}
          count={items.length}
          onClose={onClose}
          onPrev={onPrev}
          onNext={onNext}
        />
      ) : null}
    </>
  );
}

/* ---------------- Tile (whole card is clickable) ---------------- */

function TestimonialTile({ t, onOpen }) {
  const imgUrl = t?.item?.image?.asset?.url;
  const collapsed = truncate(t?.quote || "", 220);

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      aria-label={`Open testimonial`}
      className="relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
    >
      {/* Attribution row */}
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-neutral-100 ring-1 ring-black/5">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={t?.item?.titleOverride || t?.name || "Image"}
              fill
              sizes="48px"
              className="object-cover"
              priority={false}
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-tight truncate">
            {t?.name || "Anonymous"}
          </div>
          <time className="text-xs text-neutral-500">
            {t?.date
              ? new Date(t.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </time>
        </div>
      </div>

      {/* Quote (allow expanding without opening overlay) */}
      <div className="mt-4">
        <details>
          <summary
            className="list-none cursor-pointer text-left"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <p className="text-[15px] leading-relaxed text-neutral-800">
              <span className="mr-1 text-neutral-400">“</span>
              <span className="align-middle">
                {collapsed.isTruncated ? collapsed.text : t?.quote}
              </span>
              <span className="ml-1 text-neutral-400">”</span>
            </p>
            {collapsed.isTruncated ? (
              <span className="mt-2 inline-block rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
                Read full
              </span>
            ) : null}
          </summary>

          {collapsed.isTruncated ? (
            <div
              className="mt-3"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <p className="text-[15px] leading-relaxed text-neutral-800">
                <span className="mr-1 text-neutral-400">“</span>
                <span className="align-middle">{t?.quote}</span>
                <span className="ml-1 text-neutral-400">”</span>
              </p>
            </div>
          ) : null}
        </details>
      </div>
    </article>
  );
}

/* ---------------- Overlay (click outside to close) ---------------- */

function TestimonialOverlay({ t, index, count, onClose, onPrev, onNext }) {
  const dialogRef = React.useRef(null);
  const panelRef = React.useRef(null);

  React.useEffect(() => {
    dialogRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  const photoUrl = t?.item?.image?.asset?.url;

  // inside TestimonialOverlay
  const handleRootClick = (e) => {
    // If click is NOT inside any element marked as a panel, close.
    if (!e.target.closest("[data-overlay-panel]")) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Testimonial details"
      tabIndex={-1}
      ref={dialogRef}
      className="fixed inset-0 z-50 flex md:items-center md:justify-center"
      onClick={handleRootClick} // <-- updated outside click logic
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full md:max-w-6xl p-4 sm:p-6 md:p-8 overflow-y-auto max-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] gap-6 md:gap-8 md:items-start">
          {/* Large image */}
          <div className="relative flex justify-center">
            <div
              data-overlay-panel
              className="relative inline-block bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={t?.item?.titleOverride || "Image"}
                  className="block max-w-full md:max-h-[78vh] max-h-[62vh] object-contain"
                  draggable={false}
                />
              ) : (
                <div className="p-16 text-neutral-400">No image provided.</div>
              )}
            </div>
          </div>

          {/* Details panel */}
          <div className="relative">
            <div
              data-overlay-panel
              className="rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-5 md:p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold truncate">
                    {t?.item?.titleOverride || "Untitled image"}
                  </h2>
                  <p className="text-sm text-neutral-700">
                    {t?.name || "Anonymous"}
                  </p>
                  <time className="block text-xs text-neutral-500">
                    {t?.date
                      ? new Date(t.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </time>
                </div>

                <div className="flex items-center gap-2">
                  {count > 1 ? (
                    <>
                      <button
                        onClick={onPrev}
                        aria-label="Previous"
                        className="rounded-full bg-white px-2 py-1 text-sm shadow hover:bg-neutral-50"
                      >
                        ‹
                      </button>
                      <span className="text-xs text-neutral-600 tabular-nums">
                        {index + 1} / {count}
                      </span>
                      <button
                        onClick={onNext}
                        aria-label="Next"
                        className="rounded-full bg-white px-2 py-1 text-sm shadow hover:bg-neutral-50"
                      >
                        ›
                      </button>
                    </>
                  ) : null}
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="rounded-full px-2 py-0.5 text-sm hover:bg-neutral-50"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Quote */}
              {t?.quote ? (
                <p className="text-[15px] leading-relaxed text-neutral-800">
                  <span className="mr-1 text-neutral-400">“</span>
                  <span className="align-middle">{t.quote}</span>
                  <span className="ml-1 text-neutral-400">”</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Utils ---------------- */

function truncate(str, max = 220) {
  const s = String(str || "");
  if (s.length <= max) return { text: s, isTruncated: false };
  const cut = s.slice(0, max).replace(/\s+\S*$/, "");
  return { text: `${cut}…`, isTruncated: true };
}
