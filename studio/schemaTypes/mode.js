// mode.js
export default {
  name: "mode",
  title: "Mode",
  type: "object",
  fields: [
    {
      name: "kinds",
      title: "Kinds",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Fullscreen", value: "fullscreen" },
          { title: "Side Image", value: "sideImage" },
          { title: "Triple Column", value: "tripleColumn" },
        ],
        layout: "checkbox",
      },
      validation: (Rule) => Rule.unique(),
    },
  ],
  preview: {
    select: { kinds: "kinds" },
    prepare: ({ kinds }) => ({
      title: kinds?.length
        ? `Modes: ${kinds.join(", ")}`
        : "Modes (none selected)",
    }),
  },
};
