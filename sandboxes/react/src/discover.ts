import type { SnippetMeta, Variant } from "../../../src/snippets/types";

/**
 * Discover every React variant straight from the real snippet source, using the
 * same `import.meta.glob` mechanism the site registry uses (src/lib/snippets.ts).
 * The file that ships is the file that runs — no copy to drift (ADR-0017).
 */

// Eager: metadata for every snippet (small, needed to build the list).
const metaModules = import.meta.glob<{ default: SnippetMeta }>(
  "../../../src/snippets/**/meta.ts",
  { eager: true },
);

// Lazy: the component entries, imported one at a time when a variant is picked.
// `import.meta.glob` bundles EVERY matched file at build time (not just the ones
// the runtime loads), so `react-next` — which imports `next/link` — must be
// excluded here, not merely filtered below, or the build can't resolve it.
const componentModules = import.meta.glob<{ default: unknown }>([
  "../../../src/snippets/**/*.{tsx,jsx}",
  "!../../../src/snippets/**/react-next/**",
]);

export interface SandboxEntry {
  /** URL-safe id: `${snippet.name}--${variant.id}` (both are already slugs). */
  key: string;
  snippet: SnippetMeta;
  variant: Variant;
  load: () => Promise<{ default: unknown }>;
}

// `framework: "react"` is the plain-React target. `react-next` carries
// framework "react-next" and is filtered out here — it needs a real Next
// runtime (next/link), out of scope for a plain Vite app (ADR-0006 / ADR-0017).
const TARGET_FRAMEWORK = "react";

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
      if (!load) continue; // entry not found on disk — skip rather than crash
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
