// app/collections/page.jsx
import { sanityClient } from "@/lib/sanity.client";
import NavBarLight from "@/components/NavBarLight";
import CollectionsClient from "./CollectionsClient";

export const revalidate = 60;

// Fetch all collections (published), newest year first, then title.
// …
const query = /* groq */ `
*[_type == "collection" && (published != false)] 
| order(coalesce(year, 0) desc, title asc) {
  _id,
  title,
  year,
  "slug": slug.current,
  // alias to "cover" so the card can read it directly
  "cover": coalesce(
    coverImage.asset->url,
    items[0].image.asset->url
  ),
  "count": count(items)
}
`;

async function getCollections() {
  const rows = await sanityClient.fetch(query);
  return (rows || []).map((c) => ({
    id: c._id,
    title: c.title,
    year: c.year ?? null,
    slug: c.slug,
    cover: c.cover || null, // <-- was coverUrl
    count: typeof c.count === "number" ? c.count : 0,
  }));
}

export default async function Page() {
  const albums = await getCollections();

  return (
    <>
      {/* keep navbar consistent with your inner pages */}
      <div className="fixed inset-x-0 top-0 h-6 bg-opacity-100 z-30" />
      <NavBarLight />

      <div className="pt-24 bg-background text-black">
        <CollectionsClient albums={albums} />
      </div>
    </>
  );
}
