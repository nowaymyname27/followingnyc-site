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
  capturedAtOverride,
  description,
  "slug": slug.current,
  items[]{
    _key,
    // prefer inline image, else referenced photo image
    "url": coalesce(image.asset->url, photo->image.asset->url),
    "lqip": coalesce(image.asset->metadata.lqip, photo->image.asset->metadata.lqip),
    "width": coalesce(image.asset->metadata.dimensions.width, photo->image.asset->metadata.dimensions.width),
    "height": coalesce(image.asset->metadata.dimensions.height, photo->image.asset->metadata.dimensions.height),
    "ratio": coalesce(image.asset->metadata.dimensions.aspectRatio, photo->image.asset->metadata.dimensions.aspectRatio),
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

function normalizeItem(i, idx) {
  if (!i?.url) return null;
  return {
    id: i._key ?? `${idx}`,
    url: i.url,
    alt: i.alt || "Photo",
    title: i.title ?? null,
    description: i.description ?? "",
    capturedAt: i.capturedAt ?? null,
    tags: i.tags || [],
    // perf extras:
    lqip: i.lqip || null,
    width: i.width ?? null,
    height: i.height ?? null,
    ratio: i.ratio ?? (i.width && i.height ? i.width / i.height : null),
  };
}

async function getCollection(slug) {
  const data = await sanityClient.fetch(query, { slug });
  if (!data) return null;

  const items = (data.items || []).map(normalizeItem).filter(Boolean);
  if (!items.length) return null;

  return {
    id: data._id,
    title: data.title,
    year: data.year ?? null,
    date: data.capturedAtOverride ?? null,
    slug: data.slug,
    description: data.description || "",
    items,
  };
}

export default async function Page({ params: paramsPromise }) {
  const { slug } = await paramsPromise; // await required on app router
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
