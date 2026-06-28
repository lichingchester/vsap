# tskr/ui — Copilot Instructions

## Project Overview

**tskr/ui** is a **copy-paste collection** of UI components, visual effects, and layouts for the web. Users copy a snippet's source straight into their project from the site — no install, no CLI, no package. It's an **Astro 7** site supporting Vue, React, and plain HTML (with Tailwind or native CSS). The earlier jsrepo + VitePress "VSAP" registry was retired.

Two rules drive everything:

1. **Snippets must be self-contained** — a distributable snippet may not import from another. External deps (gsap, three) are declared per-variant as **Prerequisites**.
2. **The site is separate** — chrome, previews, and docs-only components are never copied.

## Repository Layout

- `src/snippets/<category>/<name>/` — the distributable snippets. `meta.ts` (data model) + one folder per variant (`vue-tailwind/` is the reference, then `vue-css/`, `react-tailwind/`, `react-css/`, `html/`, …).
- `src/pages/` — the Astro site: `index.astro` (Terminal · Masthead home) and `snippets/<category>/<name>.astro` (docs detail pages).
- `src/lib/snippets.ts` — `import.meta.glob` registry over `meta.ts`; powers the home index + sidebar.
- `src/layouts/` — `Layout.astro` (base + fonts), `SnippetLayout.astro` (docs shell).
- `src/styles/` — `global.css` (Tailwind v4 `@theme` design tokens) + `site.css` (site chrome).
- Docs-only components (never copied): `src/components/SnippetTabs.vue`, `GradientTextPlayground.vue`, `ApiTable.astro`, `OnThisPage.astro`.
- **Legacy** (being phased out, don't build on): old `docs/` VitePress site, `src/docs/`, old `src/components/<category>/` blocks, `jsrepo-*.json`.

## Key Commands

| Command           | Purpose                          |
| ----------------- | -------------------------------- |
| `npm run dev`     | Astro dev server                 |
| `npm run build`   | Production build (static)        |
| `npm run preview` | Preview the production build     |
| `npm run check`   | `astro check` (type-check)       |

Node >= 24. No lint script; Prettier-on-save.

## Adding a Snippet

1. `src/snippets/<category>/<name>/vue-tailwind/<Name>.vue` (reference) + any ports/native variants.
2. `src/snippets/<category>/<name>/meta.ts` — title, kind, category, `props` (for the API table), variants, prerequisites.
3. `src/pages/snippets/<category>/<name>.astro` — mounts the reference for the live preview, `?raw`-imports each variant for the code tabs (no-drift rule).
4. It appears on the home index + sidebar automatically.

## Conventions

- Vue 3 `<script setup lang="ts">`, `defineProps<Interface>()`, defaults via `withDefaults`. PascalCase filenames, kebab-case directories.
- Tailwind v4 via `@tailwindcss/postcss` (no `tailwind.config.js`). The entry imports `@import "tailwindcss/index.css"` (Rolldown/Astro 7 workaround).
- Design tokens (amber on charcoal; Bricolage / Hanken / JetBrains) are in `global.css @theme`; site chrome uses them in `site.css`. Snippets themselves use plain Tailwind and never depend on site tokens.

## Documentation

All domain docs live in the Obsidian vault `tskr-ui-vault/` (glossary `CONTEXT.md`, ADRs, logs). See `CONTEXT-MAP.md`.

## Commit Convention

[Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`. Suggest the commit message when making code changes.
