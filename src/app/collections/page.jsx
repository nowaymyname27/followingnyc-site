// app/collections/page.jsx
import { sanityClient } from "@/lib/sanity.client";
import NavBarLight from "@/components/NavBarLight";
import CollectionsClient from "./CollectionsClient";

export const revalidate = 60;

// Fetch all collections (published), newest year first, then title.
const query = /* groq */ `
*[_type == "collection" && (published != false)] 
| order(coalesce(year, 0) desc, title asc) {
  _id,
  title,
  year,
  "slug": slug.current,
  // Prefer explicit coverImage; otherwise fall back to first item (embedded image or photo ref)
  "coverUrl": coalesce(
    coverImage.asset->url,
    items[0].image.asset->url,
    items[0].photo->image.asset->url
  ),
  "count": count(items)
}
`;

async function getCollections() {
  const rows = await sanityClient.fetch(query);

  // Normalize to the shape CollectionsClient expects: albums[]
  const albums = (rows || []).map((c) => ({
    id: c._id,
    title: c.title,
    year: c.year ?? null,
    slug: c.slug,
    coverUrl: c.coverUrl || null,
    count: typeof c.count === "number" ? c.count : 0,
  }));

  return albums;
}

export default async function Page() {
  const albums = await getCollections();

  return (
    <>
      {/* keep navbar consistent with your inner pages */}
      <div className="fixed inset-x-0 top-0 h-6 bg-background z-30" />
      <NavBarLight />

      <div className="pt-24 bg-background text-black">
        <CollectionsClient albums={albums} />
      </div>
    </>
  );
}
