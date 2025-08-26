"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MODES } from "./hero/modes";
import { getMediaByMode } from "../lib/heroData"; // keep existing source

export default function Hero({
  interval = 5000,
  mode = "auto",
  layoutRangeMs = [9000, 16000],
  colors = [
    "#0ea5e9",
    "#6366f1",
    "#a78bfa",
    "#f472b6",
    "#fb7185",
    "#34d399",
    "#f59e0b",
  ],
  darkenBg = true,
  darkenFactor = 0.55,
  // NEW (optional):
  enabledModes,
  mediaOverride = {},
  children,
}) {
  const registryKeys = useMemo(() => Object.keys(MODES), []);
  const modeKeys = useMemo(() => {
    if (Array.isArray(enabledModes) && enabledModes.length) {
      return registryKeys.filter((k) => enabledModes.includes(k));
    }
    return registryKeys;
  }, [registryKeys, enabledModes]);

  // keep your existing local media source
  const mediaByMode = useMemo(() => {
    const out = {};
    modeKeys.forEach((k) => (out[k] = getMediaByMode(k)));
    return out;
  }, [modeKeys]);

  const [indices, setIndices] = useState(() =>
    Object.fromEntries(modeKeys.map((k) => [k, 0]))
  );
  const [layout, setLayout] = useState(modeKeys[0] || "fullscreen");
  const [bgColor, setBgColor] = useState("#000000");

  const autoMode = mode === "auto" || mode === "random";
  const rand = (n) => Math.floor(Math.random() * n);
  const randRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16),
    };
  };
  const rgbToHex = (r, g, b) =>
    `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  const darkenColor = (hex, factor = 0.55) => {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(
      Math.round(r * (1 - factor)),
      Math.round(g * (1 - factor)),
      Math.round(b * (1 - factor))
    );
  };

  useEffect(() => {
    setIndices((prev) => {
      const next = { ...prev };
      modeKeys.forEach((k) => {
        const slides = mediaOverride[k] || mediaByMode[k] || [];
        const len = slides.length || 1;
        next[k] = rand(len);
      });
      return next;
    });

    if (modeKeys.length) {
      if (mode === "auto" || mode === "random") {
        setLayout(modeKeys[rand(modeKeys.length)]);
      } else if (modeKeys.includes(mode)) {
        setLayout(mode);
      } else {
        setLayout(modeKeys[0]);
      }
    }
    setBgColor(colors[rand(colors.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // once

  useEffect(() => {
    const timers = [];
    modeKeys.forEach((k) => {
      const slides = mediaOverride[k] || mediaByMode[k] || [];
      if (slides.length < 2) return;
      const id = setInterval(() => {
        setIndices((prev) => ({
          ...prev,
          [k]: ((prev[k] || 0) + 1) % slides.length,
        }));
      }, interval);
      timers.push(id);
    });
    return () => timers.forEach(clearInterval);
  }, [modeKeys, mediaByMode, mediaOverride, interval]);

  useEffect(() => {
    if (!autoMode || modeKeys.length <= 1) return;
    let timeout;
    const schedule = () => {
      const delay = randRange(layoutRangeMs[0], layoutRangeMs[1]);
      timeout = setTimeout(() => {
        const others = modeKeys.filter((k) => k !== layout);
        const next = others.length ? others[rand(others.length)] : layout;
        setLayout(next);
        setBgColor(colors[rand(colors.length)]);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [autoMode, layout, modeKeys, layoutRangeMs, colors]);

  const plainBg = MODES[layout]?.plainBackground;
  const appliedBg = plainBg
    ? darkenBg
      ? darkenColor(bgColor, darkenFactor)
      : bgColor
    : "#000000";

  return (
    <div
      className="relative h-screen w-full overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: appliedBg }}
    >
      {modeKeys.map((key) => {
        const { Component } = MODES[key];
        const slides = mediaOverride[key] || mediaByMode[key] || []; // <-- override if provided
        return (
          <Component
            key={key}
            slides={slides}
            activeIndex={indices[key] || 0}
            active={layout === key}
          />
        );
      })}
      {children}
    </div>
  );
}
