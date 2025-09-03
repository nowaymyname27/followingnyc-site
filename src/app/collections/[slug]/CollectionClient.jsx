// app/collections/[slug]/CollectionClient.jsx
"use client";
import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import PhotoMasonry from "../components/PhotoMasonry";
import LightboxOverlay from "../components/LightboxOverlay";

function formatPlainDate(dateStr) {
  if (!dateStr) return "";
  // dateStr like "2025-09-03" -> local Date at midnight *without* TZ shift
  const [y, m, d] = dateStr.split("-").map((n) => parseInt(n, 10));
  const dt = new Date(y, m - 1, d); // local time
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CollectionClient({ collection }) {
  const { title, year, date, items = [] } = collection || {};

  const photos = useMemo(
    () =>
      (items || []).map((i, idx) => ({
        id: i._key ?? `${idx}`,
        url: i.url,
        alt: i.alt || "Photo",
        title: i.title ?? null,
        description: i.description ?? "",
        capturedAt: i.capturedAt ?? null,
        tags: i.tags || [],
      })),
    [items]
  );

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const openAt = useCallback((i) => {
    setIdx(i);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const total = photos.length;
  const indexLabel = useMemo(
    () =>
      `${String(idx + 1).padStart(3, "0")} / ${String(total).padStart(3, "0")}`,
    [idx, total]
  );

  return (
    <div className="min-h-screen bg-background text-black">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-3">
          <Link
            href="/collections"
            className="bg-white inline-flex items-center gap-2 rounded-full border border-black/20 px-3 py-1 text-sm text-black hover:bg-black/5"
          >
            <span aria-hidden>←</span>
            <span>Back to Collections</span>
          </Link>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-5xl sm:text-6xl font-semibold leading-none">
              {title}
            </div>

            {/* Use our formatter (falls back to year if no date) */}
            {date ? (
              <div className="mt-1 text-sm text-black/60">
                {formatPlainDate(date)}
              </div>
            ) : year ? (
              <div className="mt-1 text-sm text-black/60">{year}</div>
            ) : null}
          </div>

          <div className="text-sm text-black/60">
            {total} photo{total === 1 ? "" : "s"}
            {total > 0 ? (
              <span className="ml-2 text-black/40">({indexLabel})</span>
            ) : null}
          </div>
        </div>
      </header>

      {/* Masonry stream */}
      <main className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-10 pb-12">
        <PhotoMasonry photos={photos} onOpen={openAt} />
      </main>

      {/* Lightbox */}
      <LightboxOverlay
        open={open}
        photos={photos}
        index={idx}
        setIndex={setIdx}
        onClose={close}
        // if you want the date in the overlay as well, pass it here:
        // meta={{ title, date }}
        meta={{ title, year }}
      />
    </div>
  );
}
