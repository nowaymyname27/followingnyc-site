export default {
  name: "galleryItem",
  title: "Gallery Item",
  type: "object",
  fields: [
    {
      name: "photo",
      title: "Photo (reference)",
      type: "reference",
      to: [{ type: "photo" }],
    },
    {
      name: "image",
      title: "Or upload image",
      type: "image",
      options: { hotspot: true },
    },
    { name: "titleOverride", title: "Title (override)", type: "string" },
    {
      name: "descriptionOverride",
      title: "Description (override)",
      type: "text",
    },
    { name: "yearOverride", title: "Year (override)", type: "number" },
  ],
  // Optional: require at least one of photo or image
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
