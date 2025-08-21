export default {
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    { name: "label", type: "string", validation: (Rule) => Rule.required() },
  ],
};
