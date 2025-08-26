export default {
  name: "collectionItem",
  title: "Collection Item",
  type: "object",
  fields: [
    // EITHER reference an existing photo...
    {
      name: "photo",
      title: "Photo (reference)",
      type: "reference",
      to: [{ type: "photo" }],
    },
    // ...OR upload an image directly
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    },

    // Optional per-item metadata (used when you embed an image, or to override a referenced photo)
    { name: "titleOverride", title: "Title", type: "string" },
    { name: "descriptionOverride", title: "Description", type: "text" },
    { name: "capturedAtOverride", title: "Capture Date", type: "datetime" },
    {
      name: "tagsOverride",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
  ],
  validation: (Rule) =>
    Rule.custom((val) =>
      val?.photo || val?.image
        ? true
        : "Add a Photo reference or upload an Image"
    ),
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
