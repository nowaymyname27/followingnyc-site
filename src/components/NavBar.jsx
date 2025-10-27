// components/NavBar.jsx
"use client";
import React from "react";
import Image from "next/image";
import { NAV_BUTTONS } from "@/lib/nav.data";

export default function NavBar({
  brand = "FollowingNYC",
  brandLogo = "/logo_white.png",
  brandAlt = "FollowingNYC logo",
}) {
  return (
    <div className="fixed inset-x-0 top-6 z-40 pointer-events-none">
      {/* Make the flex wrapper NOT intercept clicks */}
      <div className="flex w-full items-center justify-between px-4 md:px-6 pointer-events-none">
        {/* Brand pill is clickable */}
        <a
          href="/"
          aria-label={brandAlt}
          className="pointer-events-auto inline-flex items-center rounded-full border border-white/50 bg-white/10 px-4 py-2 backdrop-blur-xl shadow-lg h-10 transition-all duration-200 ease-out hover:bg-black/30 hover:scale-[1.02]"
        >
          <Image
            src={brandLogo}
            alt={brandAlt}
            width={160}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </a>

        {/* Nav pill is clickable */}
        <div className="pointer-events-auto flex items-center gap-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-xl shadow-lg">
          {[
            { label: "Galleries", href: "/galleries" },
            { label: "Collections", href: "/collections" },
            ...NAV_BUTTONS,
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 transition-all duration-200 ease-out hover:text-white hover:font-semibold hover:bg-white/15 hover:translate-y-[-1px] hover:shadow-md"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
