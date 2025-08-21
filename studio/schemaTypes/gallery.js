// /schemas/gallery.js
export default {
  name: "gallery",
  title: "Gallery",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "year",
      title: "Year",
      type: "number",
      validation: (Rule) =>
        Rule.integer().min(1900).max(2100).error("Enter a valid year"),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "photos",
      title: "Photos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "photo" }] }],
      options: { sortable: true },
      validation: (Rule) => Rule.min(1).error("Add at least one photo."),
    },
    {
      name: "tags",
      title: "Tags (optional)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      description: "description",
    },
    prepare({ title, media, description }) {
      const subtitle = description
        ? `${description.slice(0, 80)}${description.length > 80 ? "…" : ""}`
        : "No description";
      return { title, subtitle, media };
    },
  },
};
