// app/featured/PeopleGrid.client.jsx
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PeopleGrid({ items }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 px-4 md:px-8">
      {(items ?? []).map((p) => {
        const { _id, name, slug, portraitUrl, portraitAlt, count } = p || {};
        return (
          <button
            key={_id}
            onClick={() => router.push(`/featured/people/${slug}`)}
            className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface text-left"
            aria-label={`Open ${name}`}
          >
            {portraitUrl ? (
              <Image
                src={portraitUrl}
                alt={portraitAlt || name || "Person"}
                fill
                className="object-contain bg-surface transition-transform duration-300 ease-out group-hover:scale-105 group-hover:brightness-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-sm text-foreground/60">
                No portrait
              </div>
            )}

            {/* White footer for text */}
            <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-white">
              <div className="text-foreground text-sm sm:text-base font-medium">
                {name}
              </div>
              {typeof count === "number" && (
                <div className="text-foreground/70 text-xs">
                  {count} photo{count === 1 ? "" : "s"}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
