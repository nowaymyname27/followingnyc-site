"use client";
import React, { useState } from "react";
import Image from "next/image";
import { NAV_BUTTONS } from "@/lib/nav.data";

export default function NavBarLight({
  brand = "FollowingNYC",
  brandLogo = "/logo.png",
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
      <div className="mx-auto flex w-full items-center justify-between px-4 md:px-6 pointer-events-none">
        {/* Brand pill */}
        <a
          href="/"
          aria-label={brandAlt}
          className="
            pointer-events-auto inline-flex items-center
            h-10 px-4
            rounded-full border border-black/30
            bg-white backdrop-blur-xl shadow-md
            transition-all duration-200
            hover:bg-black/5 hover:scale-[1.02]
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
        <div className="pointer-events-auto hidden md:flex items-center gap-6 rounded-full border border-black/30 bg-white px-4 py-2 text-black backdrop-blur-xl shadow-md">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="
                rounded-full px-3 py-1.5
                text-xs font-medium text-black/80
                transition-all duration-200
                hover:text-black hover:font-semibold
                hover:bg-black/10 hover:-translate-y-0.5
                hover:shadow-[0_2px_6px_rgba(0,0,0,0.25)]
              "
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu pill (Option 1) */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="
            pointer-events-auto md:hidden
            inline-flex items-center gap-2
            h-10 px-4
            rounded-full border border-black/30
            bg-white text-sm font-medium text-black
            backdrop-blur-xl shadow-md
            transition-all duration-200
            hover:bg-black/5
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
        <div className="pointer-events-auto mt-4 mx-4 rounded-2xl border border-black/20 bg-white/90 backdrop-blur-xl shadow-xl md:hidden">
          <nav className="flex flex-col items-center gap-1 py-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="
                  w-full text-center
                  px-6 py-3
                  text-base font-medium text-black
                  transition
                  hover:bg-black/5
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
