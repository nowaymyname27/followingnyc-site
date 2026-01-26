import { createClient } from "next-sanity";
import NavBarLight from "@/components/NavBarLight";
import BackButton from "@/components/BackButton";
import AiCollectionCard from "./components/AiCollectionCard";
// We no longer need VideoPlayer or the expanded type
import { AiCollection } from "../../sanity.types";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
});

// Simplified query: Just get the collections
const AI_PAGE_QUERY = /* groq */ `
  *[_type == "aiCollection"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "original": coalesce(previewOriginal, originals[0]).asset->{
      "url": url,
      metadata{dimensions}
    },
    "generated": coalesce(previewGenerated, generated[0]).asset->{
      "url": url,
      metadata{dimensions}
    }
  }
`;

export const revalidate = 60;

export default async function AiGridPage() {
  // Fetch the array directly
  const collections = await client.fetch<AiCollection[]>(AI_PAGE_QUERY);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-x-0 top-0 h-6 bg-background z-30" />
      <NavBarLight />

      <div className="mx-auto max-w-[2000px] px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4">
          <div>
            <div className="mb-4">
              <BackButton>Back Home</BackButton>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              AI Experiments
            </h1>
            <p className="mt-2 text-gray-500">
              Exploring the bridge between reality and artificial imagination.
            </p>
          </div>
        </div>

        {/* Collections Grid */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {collections.map((project) => (
              <AiCollectionCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
