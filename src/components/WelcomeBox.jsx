"use client";
import React from "react";

export default function WelcomeBox({
  className = "",
  title = "",
  heading = "Explore my work",
  primary = { label: "Latest Curated Gallery", href: "/portfolio" },
  secondary = { label: "Latest Collection", href: "/book" },
  floating = true,
}) {
  const posClasses = floating
    ? [
        "absolute",
        "left-1/2 -translate-x-1/2",
        "top-1/2 -translate-y-1/2",
        "z-20",
        "text-center",
        "w-[90vw] max-w-md",
        "md:left-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] md:translate-x-0 md:text-left",
      ].join(" ")
    : "relative z-20";

  return (
    <div
      className={[
        posClasses,
        "rounded-3xl border border-white/20 bg-white/10",
        "p-5 md:p-6 lg:p-8",
        "text-white backdrop-blur-md md:backdrop-blur-lg shadow-2xl",
        className,
      ].join(" ")}
    >
      {title && (
        <h1 className="mb-4 text-3xl md:text-5xl lg:text-6xl font-semibold text-white drop-shadow">
          {title}
        </h1>
      )}

      {heading && (
        <p className="mb-3 md:mb-4 lg:mb-6 text-sm md:text-base lg:text-lg text-white/80">
          {heading}
        </p>
      )}

      <div className="flex flex-col gap-3 md:gap-4">
        <a
          href={primary.href}
          className="w-full rounded-xl bg-white px-4 py-2 md:py-3 lg:py-3.5 text-center text-sm md:text-base font-semibold text-black hover:bg-white/90"
        >
          {primary.label}
        </a>
        <a
          href={secondary.href}
          className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-2 md:py-3 lg:py-3.5 text-center text-sm md:text-base font-semibold text-white hover:bg-white/20"
        >
          {secondary.label}
        </a>
      </div>
    </div>
  );
}
