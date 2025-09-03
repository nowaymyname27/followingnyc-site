// app/news/TestimonialsSection.jsx
import Image from "next/image";
import { createClient } from "next-sanity";

export const revalidate = 900;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
});

const TESTIMONIALS_QUERY = `
*[_type=="testimonial"]|order(date desc, _createdAt desc){
  _id,
  quote,
  name,
  date,
  item{
    image{asset->{"url": url}},
    titleOverride
  }
}
`;

export default async function TestimonialsSection() {
  const testimonials = await client.fetch(TESTIMONIALS_QUERY);

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-center">
        What People Say
      </h2>

      {/* Full-bleed grid */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Auto-fit as many columns as possible with a nice min width */}
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
            {testimonials?.length ? (
              testimonials.map((t) => <TestimonialTile key={t._id} t={t} />)
            ) : (
              <p className="text-neutral-500">No testimonials yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Tile ---------------- */

function TestimonialTile({ t }) {
  const imgUrl = t?.item?.image?.asset?.url;

  // Short preview (for the collapsed state)
  const collapsed = truncate(t?.quote || "", 220);

  return (
    <article className="relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md">
      {/* Attribution row */}
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-neutral-100 ring-1 ring-black/5">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={t?.item?.titleOverride || t?.name || "Image"}
              fill
              sizes="48px"
              className="object-cover"
              priority={false}
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-tight truncate">
            {t?.name || "Anonymous"}
          </div>
          <time className="text-xs text-neutral-500">
            {t?.date
              ? new Date(t.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </time>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-4">
        {/* Collapsible without client JS */}
        <details>
          <summary className="list-none cursor-pointer text-left">
            <p className="text-[15px] leading-relaxed text-neutral-800">
              <span className="mr-1 text-neutral-400">“</span>
              <span className="align-middle">
                {collapsed.isTruncated ? collapsed.text : t?.quote}
              </span>
              <span className="ml-1 text-neutral-400">”</span>
            </p>
            {collapsed.isTruncated ? (
              <span className="mt-2 inline-block rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
                Read full
              </span>
            ) : null}
          </summary>

          {/* Full text reveals below summary */}
          {collapsed.isTruncated ? (
            <div className="mt-3">
              <p className="text-[15px] leading-relaxed text-neutral-800">
                <span className="mr-1 text-neutral-400">“</span>
                <span className="align-middle">{t?.quote}</span>
                <span className="ml-1 text-neutral-400">”</span>
              </p>
            </div>
          ) : null}
        </details>
      </div>
    </article>
  );
}

/* ---------------- Utils ---------------- */

function truncate(str, max = 220) {
  const s = String(str || "");
  if (s.length <= max) return { text: s, isTruncated: false };
  // try to cut on a word boundary
  const cut = s.slice(0, max).replace(/\s+\S*$/, "");
  return { text: `${cut}…`, isTruncated: true };
}
