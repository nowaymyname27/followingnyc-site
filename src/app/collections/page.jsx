// app/collections/page.jsx
import { sanityClient } from "@/lib/sanity.client";
import NavBarLight from "@/components/NavBarLight";
import CollectionsClient from "./CollectionsClient";

export const revalidate = 60;

// V2: structured cover with metadata (preferred)
const queryV2 = /* groq */ `
*[_type == "collection" && (published != false)]
| order(coalesce(year, 0) desc, title asc) {
  _id,
  title,
  year,
  "slug": slug.current,
  "cover": select(
    defined(coverImage.asset) => {
      "src": coverImage.asset->url,
      "lqip": coverImage.asset->metadata.lqip,
      "width": coverImage.asset->metadata.dimensions.width,
      "height": coverImage.asset->metadata.dimensions.height,
      "ratio": coverImage.asset->metadata.dimensions.aspectRatio
    },
    defined(items[0].image.asset) => {
      "src": items[0].image.asset->url,
      "lqip": items[0].image.asset->metadata.lqip,
      "width": items[0].image.asset->metadata.dimensions.width,
      "height": items[0].image.asset->metadata.dimensions.height,
      "ratio": items[0].image.asset->metadata.dimensions.aspectRatio
    },
    null
  ),
  "count": count(items)
}
`;

// Fallback: string URL only
const queryFallback = /* groq */ `
*[_type == "collection" && (published != false)]
| order(coalesce(year, 0) desc, title asc) {
  _id,
  title,
  year,
  "slug": slug.current,
  "cover": coalesce(coverImage.asset->url, items[0].image.asset->url),
  "count": count(items)
}
`;

function normalizeCover(c) {
  if (!c) return null;
  if (typeof c === "string") {
    return { src: c, lqip: null, width: null, height: null, ratio: null };
  }
  if (typeof c === "object" && c.src) return c;
  return null;
}

async function getCollections() {
  let rows = [];
  try {
    rows = await sanityClient.fetch(queryV2);
  } catch {
    rows = [];
  }
  if (!rows?.length) rows = await sanityClient.fetch(queryFallback);

  return (rows || []).map((c) => ({
    id: c._id,
    title: c.title,
    year: c.year ?? null,
    slug: c.slug,
    cover: normalizeCover(c.cover),
    count: Number.isFinite(c.count) ? c.count : 0,
  }));
}

export default async function Page() {
  const albums = await getCollections();
  return (
    <>
      <div className="fixed inset-x-0 top-0 h-6 bg-opacity-100 z-30" />
      <NavBarLight />
      <div className="pt-24 bg-background text-black">
        <CollectionsClient albums={albums} />
      </div>
    </>
  );
}
