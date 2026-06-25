/**
 * Shared shape for every snippet's `meta.ts`.
 *
 * `meta.ts` is the data model that drives the site: the Astro page reads it to
 * render the preview, variant tabs, copy buttons, and prerequisites. Every
 * domain noun from CONTEXT.md maps onto a field here.
 */

export type Framework = "vue" | "vue-nuxt" | "react" | "react-next" | "html";
export type Styling = "tailwind" | "css";
export type Kind = "component" | "effect" | "layout" | "utility";

export interface Prerequisite {
  /** npm package the user must install, if any (e.g. "gsap", "three"). */
  npm?: string;
  /** Human note: assumed tooling, global CSS to add, version constraints. */
  note?: string;
}

export interface Variant {
  /** Stable id; also the variant's folder name (e.g. "vue", "react-next"). */
  id: string;
  framework: Framework;
  /** Omitted when the snippet opts out of the styling axis (see hasStylingAxis). */
  styling?: Styling;
  /** Tab label shown on the snippet page. */
  label: string;
  /** Entry file, relative to the variant folder. */
  entry: string;
  /** The reference variant (Vue + Tailwind) — source of truth for ports. */
  reference?: boolean;
  /** A native variant: an independent per-framework impl, not a port. Utilities only. */
  native?: boolean;
  prerequisites?: Prerequisite[];
}

export interface SnippetMeta {
  /** Slug; matches the snippet's folder name. */
  name: string;
  title: string;
  description: string;
  kind: Kind;
  /** User-facing grouping slug (e.g. "backgrounds", "utils"). */
  category: string;
  /**
   * Whether this snippet participates in the Tailwind/CSS styling axis.
   * `false` for behavioural snippets like utilities, whose variants are
   * framework-only (LinkTag is the first such case).
   */
  hasStylingAxis: boolean;
  /** Opt-in interactive playground — flagship snippets only. */
  playground?: boolean;
  variants: Variant[];
}
