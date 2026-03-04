"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MODES } from "./hero/modes";
import { getMediaByMode } from "../lib/heroData";
import "./styles/hero.css"; // shared CSS with vars

export default function Hero({
  beatMs = 10000,
  modeHoldCount = 2,
  mode = "auto",
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
  const orderedModes = useMemo(
    () => ["fullscreen", "sideImage", "tripleColumn"],
    []
  );

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

  const sequenceModeKeys = useMemo(
    () => orderedModes.filter((k) => modeKeys.includes(k)),
    [orderedModes, modeKeys]
  );

  // Media per mode
  const mediaByMode = useMemo(() => {
    const out = {};
    modeKeys.forEach((k) => (out[k] = getMediaByMode(k)));
    return out;
  }, [modeKeys]);

  // State
  const [heroState, setHeroState] = useState(() => ({
    indices: Object.fromEntries(
      (modeKeys.length ? modeKeys : ["fullscreen"]).map((k) => [k, 0])
    ),
    layout: modeKeys[0] || "fullscreen",
    bgColor: "#000000",
    hold: 1,
  }));

  const autoMode = mode === "auto" || mode === "random";
  const rand = (n) => Math.floor(Math.random() * n);

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

  // Initial randomization on mount
  useEffect(() => {
    setHeroState((prev) => {
      const nextIndices = { ...prev.indices };
      modeKeys.forEach((k) => {
        const slides = mediaOverride[k] || mediaByMode[k] || [];
        const len = slides.length || 1;
        nextIndices[k] = rand(len);
      });

      let nextLayout = prev.layout;
      if (sequenceModeKeys.length) {
        if (mode === "auto" || mode === "random") {
          nextLayout = sequenceModeKeys[0];
        } else if (modeKeys.includes(mode)) {
          nextLayout = mode;
        } else {
          nextLayout = sequenceModeKeys[0];
        }
      }

      return {
        indices: nextIndices,
        layout: nextLayout,
        bgColor: colors[rand(colors.length)],
        hold: 1,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // once

  // 🔧 Normalize when the available mode set changes (e.g., crossing lg breakpoint)
  useEffect(() => {
    setHeroState((prev) => {
      const next = {};
      modeKeys.forEach((k) => {
        const slides = mediaOverride[k] || mediaByMode[k] || [];
        const len = slides.length || 1;
        next[k] = prev.indices[k] != null ? prev.indices[k] % len : 0;
      });

      const nextLayout = sequenceModeKeys.includes(prev.layout)
        ? prev.layout
        : sequenceModeKeys[0] || "fullscreen";

      return {
        ...prev,
        indices: next,
        layout: nextLayout,
        hold: 1,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeKeys, sequenceModeKeys]);

  // Unified beat: image advance + optional layout rotation
  useEffect(() => {
    const id = setInterval(() => {
      setHeroState((prev) => {
        const sequence = sequenceModeKeys.length
          ? sequenceModeKeys
          : ["fullscreen"];
        const currentLayout = sequence.includes(prev.layout)
          ? prev.layout
          : sequence[0];

        const nextIndices = { ...prev.indices };
        let nextLayout = currentLayout;
        let nextHold = prev.hold || 1;
        let nextBgColor = prev.bgColor;

        if (autoMode && sequence.length > 1) {
          if (nextHold >= modeHoldCount) {
            const currentIdx = sequence.indexOf(currentLayout);
            nextLayout = sequence[(currentIdx + 1) % sequence.length];
            nextHold = 1;
            nextBgColor = colors[rand(colors.length)];
          } else {
            nextHold += 1;

            const currentSlides =
              mediaOverride[currentLayout] || mediaByMode[currentLayout] || [];
            if (currentSlides.length >= 2) {
              nextIndices[currentLayout] =
                ((prev.indices[currentLayout] || 0) + 1) % currentSlides.length;
            }
          }
        } else {
          const activeSlides =
            mediaOverride[currentLayout] || mediaByMode[currentLayout] || [];
          if (activeSlides.length >= 2) {
            nextIndices[currentLayout] =
              ((prev.indices[currentLayout] || 0) + 1) % activeSlides.length;
          }
          nextHold = 1;
        }

        return {
          ...prev,
          indices: nextIndices,
          layout: nextLayout,
          hold: nextHold,
          bgColor: nextBgColor,
        };
      });
    }, beatMs);

    return () => clearInterval(id);
  }, [
    beatMs,
    autoMode,
    modeKeys,
    mediaByMode,
    mediaOverride,
    sequenceModeKeys,
    modeHoldCount,
    colors,
  ]);

  const { indices, layout, bgColor } = heroState;

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
