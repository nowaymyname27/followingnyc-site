// app/collections/[slug]/page.jsx
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import NavBarLight from "@/components/NavBarLight";
import CollectionClient from "./CollectionClient";

export const revalidate = 60;

const query = `
*[_type=="collection" && slug.current==$slug && (published != false)][0]{
  _id,
  title,
  year,
  "slug": slug.current,
  "photos": photos[]->{
    _id,
    title,
    // adapt field names if your photo schema differs (e.g., mainImage vs image)
    "url": coalesce(image.asset->url, mainImage.asset->url),
    "alt": coalesce(alt, title)
  }
}
`;

async function getCollection(slug) {
  const data = await sanityClient.fetch(query, { slug });
  if (!data || !data.photos?.length) return null;

  // Normalize to client shape
  return {
    id: data._id,
    title: data.title,
    year: data.year,
    slug: data.slug,
    photos: data.photos
      .filter((p) => !!p?.url)
      .map((p) => ({ id: p._id, url: p.url, alt: p.alt || "Photo" })),
  };
}

export default async function Page({ params }) {
  const { slug } = params;
  const collection = await getCollection(slug);
  if (!collection) notFound();

  return (
    <>
      {/* White shim so the floating nav never shows a dark band above */}
      <div className="fixed inset-x-0 top-0 h-6 bg-background z-30" />

      {/* Solid white / black-text navbar for inner pages */}
      <NavBarLight />

      {/* Content padded to clear fixed nav */}
      <div className="pt-24 bg-background text-black">
        <CollectionClient collection={collection} />
      </div>
    </>
  );
}
