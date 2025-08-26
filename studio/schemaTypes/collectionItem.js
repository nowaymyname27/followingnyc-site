export default {
  name: "collectionItem",
  title: "Collection Item",
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
    { name: "descriptionOverride", title: "Description", type: "text" },
    { name: "capturedAtOverride", title: "Capture Date", type: "datetime" },
    {
      name: "tagsOverride",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
  ],
  preview: {
    select: { t: "titleOverride", media: "image" },
    prepare({ t, media }) {
      return { title: t || "Image", media };
    },
  },
};
