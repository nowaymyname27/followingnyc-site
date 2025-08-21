// app/galleries/[slug]/hooks/useKeyNav.js
import * as React from "react";

/**
 * Global key handler for navigation & actions.
 * Pass any subset of handlers; omitted ones are ignored.
 *
 * Keys:
 *  - ArrowLeft  -> onPrev
 *  - ArrowRight -> onNext
 *  - "i" or Enter -> onOpen
 *  - Escape -> onClose
 */
export function useKeyNav({
  onPrev,
  onNext,
  onOpen,
  onClose,
  enabled = true,
} = {}) {
  React.useEffect(() => {
    if (!enabled) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      else if (e.key === "ArrowRight" && onNext) onNext();
      else if ((e.key === "Enter" || e.key.toLowerCase() === "i") && onOpen)
        onOpen();
      else if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext, onOpen, onClose, enabled]);
}
