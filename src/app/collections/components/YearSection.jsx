// app/collections/components/YearSection.jsx
"use client";

import React from "react";
import CollectionCard from "./CollectionCard";

export default React.memo(function YearSection({
  year,
  items = [],
  priorityIds,
}) {
  return (
    <section
      className="bg-stone-100 rounded-3xl border border-black/10 p-6 sm:p-8"
      style={{ contentVisibility: "auto", containIntrinsicSize: "680px" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-3">
          <div className="text-6xl sm:text-7xl font-semibold leading-none">
            {year}
          </div>
        </div>

        <div className="lg:col-span-9">
          {items.length === 0 ? (
            <div className="text-sm text-black/50">No collections.</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((a) => (
                <CollectionCard
                  key={a.id || a.slug}
                  album={a}
                  priority={priorityIds?.has(a.id || a.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
