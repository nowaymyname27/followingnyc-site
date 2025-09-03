export const GAP_PX = 32; // constant spacing between frames
export const MIN_PEEK = 48; // minimum visible width for edge fades

export function fitWithin(hostW, hostH, ratio) {
  if (!hostW || !hostH || !ratio) return null;
  let w = hostW;
  let h = w / ratio;
  if (h > hostH) {
    h = hostH;
    w = h * ratio;
  }
  return { w, h };
}
