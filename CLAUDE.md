# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

VSAP is a **copy-and-use Vue 3 component registry** distributed via [jsrepo](https://jsrepo.dev), not an npm package. Users run `npx jsrepo add <category>/<block>` to copy a single component's source directly into their own project. The two consequences that drive everything else:

1. **Registry components must be self-contained.** A component under `src/components/` may NOT import from another registry component. External deps (gsap, three) are declared per-block, not assumed present. `vue` and `vue-router` are treated as peer deps (`excludeDeps` in `jsrepo-build-config.json`).
2. **The docs site is a separate concern.** Anything under `src/docs/` and `docs/` exists only to preview components and is never shipped to users.

## Commands

```bash
npm run docs:dev        # VitePress dev server — the primary way to view/work on components
npm run docs:build      # Build docs for production
npm run build:registry  # Regenerate jsrepo-manifest.json after adding/changing a registry block
npm test                # Vitest watch mode (browser mode via Playwright/Chromium)
npm run test:run        # Run tests once
npx vitest run src/components/utils/link-tag/LinkTag.spec.ts   # Single test file
```

Notes:
- Tests run in **real browser mode** (Playwright/Chromium), not jsdom-only — `npx playwright install` may be needed first.
- There is **no lint script** despite CONTRIBUTING.md mentioning ESLint; formatting is Prettier-on-save via `.vscode/settings.json`.
- Requires Node >= 22.

## Layout

- `src/components/<category>/<name>/` — the actual distributable blocks. One `.vue` file per folder (+ optional `.spec.ts`, `README.md`). Categories: `backgrounds`, `text-animations`, `utils`.
- `src/components/<category>/<name>-nuxt/` — Nuxt variants. Same `.vue` filename as the base block but import from `#components` (e.g. `NuxtLink`) instead of `vue-router`. These are **excluded from TypeScript checking** via `tsconfig.json` (`"src/components/**/*-nuxt/*.vue"`).
- `src/docs/` — Vue used only by the docs (previews, showcases, shadcn-vue UI). NOT registry code.
- `docs/components/<category>/<name>/index.md` — VitePress page for each component.
- `jsrepo-manifest.json` — **auto-generated**; never hand-edit. Rebuild with `npm run build:registry`.

## Component conventions

- `<script setup lang="ts">`, `defineProps<Interface>()`, defaults via `withDefaults(defineProps<...>(), { ... })`.
- PascalCase `.vue` filenames matching the component; kebab-case directory names.
- Tailwind CSS v4 via `@tailwindcss/vite` — **no `tailwind.config.js`**, config is CSS-based.
- Path alias `@/` resolves to the project root (configured in both `tsconfig.json` and `docs/.vitepress/config.mts`).

## Adding a component

1. `src/components/<category>/<Name>/Name.vue` (+ `-nuxt/` variant if needed).
2. `npm run build:registry` to regenerate the manifest.
3. `docs/components/<category>/<name>/index.md` for the doc page.
4. `Preview.vue` + `Showcases.vue` under `src/docs/components/<category>/<name>/`. `Showcases.vue` switches variants via a `caseName` prop with `v-if`.
5. Register it in the VitePress sidebar in `docs/.vitepress/config.mts`.

## Commits

Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`). When making code changes, suggest the commit message too.

## Agent skills

### Issue tracker

Issues are tracked in this repo's **GitHub Issues** (via the `gh` CLI). External pull requests are also pulled into the triage queue as feature requests. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

All documentation lives in the Obsidian vault `tskr-ui-vault/` (glossary `CONTEXT.md`, ADRs in `adr/`, process logs in `log/`). A root `CONTEXT-MAP.md` redirects skills to it. See `docs/agents/domain.md`.
