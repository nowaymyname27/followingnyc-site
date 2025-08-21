// app/collections/hooks/useCollectionsGrouping.js
"use client";

import { useMemo } from "react";

/**
 * Groups albums by year, newest → oldest.
 * Safely handles missing years by putting them at the bottom under "Unknown".
 */
export function useCollectionsGrouping(albums = []) {
  const list = Array.isArray(albums) ? albums : [];

  const years = useMemo(() => {
    const ys = new Set();
    for (const a of list) ys.add(a?.year ?? "Unknown");
    // Sort numeric years desc; put "Unknown" last
    return Array.from(ys).sort((a, b) => {
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return Number(b) - Number(a);
    });
  }, [list]);

  const grouped = useMemo(() => {
    const byYear = new Map();
    for (const a of list) {
      const y = a?.year ?? "Unknown";
      if (!byYear.has(y)) byYear.set(y, []);
      byYear.get(y).push(a);
    }
    return years.map((y) => ({ year: y, items: byYear.get(y) ?? [] }));
  }, [list, years]);

  return { grouped, years };
}
