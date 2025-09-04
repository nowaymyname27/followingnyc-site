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

  const sectionRefs = React.useRef([]);
  const [visible, setVisible] = React.useState(() =>
    Array(items.length).fill(false)
  );
  const [showFade, setShowFade] = React.useState(true);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = [...prev];
          for (const e of entries) {
            const idx = Number(e.target.getAttribute("data-idx"));
            if (!Number.isNaN(idx)) next[idx] = e.isIntersecting;
          }
          return next;
        });
      },
      { root: null, rootMargin: "0px 0px -20% 0px", threshold: 0.2 }
    );
    sectionRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    const onScroll = () => {
      const scrolled =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;
      setShowFade(!scrolled);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative">
      <div className="bg-background text-neutral-900 px-4 sm:px-6 lg:px-8">
        <div className="h-4" />
        {items.map((g, i) => (
          <section
            key={g.id || g.slug || i}
            ref={(el) => (sectionRefs.current[i] = el)}
            data-idx={i}
            className="min-h-[88svh] grid place-items-center py-6"
            style={{
              contentVisibility: "auto",
              containIntrinsicSize: "1400px",
            }}
          >
            <div className="w-full max-w-7xl mx-auto">
              <GalleryCard
                gallery={g}
                isVisible={visible[i]}
                href={g.slug ? `/galleries/${g.slug}` : undefined}
                priority={i < 2}
              />
            </div>
          </section>
        ))}
        <div className="h-8" />
      </div>

      {showFade && (
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-20" />
      )}
    </div>
  );
}
