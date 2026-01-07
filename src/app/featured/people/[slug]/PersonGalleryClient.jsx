// app/featured/people/[slug]/PersonGalleryClient.jsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
// Adjust this import path to where you saved the LightboxOverlay earlier
// likely "@/app/collections/components/LightboxOverlay" or "@/components/LightboxOverlay"
import LightboxOverlay from "@/app/collections/components/LightboxOverlay";

export default function PersonGalleryClient({ photos = [], name }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  // Normalize data for the Lightbox
  // The lightbox expects: { url, alt, width, height, ... }
  const galleryPhotos = useMemo(() => {
    return photos.map((ph) => ({
      url: ph?.asset?.url,
      // Pass the specific alt text from Sanity
      alt: ph?.alt || name || "Person photo",
      width: ph?.asset?.metadata?.dimensions?.width,
      height: ph?.asset?.metadata?.dimensions?.height,
    }));
  }, [photos, name]);

  const handleOpen = (i) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Photos</h2>

        <div className="columns-2 md:columns-3 xl:columns-4 gap-4">
          {galleryPhotos.map((photo, idx) => (
            <div
              key={photo.url ?? idx}
              className="relative mb-4 break-inside-avoid overflow-hidden rounded-xl bg-surface group cursor-pointer"
              onClick={() => handleOpen(idx)}
            >
              {photo.url && (
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  width={photo.width || 800}
                  height={photo.height || 600}
                  className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] group-hover:opacity-90"
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Re-using your existing Lightbox Overlay */}
      <LightboxOverlay
        open={open}
        photos={galleryPhotos}
        index={index}
        setIndex={setIndex}
        onClose={() => setOpen(false)}
        meta={{ title: name }} // This puts the Person's Name in the lightbox header
      />
    </>
  );
}
