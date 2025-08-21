// app/collections/hooks/useKeyNav.js
"use client";

import * as React from "react";

/**
 * Keyboard navigation helper.
 * - ArrowLeft  -> onPrev
 * - ArrowRight -> onNext
 * - Escape     -> onClose
 */
export function useKeyNav({ onPrev, onNext, onClose, enabled = true } = {}) {
  React.useEffect(() => {
    if (!enabled) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      else if (e.key === "ArrowRight" && onNext) onNext();
      else if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext, onClose, enabled]);
}
