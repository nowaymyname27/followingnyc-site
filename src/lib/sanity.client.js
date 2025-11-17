// /lib/sanity.client.js
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "../sanity/env";

// Client for reliably fetching published content everywhere (local + production)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // ensure fresh, uncached data for cross-dataset references
  perspective: "published", // keep published-only behavior
});
