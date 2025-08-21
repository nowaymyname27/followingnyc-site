// app/galleries/GalleriesClient.jsx
"use client";

import * as React from "react";
import GalleryCard from "./GalleryCard";

export default function GalleriesClient({ items = [] }) {
  if (!items.length) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-white text-neutral-600">
        <p>No galleries yet.</p>
      </div>
    );
  }

  // Refs to each scroll section for visibility animation
  const sectionRefs = React.useRef([]);

  // Track which cards are within a comfortable viewport band for fade-in
  const [visible, setVisible] = React.useState(() =>
    Array(items.length).fill(false)
  );

  // Track if we are near the bottom (to hide fade)
  const [showFade, setShowFade] = React.useState(true);

  // Always start at top
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Compute visibility band + bottom detection
  React.useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight;
      const bandTop = vh * 0.2;
      const bandBottom = vh * 0.8;

      setVisible((prev) => {
        const next = [...prev];
        sectionRefs.current.forEach((sec, idx) => {
          if (!sec) return;
          const r = sec.getBoundingClientRect();
          next[idx] = r.bottom > bandTop && r.top < bandBottom;
        });
        return next;
      });

      // Check if we're near bottom of page
      const scrolled =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 20; // within 20px of bottom
      setShowFade(!scrolled);
    };

    // initial + bind
    compute();
    const onScroll = () => compute();
    const onResize = () => compute();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative">
      {/* Page content (uses window scroll) */}
      <div className="bg-background text-neutral-900 px-4 sm:px-6 lg:px-8">
        <div className="h-4" />

        {items.map((g, i) => (
          <section
            key={g.id || g.slug || i}
            ref={(el) => (sectionRefs.current[i] = el)}
            className="min-h-[88svh] grid place-items-center py-6"
          >
            {/* Wrapper matches card width and centers it */}
            <div className="w-full max-w-7xl mx-auto">
              <GalleryCard
                gallery={g}
                isVisible={visible[i]}
                href={g.slug ? `/galleries/${g.slug}` : undefined}
              />
            </div>
          </section>
        ))}

        <div className="h-8" />
      </div>

      {/* Bottom shadow indicator */}
      {showFade && (
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-20" />
      )}
    </div>
  );
}
