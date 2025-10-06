"use client";
import React from "react";
import { SiInstagram } from "react-icons/si";

export default function WelcomeBox({
  className = "",
  title = "",
  heading = "",
  primary = { label: "Latest Gallery", href: "/galleries/Collage" },
  secondary = {
    label: "Latest Collection",
    href: "/collections/pride-philly-parade",
  },
  floating = true,
  // Pass any of these keys: instagram, tiktok, youtube, x, twitter
  social = {},
}) {
  const posClasses = floating
    ? [
        "absolute",
        "left-1/2 -translate-x-1/2",
        "top-1/2 -translate-y-1/2",
        "z-20",
        "text-center",
        "lg:left-1/4 lg:-translate-x-1/2 lg:text-left",
      ].join(" ")
    : "relative z-20";

  const SocialIcon = ({ href, label, children }) => {
    if (!href) return null;
    return (
      <a
        href={href}
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-[1.03] active:scale-95 transition"
        title={label}
      >
        {children}
      </a>
    );
  };

  const xHref = social.x || social.twitter; // prefer X if provided, else Twitter
  const hasSocial =
    social.instagram || social.tiktok || social.youtube || xHref;

  return (
    <div
      className={[
        posClasses,
        "rounded-3xl border border-white/20 bg-white/10",
        "w-[92vw] sm:w-[88vw] md:w-auto",
        "max-w-[18rem] sm:max-w-[20rem] md:max-w-[22rem] lg:max-w-[26rem] xl:max-w-[28rem]",
        "p-4 sm:p-5 md:p-6 lg:p-8",
        "text-white backdrop-blur-md md:backdrop-blur-lg shadow-2xl",
        className,
      ].join(" ")}
    >
      {title && (
        <h1 className="mb-3 sm:mb-4 text-3xl md:text-5xl lg:text-6xl font-semibold text-white drop-shadow">
          {title}
        </h1>
      )}

      {heading && (
        <p className="mb-3 md:mb-4 lg:mb-6 text-sm md:text-base lg:text-lg text-white/80">
          {heading}
        </p>
      )}

      <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4">
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

      {hasSocial && (
        <div className="mt-4 md:mt-5 lg:mt-6">
          <div className="flex items-center justify-center gap-2.5 sm:gap-3">
            <SocialIcon href={social.instagram} label="Instagram">
              <SiInstagram size={20} />
            </SocialIcon>
          </div>
        </div>
      )}
    </div>
  );
}
