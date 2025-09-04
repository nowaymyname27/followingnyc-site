// app/news/TestimonialsGrid.client.jsx
"use client";

import { useEffect, useRef, useState, memo } from "react";
import Image from "next/image";

/**
 * items[] shape (from TestimonialsSection query):
 * {
 *   _id,
 *   quote,
 *   name,
 *   date,                // ISO string
 *   photoUrl,            // image url
 *   photoAlt,            // alt from schema
 *   photoTitle           // optional display title for the photo
 * }
 */

export default function TestimonialsGrid({ items = [] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const openOverlay = (t) => {
    setActive(t);
    setOpen(true);
  };
  const closeOverlay = () => {
    setOpen(false);
    setActive(null);
  };

  return (
    <>
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        {items.length ? (
          items.map((t) => (
            <TestimonialCard
              key={t._id}
              t={t}
              onOpenImage={() => openOverlay(t)}
            />
          ))
        ) : (
          <p className="text-neutral-500">No testimonials yet.</p>
        )}
      </div>

      {open && active ? (
        <SimpleTestimonialOverlay t={active} onClose={closeOverlay} />
      ) : null}
    </>
  );
}

/* ---------------- Card (image opens overlay) ---------------- */

const TestimonialCard = memo(function TestimonialCard({ t, onOpenImage }) {
  const [expanded, setExpanded] = useState(false);

  const imgUrl = t?.photoUrl || "";
  const imgAlt = t?.photoAlt || t?.name || "Photo";
  const titleText = t?.photoTitle || ""; // optional context about the photo

  const dateStr = formatDate(t?.date);
  const quote = String(t?.quote || "");
  const maxChars = 220;
  const isTruncated = quote.length > maxChars;
  const preview = isTruncated ? truncate(quote, maxChars) : quote;

  return (
    <article className="relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Image preview (click to open overlay) */}
      {imgUrl ? (
        <button
          type="button"
          onClick={onOpenImage}
          aria-label={`Preview image for ${t?.name || "testimonial"}`}
          className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-neutral-100"
        >
          <Image
            src={imgUrl}
            alt={imgAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 hover:scale-[1.02]"
          />
        </button>
      ) : null}

      {/* Name + date (placed ABOVE the testimonial text, after the picture) */}
      <div className={imgUrl ? "mt-4" : ""}>
        <div className="text-sm font-semibold leading-tight truncate">
          {t?.name || "Anonymous"}
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {dateStr && <time>{dateStr}</time>}
          {titleText && (
            <>
              <span aria-hidden="true">•</span>
              <span className="truncate">{titleText}</span>
            </>
          )}
        </div>
      </div>

      {/* Quote with inline expand (no modal) */}
      <figure className="mt-3">
        <blockquote className="relative">
          <p className="text-[15px] leading-relaxed text-neutral-800">
            <span className="mr-1 text-neutral-400">“</span>
            <span className="align-middle">{expanded ? quote : preview}</span>
            <span className="ml-1 text-neutral-400">”</span>
          </p>
        </blockquote>
        <figcaption className="sr-only">
          Testimonial by {t?.name || "Anonymous"}
        </figcaption>
      </figure>

      {isTruncated && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setExpanded((s) => !s)}
            className="inline-flex items-center rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-white"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Read full"}
          </button>
        </div>
      )}
    </article>
  );
});

/* ---------------- Simple Overlay ---------------- */

function SimpleTestimonialOverlay({ t, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleRootClick = (e) => {
    if (!e.target.closest("[data-overlay-panel]")) onClose();
  };

  const imgUrl = t?.photoUrl || "";
  const imgAlt = t?.photoAlt || t?.name || "Photo";
  const name = t?.name || "Anonymous";
  const dateStr = formatDate(t?.date);
  const titleText = t?.photoTitle || "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Testimonial preview"
      tabIndex={-1}
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center"
      onClick={handleRootClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        data-overlay-panel
        className="relative z-10 w-full max-w-6xl mx-4 my-6 md:my-10 rounded-2xl bg-white shadow-[0_16px_60px_rgba(0,0,0,0.35)] overflow-hidden"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-sm text-neutral-700 hover:bg-neutral-100 z-10"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px] gap-0 md:gap-6">
          {/* Large image */}
          <div className="relative bg-neutral-50 min-h-[40vh] md:min-h-[60vh] p-4 flex items-center justify-center">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={imgAlt}
                className="max-h-[78vh] md:max-h-[72vh] w-auto object-contain"
                draggable={false}
              />
            ) : (
              <div className="text-neutral-400">No image</div>
            )}
          </div>

          {/* Side panel: testimonial details */}
          <aside className="p-5 md:p-6 border-t md:border-t-0 md:border-l border-neutral-200">
            <div className="mb-3">
              <h2 className="text-lg md:text-xl font-semibold text-neutral-900">
                {name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                {dateStr && <time>{dateStr}</time>}
                {titleText && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span className="truncate">{titleText}</span>
                  </>
                )}
              </div>
            </div>

            {t?.quote ? (
              <blockquote className="mt-2">
                <p className="text-[15px] leading-relaxed text-neutral-800">
                  <span className="mr-1 text-neutral-400">“</span>
                  <span className="align-middle">{t.quote}</span>
                  <span className="ml-1 text-neutral-400">”</span>
                </p>
              </blockquote>
            ) : (
              <p className="text-sm text-neutral-500">
                No testimonial provided.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Utils ---------------- */

function truncate(str, max = 220) {
  const s = String(str || "");
  if (s.length <= max) return s;
  return s.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
