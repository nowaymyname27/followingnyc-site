// app/collections/components/YearSection.jsx
"use client";

import CollectionCard from "./CollectionCard";

export default function YearSection({ year, items = [] }) {
  return (
    <section className="bg-stone-100 rounded-3xl border border-black/10 p-6 sm:p-8">
      {/* 50/50 split on md+; stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Left half: big year */}
        <div className="md:col-span-6">
          <div className="text-6xl sm:text-7xl font-semibold leading-none">
            {year}
          </div>
        </div>

        {/* Right half: two-column grid of collections */}
        <div className="md:col-span-6">
          {items.length === 0 ? (
            <div className="text-sm text-black/50">No collections.</div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
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
