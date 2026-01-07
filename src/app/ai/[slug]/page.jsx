import { createClient } from "next-sanity";
import { notFound } from "next/navigation";
import NavBarLight from "@/components/NavBarLight";
import AiProjectViewer from "./components/AiProjectViewer";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
});

// Fetch current project + Next/Prev slugs for navigation
const PROJECT_QUERY = /* groq */ `
{
  "current": *[_type == "aiCollection" && slug.current == $slug][0]{
    _id,
    title,
    description,
    "originals": originals[]{ asset->{ "url": url } },
    "generated": generated[]{ asset->{ "url": url } }
  },
  "next": *[_type == "aiCollection" && publishedAt > ^.publishedAt] | order(publishedAt asc) [0] { "slug": slug.current },
  "prev": *[_type == "aiCollection" && publishedAt < ^.publishedAt] | order(publishedAt desc) [0] { "slug": slug.current }
}
`;

export default async function AiProjectPage({ params }) {
  const data = await client.fetch(PROJECT_QUERY, { slug: params.slug });

  if (!data.current) return notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <NavBarLight />
      <div className="pt-24 pb-12">
        <AiProjectViewer
          project={data.current}
          nextSlug={data.next?.slug}
          prevSlug={data.prev?.slug}
        />
      </div>
    </main>
  );
}
