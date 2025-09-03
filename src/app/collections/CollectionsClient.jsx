// app/collections/CollectionsClient.jsx
"use client";

import React from "react";
import { useCollectionsGrouping } from "./hooks/useCollectionsGrouping";
import YearSection from "./components/YearSection";

export default function CollectionsClient({ albums }) {
  const { grouped } = useCollectionsGrouping(albums);
  const hasAny = grouped?.some((g) => g.items?.length) ?? false;

  return (
    <div className="min-h-screen bg-background text-black">
      {/* Full-bleed wrapper so sections can span the whole viewport */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="w-screen px-4 sm:px-6 lg:px-8 py-10 space-y-8 lg:space-y-10">
          {hasAny ? (
            grouped.map(({ year, items }) => (
              <YearSection key={String(year)} year={year} items={items} />
            ))
          ) : (
            <div className="mx-auto max-w-3xl text-center text-sm text-black/60">
              No collections to display.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
