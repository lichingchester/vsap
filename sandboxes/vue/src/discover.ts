import type { SnippetMeta, Variant } from "../../../src/snippets/types";

/**
 * Discover every Vue variant straight from the real snippet source, using the
 * same `import.meta.glob` mechanism the site registry uses (src/lib/snippets.ts).
 * The file that ships is the file that runs — no copy to drift (ADR-0017).
 */

// Eager: metadata for every snippet.
const metaModules = import.meta.glob<{ default: SnippetMeta }>(
  "../../../src/snippets/**/meta.ts",
  { eager: true },
);

// Lazy: SFC entries, imported one at a time. `vue-nuxt` is excluded here (not
// just filtered below) because it imports `#components` (a Nuxt-only virtual
// module) that a plain Vite build can't resolve — out of scope (ADR-0006/0017).
const componentModules = import.meta.glob<{ default: unknown }>([
  "../../../src/snippets/**/*.vue",
  "!../../../src/snippets/**/vue-nuxt/**",
]);

export interface SandboxEntry {
  /** URL-safe id: `${snippet.name}--${variant.id}` (both are already slugs). */
  key: string;
  snippet: SnippetMeta;
  variant: Variant;
  load: () => Promise<{ default: unknown }>;
}

// `framework: "vue"` is the plain-Vue target; `vue-nuxt` carries framework
// "vue-nuxt" and is filtered out (it needs a Nuxt runtime).
const TARGET_FRAMEWORK = "vue";

export const entries: SandboxEntry[] = buildEntries();

function buildEntries(): SandboxEntry[] {
  const out: SandboxEntry[] = [];
  for (const [metaPath, mod] of Object.entries(metaModules)) {
    const snippet = mod.default;
    const folder = metaPath.replace(/\/meta\.ts$/, "");
    for (const variant of snippet.variants) {
      if (variant.framework !== TARGET_FRAMEWORK) continue;
      const entryPath = `${folder}/${variant.id}/${variant.entry}`;
      const load = componentModules[entryPath];
      if (!load) continue;
      out.push({
        key: `${snippet.name}--${variant.id}`,
        snippet,
        variant,
        load,
      });
    }
  }
  return out.sort((a, b) => a.key.localeCompare(b.key));
}

export interface SandboxGroup {
  title: string;
  items: SandboxEntry[];
}

/** Entries grouped by snippet, for the sidebar. */
export function groupedEntries(): SandboxGroup[] {
  const groups: SandboxGroup[] = [];
  for (const e of entries) {
    let g = groups.find((x) => x.title === e.snippet.title);
    if (!g) {
      g = { title: e.snippet.title, items: [] };
      groups.push(g);
    }
    g.items.push(e);
  }
  return groups;
}
