// app/ai/[slug]/AiProjectViewer.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import LightboxOverlay from "@/app/collections/components/LightboxOverlay";

function getOptimizedUrl(url, width = 1600) {
  if (!url?.includes("cdn.sanity.io")) return url;
  return `${url}?w=${width}&auto=format`;
}

export default function AiProjectViewer({ project, nextSlug, prevSlug }) {
  const router = useRouter();
  const { title, description, originals = [], generated = [] } = project;

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const galleryPhotos = useMemo(() => {
    const origs = originals.map((img) => ({
      url: img?.asset?.url,
      alt: "Original Source",
      title: "Original Source",
    }));

    const gens = generated.map((img) => ({
      url: img?.asset?.url,
      alt: "AI Generated",
      title: "AI Interpretation",
    }));

    return [...origs, ...gens];
  }, [originals, generated]);

  const handleOriginalClick = (localIndex) => {
    setIndex(localIndex);
    setOpen(true);
  };

  const handleAiClick = (localIndex) => {
    setIndex(originals.length + localIndex);
    setOpen(true);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (open) return;
      if (e.key === "ArrowRight" && nextSlug) router.push(`/ai/${nextSlug}`);
      if (e.key === "ArrowLeft" && prevSlug) router.push(`/ai/${prevSlug}`);
      if (e.key === "Escape") router.push("/ai");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlug, prevSlug, router, open]);

  return (
    <>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* HEADER */}
        <div className="max-w-5xl mx-auto mb-12 space-y-6">
          <div className="flex items-center justify-between">
            <BackButton>Back to Grid</BackButton>

            <div className="hidden md:flex gap-4 text-sm font-medium">
              {prevSlug && (
                <Link
                  href={`/ai/${prevSlug}`}
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  ← Previous
                </Link>
              )}
              {nextSlug && (
                <Link
                  href={`/ai/${nextSlug}`}
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
            {description && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-16">
          <ImageSection
            title="Original Source"
            images={originals}
            badgeText="Real Photograph"
            badgeClasses="bg-white/90 text-black"
            onImageClick={handleOriginalClick}
          />

          <div className="flex items-center gap-4 justify-center opacity-20">
            <div className="h-12 w-px bg-black" />
            <span className="text-2xl">↓</span>
            <div className="h-12 w-px bg-black" />
          </div>

          <ImageSection
            title="AI Interpretation"
            images={generated}
            badgeText="AI Generated"
            badgeClasses="bg-purple-600/90 text-white"
            onImageClick={handleAiClick}
          />
        </div>

        {/* FOOTER */}
        <div className="max-w-5xl mx-auto mt-20 pt-10 border-t border-gray-200 flex items-center justify-between">
          {prevSlug ? (
            <Link href={`/ai/${prevSlug}`} className="group flex flex-col">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                Previous
              </span>
              <span className="text-lg font-medium group-hover:underline">
                ← Go Back
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextSlug ? (
            <Link
              href={`/ai/${nextSlug}`}
              className="group flex flex-col items-end"
            >
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                Next Project
              </span>
              <span className="text-lg font-medium group-hover:underline">
                View Next →
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      <LightboxOverlay
        open={open}
        photos={galleryPhotos}
        index={index}
        setIndex={setIndex}
        onClose={() => setOpen(false)}
        meta={{ title: title }}
      />
    </>
  );
}

// --- MASONRY IMAGE SECTION ---
function ImageSection({
  title,
  images,
  badgeText,
  badgeClasses,
  onImageClick,
}) {
  if (!images || images.length === 0) return null;

  return (
    <section>
      <div className="max-w-5xl mx-auto flex items-center gap-3 mb-6">
        <span
          className={`h-2 w-2 rounded-full ${badgeClasses.includes("bg-white") ? "bg-black" : badgeClasses.split(" ")[0]}`}
        />
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
          {title}
        </h2>
      </div>

      {/* --- CASE 1: SINGLE IMAGE --- 
          We center it and limit the height so it doesn't get huge.
      */}
      {images.length === 1 && (
        <div className="flex justify-center">
          <div
            onClick={() => onImageClick(0)}
            className="relative inline-block cursor-zoom-in group overflow-hidden rounded-2xl border border-black/5"
          >
            {images[0]?.asset?.url && (
              <>
                <Image
                  src={getOptimizedUrl(images[0].asset.url)}
                  alt={`${title} 1`}
                  width={1600}
                  height={1200}
                  className="w-auto h-auto object-contain transition-transform active:scale-[0.99]"
                  // This constraint stops the "humongous" single image issue
                  style={{ maxWidth: "100%", maxHeight: "80vh" }}
                />
                <Badge text={badgeText} classes={badgeClasses} />
              </>
            )}
          </div>
        </div>
      )}

      {/* --- CASE 2: MULTIPLE IMAGES (MASONRY) --- 
          We use CSS columns to pack them tightly without margins.
      */}
      {images.length > 1 && (
        <div className="mx-auto max-w-[1800px] columns-1 md:columns-2 gap-6 space-y-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => onImageClick(idx)}
              // 'break-inside-avoid' keeps the image whole
              className="relative break-inside-avoid cursor-zoom-in group overflow-hidden rounded-2xl border border-black/5 active:scale-[0.99] transition-transform"
            >
              {img?.asset?.url && (
                <>
                  <Image
                    src={getOptimizedUrl(img.asset.url)}
                    alt={`${title} ${idx + 1}`}
                    width={1600}
                    height={1200}
                    // w-full makes it fill the column width perfectly
                    className="w-full h-auto object-cover"
                  />
                  <Badge text={badgeText} classes={badgeClasses} />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Helper for the badge to keep code clean
function Badge({ text, classes }) {
  return (
    <div className="absolute top-4 right-4 z-10 pointer-events-none">
      <span
        className={`${classes} text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm`}
      >
        {text}
      </span>
    </div>
  );
}
