// app/ai/AiCarouselClient.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// Helper to optimize images
function getOptimizedUrl(url, width = 2000) {
  if (!url?.includes("cdn.sanity.io")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}w=${width}&fit=max&auto=format`;
}

export default function AiCarouselClient({ collections = [] }) {
  const [projectIndex, setProjectIndex] = useState(0);
  const [mode, setMode] = useState("ai"); // 'ai' or 'original'

  const currentProject = collections[projectIndex];
  const count = collections.length;

  // 1. Navigation Logic
  const nextProject = () => {
    setProjectIndex((prev) => (prev + 1) % count);
  };

  const prevProject = () => {
    setProjectIndex((prev) => (prev - 1 + count) % count);
  };

  // Keyboard support
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") nextProject();
      if (e.key === "ArrowLeft") prevProject();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [count]);

  if (!currentProject) return <div className="p-20">No collections found.</div>;

  // Decide which images to show based on Toggle Mode
  const activeImages =
    mode === "ai" ? currentProject.generated : currentProject.originals;

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* TOP CONTROLS */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        {/* Back Button */}
        <Link
          href="/"
          className="bg-white inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-1.5 text-sm text-black hover:bg-black/5"
        >
          <span>←</span> Back Home
        </Link>

        {/* MODE TOGGLE SWITCH */}
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

        {/* Pagination Counter */}
        <div className="text-sm text-gray-500 font-mono hidden md:block">
          Project {projectIndex + 1} / {count}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
        {/* IMAGE DISPLAY */}
        <div className="relative group bg-gray-50 rounded-2xl overflow-hidden border border-black/5 aspect-[4/3] flex items-center justify-center">
          {activeImages && activeImages.length > 0 ? (
            <div className="w-full h-full p-4 flex items-center justify-center">
              {/* If there are multiple images in one category, we just stack them or show the first one. 
                  For now, let's show the first one nicely formatted. */}
              <Image
                key={activeImages[0].asset.url + mode} // Force re-render on mode switch
                src={getOptimizedUrl(activeImages[0].asset.url)}
                alt={currentProject.title}
                width={2000}
                height={1500}
                className="w-full h-full object-contain drop-shadow-xl"
                priority
              />

              {/* Optional: If you have multiple images in "Originals", 
                  you could map them here in a mini-grid instead of one big image */}
            </div>
          ) : (
            <div className="text-gray-400 italic">No image available</div>
          )}

          {/* HOVER ARROWS for Navigation */}
          <button
            onClick={prevProject}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            ←
          </button>
          <button
            onClick={nextProject}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            →
          </button>
        </div>

        {/* INFO PLACARD */}
        <div className="space-y-6 lg:mt-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {currentProject.title}
            </h1>
            <div className="h-1 w-20 bg-black/10 rounded-full" />
          </div>

          <div className="prose prose-sm text-gray-600">
            {currentProject.description ? (
              <p>{currentProject.description}</p>
            ) : (
              <p className="italic opacity-50">No description provided.</p>
            )}
          </div>

          {/* Mini Tech Specs or Details could go here */}
          <div className="pt-6 border-t border-black/10">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Current View
            </span>
            <p className="text-lg font-medium">
              {mode === "ai" ? "✨ AI Interpretation" : "📷 Source Reference"}
            </p>
          </div>

          {/* Mobile Navigation Controls (Visible only on small screens) */}
          <div className="flex items-center justify-between lg:hidden pt-4">
            <button
              onClick={prevProject}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Previous
            </button>
            <span className="text-sm font-mono text-gray-500">
              {projectIndex + 1} / {count}
            </span>
            <button
              onClick={nextProject}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
