/*
 * Detail page — the runtime shape the detail components consume, assembled from
 * a snippet's `meta.ts` plus its raw variant sources (see snippetData.ts). The
 * copy-artifact model (Install · Source · Usage) and the generated Usage are
 * built off this. Docs-only; never copied into a user's project.
 */
import type { Component } from "vue";
import type {
  PropDoc,
  ControlSpec,
  UsageDescriptor,
  Prerequisite,
} from "../snippets/types";

export interface DetailVariant {
  id: string;
  framework: string;
  styling?: "tailwind" | "css";
  label: string;
  /** Filename for the code block's filename tab + as the Source. */
  filename: string;
  /** Shiki language id. */
  lang: string;
  source: string;
  /** A second file the variant ships (e.g. the React + CSS stylesheet). */
  extra?: { filename: string; lang: string; source: string };
  reference?: boolean;
  native?: boolean;
  prerequisites?: Prerequisite[];
}

export interface SnippetData {
  name: string;
  title: string;
  category: string;
  kind: string;
  hasStylingAxis: boolean;
  /** Live preview component (the reference variant). */
  component: Component;
  previewClass?: string;
  /** Initial prop values — control defaults plus any fixed props. */
  defaultProps: Record<string, unknown>;
  controls: ControlSpec[];
  usage: UsageDescriptor;
  props: PropDoc[];
  variants: DetailVariant[];
}
