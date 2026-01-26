import { useEffect } from "react";

interface UseKeyNavProps {
  onPrev?: () => void;
  onNext?: () => void;
  onClose?: () => void;
  enabled?: boolean;
}

export function useKeyNav({
  onPrev,
  onNext,
  onClose,
  enabled,
}: UseKeyNavProps) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Prevent navigation if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "ArrowLeft" && onPrev) {
        onPrev();
      } else if (e.key === "ArrowRight" && onNext) {
        onNext();
      } else if (e.key === "Escape" && onClose) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext, onClose, enabled]);
}
