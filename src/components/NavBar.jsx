"use client";
import React, { useState } from "react";

export default function NavBar({
  brand = "FollowingNYC",
  menus,
  rightButtons,
}) {
  const defaultMenus = menus ?? [
    {
      label: "Galleries",
      links: [
        { label: "Collage", href: "/galleries/Collage" },
        { label: "Hotel Rooms", href: "/galleries/hotel-rooms" },
        {
          label: "Water Tanks",
          href: "/galleries/skyline-relics-nyc-water-tanks",
        },
        { label: "All Galleries", href: "/galleries" },
      ],
    },
    {
      label: "Collections",
      links: [
        {
          label: "Philly Pride Parade",
          href: "/collections/pride-philly-parade-june-1st",
        },
        {
          label: "Easter Parade",
          href: "/collections/april-20-easter-parade-manhattan",
        },
        { label: "NYFW 2025", href: "/collections/nyfw" },
        { label: "All Collections", href: "/collections" },
      ],
    },
  ];

  const buttons = rightButtons ?? [
    { label: "Featured", href: "/featured", primary: false },
    { label: "Contact Me", href: "/contact", primary: false },
  ];

  return (
    <div className="fixed inset-x-0 top-6 z-40">
      <div className="flex w-full items-center justify-between px-4 md:px-6">
        {/* Brand (left) */}
        <a
          href="/"
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold tracking-tight text-white backdrop-blur-xl shadow-lg hover:bg-white/15"
          aria-label={brand}
        >
          {brand}
        </a>

        {/* Right side: full menus on md+, compact on <md */}
        <div className="flex items-center">
          {/* Mobile menu */}
          <MobileMenu
            menus={defaultMenus}
            buttons={buttons}
            className="md:hidden"
          />

          {/* Desktop/tablet menu */}
          <div className="hidden md:flex items-center gap-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-xl shadow-lg">
            {defaultMenus.map((m) => (
              <Dropdown key={m.label} label={m.label} links={m.links} />
            ))}
            <div className="ml-2 flex items-center gap-2">
              {buttons.map((b) => (
                <a
                  key={b.label}
                  href={b.href}
                  className={
                    b.primary
                      ? "rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-white/90"
                      : "rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                  }
                >
                  {b.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dropdown({ label, links }) {
  const [open, setOpen] = useState(false);

  const mainLinks = links.slice(0, 3);
  const allLink = links.find((l) => l.label.toLowerCase().startsWith("all"));

  return (
    <div className="group relative" onMouseLeave={() => setOpen(false)}>
      <button
        className="flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>{label}</span>
        <svg
          aria-hidden="true"
          className={`h-3 w-3 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          } group-hover:rotate-180`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={`absolute right-0 top-full z-50 mt-2 min-w-[12rem] rounded-2xl border border-white/15 bg-black/70 p-2 opacity-0 shadow-xl backdrop-blur-xl transition-all duration-200
        ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }
        group-hover:visible group-hover:translate-y-0 group-hover:opacity-100`}
      >
        {mainLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="block rounded-xl px-3 py-2 text-xs text-white/90 hover:bg-white/10 hover:text-white"
          >
            {l.label}
          </a>
        ))}

        {allLink && (
          <>
            <div className="my-2 border-t border-white/10" />
            <a
              href={allLink.href}
              className="block rounded-xl px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
            >
              {allLink.label}
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function MobileMenu({ menus, buttons, className = "" }) {
  const [open, setOpen] = useState(false);

  const splitLinks = (links) => {
    const main = links.slice(0, 3);
    const all = links.find((l) => l.label.toLowerCase().startsWith("all"));
    return { main, all };
  };

  return (
    <div className={className}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl shadow-lg hover:bg-white/15"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open menu"
      >
        Menu
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/15 bg-black/70 p-2 text-white shadow-xl backdrop-blur-xl">
          {menus.map((m, i) => {
            const { main, all } = splitLinks(m.links);
            return (
              <div key={m.label} className="mb-4 last:mb-0">
                {/* Bigger, bolder section title */}
                <div className="px-3 py-2 text-sm font-bold text-white">
                  {m.label}
                </div>

                {main.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="block rounded-xl px-3 py-2 text-xs text-white/90 hover:bg-white/10 hover:text-white"
                  >
                    {l.label}
                  </a>
                ))}

                {all && (
                  <>
                    <div className="my-2 border-t border-white/10" />
                    <a
                      href={all.href}
                      className="block rounded-xl px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      {all.label}
                    </a>
                  </>
                )}

                {/* Section separator */}
                {i < menus.length - 1 && (
                  <div className="my-3 border-t border-white/20" />
                )}
              </div>
            );
          })}

          {/* Separator before News/Contact */}
          <div className="my-3 border-t border-white/20" />

          <div className="pt-2">
            {buttons.map((b, i) => (
              <div key={b.label}>
                {/* Bigger label for "News" / "Contact" */}
                <a
                  href={b.href}
                  className="block rounded-xl px-3 py-2 text-sm font-bold text-white hover:bg-white/10"
                >
                  {b.label}
                </a>
                {i < buttons.length - 1 && (
                  <div className="my-2 border-t border-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
