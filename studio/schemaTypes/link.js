// /schemas/objects/link.js
export default {
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    {
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    },
  ],
  preview: {
    select: { subtitle: "url" },
    prepare({ subtitle }) {
      return { title: "Link", subtitle };
    },
  },
};
