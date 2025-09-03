// app/collections/[slug]/page.jsx
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import NavBarLight from "@/components/NavBarLight";
import CollectionClient from "./CollectionClient";

export const revalidate = 60;

const query = /* groq */ `
*[_type=="collection" && slug.current==$slug && (published != false)][0]{
  _id,
  title,
  year,
  capturedAtOverride,            // ← add this
  description,
  "slug": slug.current,
  items[]{
    _key,
    "url": coalesce(image.asset->url, photo->image.asset->url),
    "title": coalesce(titleOverride, photo->title),
    "description": coalesce(descriptionOverride, photo->description),
    "alt": coalesce(titleOverride, photo->title, "Photo"),
    "capturedAt": coalesce(capturedAtOverride, photo->capturedAt),
    "tags": coalesce(
      tagsOverride[]->{"_id": _id, "label": label},
      photo->tags[]->{"_id": _id, "label": label}
    )
  }
}
`;

async function getCollection(slug) {
  const data = await sanityClient.fetch(query, { slug });
  if (!data) return null;

  const items = (data.items || []).filter((i) => i?.url);
  if (!items.length) return null;

  return {
    id: data._id,
    title: data.title,
    year: data.year ?? null, // keep if you still use it elsewhere
    date: data.capturedAtOverride ?? null, // ← pass the new date
    slug: data.slug,
    description: data.description || "",
    items,
  };
}

export default async function Page({ params: paramsPromise }) {
  const { slug } = await paramsPromise;
  const collection = await getCollection(slug);
  if (!collection) notFound();

  return (
    <>
      <div className="fixed inset-x-0 top-0 h-6 bg-opacity-100 z-30" />
      <NavBarLight />
      <div className="pt-24 bg-background text-black">
        <CollectionClient collection={collection} />
      </div>
    </>
  );
}
