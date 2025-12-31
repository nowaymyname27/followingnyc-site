// app/featured/people/[slug]/page.jsx
import { createClient } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import NavBarLight from "@/components/NavBarLight";
import BackButton from "@/components/BackButton"; // Import your new component

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
            {/* Using the reusable component for scroll restoration */}
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

          {/* Photos grid */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Photos</h2>
            <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {(photos ?? []).map((ph, idx) => {
                const url = ph?.asset?.url;
                const alt = ph?.alt || name;
                return (
                  <figure
                    key={url ?? idx}
                    className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface"
                  >
                    {url && (
                      <Image
                        src={url}
                        alt={alt}
                        fill
                        className="object-contain bg-surface transition-transform group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
                      />
                    )}
                  </figure>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
