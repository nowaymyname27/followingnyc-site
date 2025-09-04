// app/collections/components/PhotoMasonry.jsx
"use client";

import React from "react";
import PhotoCell from "./PhotoCell";

export default function PhotoMasonry({ photos = [], onOpen }) {
  const hostRef = React.useRef(null);
  const [cols, setCols] = React.useState(1);

  // Responsive column count (match Tailwind-ish breakpoints)
  React.useEffect(() => {
    const el = hostRef.current;
    const calc = () => {
      const w = el?.clientWidth ?? window.innerWidth;
      const n = w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 640 ? 2 : 1;
      setCols(n);
    };
    calc();
    const ro = el ? new ResizeObserver(calc) : null;
    ro?.observe(el);
    window.addEventListener("resize", calc, { passive: true });
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, []);

  // Distribute round-robin so top rows across columns come first
  const columnized = React.useMemo(() => {
    const buckets = Array.from({ length: cols }, () => []);
    photos.forEach((p, i) => {
      buckets[i % cols].push({ ...p, _i: i });
    });
    return buckets;
  }, [photos, cols]);

  const EAGER_ROWS = 1; // top N rows per column load eagerly

  return (
    <div ref={hostRef} className="w-full">
      <div className="flex gap-4">
        {columnized.map((col, cIdx) => (
          <div
            key={cIdx}
            className="flex-1 min-w-0"
            style={{
              contentVisibility: "auto",
              containIntrinsicSize: "1200px",
            }}
          >
            {col.map((p, rIdx) => (
              <PhotoCell
                key={p.id ?? `${p._i}-${p.url}`}
                src={p.url}
                alt={p.alt}
                i={p._i}
                onOpen={onOpen}
                eager={rIdx < EAGER_ROWS}
                lqip={p.lqip}
                width={p.width}
                height={p.height}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
