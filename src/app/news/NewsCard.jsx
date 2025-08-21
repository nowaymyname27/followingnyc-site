// app/news/NewsCard.jsx
// Server Component by default (no client-only APIs)

export default function NewsCard({
  href,
  title,
  source,
  dateMs,
  summaryHtml,
  imageUrl,
}) {
  const date = new Date(dateMs || Date.now());

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Image */}
      <a href={href} target="_blank" rel="noreferrer" className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title || "Story image"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-neutral-400 text-sm">
              No image
            </div>
          )}
        </div>
      </a>

      {/* Body */}
      <div className="p-4">
        <a href={href} target="_blank" rel="noreferrer" className="block">
          <h2 className="line-clamp-2 text-base font-semibold tracking-tight group-hover:underline">
            {title || "Untitled"}
          </h2>
        </a>

        <p
          className="mt-2 line-clamp-3 text-sm text-neutral-600"
          // Render brief HTML summary safely; RSS often ships snippets
          dangerouslySetInnerHTML={{
            __html: summaryHtml || "",
          }}
        />

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
          <span className="truncate">{source || "Source"}</span>
          <span aria-hidden>•</span>
          <time dateTime={date.toISOString()}>
            {date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
    </article>
  );
}
