// /schemas/testimonial.js
export default {
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    {
      name: "quote",
      title: "Testimonial",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "item",
      title: "Image (collection item)",
      type: "collectionItem", // uses your existing object
      validation: (Rule) => Rule.required(),
    },
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "date",
      title: "Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "quote",
      media: "item.image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? subtitle.slice(0, 50) + "…" : "",
        media,
      };
    },
  },
};
