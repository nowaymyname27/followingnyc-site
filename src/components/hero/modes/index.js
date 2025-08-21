import FullscreenMode from "./FullscreenMode";
import SideImageMode, {
  usesPlainBackground as sidePlainBg,
} from "./SideImageMode";
import TripleColumnMode, {
  usesPlainBackground as triplePlainBg,
} from "./TripleColumnMode";

/**
 * Registry of modular hero modes.
 * Add new modes here (e.g., "leftSplit", "collage", etc.).
 */
export const MODES = {
  fullscreen: { Component: FullscreenMode, plainBackground: false },
  sideImage: { Component: SideImageMode, plainBackground: !!sidePlainBg },
  tripleColumn: {
    Component: TripleColumnMode,
    plainBackground: !!triplePlainBg,
  },
};
