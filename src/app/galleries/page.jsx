// app/galleries/page.jsx
import { sanityClient } from "@/lib/sanity.client";
import GalleriesClient from "./GalleriesClient";
import NavBarLight from "@/components/NavBarLight";

export const revalidate = 60;

// Enhanced (with metadata)
const queryV2 = `
*[_type == "gallery"]{
  _id,
  title,
  "slug": slug.current,
  description,
  year,
  "cover": select(
    defined(coverImage.asset) => {
      "src": coverImage.asset->url,
      "lqip": coverImage.asset->metadata.lqip,
      "width": coverImage.asset->metadata.dimensions.width,
      "height": coverImage.asset->metadata.dimensions.height,
      "aspectRatio": coverImage.asset->metadata.dimensions.aspectRatio
    },
    null
  )
} | order(coalesce(year, 0) desc, title asc)
`;

// Original (string URL only)
const queryFallback = `
*[_type == "gallery"]{
  _id,
  title,
  "slug": slug.current,
  description,
  year,
  "cover": coverImage.asset->url
} | order(coalesce(year, 0) desc, title asc)
`;

function normalizeCover(c) {
  if (!c) return null;
  if (typeof c === "string") {
    return { src: c, lqip: null, width: null, height: null, aspectRatio: null };
  }
  if (typeof c === "object" && c.src) return c;
  return null;
}

async function getGalleries() {
  let rows = [];
  try {
    rows = await sanityClient.fetch(queryV2);
  } catch {
    rows = [];
  }
  if (!rows?.length) {
    // Fallback to the original query if V2 returns nothing or errors
    rows = await sanityClient.fetch(queryFallback);
  }

  return (rows || []).map((r) => ({
    id: r._id,
    slug: r.slug,
    title: r.title,
    description: r.description || "",
    year: r.year ?? null,
    cover: normalizeCover(r.cover),
  }));
}

export default async function Page() {
  const items = await getGalleries();

  return (
    <>
      <div className="fixed inset-x-0 top-0 h-6 bg-opacity-100 z-30" />
      <NavBarLight />
      <div className="pt-24 bg-background text-black">
        <GalleriesClient items={items} />
      </div>
    </>
  );
}
