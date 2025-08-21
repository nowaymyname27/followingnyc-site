// app/news/page.jsx
import Parser from "rss-parser";
import NavBarLight from "@/components/NavBarLight";
import NewsCard from "./NewsCard";

export const revalidate = 900; // refresh every 15 minutes

// Curate your feeds here (shared across topics)
const FEEDS = [
  "https://feeds.feedburner.com/FeatureShoot",
  "https://feeds.feedburner.com/PhotofocusBlog",
  "https://davidduchemin.com/feed/",
  "https://www.thephoblographer.com/feed/",
  "https://joemcnally.com/feed/",
  "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
  "https://nypost.com/feed/",
  "https://www.newyorker.com/feed/everything",
  "https://gothamist.com/feed",
  "https://feeds.feedburner.com/nymag/vulture",
  "https://observer.com/feed/",
  "https://www.sarahmerians.com/feed/",
  "https://hitlinphoto.com/feed/",
  "https://aperture.org/feed/",
];

/* ======================================
   TOPIC PRESETS with stricter filtering
   - label: UI tab + ?topic= value
   - values: synonyms/queries to score against
   - requireAny: each group must match at least one term
   - excludeAny: any match excludes the item
   ====================================== */
const PRESETS = [
  {
    label: "NYC events",
    values: [
      "NYC events",
      "New York City events",
      "Brooklyn events",
      "Manhattan events",
    ],
    requireAny: [
      // must be NYC-ish
      [
        "nyc",
        "new york",
        "manhattan",
        "brooklyn",
        "queens",
        "bronx",
        "staten island",
      ],
      // must be event-ish
      [
        "opening",
        "exhibit",
        "festival",
        "show",
        "concert",
        "gallery opening",
        "museum",
        "parade",
        "event",
        "conference",
        "expo",
        "social",
        "food",
      ],
    ],
    excludeAny: [
      "opinion",
      "sports betting",
      "recipe",
      "crossword",
      "politics",
      "policy",
      "shooting",
    ],
  },
  {
    label: "NYC",
    values: ["New York", "NYC news", "NYC culture"],
    requireAny: [
      [
        "nyc",
        "new york",
        "manhattan",
        "brooklyn",
        "queens",
        "bronx",
        "staten island",
      ],
    ],
    excludeAny: [
      "sports betting",
      "box score",
      "crossword",
      "wordle",
      "policy",
      "law",
    ],
  },
  {
    label: "NYC Photography",
    values: [
      "NYC photography",
      "street photography NYC",
      "urban photography New York",
    ],
    requireAny: [
      [
        "nyc",
        "ny",
        "new york",
        "manhattan",
        "brooklyn",
        "queens",
        "bronx",
        "staten island",
      ], // NYC
      [
        "photo",
        "photography",
        "photographer",
        "camera",
        "lens",
        "gallery",
        "exhibit",
        "museum",
        "art",
      ], // photo
    ],
    excludeAny: ["sports betting", "real estate listing"],
  },
];

/* =========================
   Text helpers
   ========================= */
function norm(s = "") {
  return String(s).toLowerCase();
}

function containsAny(hay, terms = []) {
  const h = norm(hay);
  return terms.some((t) => h.includes(norm(t)));
}

/* ======================================
   Relevance + filtering (strict first)
   ====================================== */
function baseScore(queries = [], title = "", summary = "") {
  const hay = norm(`${title} ${summary}`);
  let score = 0;

  for (const q of queries) {
    const words = norm(q).split(/\s+/).filter(Boolean);
    // word hits
    for (const w of words) {
      const safe = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matches = hay.match(new RegExp(`\\b${safe}\\b`, "g"));
      if (matches) score += matches.length * 2;
    }
    // phrase boost
    if (hay.includes(norm(q))) score += 5;
  }
  return score;
}

function recencyBoost(dateMs) {
  if (!dateMs) return 0;
  const days = (Date.now() - dateMs) / 86_400_000;
  // linear decay: strong boost < 3 days, fades by ~10 days
  return Math.max(0, 10 - Math.min(days, 10));
}

function passesRequirements(preset, title = "", summary = "") {
  const hay = `${title} ${summary}`;
  // Every requireAny group must match at least one term
  if (preset.requireAny?.length) {
    for (const group of preset.requireAny) {
      if (!containsAny(hay, group)) return false;
    }
  }
  // Any exclude term knocks it out
  if (preset.excludeAny?.length && containsAny(hay, preset.excludeAny)) {
    return false;
  }
  return true;
}

/* ======================================
   RSS image extraction
   ====================================== */
function extractImage(item = {}) {
  const encUrl = item.enclosure?.url;
  const mediaContent = item.media?.content?.url || item["media:content"]?.url;
  const mediaThumb = item.media?.thumbnail?.url || item["media:thumbnail"]?.url;
  if (encUrl) return encUrl;
  if (mediaContent) return mediaContent;
  if (mediaThumb) return mediaThumb;

  const html =
    item["content:encoded"] ||
    item.content ||
    item.summary ||
    item.contentSnippet;
  if (html && typeof html === "string") {
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m?.[1]) return m[1];
  }
  return null;
}

/* ======================================
   Fetch, filter, score per query
   ====================================== */
async function fetchAllItems() {
  const parser = new Parser({ timeout: 15000 });
  const results = await Promise.allSettled(
    FEEDS.map((u) => parser.parseURL(u))
  );

  return results.flatMap((res) => {
    if (res.status !== "fulfilled" || !res.value?.items) return [];
    const source = res.value.title || "";
    return (res.value.items || []).map((it) => ({ ...it, _source: source }));
  });
}

// dedupe by link/guid/title (loose)
function dedupeItems(items) {
  const seen = new Set();
  return items.filter((it) => {
    const key = (it.link || it.guid || it.title || "").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Choose a preset by label (or build a default from free text)
function presetFor(topicKey) {
  const p = PRESETS.find(
    (x) => x.label.toLowerCase() === String(topicKey).toLowerCase()
  );
  if (p) return p;
  // fallback: treat the free text as a single-query preset requiring NYC context lightly
  return {
    label: topicKey,
    values: [topicKey],
    requireAny: [
      [
        "nyc",
        "new york",
        "manhattan",
        "brooklyn",
        "queens",
        "bronx",
        "staten island",
      ],
    ],
    excludeAny: [],
  };
}

export default async function NewsPage({ searchParams }) {
  // Await per Next.js dynamic API rule
  const params = await searchParams;
  const topicKey = (params?.topic || "NYC Photography").trim();
  const preset = presetFor(topicKey);

  // Fetch once from all feeds, then filter/score for this preset
  const raw = await fetchAllItems();
  const deduped = dedupeItems(raw);

  // Normalize + precompute dates/images
  const withMeta = deduped.map((it) => ({
    ...it,
    _image: extractImage(it),
    _date: new Date(it.isoDate || it.pubDate || Date.now()).getTime(),
  }));

  // 1) Strict filter:
  //    - must have image
  //    - must satisfy ALL requireAny groups
  //    - must not match excludeAny
  const strictlyRelevant = withMeta.filter(
    (it) =>
      !!it._image &&
      passesRequirements(
        preset,
        it.title,
        it.contentSnippet || it.content || it.summary || ""
      )
  );

  // 2) Score with queries + recency
  const scored = strictlyRelevant
    .map((it) => {
      const hay = it.contentSnippet || it.content || it.summary || "";
      const s =
        baseScore(preset.values, it.title, hay) + recencyBoost(it._date);
      return { ...it, _scoreCombined: s };
    })
    .filter((it) => it._scoreCombined > 0)
    .sort((a, b) => b._scoreCombined - a._scoreCombined || b._date - a._date)
    .slice(0, 36);

  return (
    <>
      {/* Top shim to match site pattern */}
      <div className="fixed inset-x-0 top-0 h-6 bg-background z-30" />
      <NavBarLight />

      {/* Content */}
      <div className="pt-24 min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          {/* Tabs + Search */}
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Tabs topicKey={topicKey} />
          </header>

          {/* Grid */}
          {scored.length === 0 ? (
            <p className="mt-20 text-center text-neutral-600">
              No image stories matched <strong>{topicKey}</strong>. Try another
              tab or edit the search.
            </p>
          ) : (
            <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {scored.map((a, idx) => {
                const key = String(a.link || a.guid || idx);
                return (
                  <li key={key}>
                    <NewsCard
                      href={a.link}
                      title={a.title}
                      source={a._source}
                      dateMs={a._date}
                      summaryHtml={
                        a.contentSnippet || a.content || a.summary || ""
                      }
                      imageUrl={a._image}
                    />
                  </li>
                );
              })}
            </ol>
          )}

          <footer className="mt-10 text-center text-xs text-neutral-500">
            <p>
              Showing {scored.length} image stories for{" "}
              <strong>{preset.label}</strong>. Feeds: {FEEDS.length}.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

/* ---------------- UI Bits ---------------- */

function Tabs({ topicKey }) {
  return (
    <nav className="flex flex-wrap items-center gap-2">
      {PRESETS.map((t) => {
        const isActive = t.label.toLowerCase() === topicKey.toLowerCase();
        const href = `/news?topic=${encodeURIComponent(t.label)}`;
        return (
          <a
            key={t.label}
            href={href}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
              isActive
                ? "border-neutral-800 bg-neutral-900 text-white"
                : "border-neutral-300 bg-background text-foreground hover:bg-neutral-100",
            ].join(" ")}
          >
            {t.label}
          </a>
        );
      })}
    </nav>
  );
}
