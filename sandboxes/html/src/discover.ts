import type { SnippetMeta, Variant } from "../../../src/snippets/types";
export type { Variant };

/**
 * Discover every HTML variant straight from the real snippet source. Fragments
 * are pulled in as ?raw text (no execution here) — the switcher runs each one
 * in an iframe srcdoc so its inline/CDN <script> actually executes (ADR-0017).
 */

const metaModules = import.meta.glob<{ default: SnippetMeta }>(
  "../../../src/snippets/**/meta.ts",
  { eager: true },
);

// Raw HTML fragment text, keyed by path.
const htmlModules = import.meta.glob<string>("../../../src/snippets/**/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});

export interface HtmlEntry {
  key: string;
  snippet: SnippetMeta;
  variant: Variant;
  html: string;
}

export const entries: HtmlEntry[] = buildEntries();

function buildEntries(): HtmlEntry[] {
  const out: HtmlEntry[] = [];
  for (const [metaPath, mod] of Object.entries(metaModules)) {
    const snippet = mod.default;
    const folder = metaPath.replace(/\/meta\.ts$/, "");
    for (const variant of snippet.variants) {
      if (variant.framework !== "html") continue;
      const entryPath = `${folder}/${variant.id}/${variant.entry}`;
      const html = htmlModules[entryPath];
      if (html == null) continue;
      out.push({
        key: `${snippet.name}--${variant.id}`,
        snippet,
        variant,
        html,
      });
    }
  }
  return out.sort((a, b) => a.key.localeCompare(b.key));
}

export interface HtmlGroup {
  title: string;
  items: HtmlEntry[];
}

export function groupedEntries(): HtmlGroup[] {
  const groups: HtmlGroup[] = [];
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
