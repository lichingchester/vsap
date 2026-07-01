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
  /**
   * Known-good version the reference was written against, as an npm range
   * (e.g. "^3.12"). Rendered into the Install command (`npm i gsap@^3.12`).
   * Guidance, not a hard pin — see ADR-0012. Ignored without `npm`.
   *
   * Set it only for libraries the snippet *bundles and is coded against*
   * (gsap, three) — a major bump can break the pasted code. Leave framework /
   * peer packages the user's app already owns (vue-router, next) unversioned:
   * their version is the user's project's call, not the snippet's.
   */
  version?: string;
  /**
   * CDN / import URL for the HTML variant, which has no npm. When the selected
   * variant is `html`, the Install command becomes a `<script>` line built from
   * this instead of `npm i` (ADR-0012).
   */
  cdn?: string;
  /** Human note: assumed tooling, global CSS to add, or other setup. */
  note?: string;
  /**
   * Optional doc link for the `note` — e.g. a tooling setup guide the site
   * shouldn't reproduce ("Tailwind v4 configured" → tailwindcss.com install
   * docs). Rendered as a link on the note line; ignored without `note`.
   */
  href?: string;
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
  /** Public props of the snippet's component, for the detail page's API table. */
  props?: PropDoc[];
  /**
   * Descriptor the detail page uses to GENERATE the Usage copy artifact (the
   * call-site example) for each variant. Combined with prop values, so the
   * playground controls drive the copied code (props→code).
   */
  usage?: UsageDescriptor;
  /** Interactive controls for the live preview (flagship snippets). */
  controls?: ControlSpec[];
  /** Initial prop values used for the live preview and the generated Usage. */
  previewProps?: Record<string, unknown>;
  /** Class applied to the previewed component (sizing within the stage). */
  previewClass?: string;
  variants: Variant[];
}

/** Descriptor for generating a snippet's Usage example on the detail page. */
export interface UsageDescriptor {
  /** Component tag, e.g. "GradientText". */
  tag: string;
  /** Slot / children example; omit for a self-closing element. */
  children?: string;
  /** Props to surface in the usage example, in order. */
  props: string[];
}

/** One live-preview control on the detail page, bound to a prop. */
export interface ControlSpec {
  /** Prop this control drives — must match a usage prop + a `props` entry. */
  prop: string;
  label: string;
  kind: "colors" | "range" | "toggle" | "text";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

/** One row of a snippet's API reference table on the detail page. */
export interface PropDoc {
  /** Prop name, e.g. "colors". */
  name: string;
  /** Type, written as it appears in the source, e.g. "string[]" or "number". */
  type: string;
  /** Default value as source text; omit for required/no-default props. */
  default?: string;
  /** One-line description of what the prop does. */
  description: string;
}
