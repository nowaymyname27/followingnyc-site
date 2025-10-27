// components/NavBarLight.jsx
"use client";
import React from "react";
import Image from "next/image";
import { NAV_BUTTONS } from "@/lib/nav.data";

export default function NavBarLight({
  brand = "FollowingNYC",
  brandLogo = "/logo.png",
  brandAlt = "FollowingNYC logo",
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-40">
      <div className="flex w-full items-center justify-between px-4 md:px-6">
        {/* Brand */}
        <a
          href="/"
          aria-label={brandAlt}
          className="pointer-events-auto inline-flex items-center rounded-full border border-black/30 bg-white px-4 py-2 backdrop-blur-xl shadow-md h-10 transition-all duration-200 ease-out hover:bg-black/5 hover:scale-[1.02]"
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

        {/* Nav links */}
        <div className="pointer-events-auto flex items-center gap-6 rounded-full border border-black/30 bg-white px-4 py-2 text-black backdrop-blur-xl shadow-md">
          {[
            { label: "Galleries", href: "/galleries" },
            { label: "Collections", href: "/collections" },
            ...NAV_BUTTONS,
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-black/80 transition-all duration-200 ease-out hover:text-black hover:font-semibold hover:bg-black/10 hover:translate-y-[-1px] hover:shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
