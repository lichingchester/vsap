/*
 * Detail page — assembles the runtime SnippetData a detail page needs from a
 * snippet's `meta.ts` (the data model) plus its raw variant sources (which the
 * Astro page ?raw-imports, preserving no-drift, ADR-0004) and the live reference
 * component (the only variant that runs, ADR-0005).
 */
import { markRaw, type Component } from "vue";
import type { SnippetMeta } from "../snippets/types";
import type { SnippetData, DetailVariant } from "./types";

const LANG: Record<string, string> = {
  vue: "vue",
  tsx: "tsx",
  jsx: "jsx",
  ts: "ts",
  html: "html",
  css: "css",
};
const langOf = (filename: string) => LANG[filename.split(".").pop() ?? ""] ?? "txt";

export interface VariantSource {
  source: string;
  extra?: { filename: string; lang: string; source: string };
}

export function buildSnippetData(
  meta: SnippetMeta,
  component: Component,
  sources: Record<string, VariantSource>,
): SnippetData {
  const variants: DetailVariant[] = meta.variants.map((v) => {
    const s = sources[v.id];
    return {
      id: v.id,
      framework: v.framework,
      styling: v.styling,
      label: v.label,
      filename: v.entry,
      lang: langOf(v.entry),
      source: s?.source ?? "",
      extra: s?.extra,
      reference: v.reference,
      native: v.native,
      prerequisites: v.prerequisites,
    };
  });

  return {
    name: meta.name,
    title: meta.title,
    category: meta.category,
    kind: meta.kind,
    hasStylingAxis: meta.hasStylingAxis,
    replayable: meta.replayable,
    component: markRaw(component),
    previewClass: meta.previewClass,
    defaultProps: meta.previewProps ?? {},
    controls: meta.controls ?? [],
    usage: meta.usage ?? { tag: meta.title.replace(/\s+/g, ""), props: [] },
    props: meta.props ?? [],
    variants,
  };
}
