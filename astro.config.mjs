import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import react from "@astrojs/react";

// Displayed site version. Source of truth is the latest `v*` git tag (we tag on
// every production deploy), resolved here at build and injected as
// import.meta.env.PUBLIC_APP_VERSION. `--sort=-v:refname` gives the newest
// release regardless of branch (git describe would return an ancestry-based
// string like `pre-tskr-47-gsha` on develop). Falls back to package.json
// version (kept in sync), then "dev" when no git/tags are reachable (a bare
// checkout or a shallow CI clone). "dev" renders as plain text; a real version
// links to its GitHub release tag (see VersionChip.astro).
function resolveVersion() {
  try {
    const tag = execSync("git tag --list 'v*' --sort=-v:refname", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)[0];
    if (tag) return tag;
  } catch {
    /* no git / no tags */
  }
  try {
    const pkg = JSON.parse(
      readFileSync(new URL("./package.json", import.meta.url), "utf8"),
    );
    if (pkg.version) return `v${pkg.version}`;
  } catch {
    /* unreadable */
  }
  return "dev";
}
const APP_VERSION = resolveVersion();

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
  // Canonical origin for the production deploy (Cloudflare Pages → the custom
  // domain). Powers absolute canonical + Open Graph URLs (see Layout.astro) and
  // any future sitemap. Preview deploys still render fine; only the absolute
  // social-card URLs point at production, which is what we want them to.
  site: "https://ui.tskrlabs.com",

  // Vue handles .vue files, React handles .jsx/.tsx — no overlap, so both
  // framework islands can render on the same page (the multi-framework preview).
  // Tailwind v4 is wired via PostCSS (postcss.config.mjs) rather than the
  // @tailwindcss/vite plugin, which is incompatible with Astro 7's Rolldown Vite.
  integrations: [vue(), react()],

  vite: {
    plugins: [ignoreUnexecutedImports()],
    define: {
      "import.meta.env.PUBLIC_APP_VERSION": JSON.stringify(APP_VERSION),
    },
  },
});
