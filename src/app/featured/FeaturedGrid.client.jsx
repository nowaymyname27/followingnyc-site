// app/news/FeaturedGrid.client.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * items[] shape (from FeaturedSection query):
 * {
 *   _id, title, photoUrl, photoAlt, links[], note
 * }
 */

export default function FeaturedGrid({ items = [] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const openOverlay = (feature) => {
    setActive(feature);
    setOpen(true);
  };
  const closeOverlay = () => {
    setOpen(false);
    setActive(null);
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length ? (
          items.map((f) => (
            <FeatureCard
              key={f._id}
              feature={f}
              onOpen={() => openOverlay(f)}
            />
          ))
        ) : (
          <p className="text-neutral-500 col-span-full">No features yet.</p>
        )}
      </div>

      {open && active ? (
        <SimpleFeatureOverlay feature={active} onClose={closeOverlay} />
      ) : null}
    </>
  );
}

function FeatureCard({ feature, onOpen }) {
  const photoUrl = feature?.photoUrl || "";
  const titleText = feature?.title || "Featured";
  const imgAlt = feature?.photoAlt || titleText;

  const links = Array.isArray(feature?.links)
    ? feature.links.filter((l) => l?.url)
    : [];

  const primaryUrl = links[0]?.url || null;

  return (
    <article
      className={[
        "group relative w-full overflow-hidden rounded-2xl",
        "border border-neutral-200 bg-white shadow-sm hover:shadow-md",
        "focus-within:ring-2 focus-within:ring-black/10",
      ].join(" ")}
    >
      {/* Media (opens overlay) */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Preview: ${titleText}`}
        className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-neutral-100"
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={imgAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-neutral-400">
            No image
          </div>
        )}
      </button>

      {/* Content (title + links + note) */}
      <div className="px-4 sm:px-5 py-3">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900">
          {primaryUrl ? (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {titleText}
            </a>
          ) : (
            titleText
          )}
        </h3>

        <div className="mt-2">
          {links.length > 0 ? (
            <LinksChips links={links} />
          ) : (
            <span className="text-xs text-neutral-500">No links provided</span>
          )}
        </div>

        {feature?.note ? (
          <p className="mt-3 text-xs leading-relaxed text-neutral-600 line-clamp-3">
            {feature.note}
          </p>
        ) : null}
      </div>
    </article>
  );
}

/* ---------------- Simple Overlay ---------------- */

function SimpleFeatureOverlay({ feature, onClose }) {
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

  const photoUrl = feature?.photoUrl || "";
  const titleText = feature?.title || "Featured";
  const imgAlt = feature?.photoAlt || titleText;
  const links = Array.isArray(feature?.links)
    ? feature.links.filter((l) => l?.url)
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Feature preview"
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
          {/* Image */}
          <div className="relative bg-neutral-50 min-h-[40vh] md:min-h-[60vh] p-4 flex items-center justify-center">
            {photoUrl ? (
              // Use plain img to avoid layout jumps in modal
              <img
                src={photoUrl}
                alt={imgAlt}
                className="max-h-[78vh] md:max-h-[72vh] w-auto object-contain"
                draggable={false}
              />
            ) : (
              <div className="text-neutral-400">No image</div>
            )}
          </div>

          {/* Side panel: title + links */}
          <aside className="p-5 md:p-6 border-t md:border-t-0 md:border-l border-neutral-200">
            <h2 className="text-lg md:text-xl font-semibold text-neutral-900">
              {titleText}
            </h2>

            {links.length > 0 ? (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-neutral-700">Links</h3>
                <div className="flex flex-wrap gap-2">
                  {links.map((l, i) => (
                    <a
                      key={`ol-${i}`}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-800 ring-1 ring-black/10 hover:bg-white"
                      aria-label={`Open ${safeHost(l.url)}`}
                    >
                      {safeHost(l.url)}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-xs text-neutral-500">No links provided</p>
            )}

            {feature?.note ? (
              <p className="mt-4 text-sm leading-relaxed text-neutral-700">
                {feature.note}
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Links chips (on card) ---------------- */

function LinksChips({ links }) {
  const visible = links.slice(0, 3);
  const hidden = links.slice(3);

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((l, i) => (
        <a
          key={`vis-${i}`}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-800 ring-1 ring-black/10 hover:bg-white"
          aria-label={`Open ${safeHost(l.url)}`}
        >
          {safeHost(l.url)}
        </a>
      ))}

      {hidden.length > 0 ? (
        <details className="inline-block">
          <summary className="list-none inline-flex cursor-pointer select-none items-center rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-white">
            More ({hidden.length})
          </summary>
          <div className="mt-2 flex flex-wrap gap-2">
            {hidden.map((l, i) => (
              <a
                key={`hid-${i}`}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-800 ring-1 ring-black/10 hover:bg-white"
                aria-label={`Open ${safeHost(l.url)}`}
              >
                {safeHost(l.url)}
              </a>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

/* ---------------- Utils ---------------- */

function safeHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
