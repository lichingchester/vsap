import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import react from "@astrojs/react";

// Astro's dev dependency scanner crawls *every* component under `src/`, not
// just files reachable from a live page. That sweep enters code that is never
// actually executed by the site:
//   1. Legacy `src/docs/**` and the legacy snippet *blocks* under
//      `src/components/<category>/<name>/` (the VSAP-era dirs being phased out
//      — see CLAUDE.md "Legacy"). NOTE: the top-level `src/components/*` files
//      (SnippetTabs.vue, GradientTextPlayground.vue, ApiTable.astro, …) are the
//      LIVE docs-only components and must NOT be stubbed — hence the nested
//      `components/<dir>/` match below, not all of `src/components`.
//   2. Non-reference snippet variants (react-next, *-css, html, …), which ship
//      as RAW TEXT for copy-paste — only the vue-tailwind reference variant is
//      run (ADR-0004 no-drift rule).
// Those files import packages we deliberately don't install (next/link, gsap,
// three, reka-ui, lucide-vue-next, @vueuse/core) or `@/`-style aliases that
// only resolve inside a consumer's project, so the scanner logs a noisy
// "could not be resolved … Skipping dependency pre-bundling" warning.
// We stub any import that ORIGINATES from those files, silencing the scan
// without touching live code (real pages, meta.ts, the reference variant, the
// top-level docs components) or any snippet later ported into
// `src/snippets/**/vue-tailwind`.
function ignoreUnexecutedImports() {
  const FROM_DEAD_CODE =
    /[\\/]src[\\/]docs[\\/]|[\\/]src[\\/]components[\\/][^\\/]+[\\/]|[\\/]snippets[\\/].*[\\/](vue-css|react-tailwind|react-css|react-next|html)[\\/]/;
  const STUB_ID = "\0tskr-ignored-import";
  return {
    name: "tskr:ignore-unexecuted-imports",
    enforce: "pre",
    resolveId(source, importer) {
      return importer && FROM_DEAD_CODE.test(importer) ? STUB_ID : null;
    },
    load(id) {
      return id === STUB_ID ? "export default {};" : null;
    },
  };
}

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Vue handles .vue files, React handles .jsx/.tsx — no overlap, so both
  // framework islands can render on the same page (the multi-framework preview).
  // Tailwind v4 is wired via PostCSS (postcss.config.mjs) rather than the
  // @tailwindcss/vite plugin, which is incompatible with Astro 7's Rolldown Vite.
  integrations: [vue(), react()],

  vite: {
    plugins: [ignoreUnexecutedImports()],
  },
});
