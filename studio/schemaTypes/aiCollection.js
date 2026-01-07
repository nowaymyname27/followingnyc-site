export default {
  name: "aiCollection",
  title: "AI Collection",
  type: "document",
  fieldsets: [
    {
      name: "preview",
      title: "Grid Preview",
      options: { collapsible: true, collapsed: false },
    },
  ],
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
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    },

    // --- NEW PREVIEW FIELDS ---
    {
      name: "previewOriginal",
      title: "Preview: Original Source",
      description: "The image shown by default on the grid card.",
      type: "image",
      options: { hotspot: true },
      fieldset: "preview",
    },
    {
      name: "previewGenerated",
      title: "Preview: AI Generated",
      description: "The image revealed on hover.",
      type: "image",
      options: { hotspot: true },
      fieldset: "preview",
    },
    // --------------------------

    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    },
    {
      name: "originals",
      title: "Originals (Full Gallery)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "generated",
      title: "AI Generated (Full Gallery)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
};
