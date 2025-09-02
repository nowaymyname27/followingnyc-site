// app/page.jsx
import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";
import WelcomeBox from "@/components/WelcomeBox";
import { sanityClient } from "@/lib/sanity.client";

export const revalidate = 60;

const query = `
*[_type == "landingPage"][0]{
  title,
  pageDescription,
  heroSlides[]{
    _key,
    alt,
    description,
    modes,
    "url": image.asset->url
  }
}
`;

async function getLandingPage() {
  const doc = await sanityClient.fetch(query);
  const slides = (doc?.heroSlides || []).map((s, i) => ({
    id: s._key || `slide-${i}`,
    src: s.url,
    alt: s.alt || "",
    description: s.description || "",
    modes:
      Array.isArray(s.modes) && s.modes.length
        ? s.modes
        : ["fullscreen", "sideImage", "tripleColumn"], // fallback: show in all modes
  }));

  return {
    pageTitle: doc?.title || "",
    slides,
  };
}

export default async function Page() {
  const landing = await getLandingPage();

  const allModes = ["fullscreen", "sideImage", "tripleColumn"];
  // Partition slides into per-mode arrays, preserving order
  const mediaOverride = allModes.reduce((acc, m) => ({ ...acc, [m]: [] }), {});
  landing.slides.forEach((s) => {
    s.modes.forEach((m) => {
      if (mediaOverride[m]) mediaOverride[m].push(s);
    });
  });

  return (
    <Hero
      interval={7000}
      mode="auto"
      layoutRangeMs={21000}
      darkenBg
      darkenFactor={0.5}
      colors={[
        "#0ea5e9",
        "#6366f1",
        "#a78bfa",
        "#f472b6",
        "#fb7185",
        "#34d399",
        "#f59e0b",
      ]}
      enabledModes={allModes.filter((m) => mediaOverride[m].length > 0)} // only enable modes that have slides
      mediaOverride={mediaOverride}
    >
      <NavBar brand="FollowingNYC" />
      <WelcomeBox title={landing.pageTitle} />
    </Hero>
  );
}
