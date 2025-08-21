export default {
  name: "galleryItem",
  title: "Gallery Item",
  type: "object",
  fields: [
    // either reference a photo...
    { name: "photo", type: "reference", to: [{ type: "photo" }] },
    // ...or embed a one-off image without creating a photo document
    { name: "image", type: "image", options: { hotspot: true } },
    // per-gallery overrides (shown on this gallery only)
    { name: "titleOverride", type: "string" },
    { name: "descriptionOverride", type: "text" },
    { name: "yearOverride", type: "number" },
  ],
  preview: {
    select: {
      t: "titleOverride",
      ptitle: "photo.title",
      media: "photo.image",
      media2: "image",
    },
    prepare({ t, ptitle, media, media2 }) {
      return { title: t || ptitle || "Image", media: media || media2 };
    },
  },
};
