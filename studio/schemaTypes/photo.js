export default {
  name: "photo",
  title: "Photo",
  type: "document",
  fields: [
    { name: "title", type: "string" }, // optional, since bulk uploads shouldn’t require it
    {
      name: "image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    { name: "description", type: "text" },
    {
      name: "tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
    { name: "capturedAt", title: "Capture Date", type: "datetime" },
    // key change: point to the parent collection so we don’t maintain giant arrays
    {
      name: "collection",
      title: "Parent Collection",
      type: "reference",
      to: [{ type: "collection" }],
    },
  ],
  preview: {
    select: { title: "title", media: "image", coll: "collection.title" },
    prepare({ title, media, coll }) {
      return { title: title || "Untitled photo", subtitle: coll || "—", media };
    },
  },
};
