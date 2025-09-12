// app/featured/PeopleSection.jsx
import { createClient } from "next-sanity";
import PeopleGrid from "./PeopleGrid.client";

export const revalidate = 900;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
});

const PEOPLE_QUERY = /* groq */ `
*[_type=="person" && defined(slug.current)] | order(name asc){
  _id,
  name,
  "slug": slug.current,
  "portraitUrl": cover.asset->url,
  "portraitAlt": coalesce(cover.alt, name),
  "count": count(photos)
}
`;

export default async function PeopleSection() {
  const people = await client.fetch(PEOPLE_QUERY);

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-center">
        People You May Know
      </h2>

      {/* Full-bleed grid (matches Featured) */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <PeopleGrid items={people ?? []} />
      </div>
    </section>
  );
}
