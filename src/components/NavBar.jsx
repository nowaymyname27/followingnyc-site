"use client";
import React, { useState } from "react";
import Image from "next/image";
import { NAV_BUTTONS } from "@/lib/nav.data";

export default function NavBar({
  brand = "FollowingNYC",
  brandLogo = "/logo_white.png",
  brandAlt = "FollowingNYC logo",
}) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Galleries", href: "/galleries" },
    { label: "Collections", href: "/collections" },
    ...NAV_BUTTONS,
  ];

  return (
    <div className="fixed inset-x-0 top-4 z-40 pointer-events-none">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6 pointer-events-none">
        {/* Brand */}
        <a
          href="/"
          aria-label={brandAlt}
          className="
            pointer-events-auto inline-flex items-center
            rounded-full border border-white/50 bg-white/10
            px-4 py-2 h-10
            backdrop-blur-xl shadow-lg
            transition-all duration-200
            hover:bg-black/30 hover:scale-[1.02]
          "
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

        {/* Desktop nav */}
        <div className="pointer-events-auto hidden md:flex items-center gap-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-xl shadow-lg">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="
                rounded-full px-3 py-1.5
                text-xs font-medium text-white/90
                transition-all duration-200
                hover:text-white hover:font-semibold
                hover:bg-white/15 hover:-translate-y-0.5
                hover:shadow-md
              "
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="
    pointer-events-auto md:hidden
    inline-flex items-center gap-2
    rounded-full border border-white/30
    bg-white/10 px-4 h-10
    text-sm font-medium text-white
    backdrop-blur-xl shadow-lg
    transition-all duration-200
    hover:bg-white/20
  "
        >
          <span>{open ? "Close" : "Menu"}</span>

          <span
            className={`block h-0.5 w-4 bg-current transition-transform duration-200 ${
              open ? "rotate-45 translate-y-1" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="pointer-events-auto mt-4 mx-4 rounded-2xl border border-white/20 bg-black/70 backdrop-blur-xl shadow-xl md:hidden">
          <nav className="flex flex-col items-center gap-2 py-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="
                  w-full text-center
                  px-6 py-3
                  text-base font-medium text-white
                  transition
                  hover:bg-white/10
                "
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
