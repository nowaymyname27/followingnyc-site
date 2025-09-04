// /schemas/featured.js
export default {
  name: "featured",
  title: "Featured Item",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title (Outlet / Headline)",
      type: "string",
      validation: (Rule) => Rule.required().min(2),
    },
    {
      name: "photo",
      title: "Photo",
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
      name: "photoTitle",
      title: "Photo Title (display)",
      type: "string",
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
      media: "photo",
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
