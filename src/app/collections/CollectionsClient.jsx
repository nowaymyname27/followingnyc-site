// app/collections/CollectionsClient.jsx
"use client";

import React from "react";
import { useCollectionsGrouping } from "./hooks/useCollectionsGrouping";
import YearSection from "./components/YearSection";

export default function CollectionsClient({ albums }) {
  const { grouped } = useCollectionsGrouping(albums);

  return (
    <div className="min-h-screen bg-background text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {grouped.map(({ year, items }) => (
          <YearSection key={String(year)} year={year} items={items} />
        ))}
      </div>
    </div>
  );
}
