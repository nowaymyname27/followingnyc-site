"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MODES } from "./hero/modes";
import { getMediaByMode } from "../lib/heroData";
import "./styles/hero.css"; // shared CSS with vars

export default function Hero({
  interval = 5000,
  mode = "auto",
  layoutRangeMs = [9000, 16000], // can also be a number
  colors = [
    "#0f77a7ff",
    "#2426a2ff",
    "#4b3295ff",
    "#a42d6aff",
    "#a72236ff",
    "#228863ff",
    "#a96b01ff",
  ],
  darkenBg = true,
  darkenFactor = 0.55,
  enabledModes,
  mediaOverride = {},
  children,
  animationConfig = {
    slideFadeMs: 1200,
    modeFadeMs: 700,
    kbDurationsSec: [16, 18, 20],
  },
}) {
  const registryKeys = useMemo(() => Object.keys(MODES), []);

  // Force fullscreen below LG (Tailwind lg = 1024px): mobile + tablet => fullscreen only
  const [isLgUp, setIsLgUp] = useState(false);
  useEffect(() => {
    const update = () => setIsLgUp(window.innerWidth >= 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Respect enabledModes on lg+, otherwise force fullscreen only
  const modeKeys = useMemo(() => {
    const base =
      Array.isArray(enabledModes) && enabledModes.length
        ? registryKeys.filter((k) => enabledModes.includes(k))
        : registryKeys;
    return isLgUp ? base : ["fullscreen"];
  }, [registryKeys, enabledModes, isLgUp]);

  // Media per mode
  const mediaByMode = useMemo(() => {
    const out = {};
    modeKeys.forEach((k) => (out[k] = getMediaByMode(k)));
    return out;
  }, [modeKeys]);

  // State
  const [indices, setIndices] = useState(() =>
    Object.fromEntries(
      (modeKeys.length ? modeKeys : ["fullscreen"]).map((k) => [k, 0])
    )
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
    `#${[r, g, b]
      .map((v) => v.toString(16))
      .join("")
      .padStart(6, "0")}`;
  const darkenColor = (hex, factor = 0.55) => {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(
      Math.round(r * (1 - factor)),
      Math.round(g * (1 - factor)),
      Math.round(b * (1 - factor))
    );
  };

  // Helper: fixed delay (number) OR random window ([min,max])
  const getLayoutDelay = () => {
    if (typeof layoutRangeMs === "number") return layoutRangeMs;
    const [min, max] = Array.isArray(layoutRangeMs)
      ? layoutRangeMs
      : [9000, 16000];
    return randRange(min, max);
  };

  // Initial randomization on mount
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

  // 🔧 Normalize when the available mode set changes (e.g., crossing lg breakpoint)
  useEffect(() => {
    // Rebuild indices for current set
    setIndices((prev) => {
      const next = {};
      modeKeys.forEach((k) => {
        const slides = mediaOverride[k] || mediaByMode[k] || [];
        const len = slides.length || 1;
        next[k] = prev[k] != null ? prev[k] % len : 0;
      });
      return next;
    });

    // Ensure the current layout is valid; if not, switch to first available
    if (!modeKeys.includes(layout)) {
      setLayout(modeKeys[0] || "fullscreen");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeKeys]);

  // Advance slides per-mode
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

  // Auto-rotate layouts
  useEffect(() => {
    if (!autoMode || modeKeys.length <= 1) return;
    let timeout;
    const schedule = () => {
      const delay = getLayoutDelay();
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

  // CSS variable injection for animation speeds
  const {
    slideFadeMs = 1200,
    modeFadeMs = 700,
    kbDurationsSec = [16, 18, 20],
  } = animationConfig || {};
  const cssVars = {
    ["--slide-fade-ms"]: `${slideFadeMs}ms`,
    ["--mode-fade-ms"]: `${modeFadeMs}ms`,
    ["--kb0-sec"]: `${kbDurationsSec[0]}s`,
    ["--kb1-sec"]: `${kbDurationsSec[1]}s`,
    ["--kb2-sec"]: `${kbDurationsSec[2]}s`,
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: appliedBg, ...cssVars }}
    >
      {modeKeys.map((key) => {
        const { Component } = MODES[key];
        const slides = mediaOverride[key] || mediaByMode[key] || [];
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
