export default {
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    {
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
};
