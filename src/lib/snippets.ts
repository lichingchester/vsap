/*
 * Snippet registry — discovers every snippet's meta.ts at build time
 * (replaces the old hand-listed array). Powers the home index and the docs
 * sidebar. The on-disk folder structure is the source of truth.
 */
import type { SnippetMeta } from "../snippets/types";

const modules = import.meta.glob<{ default: SnippetMeta }>(
  "../snippets/**/meta.ts",
  { eager: true },
);

export const allSnippets: SnippetMeta[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.title.localeCompare(b.title));

export interface SnippetGroup {
  category: string;
  items: SnippetMeta[];
}

/** Snippets grouped by category, alphabetically by category then title. */
export function groupedSnippets(): SnippetGroup[] {
  const groups: SnippetGroup[] = [];
  for (const s of [...allSnippets].sort(
    (a, b) =>
      a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
  )) {
    let g = groups.find((x) => x.category === s.category);
    if (!g) {
      g = { category: s.category, items: [] };
      groups.push(g);
    }
    g.items.push(s);
  }
  return groups;
}

export const snippetHref = (s: SnippetMeta) => `/snippets/${s.category}/${s.name}`;
