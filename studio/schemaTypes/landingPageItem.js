export default {
  name: "landingPageItem",
  title: "Landing Page Item",
  type: "object",
  fields: [
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    { name: "titleOverride", title: "Title", type: "string" },
  ],
  preview: {
    select: { t: "titleOverride", media: "image" },
    prepare({ t, media }) {
      return { title: t || "Image", media };
    },
  },
};
