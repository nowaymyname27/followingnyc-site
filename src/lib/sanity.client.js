// /lib/sanity.client.js
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "../sanity/env";

// Server-safe client for read-only published content
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // cached, fast, free
  perspective: "published", // ensures draft content isn’t fetched
});

// Optional helper if you ever need dynamic fetching (no caching)
// export const sanityClientNoCache = createClient({
//   projectId,
//   dataset,
//   apiVersion,
//   useCdn: false,
// });
