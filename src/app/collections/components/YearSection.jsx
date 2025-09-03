// app/collections/components/YearSection.jsx
"use client";

import CollectionCard from "./CollectionCard";

export default function YearSection({ year, items = [] }) {
  return (
    <section className="bg-stone-100 rounded-3xl border border-black/10 p-6 sm:p-8">
      {/* Stacked on mobile & tablet; 12-col layout only at lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Year */}
        <div className="lg:col-span-3">
          <div className="text-6xl sm:text-7xl font-semibold leading-none">
            {year}
          </div>
        </div>

        {/* Cards */}
        <div className="lg:col-span-9">
          {items.length === 0 ? (
            <div className="text-sm text-black/50">No collections.</div>
          ) : (
            // 2 cols on mobile/tablet, 3 cols on lg+
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((a) => (
                <CollectionCard key={a.id || a.slug} album={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
