export default {
  name: "collection",
  title: "Collection",
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
    // optional: a few hand-picked images to show on the collection page
    {
      name: "featuredPhotos",
      title: "Featured Photos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "photo" }] }],
    },
    {
      name: "tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
    { name: "published", type: "boolean", initialValue: true },
  ],
  preview: {
    select: { title: "title", media: "coverImage", year: "year" },
    prepare({ title, media, year }) {
      return { title, subtitle: year || "—", media };
    },
  },
};
