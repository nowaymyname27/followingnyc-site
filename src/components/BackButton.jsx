// components/BackButton.jsx
"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ children = "Back" }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      // I kept your original styling here
      className="bg-white inline-flex items-center gap-2 rounded-full border border-black/20 px-3 py-1 text-sm text-black hover:bg-black/5"
    >
      <span aria-hidden>←</span>
      <span>{children}</span>
    </button>
  );
}
