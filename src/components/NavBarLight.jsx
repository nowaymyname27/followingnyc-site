"use client";
import React, { useState } from "react";

export default function NavBarLight({
  brand = "FollowingNYC",
  menus,
  rightButtons,
}) {
  const defaultMenus = menus ?? [
    {
      label: "Curated Galleries",
      links: [
        { label: "Gallery 1", href: "/galleries/1" },
        { label: "Gallery 2", href: "/galleries/2" },
        { label: "Gallery 3", href: "/galleries/3" },
        { label: "All Galleries", href: "/galleries" },
      ],
    },
    {
      label: "Collections",
      links: [
        { label: "Collection 1", href: "/collections/1" },
        { label: "Collection 2", href: "/collections/2" },
        { label: "Collection 3", href: "/collections/3" },
        { label: "All Collections", href: "/collections" },
      ],
    },
  ];

  const buttons = rightButtons ?? [
    { label: "News", href: "/news", primary: false },
    { label: "Contact Me", href: "/contact", primary: false },
  ];

  return (
    <div className="fixed inset-x-0 top-6 z-40 px-6 bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand */}
        <a
          href="/"
          className="rounded-full border border-black/30 bg-white px-4 py-2 text-sm font-semibold tracking-tight text-black backdrop-blur-xl shadow-md hover:bg-black/5"
          aria-label={brand}
        >
          {brand}
        </a>

        <div className="flex items-center">
          <MobileMenu
            menus={defaultMenus}
            buttons={buttons}
            className="md:hidden"
          />

          <div className="hidden md:flex items-center gap-6 rounded-full border border-black/30 bg-white px-4 py-2 text-black backdrop-blur-xl shadow-md">
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
                      ? "rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/90"
                      : "rounded-full border border-black/30 bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-black/5"
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
  return (
    <div className="group relative" onMouseLeave={() => setOpen(false)}>
      <button
        className="text-xs font-medium text-black/80 hover:text-black"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
      </button>
      <div
        className={`absolute right-0 top-full z-50 mt-2 min-w-[12rem] rounded-2xl border border-black/30 bg-white p-2 opacity-0 shadow-md transition-all duration-200
        ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }
        group-hover:visible group-hover:translate-y-0 group-hover:opacity-100`}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="block rounded-xl px-3 py-2 text-xs text-black/80 hover:bg-black/5 hover:text-black"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function MobileMenu({ menus, buttons, className = "" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full border border-black/30 bg-white px-4 py-2 text-xs font-semibold text-black backdrop-blur-xl shadow-md hover:bg-black/5"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open menu"
      >
        Menu
      </button>

      {open && (
        <div className="absolute right-6 mt-2 w-56 rounded-2xl border border-black/30 bg-white p-2 text-black shadow-md backdrop-blur-xl">
          {menus.map((m) => (
            <div key={m.label} className="mb-2 last:mb-0">
              <div className="px-3 py-2 text-xs font-semibold text-black/70">
                {m.label}
              </div>
              <div>
                {m.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="block rounded-xl px-3 py-2 text-xs text-black/80 hover:bg-black/5 hover:text-black"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2 border-t border-black/20 pt-2">
            {buttons.map((b) => (
              <a
                key={b.label}
                href={b.href}
                className="block rounded-xl px-3 py-2 text-xs text-black/80 hover:bg-black/5 hover:text-black"
              >
                {b.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
