// app/news/FeaturedGrid.client.jsx
"use client";

import * as React from "react";
import Image from "next/image";

/* ---------------- Grid ---------------- */

export default function FeaturedGrid({ items }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items?.length ? (
        <Tiles items={items} />
      ) : (
        <p className="text-neutral-500 col-span-full">No features yet.</p>
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
      {items.map((f, i) => (
        <FeatureTile key={f._id} feature={f} onOpen={() => onOpen(i)} />
      ))}
      {open && items.length > 0 ? (
        <FeatureOverlay
          feature={items[idx]}
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

/* ---------------- Tile (click to open) ---------------- */

function FeatureTile({ feature, onOpen }) {
  const photoUrl = feature?.item?.image?.asset?.url;
  const logoUrl = feature?.cover?.asset?.url;
  const links = Array.isArray(feature?.links) ? feature.links : [];
  const visible = links.slice(0, 3);
  const hidden = links.slice(3);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={[
        "group relative block w-full overflow-hidden rounded-2xl text-left",
        "border border-neutral-200 bg-white shadow-sm hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-black/10",
      ].join(" ")}
      aria-label={`Open feature ${feature?.title || "Untitled"}`}
    >
      {/* Featured photo */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-neutral-100">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={feature?.item?.titleOverride || feature?.title || "Featured"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-neutral-400">
            No image
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Bottom overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white/70 ring-1 ring-black/10">
              <Image
                src={logoUrl}
                alt="Outlet logo"
                fill
                className="object-contain p-1.5"
                sizes="40px"
              />
            </div>
          ) : null}
          <h3 className="min-w-0 text-white text-base sm:text-lg font-semibold tracking-tight drop-shadow">
            <span className="line-clamp-2">{feature?.title || "Untitled"}</span>
          </h3>
        </div>

        {/* Link preview */}
        {links.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {visible.map((l, i) => (
              <span
                key={`${feature._id}-vis-${i}`}
                className="inline-flex items-center rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-xs font-medium text-neutral-800 ring-1 ring-black/10"
              >
                {safeHost(l.url)}
              </span>
            ))}
            {hidden.length > 0 ? (
              <span className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-neutral-700 ring-1 ring-black/10">
                +{hidden.length} more
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </button>
  );
}

/* ---------------- Overlay ---------------- */

function FeatureOverlay({ feature, index, count, onClose, onPrev, onNext }) {
  const dialogRef = React.useRef(null);

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

  const logoUrl = feature?.cover?.asset?.url;
  const photoUrl = feature?.item?.image?.asset?.url;
  const links = Array.isArray(feature?.links) ? feature.links : [];

  const handleRootClick = (e) => {
    if (!e.target.closest("[data-overlay-panel]")) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Feature details"
      tabIndex={-1}
      ref={dialogRef}
      className="fixed inset-0 z-50 flex md:items-center md:justify-center"
      onClick={handleRootClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full md:max-w-6xl p-4 sm:p-6 md:p-8 overflow-y-auto max-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] gap-6 md:gap-8 md:items-start">
          {/* Image */}
          <div className="relative flex justify-center">
            <div
              data-overlay-panel
              className="relative inline-block bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={
                    feature?.item?.titleOverride || feature?.title || "Featured"
                  }
                  className="block max-w-full md:max-h-[78vh] max-h-[62vh] object-contain"
                  draggable={false}
                />
              ) : (
                <div className="p-16 text-neutral-400">No image provided.</div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="relative">
            <div
              data-overlay-panel
              className="rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-5 md:p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  {logoUrl ? (
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-black/10">
                      <Image
                        src={logoUrl}
                        alt="Outlet logo"
                        fill
                        className="object-contain p-1.5"
                        sizes="40px"
                      />
                    </span>
                  ) : null}
                  <h2 className="text-lg font-semibold truncate">
                    {feature?.title || "Untitled feature"}
                  </h2>
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

              {/* Title override */}
              {feature?.item?.titleOverride ? (
                <p className="text-sm text-neutral-700 mb-3">
                  {feature.item.titleOverride}
                </p>
              ) : null}

              {/* Links */}
              {links.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-neutral-700 mb-2">
                    Links
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {links.map((l, i) => (
                      <a
                        key={`link-${i}`}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-neutral-800 ring-1 ring-black/10 hover:bg-white"
                      >
                        {safeHost(l.url)}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
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
