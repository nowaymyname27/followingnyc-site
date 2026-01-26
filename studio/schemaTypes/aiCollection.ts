import { defineType, defineField } from "sanity";

export default defineType({
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
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),

    // --- PREVIEW FIELDS ---
    defineField({
      name: "previewOriginal",
      title: "Preview: Original Source",
      type: "image",
      options: { hotspot: true },
      fieldset: "preview",
    }),
    defineField({
      name: "previewGenerated",
      title: "Preview: AI Generated",
      type: "image",
      options: { hotspot: true },
      fieldset: "preview",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),

    // --- IMAGE GALLERIES ---
    defineField({
      name: "originals",
      title: "Originals (Full Gallery)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "generated",
      title: "AI Generated (Full Gallery)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),

    // --- VIDEO GALLERY ---
    defineField({
      name: "aiVideos",
      title: "AI Videos",
      type: "array",
      of: [{ type: "mux.video" }],
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
});
