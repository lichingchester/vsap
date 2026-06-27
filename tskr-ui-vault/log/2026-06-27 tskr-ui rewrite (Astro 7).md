# 2026-06-27 — tskr/ui rewrite (Astro 7)

Process + result log for the rewrite of the library from a VitePress + jsrepo Vue
component registry into **tskr/ui**, a multi-framework copy-paste collection on Astro.

See also: [[CONTEXT]] (glossary) and the [[Home|ADR index]].

## Goal

Reposition the project from "install a Vue component library (via the jsrepo CLI)"
to a **copy-paste collection** of components / effects / layouts that supports
Vue, React, and plain HTML, with Tailwind or native CSS — no global setup.

## How we got here (the grilling)

Worked through the design one decision at a time. Each crystallised decision was
written down immediately as a glossary term ([[CONTEXT]]) or an ADR:

1. **What are we escaping?** jsrepo already copies source, so the real target was
   the *CLI/tooling step*. → drop jsrepo for a web **copy button**; per-snippet
   **Prerequisites** replace "zero setup". → [[0001-distribution-by-web-copy-paste]]
2. **The variant matrix.** Vue/React/HTML × Tailwind/CSS = up to 6 cells, which
   collides with "ship fast". → **Vue + Tailwind is the reference**; other cells
   are opportunistic **ports**. `utility` snippets are exempt (**native variants**).
   → [[0002-vue-tailwind-reference-variant]]
3. **The site framework.** VitePress is Vue-only; multi-framework previews need
   islands. → **Astro**, replacing VitePress. → [[0003-astro-over-vitepress]]
4. **No-setup vs Tailwind.** Reframed honestly: native-CSS variant is the true
   zero-setup path; everything else declares Prerequisites.
5. **Name.** VSAP (Vue-anchored) → **tskr/ui** (framework-neutral).
6. **On-disk shape.** `src/snippets/<category>/<snippet>/` with one folder per
   variant + a `meta.ts` data model. The **no-drift rule**: preview and copy
   payload come from the *same* file. → [[0004-single-source-snippet-structure]]
7. **Page UX.** Two-tier — cheap default (live preview of the reference + code-only
   variant tabs + copy) and rare opt-in playgrounds; the preview always renders the
   reference variant. → [[0005-two-tier-pages-preview-renders-reference]]
8. **First build.** Rebuild all four old components from scratch (backed up first);
   **LinkTag first** as the `utility` proof-of-concept.

## The Astro version saga

Originally [[0003-astro-over-vitepress|ADR-0003]] chose **Astro 6**, because a
May 2026 source reported Astro 7 as an alpha. At scaffold time (June 2026)
`npm view astro dist-tags` showed `latest: 7.0.2` — **Astro 7 had shipped stable**.
The ADR's premise was dead, so we moved to **Astro 7** and rewrote the ADR to
record the correction.

Astro 7 ships **Rolldown Vite (Vite 8)**, which then broke the standard Tailwind v4
setup twice:

- `@tailwindcss/vite` → `q.createIdResolver is not a function` (Rolldown lacks the
  Vite API the plugin calls).
- Switched to `@tailwindcss/postcss` → `ENOENT … /tailwindcss` (Rolldown's CSS
  resolver doesn't honor the package's bare-specifier `style` export condition).

**Fix that worked:** Tailwind v4 via PostCSS, importing the explicit subpath
`@import "tailwindcss/index.css"` (a direct file mapping Rolldown can resolve).
Verified utilities actually emit in the built CSS.

## What was built

- **Astro 7** site (`astro.config.mjs`, `postcss.config.mjs`, `src/layouts`,
  `src/pages`, `src/components/SnippetTabs.vue`).
- **Snippet data model**: `src/snippets/types.ts` (`SnippetMeta`, `Variant`, …).
- **LinkTag** rebuilt at `src/snippets/utils/link-tag/` as a `utility` with native
  variants: `vue/`, `vue-nuxt/`, `react-next/`, `html/`, plus `meta.ts`.
- **Snippet page** (`src/pages/snippets/utils/link-tag.astro`) demonstrating the
  no-drift rule: the Vue reference is mounted as an island for the preview and
  `?raw`-imported for the copy block; other variants are raw-only (never executed).

## Verification

`npm run build` → 2 pages built. Confirmed in `dist/`:
- Tailwind utilities emitted (`.max-w-4xl`, `.bg-neutral-950`, `.underline`).
- Live preview rendered a real `<a href="https://example.com" target="_blank">`.
- All four variant payloads embedded from their source files.
- Per-variant Prerequisites rendered.

## Result / state

- Merged to `develop` and pushed. Old site preserved on the `archive/vsap-vitepress`
  branch and the `pre-tskr` tag.
- Follow-ups filed as GitHub issues #2–#8 (GradientText, dynamic routing, SplitText,
  Aurora, cleanup, rename, tests).

## Open follow-ups worth noting

- The LinkTag page is still hand-written — generalise to a dynamic route (issue #3).
- Old VitePress/jsrepo files still present as migration reference (issue #6, blocked
  on the three remaining component migrations).
- Repo/git/CLAUDE.md still say "vsap" — rename pending (issue #7).
