// app/galleries/[slug]/page.jsx
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import NavBarLight from "@/components/NavBarLight";
import GalleryCarouselClient from "./GalleryCarouselClient";

export const revalidate = 60;

/**
 * Adjust field names if your schema differs (e.g., mainImage vs image).
 */
const query = `
*[_type=="gallery" && slug.current==$slug][0]{
  _id,
  title,
  year,
  description,
  "slug": slug.current,

  // Prefer a referenced photo list if present:
  "photosRef": photos[]->{
    _id,
    title,
    description,
    "url": coalesce(image.asset->url, mainImage.asset->url),
    "alt": coalesce(alt, title)
  },

  // Fallback: inline images[] array
  "photosInline": images[]{
    _key,
    "url": asset->url,
    "alt": coalesce(alt, caption),
    "title": coalesce(title, caption),
    "description": caption
  }
}
`;

async function getGallery(slug) {
  const data = await sanityClient.fetch(query, { slug });
  if (!data) return null;

  const photosRaw =
    (data.photosRef && data.photosRef.length
      ? data.photosRef
      : data.photosInline) || [];

  const photos = photosRaw
    .filter((p) => !!p?.url)
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
