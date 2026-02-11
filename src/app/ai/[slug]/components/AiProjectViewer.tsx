"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import BackButton from "@/components/BackButton";
import LightboxOverlay from "@/app/collections/components/LightboxOverlay";

interface GalleryPhoto {
  url: string;
  alt: string;
  title: string;
}

interface ProjectData {
  _id: string;
  title: string;
  description?: string;
  originals: Array<{ asset: { url: string } }>;
  generated: Array<{ asset: { url: string } }>;
  aiVideos: Array<{
    _key: string;
    asset: {
      playbackId: string;
    };
  }> | null;
}

function getOptimizedUrl(url: string, width = 1600) {
  if (!url?.includes("cdn.sanity.io")) return url;
  return `${url}?w=${width}&auto=format`;
}

export default function AiProjectViewer({
  project,
  nextSlug,
  prevSlug,
}: {
  project: ProjectData;
  nextSlug?: string;
  prevSlug?: string;
}) {
  const router = useRouter();

  const {
    title,
    description,
    originals = [],
    generated = [],
    aiVideos = [],
  } = project;

  const hasVideos = Array.isArray(aiVideos) && aiVideos.length > 0;

  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const galleryPhotos = useMemo<GalleryPhoto[]>(() => {
    const origs = (originals || []).map((img) => ({
      url: img?.asset?.url || "",
      alt: "Original Source",
      title: "Original Source",
    }));
    const gens = (generated || []).map((img) => ({
      url: img?.asset?.url || "",
      alt: "AI Generated",
      title: "AI Interpretation",
    }));
    return [...origs, ...gens];
  }, [originals, generated]);

  const handleOriginalClick = (localIndex: number) => {
    setIndex(localIndex);
    setOpen(true);
  };

  const handleAiClick = (localIndex: number) => {
    setIndex((originals?.length || 0) + localIndex);
    setOpen(true);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (open) return;
      if (e.key === "ArrowRight" && nextSlug) router.push(`/ai/${nextSlug}`);
      if (e.key === "ArrowLeft" && prevSlug) router.push(`/ai/${prevSlug}`);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlug, prevSlug, router, open]);

  return (
    <>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-black">
        {/* HEADER */}
        <div className="max-w-5xl mx-auto mb-12 space-y-6">
          <div className="flex items-center justify-between">
            <BackButton>Back to Grid</BackButton>
            <div className="hidden md:flex gap-4 text-sm font-medium">
              {prevSlug && <Link href={`/ai/${prevSlug}`}>← Previous</Link>}
              {nextSlug && <Link href={`/ai/${nextSlug}`}>Next →</Link>}
            </div>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
            {description && (
              <p className="text-lg text-gray-600">{description}</p>
            )}
          </div>
        </div>

        {/* ORIGINALS SECTION */}
        <div className="mb-20 border-b border-gray-100 pb-16">
          <ImageSection
            title="Original Source"
            images={originals}
            badgeText="Real Photograph"
            badgeClasses="bg-white/90 text-black"
            onImageClick={handleOriginalClick}
          />
        </div>

        {/* LOGIC: Show Tabs IF videos exist, OTHERWISE just show images */}
        {hasVideos ? (
          <div>
            <div className="flex justify-center gap-8 mb-12 border-b border-gray-100 max-w-5xl mx-auto">
              <button
                onClick={() => setActiveTab("images")}
                className={`pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                  activeTab === "images"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400"
                }`}
              >
                AI Images
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                  activeTab === "videos"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400"
                }`}
              >
                AI Videos
              </button>
            </div>

            <div className="min-h-[50vh]">
              {activeTab === "images" ? (
                <ImageSection
                  title="AI Interpretation"
                  images={generated}
                  badgeText="AI Generated"
                  badgeClasses="bg-purple-600 text-white"
                  onImageClick={handleAiClick}
                  hideTitle
                />
              ) : (
                <VideoSection videos={aiVideos} />
              )}
            </div>
          </div>
        ) : (
          <div className="mt-16 pt-8">
            <ImageSection
              title="AI Interpretation"
              images={generated}
              badgeText="AI Generated"
              badgeClasses="bg-purple-600 text-white"
              onImageClick={handleAiClick}
            />
          </div>
        )}
      </div>

      <LightboxOverlay
        open={open}
        photos={galleryPhotos}
        index={index}
        setIndex={setIndex}
        onClose={() => setOpen(false)}
        meta={{ title }}
      />
    </>
  );
}

// --- SUB COMPONENTS ---

function VideoSection({ videos }: { videos: ProjectData["aiVideos"] }) {
  if (!videos || videos.length === 0) return null;

  // Logic: If 2 or 4 videos, use a symmetrical 2-column layout to prevent dangling items or empty columns.
  const isBalancedEven = videos.length === 2 || videos.length === 4;
  
  const containerClass = isBalancedEven
    ? "max-w-5xl grid-cols-1 md:grid-cols-2" // 2 or 4 items -> 2 columns (Balanced)
    : "max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"; // 3, 5+ items -> Standard 3 columns

  return (
    <div className={`grid gap-8 mx-auto ${containerClass}`}>
      {videos.map((v) => (
        <div
          key={v._key}
          className="rounded-2xl overflow-hidden bg-black shadow-xl"
        >
          <MuxPlayer
            playbackId={v.asset?.playbackId}
            streamType="on-demand"
            primaryColor="#FFFFFF"
            className="w-full"
            style={{
              aspectRatio: "9 / 16",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function ImageSection({
  title,
  images,
  badgeText,
  badgeClasses,
  onImageClick,
  hideTitle = false,
}: any) {
  if (!images || images.length === 0) return null;

  // 1. Single Image Logic
  if (images.length === 1) {
    return (
      <section>
        {!hideTitle && <SectionHeader title={title} />}
        <div className="flex justify-center">
          <div
            onClick={() => onImageClick(0)}
            className="relative cursor-zoom-in group overflow-hidden rounded-2xl border border-black/5 inline-block"
          >
            <Image
              src={getOptimizedUrl(images[0].asset.url)}
              alt={title}
              width={1600}
              height={1200}
              className="w-auto h-auto max-h-[80vh] max-w-full object-contain"
            />
            <Badge text={badgeText} classes={badgeClasses} />
          </div>
        </div>
      </section>
    );
  }

  // 2. Dynamic Grid Logic
  // - If 2 images: 2-col grid (2 side by side)
  // - If 4 images: 2-col grid (2x2 square) - This fixes the "off center" look of 3 columns
  // - Else (3, 5, 6...): 3-col grid
  const isBalancedEven = images.length === 2 || images.length === 4;

  const containerClasses = isBalancedEven
    ? "max-w-5xl grid-cols-1 md:grid-cols-2" // Forces symmetry for 2 and 4
    : "max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3"; // Standard grid

  return (
    <section>
      {!hideTitle && <SectionHeader title={title} />}
      {/* Changed from 'columns-' (masonry) to 'grid' to ensure consistent row filling */}
      <div className={`grid gap-6 mx-auto ${containerClasses}`}>
        {images.map((img: any, idx: number) => (
          <div
            key={idx}
            onClick={() => onImageClick(idx)}
            className="relative cursor-zoom-in group overflow-hidden rounded-2xl border border-black/5"
          >
            <Image
              src={getOptimizedUrl(img.asset.url)}
              alt={title}
              width={1600}
              height={1200}
              className="w-full h-auto object-cover aspect-[3/4]" // Added aspect-ratio to keep grid cells even
            />
            <Badge text={badgeText} classes={badgeClasses} />
          </div>
        ))}
      </div>
    </section>
  );
}

const SectionHeader = ({ title }: { title: string }) => (
  <div className="max-w-5xl mx-auto mb-8 flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full bg-black" />
    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
      {title}
    </h2>
  </div>
);

const Badge = ({ text, classes }: { text: string; classes: string }) => (
  <div className="absolute top-4 right-4 z-10">
    <span
      className={`${classes} text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-md shadow-sm`}
    >
      {text}
    </span>
  </div>
);
