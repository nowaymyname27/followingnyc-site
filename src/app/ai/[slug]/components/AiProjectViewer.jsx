"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

function getOptimizedUrl(url) {
  if (!url?.includes("cdn.sanity.io")) return url;
  return `${url}?w=2000&fit=max&auto=format`;
}

export default function AiProjectViewer({ project, nextSlug, prevSlug }) {
  const [mode, setMode] = useState("ai"); // 'ai' or 'original'
  const router = useRouter();

  const activeImages = mode === "ai" ? project.generated : project.originals;

  // Keyboard Navigation for Next/Prev Project
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" && nextSlug) router.push(`/ai/${nextSlug}`);
      if (e.key === "ArrowLeft" && prevSlug) router.push(`/ai/${prevSlug}`);
      if (e.key === "Escape") router.push("/ai");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlug, prevSlug, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <BackButton>Back to Grid</BackButton>

        {/* TOGGLE */}
        <div className="flex items-center bg-gray-100 rounded-full p-1 border border-black/5">
          <button
            onClick={() => setMode("original")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              mode === "original"
                ? "bg-white shadow text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Originals
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              mode === "ai"
                ? "bg-purple-600 shadow text-white"
                : "text-gray-500 hover:text-black"
            }`}
          >
            AI Generated
          </button>
        </div>

        {/* Placeholder for spacing alignment */}
        <div className="hidden md:block w-32" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
        {/* IMAGE VIEWER */}
        <div className="relative group bg-gray-50 rounded-2xl overflow-hidden border border-black/5 aspect-[4/3] flex items-center justify-center">
          {activeImages && activeImages.length > 0 ? (
            <Image
              key={activeImages[0].asset.url + mode}
              src={getOptimizedUrl(activeImages[0].asset.url)}
              alt={project.title}
              width={2000}
              height={1500}
              className="w-full h-full object-contain drop-shadow-xl"
              priority
            />
          ) : (
            <div className="text-gray-400 italic">No image available</div>
          )}

          {/* HOVER ARROWS (Using Links now) */}
          {prevSlug && (
            <Link
              href={`/ai/${prevSlug}`}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 text-black"
              title="Previous Project"
            >
              ←
            </Link>
          )}
          {nextSlug && (
            <Link
              href={`/ai/${nextSlug}`}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 text-black"
              title="Next Project"
            >
              →
            </Link>
          )}
        </div>

        {/* SIDEBAR INFO */}
        <div className="space-y-6 lg:mt-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {project.title}
            </h1>
            <div className="h-1 w-20 bg-black/10 rounded-full" />
          </div>

          <div className="prose prose-sm text-gray-600">
            {project.description ? (
              <p>{project.description}</p>
            ) : (
              <p className="italic opacity-50">No description provided.</p>
            )}
          </div>

          <div className="pt-6 border-t border-black/10">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Viewing
            </span>
            <p className="text-lg font-medium">
              {mode === "ai" ? "✨ AI Generated" : "📷 Original Source"}
            </p>
          </div>

          {/* Mobile Bottom Nav */}
          <div className="flex items-center justify-between lg:hidden pt-4 border-t border-black/5">
            {prevSlug ? (
              <Link
                href={`/ai/${prevSlug}`}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
              >
                ← Previous
              </Link>
            ) : (
              <div />
            )}

            {nextSlug ? (
              <Link
                href={`/ai/${nextSlug}`}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
              >
                Next →
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
