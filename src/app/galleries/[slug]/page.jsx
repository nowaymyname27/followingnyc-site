// app/galleries/[slug]/page.jsx
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import NavBarLight from "@/components/NavBarLight";
import GalleryCarouselClient from "./GalleryCarouselClient";

export const revalidate = 60;

// Supports NEW schema (items[] of galleryItem) and falls back to OLD photos/images
const query = /* groq */ `
*[_type=="gallery" && slug.current==$slug][0]{
  _id,
  title,
  year,
  description,
  "slug": slug.current,

  // NEW: curated items with overrides
  "items": items[]{
    _key,
    // resolve an image whether it's embedded or via photo reference
    "url": coalesce(image.asset->url, photo->image.asset->url),
    // per-item fields with sensible fallbacks
    "title": coalesce(titleOverride, photo->title),
    "description": coalesce(descriptionOverride, photo->description),
    "alt": coalesce(titleOverride, photo->title, "Photo")
  },

  // OLD: for backward compatibility if you still have these
  "photosRef": photos[]->{
    _id,
    title,
    description,
    "url": image.asset->url,
    "alt": coalesce(alt, title, "Photo")
  },
  "photosInline": images[]{
    _key,
    "url": asset->url,
    "alt": coalesce(alt, caption, "Photo"),
    "title": coalesce(title, caption),
    "description": caption
  }
}
`;

async function getGallery(slug) {
  const data = await sanityClient.fetch(query, { slug });
  if (!data) return null;

  const raw =
    (Array.isArray(data.items) && data.items.length && data.items) ||
    (Array.isArray(data.photosRef) &&
      data.photosRef.length &&
      data.photosRef) ||
    (Array.isArray(data.photosInline) &&
      data.photosInline.length &&
      data.photosInline) ||
    [];

  const photos = raw
    .filter((p) => p && p.url)
    .map((p, i) => ({
      id: p._id || p._key || `${i}`,
      url: p.url,
      alt: p.alt || "Photo",
      title: p.title || null,
      description: p.description || "",
    }));

  if (!photos.length) return null;

  return {
    id: data._id,
    title: data.title || "Untitled Gallery",
    year: data.year ?? null,
    slug: data.slug,
    description: data.description || "",
    photos,
  };
}

export default async function Page({ params }) {
  const { slug } = params;
  const gallery = await getGallery(slug);
  if (!gallery) notFound();

  return (
    <>
      {/* Match the page background so the navbar area blends */}
      <div className="fixed inset-x-0 top-0 h-6 bg-background z-30" />

      <NavBarLight />

      {/* Content padded to clear fixed nav; use the same cream background */}
      <div className="pt-24 bg-background text-black min-h-screen">
        <GalleryCarouselClient gallery={gallery} />
      </div>
    </>
  );
}
