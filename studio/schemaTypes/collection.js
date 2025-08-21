export default {
  name: "collection",
  title: "Collection",
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
      validation: (Rule) => Rule.required().integer().min(1900).max(2100),
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
    {
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      count: "photos.length",
      year: "year",
    },
    prepare({ title, media, count, year }) {
      const qty = count ? `${count} photo${count === 1 ? "" : "s"}` : "Empty";
      return { title, subtitle: `${year ?? "—"} • ${qty}`, media };
    },
  },
};
