// app/news/TestimonialsSection.jsx
import { createClient } from "next-sanity";
import TestimonialsGrid from "./TestimonialsGrid.client";

export const revalidate = 900;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
});

const TESTIMONIALS_QUERY = /* groq */ `
*[_type=="testimonial"] | order(date desc, _createdAt desc){
  _id,
  quote,
  name,
  date,

  // New fields (fallback to old collectionItem)
  "photoUrl": coalesce(photo.asset->url, item.image.asset->url),
  "photoAlt": coalesce(photo.alt, "Image"),
  "titleOverride": coalesce(photoTitle, item.titleOverride)
}
`;

export default async function TestimonialsSection() {
  const testimonials = await client.fetch(TESTIMONIALS_QUERY);

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-center">
        What People Say
      </h2>

      {/* Full-bleed grid */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <div className="px-4 sm:px-6 lg:px-8">
          <TestimonialsGrid items={testimonials ?? []} />
        </div>
      </div>
    </section>
  );
}
