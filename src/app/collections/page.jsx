// app/collections/page.jsx
import { sanityClient } from "@/lib/sanity.client";
import CollectionsClient from "./CollectionsClient";
import NavBarLight from "@/components/NavBarLight";

export const revalidate = 60;

const query = `
*[_type=="collection" && defined(year) && (published != false)]{
  _id,
  title,
  year,
  "slug": slug.current,
  "cover": coverImage.asset->url,
  "count": coalesce(length(photos), 0)
} | order(year desc, title asc)
`;

async function getCollections() {
  const rows = await sanityClient.fetch(query);
  return rows.map((r) => ({
    id: r._id, // keep the internal id if you need it later
    slug: r.slug, // explicit slug for routing
    title: r.title,
    year: r.year,
    count: r.count ?? 0,
    cover: r.cover || "",
  }));
}

export default async function Page() {
  const albums = await getCollections();

  return (
    <>
      {/* White shim so the floating nav never shows a dark band above */}
      <div className="fixed inset-x-0 top-0 h-6 bg-background z-30" />

      {/* Solid white / black-text navbar for inner pages */}
      <NavBarLight />

      {/* Content padded to clear fixed nav */}
      <div className="pt-24 bg-background text-black">
        <CollectionsClient albums={albums} />
      </div>
    </>
  );
}
