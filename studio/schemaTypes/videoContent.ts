import { defineType, defineField } from "sanity";

export const videoContent = defineType({
  name: "videoContent",
  title: "AI Video",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Video Title",
      type: "string",
    }),
    defineField({
      name: "video",
      title: "Mux Video",
      type: "mux.video",
    }),
  ],
});
