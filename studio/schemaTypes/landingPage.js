export default {
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Page Title (meta/SEO)",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "pageDescription",
      title: "Page Description (meta/SEO)",
      type: "text",
    },
    {
      name: "heroSlides",
      title: "Hero Slides",
      type: "array",
      of: [{ type: "heroSlide" }],
      validation: (Rule) => Rule.min(1).error("Add at least one slide."),
      options: { layout: "grid" },
    },

    {
      name: "latestGallery",
      title: "Latest Gallery",
      type: "reference",
      to: [{ type: "gallery" }],
      options: {
        disableNew: true,
        modal: "select", // use dropdown UI
        display: "select", // ALWAYS show dropdown selector (no preview card)
      },
    },

    {
      name: "latestCollection",
      title: "Latest Collection",
      type: "reference",
      to: [{ type: "collection" }],
      options: {
        disableNew: true,
        modal: "select",
        display: "select",
      },
    },

    {
      name: "tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
  ],
  preview: {
    select: { title: "title", media: "heroSlides.0.image" },
    prepare({ title, media }) {
      return { title: title || "Landing Page", media };
    },
  },
};
