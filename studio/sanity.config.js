import { defineConfig } from "sanity";
import { visionTool } from "@sanity/vision";
import { structureTool } from "sanity/structure";

// local imports inside /studio
import { schemaTypes } from "./schemaTypes"; // from studio/schemaTypes/index.(js|ts)
import { structure } from "./structure"; // from studio/structure.(js|ts)

export default defineConfig({
  // When deploying Studio as its own app, keep root path:
  basePath: "/",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || "staging",
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool(), // api version is optional unless you need a specific one
  ],
});
