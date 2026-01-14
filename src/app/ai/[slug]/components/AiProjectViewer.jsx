"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
// Import your existing lightbox
import LightboxOverlay from "@/app/collections/components/LightboxOverlay";

// Helper for Sanity Image resizing
function getOptimizedUrl(url, width = 1600) {
  if (!url?.includes("cdn.sanity.io")) return url;
  return `${url}?w=${width}&auto=format`;
}

export default function AiProjectViewer({ project, nextSlug, prevSlug }) {
  const router = useRouter();
  const { title, description, originals = [], generated = [] } = project;

  // --- LIGHTBOX STATE ---
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // 1. Unify all images into one array for the lightbox
  const galleryPhotos = useMemo(() => {
    // Format Originals
    const origs = originals.map((img) => ({
      url: img?.asset?.url,
      alt: "Original Source", // Or img.alt if exists
      // Pass extra data if your Lightbox supports it, or generic title
      title: "Original Source",
    }));

    // Format AI Images
    const gens = generated.map((img) => ({
      url: img?.asset?.url,
      alt: "AI Generated",
      title: "AI Interpretation",
    }));

    return [...origs, ...gens];
  }, [originals, generated]);

  // 2. Click Handlers
  const handleOriginalClick = (localIndex) => {
    setIndex(localIndex); // Originals start at 0
    setOpen(true);
  };

  const handleAiClick = (localIndex) => {
    // AI images start AFTER the originals
    setIndex(originals.length + localIndex);
    setOpen(true);
  };

  // Keyboard Navigation for Project (Next/Prev Page)
  useEffect(() => {
    const handleKey = (e) => {
      // Only navigate projects if Lightbox is CLOSED
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
        {/* TOP HEADER */}
        <div className="mb-12 space-y-6">
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

        <div className="space-y-16">
          {/* ORIGINALS SECTION */}
          <ImageSection
            title="Original Source"
            images={originals}
            badgeText="Real Photograph"
            badgeClasses="bg-white/90 text-black"
            onImageClick={handleOriginalClick} // Pass handler
          />

          {/* Visual Connector */}
          <div className="flex items-center gap-4 justify-center opacity-20">
            <div className="h-12 w-px bg-black" />
            <span className="text-2xl">↓</span>
            <div className="h-12 w-px bg-black" />
          </div>

          {/* AI GENERATED SECTION */}
          <ImageSection
            title="AI Interpretation"
            images={generated}
            badgeText="AI Generated"
            badgeClasses="bg-purple-600/90 text-white"
            onImageClick={handleAiClick} // Pass handler
          />
        </div>

        {/* BOTTOM NAV */}
        <div className="mt-20 pt-10 border-t border-gray-200 flex items-center justify-between">
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

      {/* --- LIGHTBOX COMPONENT --- */}
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

// --- REUSABLE SECTION COMPONENT ---
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
      <div className="flex items-center gap-3 mb-6">
        <span
          className={`h-2 w-2 rounded-full ${badgeClasses.includes("bg-white") ? "bg-black" : badgeClasses.split(" ")[0]}`}
        />
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
          {title}
        </h2>
      </div>

      <div
        className={`grid gap-6 ${
          images.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            // Added onClick and cursor-pointer
            onClick={() => onImageClick(idx)}
            className="relative group bg-gray-50 rounded-2xl overflow-hidden border border-black/5 cursor-zoom-in active:scale-[0.99] transition-transform"
          >
            {img?.asset?.url && (
              <>
                <Image
                  src={getOptimizedUrl(img.asset.url)}
                  alt={`${title} ${idx + 1}`}
                  width={1600}
                  height={1200}
                  className="w-full h-auto object-contain"
                  style={{ width: "100%", height: "auto" }}
                />

                {/* Badge */}
                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                  <span
                    className={`${badgeClasses} text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm`}
                  >
                    {badgeText}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
