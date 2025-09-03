export default {
  name: "gallery",
  title: "Gallery",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: (Rule) => Rule.required() },
    {
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "year",
      type: "number",
      validation: (Rule) => Rule.integer().min(1900).max(2100),
    },
    { name: "description", type: "text" },
    {
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "items",
      title: "Gallery Items",
      type: "array",
      of: [{ type: "galleryItem" }],
      validation: (Rule) => Rule.min(1),
    },
    {
      name: "tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
    { name: "published", type: "boolean", initialValue: true },
  ],
  preview: {
    select: { title: "title", media: "coverImage", description: "description" },
    prepare({ title, media, description }) {
      const subtitle = description
        ? `${description.slice(0, 80)}${description.length > 80 ? "…" : ""}`
        : "No description";
      return { title, subtitle, media };
    },
  },
};
