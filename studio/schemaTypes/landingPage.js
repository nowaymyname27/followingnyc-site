export default {
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
    {
      name: "items",
      title: "Landing Page Items",
      type: "array",
      of: [{ type: "landingPageItem" }],
      validation: (Rule) => Rule.min(1),
    },
  ],
};
