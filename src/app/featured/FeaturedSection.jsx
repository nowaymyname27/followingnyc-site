// app/news/FeaturedSection.jsx
import { createClient } from "next-sanity";
import FeaturedGrid from "./FeaturedGrid.client";

export const revalidate = 900;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
});

const FEATURED_QUERY = `
*[_type=="featured"]|order(_createdAt desc){
  _id,
  title,
  cover{asset->{"url": url}, alt},
  item{
    image{asset->{"url": url}},
    titleOverride
  },
  links[]{url}
}
`;

export default async function FeaturedSection() {
  const items = await client.fetch(FEATURED_QUERY);

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-center">
        Featured In
      </h2>

      {/* Full-bleed grid */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <FeaturedGrid items={items ?? []} />
      </div>
    </section>
  );
}
