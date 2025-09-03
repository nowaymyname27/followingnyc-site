"use client";

import { useEffect, useState } from "react";

export function useImageAspect(url) {
  const [ratio, setRatio] = useState(null);

  useEffect(() => {
    if (!url) return;
    let active = true;
    const img = new Image();
    img.onload = () => {
      if (!active) return;
      const r =
        img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : 1;
      setRatio(r);
    };
    img.onerror = () => active && setRatio(1);
    img.src = url;
    return () => {
      active = false;
    };
  }, [url]);

  return ratio;
}
