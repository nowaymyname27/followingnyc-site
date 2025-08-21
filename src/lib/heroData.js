// Use JSON with an import assertion (required by Turbopack)
import catalog from "../data/heroImages.json" assert { type: "json" };

/**
 * Returns normalized media items for a given hero mode key.
 * Each item: { id, src, title }
 */
export function getMediaByMode(
  modeKey,
  { onlyActive = false, now = new Date() } = {}
) {
  const list = catalog?.images ?? [];
  const t = now.getTime();

  return list
    .filter((img) => img?.modes?.includes(modeKey))
    .filter((img) =>
      !onlyActive
        ? true
        : (!img.activeFrom || Date.parse(img.activeFrom) <= t) &&
          (!img.activeTo || t <= Date.parse(img.activeTo))
    )
    .map((img) => ({
      id: img.id ?? img.src,
      src: img.src,
      title: img.title ?? "",
    }));
}
