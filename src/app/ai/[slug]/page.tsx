import { createClient } from "next-sanity";
import { notFound } from "next/navigation";
import NavBarLight from "@/components/NavBarLight";
import AiProjectViewer from "./components/AiProjectViewer";

// We define a local interface for the specific shape of this page's data
// to ensure type safety without over-complicating global types.
export interface ProjectData {
  _id: string;
  title: string;
  description?: string;
  originals: Array<{ asset: { url: string } }>;
  generated: Array<{ asset: { url: string } }>;
  aiVideos: Array<{
    _key: string;
    asset: {
      playbackId: string;
      data?: {
        aspect_ratio?: string;
      };
    };
  }>;
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
});

const PROJECT_QUERY = /* groq */ `
{
  "current": *[_type == "aiCollection" && slug.current == $slug][0]{
    _id,
    title,
    description,
    "originals": originals[]{ asset->{ "url": url } },
    "generated": generated[]{ asset->{ "url": url } },
    "aiVideos": aiVideos[]{ 
      _key,
      asset->{ 
        playbackId,
        data { aspect_ratio }
      } 
    }
  },
  "next": *[_type == "aiCollection" && publishedAt > ^.publishedAt] | order(publishedAt asc) [0] { "slug": slug.current },
  "prev": *[_type == "aiCollection" && publishedAt < ^.publishedAt] | order(publishedAt desc) [0] { "slug": slug.current }
}
`;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AiProjectPage({ params }: PageProps) {
  // Await params in Next.js 15+ (if you are on older version, remove await)
  const { slug } = await params;

  const data = await client.fetch(PROJECT_QUERY, { slug });

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
