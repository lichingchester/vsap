# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**tskr/ui** is a **copy-paste collection** of UI components, visual effects, and layouts for the web (ADR-0001). Users copy a snippet's source straight into their own project from the site — there is **no install, no CLI, no package**. The old jsrepo + VitePress "Vue component registry" (VSAP) was retired; this is now an **Astro 7** site supporting multiple frameworks.

Two consequences drive everything:

1. **Snippets must be self-contained.** A distributable snippet may not import from another snippet. External deps (gsap, three) are declared per-variant as **Prerequisites**, not assumed present.
2. **The site is a separate concern.** Site chrome, previews, and docs-only components are never copied into a user's project.

## Commands

```bash
npm run dev      # Astro dev server — the primary way to view/work on the site
npm run build    # Production build (static)
npm run preview  # Preview the production build
npm run check    # astro check (type-check)
```

Notes:
- Requires **Node >= 24** (LTS "Krypton"); pinned via `.nvmrc` / `.node-version`.
- No lint script; formatting is Prettier-on-save via `.vscode/settings.json`.
- `astro check` reports a few **pre-existing** errors in legacy/raw files (`src/docs/lib/utils.ts`, the `link-tag/react-next` variant referencing `next/link`). Those variants are shipped as raw source, never compiled here.

## The snippet model (ADR-0002, ADR-0004)

A **snippet** is the atomic unit a user copies. Each lives at:

```
src/snippets/<category>/<name>/
├── meta.ts                      # data model: title, kind, category, props, variants, prerequisites
├── vue-tailwind/<Name>.vue      # the reference variant (Vue + Tailwind) — source of truth
├── vue-css/…  react-tailwind/…  react-css/…  html/…   # ports / native variants
```

- **Reference variant** = Vue + Tailwind, authored first. Other variants are **ports** (visual snippets) or **native variants** (utilities, which have no single canonical source).
- **Kinds:** `component`, `effect`, `layout`, `utility`. **Categories** are user-facing slugs (`text-animations`, `backgrounds`, `utils`, …).
- **No-drift rule:** a detail page's live preview mounts the *same* file it `?raw`-imports for the code tab. Only the reference variant is executed; other variants are raw text only (their `next/link`/`#components` imports never resolve here).
- `meta.ts` `props: PropDoc[]` documents the component's public props; the detail page's **API table** is generated from it.

## The site

- **`src/pages/index.astro`** — the home: a Terminal · Masthead landing (no sidebar) listing every snippet, discovered from disk.
- **`src/pages/snippets/<category>/<name>.astro`** — a snippet detail page: the **Console** layout (ADR-0011), a thin Astro page that hands `meta` + `?raw` sources to the `SnippetDetail` island. Sections **Preview → Install → Source → Usage → API** with copy artifacts and a scroll-progress "On this page" rail.
- **`src/lib/snippets.ts`** — `import.meta.glob` registry over `src/snippets/**/meta.ts`; powers the home index and the sidebar.
- **`src/layouts/`** — `Layout.astro` (base shell + fonts) and `SnippetLayout.astro` (docs shell: header + name-only sidebar + main).
- **Detail components** (`src/detail/`, docs-only, never copied, ADR-0011): the `SnippetDetail` island + `CodeBlock` (Shiki), `Controls`, `PreviewStage`, `VariantSelector`, `InstallBlock`, `ApiTable`, and the `usage`/`view`/`variantPref`/`scroll` modules.
- **Control kit** (`src/controls/`, ADR-0010): the custom "Terminal" prop controls (`Slider`, `Toggle`, `Segmented`, `Select`, `TextField`, `ColorPicker`, `ColorList`) that interactive playgrounds use instead of native inputs. Docs-only site chrome — fully custom, zero deps (lucide icons only), self-styled via `controls.css`, never copied into a user's project. Top-level (NOT `src/components/<dir>/`, which the dev-scanner stub plugin would break). The `/demo` page (`src/demo/`) is the disposable six-skin exploration that chose this design.

## Design system (ADR-0008)

- Tokens live in **`src/styles/global.css`** as Tailwind v4 `@theme` variables: warm **amber `#F5B544`** on charcoal `#0E0E11`, type **Bricolage Grotesque / Hanken Grotesk / JetBrains Mono**, tight radii. Available as utilities (`bg-canvas`, `text-accent`, `border-line`, …) and as CSS vars.
- **`src/styles/site.css`** holds the site chrome (terminal home + docs detail), reading those tokens. Snippets themselves use plain Tailwind and never depend on these tokens.
- Tailwind v4 via `@tailwindcss/postcss`; the entry imports the explicit subpath `@import "tailwindcss/index.css"` (a Rolldown/Astro 7 workaround). No `tailwind.config.js`.

## Conventions

- `<script setup lang="ts">`, `defineProps<Interface>()`, defaults via `withDefaults`. PascalCase component filenames, kebab-case directories.
- Path alias `@/` resolves to the project root.

## Adding a snippet

1. `src/snippets/<category>/<name>/vue-tailwind/<Name>.vue` (the reference) + any ports/native variants.
2. `src/snippets/<category>/<name>/meta.ts` (incl. `props` for the API table).
3. `src/pages/snippets/<category>/<name>.astro` (the detail page; mounts the reference for preview, `?raw`-imports variants for the tabs).
4. It appears on the home index and sidebar automatically (glob).

## Legacy (being phased out)

Migration cruft from the VSAP era is still present as reference while the remaining components are ported: the old `docs/` VitePress site, `src/docs/`, old `src/components/<category>/` blocks, and `jsrepo-*.json`. Don't build new work on these.

## Commits

Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`). When making code changes, suggest the commit message too.

## Agent skills

- **Issue tracker** — GitHub Issues via the `gh` CLI; external PRs are pulled into triage. See `docs/agents/issue-tracker.md`.
- **Triage labels** — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.
- **Domain docs** — all documentation lives in the Obsidian vault `tskr-ui-vault/` (glossary `CONTEXT.md`, ADRs in `adr/`, process logs in `log/`). The root `CONTEXT-MAP.md` redirects to it. See `docs/agents/domain.md`.
