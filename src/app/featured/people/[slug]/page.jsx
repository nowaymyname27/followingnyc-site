// app/featured/people/[slug]/page.jsx
import { createClient } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import NavBarLight from "@/components/NavBarLight";
import BackButton from "@/components/BackButton";

export const revalidate = 900;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
});

const PERSON_QUERY = /* groq */ `
*[_type=="person" && slug.current==$slug][0]{
  _id,
  name,
  bio,
  "slug": slug.current,
  cover{asset->{"url": url}, alt},
  "photos": photos[]{
    asset->{
      "url": url,
      metadata{dimensions}
    },
    alt
  }
}
`;

export async function generateMetadata({ params }) {
  const person = await client.fetch(PERSON_QUERY, { slug: params.slug });
  if (!person) return { title: "Person" };
  return {
    title: `${person.name} — People You May Know`,
    description: person.bio || `Photos of ${person.name}`,
  };
}

export default async function PersonPage({ params }) {
  const person = await client.fetch(PERSON_QUERY, { slug: params.slug });

  if (!person) {
    return (
      <main className="pt-24 min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p>Not found.</p>
          <Link href="/featured" className="underline">
            Back to Featured
          </Link>
        </div>
      </main>
    );
  }

  const { name, bio, cover, photos } = person;

  return (
    <>
      <div className="fixed inset-x-0 top-0 h-6 bg-background z-30" />
      <NavBarLight />
      <main className="pt-24 min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 space-y-10">
          {/* Back to Featured button */}
          <div className="mb-3">
            <BackButton>Back to Featured</BackButton>
          </div>

          {/* Header */}
          <header className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative w-28 h-36 rounded-xl overflow-hidden bg-surface">
              {cover?.asset?.url && (
                <Image
                  src={cover.asset.url}
                  alt={cover.alt || name}
                  fill
                  className="object-contain bg-surface"
                  sizes="112px"
                />
              )}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
              {bio && (
                <p className="text-foreground/80 whitespace-pre-line">{bio}</p>
              )}
            </div>
          </header>

          {/* Photos Masonry Grid */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Photos</h2>

            {/* 
               CHANGED: Switched from 'grid' to 'columns-*'. 
               'gap-4' handles horizontal space between columns.
               'space-y-4' is NOT used here because vertical spacing is handled per item.
            */}
            <div className="columns-2 md:columns-3 xl:columns-4 gap-4">
              {(photos ?? []).map((ph, idx) => {
                const url = ph?.asset?.url;
                const alt = ph?.alt || name;
                // Extract dimensions from Sanity metadata
                const { width, height } = ph?.asset?.metadata?.dimensions || {
                  width: 800,
                  height: 600,
                };

                return (
                  <div
                    key={url ?? idx}
                    // CHANGED: 'break-inside-avoid' prevents an image from being cut in half across columns
                    // 'mb-4' adds the vertical spacing between items in the column
                    className="relative mb-4 break-inside-avoid overflow-hidden rounded-xl bg-surface group"
                  >
                    {url && (
                      <Image
                        src={url}
                        alt={alt}
                        // CHANGED: Removed 'fill'. We use intrinsic width/height
                        // so the browser knows the exact aspect ratio.
                        width={width}
                        height={height}
                        className="h-auto w-full object-cover transition-transform group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
