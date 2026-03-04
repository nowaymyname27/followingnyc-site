# AGENTS.md

Guidance for coding agents working in `followingnyc-site`.

## Project Overview

- Monorepo-style layout with two Node projects:
- Root app: Next.js 15 + React 19 site in `src/`.
- Studio app: Sanity Studio in `studio/`.
- Package manager in use: `npm` (lockfiles are `package-lock.json` in root and `studio/`).
- TypeScript is enabled with `strict: true`, but the codebase is mixed TS/JS.

## Repository Layout

- `src/app/`: Next.js App Router pages, layouts, route segments.
- `src/components/`: shared UI components.
- `src/lib/`: data/client/query helpers.
- `src/sanity/`: Sanity env and client-side helpers used by site code.
- `src/sanity.types.ts`: generated file from Sanity TypeGen (do not hand-edit).
- `studio/schemaTypes/`: Sanity document/object schema definitions.
- `update-types.sh`: root helper that extracts schema and regenerates site types.

## Setup and Install

- Install root dependencies: `npm install`
- Install Studio dependencies: `npm install --prefix studio`
- Start site dev server: `npm run dev`
- Start Studio dev server: `npm run dev --prefix studio`

## Build, Lint, and Test Commands

### Root (Next.js site)

- Dev: `npm run dev`
- Production build: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`
- Regenerate Sanity types: `npm run typegen`

### Studio (Sanity)

- Dev: `npm run dev --prefix studio`
- Build: `npm run build --prefix studio`
- Start built Studio: `npm run start --prefix studio`

### Tests (current status)

- There is currently no test script in root `package.json`.
- There is currently no test script in `studio/package.json`.
- No Jest/Vitest/Playwright/Cypress config was found.
- No `*.test.*` / `*.spec.*` files were found.

### Single-test execution guidance

- A single-test command is not currently available because no test runner is configured.
- If a test runner is added later, add explicit scripts and update this file.
- Recommended future script pattern (example only):
- `"test": "vitest run"`
- `"test:one": "vitest run"` then run `npm run test:one -- src/path/file.test.ts`

## Type Generation and Generated Files

- `src/sanity.types.ts` is generated from Studio schema.
- Generate via root script: `npm run typegen`.
- Under the hood, this script:
- runs `sanity schema extract` in `studio/`
- runs `sanity typegen generate --output ../src/sanity.types.ts`
- Never manually edit generated type files; regenerate instead.

## Env and Configuration Notes

- Site-side Sanity values are read from:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION` (fallback in `src/sanity/env.js`)
- Studio-side Sanity values are read from:
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET` (defaults to `staging`)
- Contact form depends on `NEXT_PUBLIC_FORMSPREE_ID`.
- Next config allows external-dir imports and transpiles Sanity packages.

## Code Style and Conventions

### General formatting

- Follow existing file-local style first when editing.
- Most files use:
- double quotes for strings
- semicolons
- trailing commas in multiline objects/arrays
- 2-space indentation
- Keep files ASCII unless existing content requires Unicode.

### Imports

- Prefer alias imports from `@/` for site code under `src/`.
- Relative imports are common for same-folder modules (e.g. `./Component`).
- Usual order in site files:
- framework/library imports (`next/*`, `react`, packages)
- internal alias imports (`@/...`)
- local relative imports
- CSS imports near top of module (`./globals.css`, module CSS).

### Components and modules

- Use function components and `export default` for route/page components.
- Add `"use client";` only for client components/hooks needing browser APIs/state.
- Keep server components async when fetching data.
- Use clear prop names and avoid deep prop drilling where practical.
- Co-locate route-specific components under their route segment folder.

### Naming conventions

- React components: `PascalCase` filenames and identifiers.
- Hooks: `camelCase` with `use` prefix (`useKeyNav`, `useCollectionsGrouping`).
- Utility/helper functions: descriptive `camelCase`.
- Constants: `UPPER_SNAKE_CASE` for true constants, otherwise `camelCase`.
- GROQ query constants are typically `query`, `queryV2`, `PROJECT_QUERY`.

### TypeScript usage

- Keep strict typing in TS files (`strict: true` is enabled).
- Prefer explicit interfaces/types for props and fetched payloads.
- Use optional fields (`?`) and nullish handling for CMS data.
- Avoid `any`; use `unknown` + narrowing when uncertain.
- In JS files, preserve JSDoc/type hints only where they add real value.

### Data fetching and error handling

- CMS data is often optional; guard with optional chaining and defaults.
- Normalize external/CMS payloads before rendering.
- For missing route content, use Next navigation `notFound()`.
- For non-critical fetch failures, fail soft with safe fallback arrays/objects.
- Avoid throwing raw errors in rendering paths when a fallback UX is available.

### Styling conventions

- Tailwind v4 is used via `@import "tailwindcss"` in `src/app/globals.css`.
- Shared theme tokens are defined in `:root` and exposed via `@theme inline`.
- Prefer utility classes; use CSS modules for complex scoped interactions.
- Reuse existing color tokens (`bg-background`, `text-foreground`) when possible.

### Sanity schema conventions (studio)

- Existing schema files mostly export plain objects with `export default`.
- Some newer schema files use `defineType`/`defineField` (TS style).
- Both styles currently coexist; keep consistency within edited file.
- Include validation rules for required editorial fields.
- Keep preview selection/prepare logic concise and content-focused.

## Lint and Quality Expectations

- ESLint extends `next/core-web-vitals` via flat config (`eslint.config.mjs`).
- Run `npm run lint` after code changes in root app.
- When changing Studio code, also ensure `npm run build --prefix studio` passes.
- Prefer small targeted changes over broad refactors unless requested.

## Rules Files (Cursor/Copilot)

- No `.cursor/rules/` directory was found.
- No `.cursorrules` file was found.
- No `.github/copilot-instructions.md` file was found.
- If any of these are added later, treat them as higher-priority local guidance and update this document.

## Agent Workflow Recommendations

- Before editing, inspect nearby files for local patterns.
- Avoid introducing a new framework/tooling unless requested.
- If adding tests, add both full-suite and single-test scripts immediately.
- For generated artifacts, run the generator script instead of hand edits.
- Keep commits focused: one concern per change where possible.
