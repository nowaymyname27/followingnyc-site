// app/news/FeaturedSection.jsx
import Image from "next/image";
import { createClient } from "next-sanity";

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
        <div
          className="px-4 sm:px-6 lg:px-8
                     grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items?.length ? (
            items.map((f) => <FeatureTile key={f._id} feature={f} />)
          ) : (
            <p className="text-neutral-500 col-span-full">No features yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Tile ---------------- */

function FeatureTile({ feature }) {
  const photoUrl = feature?.item?.image?.asset?.url;
  const logoUrl = feature?.cover?.asset?.url;

  const links = Array.isArray(feature?.links) ? feature.links : [];
  const visible = links.slice(0, 3);
  const hidden = links.slice(3);

  return (
    <div
      className={[
        "group relative block overflow-hidden rounded-2xl",
        "border border-neutral-200 bg-white shadow-sm hover:shadow-md",
      ].join(" ")}
    >
      {/* Featured photo in fixed ratio; image retains its own ratio inside */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-neutral-100">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={
              feature?.item?.titleOverride || feature?.title || "Featured image"
            }
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-neutral-400">
            No image
          </div>
        )}

        {/* Legibility gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Bottom overlay: logo + title + links */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white/70 ring-1 ring-black/10">
              <Image
                src={logoUrl}
                alt={feature?.cover?.alt || "Outlet"}
                fill
                className="object-contain p-1.5"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="h-10 w-10 shrink-0 rounded-md bg-white/60 ring-1 ring-black/10" />
          )}

          <h3 className="min-w-0 text-white text-base sm:text-lg font-semibold tracking-tight drop-shadow">
            <span className="line-clamp-2">
              {feature?.title || "Untitled feature"}
            </span>
          </h3>
        </div>

        {/* Link chips (only interactive elements) */}
        {links.length > 0 ? (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {visible.map((l, i) => (
                <a
                  key={`${feature._id}-vis-${i}`}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-xs font-medium text-neutral-800 ring-1 ring-black/10 hover:bg-white"
                >
                  {safeHost(l.url)}
                </a>
              ))}
            </div>

            {hidden.length > 0 ? (
              <details className="mt-2">
                <summary className="list-none inline-flex cursor-pointer items-center rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-xs font-medium text-neutral-800 ring-1 ring-black/10 hover:bg-white select-none">
                  View all links ({links.length})
                </summary>
                <div className="mt-2 flex flex-wrap gap-2">
                  {hidden.map((l, i) => (
                    <a
                      key={`${feature._id}-hid-${i}`}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-xs font-medium text-neutral-800 ring-1 ring-black/10 hover:bg-white"
                    >
                      {safeHost(l.url)}
                    </a>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- Utils ---------------- */

function safeHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
