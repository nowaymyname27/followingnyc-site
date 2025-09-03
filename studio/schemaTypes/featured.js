// /schemas/featured.js
export default {
  name: "featured",
  title: "Featured Item",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(2),
    },
    {
      name: "cover",
      title: "Cover Image (Outlet/Org Logo or Screenshot)",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "item",
      title: "Featured Photo",
      type: "collectionItem", // uses your existing object schema
      validation: (Rule) => Rule.required(),
    },
    {
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "link" }],
      validation: (Rule) => Rule.min(1),
    },
    {
      name: "note",
      title: "Short Note (optional)",
      type: "text",
      rows: 3,
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "cover",
      firstUrl: "links[0].url",
    },
    prepare({ title, media, firstUrl }) {
      let subtitle = "";
      try {
        subtitle = firstUrl
          ? new URL(firstUrl).hostname.replace(/^www\./, "")
          : "";
      } catch {}
      return { title, media, subtitle };
    },
  },
};
