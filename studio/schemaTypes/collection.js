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
    { name: "capturedAtOverride", title: "Capture Date", type: "date" },
    { name: "description", type: "text" },
    {
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },

    // NEW: curated array of items (like gallery.items)
    {
      name: "items",
      title: "Collection Items",
      type: "array",
      of: [{ type: "collectionItem" }],
      options: { sortable: true },
      validation: (Rule) => Rule.min(1).error("Add at least one item."),
    },

    {
      name: "tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
    { name: "published", type: "boolean", initialValue: true },
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      year: "year",
      count: "items.length",
    },
    prepare({ title, media, year, count }) {
      const qty = count ? `${count} image${count === 1 ? "" : "s"}` : "Empty";
      return { title, subtitle: `${year ?? "—"} • ${qty}`, media };
    },
  },
};
