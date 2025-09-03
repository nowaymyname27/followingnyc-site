// app/hooks/useScrollBottom.js
"use client";

import { useEffect } from "react";

export function useScrollBottom({ enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return;
    // scroll to bottom smoothly
    window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
  }, [enabled]);
}
