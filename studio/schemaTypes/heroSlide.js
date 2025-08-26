// heroSlide.js
export default {
  name: "heroSlide",
  title: "Hero Slide",
  type: "object",
  fields: [
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "alt",
      title: "Alt Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "modes",
      title: "Modes",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "checkbox",
        list: [
          { title: "Fullscreen", value: "fullscreen" },
          { title: "Side Image", value: "sideImage" },
          { title: "Triple Column", value: "tripleColumn" },
        ],
      },
      validation: (Rule) => Rule.unique(), // no duplicate modes per slide
    },
  ],
  preview: {
    select: { media: "image", alt: "alt", modes: "modes" },
    prepare({ media, alt, modes }) {
      return {
        title: alt || "Image",
        subtitle: modes?.length ? `Modes: ${modes.join(", ")}` : "No modes",
        media,
      };
    },
  },
};
