// app/galleries/[slug]/page.jsx
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import NavBarLight from "@/components/NavBarLight";
import GalleryCarouselClient from "./GalleryCarouselClient";
import ScrollToBottomOnDesktop from "./ScrollToBottomOnDesktop";

export const revalidate = 60;

const query = /* groq */ `
*[_type=="gallery" && slug.current==$slug][0]{
  _id,
  title,
  year,
  description,
  "slug": slug.current,

  // NEW: curated items
  "items": items[]{
    _key,
    "url": coalesce(image.asset->url, photo->image.asset->url),
    "lqip": coalesce(image.asset->metadata.lqip, photo->image.asset->metadata.lqip),
    "width": coalesce(image.asset->metadata.dimensions.width, photo->image.asset->metadata.dimensions.width),
    "height": coalesce(image.asset->metadata.dimensions.height, photo->image.asset->metadata.dimensions.height),
    "ratio": coalesce(image.asset->metadata.dimensions.aspectRatio, photo->image.asset->metadata.dimensions.aspectRatio),
    "title": coalesce(titleOverride, photo->title),
    "description": coalesce(descriptionOverride, photo->description),
    "alt": coalesce(titleOverride, photo->title, "Photo")
  },

  // OLD: referenced photos[]
  "photosRef": photos[]->{
    _id,
    title,
    description,
    "url": image.asset->url,
    "lqip": image.asset->metadata.lqip,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
    "ratio": image.asset->metadata.dimensions.aspectRatio,
    "alt": coalesce(alt, title, "Photo")
  },

  // OLD: inline images[]
  "photosInline": images[]{
    _key,
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "ratio": asset->metadata.dimensions.aspectRatio,
    "alt": coalesce(alt, caption, "Photo"),
    "title": coalesce(title, caption),
    "description": caption
  }
}
`;

function normalizePhoto(p, i) {
  if (!p?.url) return null;
  return {
    id: p._id || p._key || `${i}`,
    url: p.url,
    alt: p.alt || "Photo",
    title: p.title || null,
    description: p.description || "",
    lqip: p.lqip || null,
    width: p.width ?? null,
    height: p.height ?? null,
    ratio: p.ratio ?? (p.width && p.height ? p.width / p.height : null),
  };
}

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

  const photos = raw.map(normalizePhoto).filter(Boolean);
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
  const { slug } = await params; // not a Promise
  const gallery = await getGallery(slug);
  if (!gallery) notFound();

  return (
    <>
      <div className="fixed inset-x-0 top-0 h-6 bg-opacity-100 z-30" />
      <NavBarLight />
      <ScrollToBottomOnDesktop>
        <div className="pt-24 bg-background text-black min-h-screen">
          <GalleryCarouselClient gallery={gallery} />
        </div>
      </ScrollToBottomOnDesktop>
    </>
  );
}
