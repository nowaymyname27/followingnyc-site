// app/galleries/page.jsx
import { sanityClient } from "@/lib/sanity.client";
import GalleriesClient from "./GalleriesClient";
import NavBarLight from "@/components/NavBarLight";

export const revalidate = 60;

const query = `
*[_type == "gallery"]{
  _id,
  title,
  "slug": slug.current,
  description,
  year,
  "cover": coverImage.asset->url
} | order(coalesce(year, 0) desc, title asc)
`;

async function getGalleries() {
  const rows = await sanityClient.fetch(query);
  return rows.map((r) => ({
    id: r._id,
    slug: r.slug,
    title: r.title,
    description: r.description || "",
    year: r.year ?? null,
    cover: r.cover || "",
  }));
}

export default async function Page() {
  const items = await getGalleries();

  return (
    <>
      {/* White shim so the floating nav never shows a dark band above */}
      <div className="fixed inset-x-0 top-0 h-6 bg-opacity-100 z-30" />
      <NavBarLight />

      {/* Content padded to clear fixed nav */}
      <div className="pt-24 bg-background text-black">
        <GalleriesClient items={items} />
      </div>
    </>
  );
}
