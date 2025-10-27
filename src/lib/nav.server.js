// /lib/nav.server.js
import { sanityClient } from "./sanity.client";
import { LATEST_GALLERIES, LATEST_COLLECTIONS } from "./sanity.queries";

export async function getNavbarMenus() {
  try {
    const [galleries, collections] = await Promise.all([
      sanityClient.fetch(LATEST_GALLERIES),
      sanityClient.fetch(LATEST_COLLECTIONS),
    ]);

    const galleryLinks = (galleries || [])
      .filter((g) => g?.slug) // ensure we have a usable URL
      .map((g) => ({ label: g.title, href: `/galleries/${g.slug}` }));

    const collectionLinks = (collections || [])
      .filter((c) => c?.slug)
      .map((c) => ({ label: c.title, href: `/collections/${c.slug}` }));

    galleryLinks.push({ label: "All Galleries", href: "/galleries" });
    collectionLinks.push({ label: "All Collections", href: "/collections" });

    return [
      { label: "Galleries", links: galleryLinks },
      { label: "Collections", links: collectionLinks },
    ];
  } catch (error) {
    console.error("Failed to fetch navbar menus:", error);
    return [
      {
        label: "Galleries",
        links: [{ label: "All Galleries", href: "/galleries" }],
      },
      {
        label: "Collections",
        links: [{ label: "All Collections", href: "/collections" }],
      },
    ];
  }
}
