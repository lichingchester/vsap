# VSAP — Copilot Instructions

## Project Overview

VSAP is a **copy-and-use Vue component registry** distributed via [jsrepo](https://jsrepo.dev). Users install individual components into their own projects (`npx jsrepo add <category>/<block>`), so each component must be **self-contained** with no cross-component imports. The docs site is a separate VitePress app used for previewing components.

## Repository Layout

- `src/components/<category>/<name>/` — **Registry components** (the actual distributable). Each folder is a jsrepo "block" containing a single `.vue` file (+ optional `.spec.ts` and `README.md`). Categories: `backgrounds`, `text-animations`, `utils`.
- `src/components/<category>/<name>-nuxt/` — **Nuxt variants** of components that need framework-specific code (e.g., `link-tag-nuxt/`). These are excluded from TypeScript checking via `tsconfig.json`.
- `docs/` — VitePress documentation site. Each component page lives at `docs/components/<category>/<name>/index.md`.
- `src/docs/` — Vue components used **only** in the docs site (previews, showcases, shadcn UI, etc.). These are NOT part of the registry.
- `jsrepo-manifest.json` — Auto-generated manifest listing all registry blocks. Rebuilt with `npm run build:registry`.
- `jsrepo-build-config.json` — Configuration for jsrepo build. `excludeDeps: ["vue", "vue-router"]` means these are peer deps.

## Key Commands

| Command                  | Purpose                                                |
| ------------------------ | ------------------------------------------------------ |
| `npm run docs:dev`       | Start VitePress dev server for docs                    |
| `npm run docs:build`     | Build docs for production                              |
| `npm run build:registry` | Rebuild jsrepo manifest (`jsrepo-manifest.json`)       |
| `npm test`               | Run Vitest in watch mode (browser-mode via Playwright) |
| `npm run test:run`       | Run tests once                                         |

## Adding a New Component

1. Create `src/components/<category>/<ComponentName>/ComponentName.vue` — the component file.
2. If it needs a Nuxt variant, create `src/components/<category>/<component-name>-nuxt/ComponentName.vue`.
3. Run `npm run build:registry` to regenerate `jsrepo-manifest.json`.
4. Create documentation page at `docs/components/<category>/<component-name>/index.md`.
5. Create preview/showcase Vue files in `src/docs/components/<category>/<component-name>/` (`Preview.vue`, `Showcases.vue`).
6. Add the component to the VitePress sidebar in `docs/.vitepress/config.mts`.

## Component Conventions

- **Vue 3 Composition API with `<script setup lang="ts">`** — all components use TypeScript and `defineProps` with interface types.
- **Props use `withDefaults(defineProps<Interface>(), { ... })`** pattern for default values.
- **Self-contained** — registry components must not import from other registry components. External deps (gsap, three) are declared per-block in the manifest.
- **Naming**: PascalCase for `.vue` filenames matching the component name. Kebab-case for directory names.
- **Nuxt variants** use the same filename as the Vue variant but import from `#components` (e.g., `NuxtLink`) instead of `vue-router`.

## Documentation Page Pattern

Each doc page (`docs/components/.../index.md`) follows this structure:

```md
<script setup lang="ts">
import Preview from "@/src/docs/components/<category>/<name>/Preview.vue";
import Showcases from "@/src/docs/components/<category>/<name>/Showcases.vue";
</script>

# Component Name

<Preview />
## Installation (jsrepo / standalone / manual install) ## Showcases
<Showcases case-name="CaseName" />
```

- `Preview.vue` — interactive demo with configuration controls (uses shadcn UI from `src/docs/components/shadcn/`).
- `Showcases.vue` — uses `caseName` prop with `v-if` to switch between showcase variants.
- Path alias `@/` resolves to the project root.

## Testing

- Framework: **Vitest** with `@vue/test-utils`, running in browser mode (Playwright/Chromium).
- Test files are co-located with components: `src/components/<category>/<name>/ComponentName.spec.ts`.
- Tests use `vi.mock()` for external deps like `vue-router`.

## Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.js` — uses CSS-based config).
- Docs UI uses **shadcn-vue** (new-york style) configured in `components.json`.
- Registry components should use Tailwind utility classes for styling.

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`.
When making code updates, suggest the git commit message for the updates too.
