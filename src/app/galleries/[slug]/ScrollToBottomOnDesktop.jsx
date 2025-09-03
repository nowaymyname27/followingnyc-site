// app/galleries/[slug]/ScrollToBottomOnDesktop.jsx
"use client";

import { useEffect, useState } from "react";

export default function ScrollToBottomOnDesktop({ children }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    // Jump to bottom so the carousel is in view immediately
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "auto",
    });
  }, [isDesktop]);

  return children;
}
