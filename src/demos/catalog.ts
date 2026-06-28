/*
 * THROWAWAY (detail-page /demos harness). Throwaway snippet datasets for the
 * three detail-page layout demos (A/B/C). It augments the two real snippets
 * with the bits the new model needs but the real `meta.ts` doesn't carry yet:
 * a `usage` descriptor (tag + children) and a `controls` config. Source code is
 * pulled from the real variant files via ?raw (no-drift, ADR-0004). On
 * promotion these fields move into each snippet's real `meta.ts` and this file
 * is deleted.
 */
import { markRaw } from "vue";
import type { Component } from "vue";
import type { PropDoc } from "../snippets/types";

// Live reference components — the only variants that actually run (ADR-0005).
import GradientText from "../snippets/text-animations/gradient-text/vue-tailwind/GradientText.vue";
import LinkTag from "../snippets/utils/link-tag/vue/LinkTag.vue";

// Raw sources for every variant, keyed by path under src/snippets.
const RAW = import.meta.glob("../snippets/**/*.{vue,tsx,css,html}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const raw = (p: string) => RAW[`../snippets/${p}`] ?? "";

export interface ControlSpec {
  /** Prop this control drives — must match a usage prop + a meta prop. */
  prop: string;
  label: string;
  kind: "colors" | "range" | "toggle" | "text";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface DemoVariant {
  id: string;
  framework: string;
  styling?: "tailwind" | "css";
  label: string;
  /** Filename shown on the code block's filename tab + as the Source. */
  filename: string;
  /** Shiki language id. */
  lang: string;
  source: string;
  /** A second file the variant ships (e.g. the React + CSS stylesheet). */
  extra?: { filename: string; lang: string; source: string };
  reference?: boolean;
  native?: boolean;
  prerequisites?: { npm?: string; note?: string }[];
}

export interface UsageDescriptor {
  tag: string;
  /** Slot / children example; omit for a self-closing element. */
  children?: string;
  /** Props to surface in the usage example, in order. */
  props: string[];
}

export interface DemoSnippet {
  name: string;
  title: string;
  category: string;
  kind: string;
  description: string;
  hasStylingAxis: boolean;
  /** Live preview component (the reference variant). */
  component: Component;
  /** Class applied to the previewed component (sizing for the stage). */
  previewClass?: string;
  /** Initial prop values — control defaults plus any fixed props. */
  defaultProps: Record<string, unknown>;
  controls: ControlSpec[];
  usage: UsageDescriptor;
  props: PropDoc[];
  variants: DemoVariant[];
}

const gradientText: DemoSnippet = {
  name: "gradient-text",
  title: "Gradient Text",
  category: "text-animations",
  kind: "effect",
  description:
    "Text painted with an animated linear gradient that flows across the letters.",
  hasStylingAxis: true,
  component: markRaw(GradientText),
  previewClass: "text-5xl font-semibold sm:text-6xl",
  defaultProps: {
    colors: ["#ffaa40", "#9c40ff", "#ffaa40"],
    degree: 90,
    animationSpeed: 8,
  },
  controls: [
    { prop: "colors", label: "Colors", kind: "colors" },
    { prop: "degree", label: "Direction", kind: "range", min: 0, max: 360, step: 1, unit: "°" },
    { prop: "animationSpeed", label: "Loop", kind: "range", min: 1, max: 10, step: 0.1, unit: "s" },
  ],
  usage: {
    tag: "GradientText",
    children: "Gradient Text",
    props: ["colors", "degree", "animationSpeed"],
  },
  props: [
    {
      name: "colors",
      type: "string[]",
      default: "['#ffaa40', '#9c40ff', '#ffaa40']",
      description:
        "Gradient colours, in order. Repeat the first colour last for a seamless loop.",
    },
    { name: "degree", type: "number", default: "90", description: "Gradient direction, in degrees (0–360)." },
    { name: "animationSpeed", type: "number", default: "8", description: "One full loop, in seconds. Higher is slower." },
  ],
  variants: [
    {
      id: "vue-tailwind",
      framework: "vue",
      styling: "tailwind",
      label: "Vue + Tailwind",
      filename: "GradientText.vue",
      lang: "vue",
      source: raw("text-animations/gradient-text/vue-tailwind/GradientText.vue"),
      reference: true,
      prerequisites: [{ note: "Tailwind v4 configured." }],
    },
    {
      id: "vue-css",
      framework: "vue",
      styling: "css",
      label: "Vue + CSS",
      filename: "GradientText.vue",
      lang: "vue",
      source: raw("text-animations/gradient-text/vue-css/GradientText.vue"),
      prerequisites: [{ note: "No dependencies — styles are scoped in the SFC." }],
    },
    {
      id: "react-tailwind",
      framework: "react",
      styling: "tailwind",
      label: "React + Tailwind",
      filename: "GradientText.tsx",
      lang: "tsx",
      source: raw("text-animations/gradient-text/react-tailwind/GradientText.tsx"),
      prerequisites: [{ note: "Tailwind v4 configured." }],
    },
    {
      id: "react-css",
      framework: "react",
      styling: "css",
      label: "React + CSS",
      filename: "GradientText.tsx",
      lang: "tsx",
      source: raw("text-animations/gradient-text/react-css/GradientText.tsx"),
      extra: {
        filename: "GradientText.css",
        lang: "css",
        source: raw("text-animations/gradient-text/react-css/GradientText.css"),
      },
      prerequisites: [
        { note: "Also copy GradientText.css next to the component and keep the import." },
      ],
    },
    {
      id: "html",
      framework: "html",
      label: "HTML",
      filename: "gradient-text.html",
      lang: "html",
      source: raw("text-animations/gradient-text/html/gradient-text.html"),
      prerequisites: [{ note: "No dependencies — self-contained <style> + markup." }],
    },
  ],
};

const linkTag: DemoSnippet = {
  name: "link-tag",
  title: "Link Tag",
  category: "utils",
  kind: "utility",
  description:
    "A universal link that renders the right element for the context — router link, plain <a>, or <div>.",
  hasStylingAxis: false,
  component: markRaw(LinkTag),
  defaultProps: {
    href: "https://example.com",
    external: true,
    newTab: true,
    attributes: { class: "text-lg underline underline-offset-4" },
  },
  controls: [], // utility — static preview, no playground
  usage: {
    tag: "LinkTag",
    children: "Visit example.com →",
    props: ["href", "external", "newTab"],
  },
  props: [
    { name: "href", type: "string", default: "''", description: "URL or path to navigate to." },
    { name: "noLink", type: "boolean", default: "false", description: "Render a <div> instead of a link." },
    { name: "external", type: "boolean", default: "false", description: "Treat href as an external URL — always a plain <a>." },
    { name: "newTab", type: "boolean", default: "false", description: 'Open in a new tab (sets target="_blank").' },
    { name: "attributes", type: "Record<string, unknown>", description: "Extra attributes forwarded to the rendered element." },
  ],
  variants: [
    {
      id: "vue",
      framework: "vue",
      label: "Vue",
      filename: "LinkTag.vue",
      lang: "vue",
      source: raw("utils/link-tag/vue/LinkTag.vue"),
      reference: true,
      native: true,
      prerequisites: [
        { npm: "vue-router", note: "Optional — falls back to a plain <a> when vue-router isn't installed." },
      ],
    },
    {
      id: "vue-nuxt",
      framework: "vue-nuxt",
      label: "Nuxt",
      filename: "LinkTag.vue",
      lang: "vue",
      source: raw("utils/link-tag/vue-nuxt/LinkTag.vue"),
      native: true,
      prerequisites: [{ note: "Uses Nuxt's built-in <NuxtLink> — no extra install." }],
    },
    {
      id: "react-next",
      framework: "react-next",
      label: "React (Next.js)",
      filename: "LinkTag.tsx",
      lang: "tsx",
      source: raw("utils/link-tag/react-next/LinkTag.tsx"),
      native: true,
      prerequisites: [{ npm: "next", note: "Uses next/link." }],
    },
    {
      id: "html",
      framework: "html",
      label: "HTML",
      filename: "link-tag.html",
      lang: "html",
      source: raw("utils/link-tag/html/link-tag.html"),
      native: true,
      prerequisites: [{ note: "No dependencies — plain <a>." }],
    },
  ],
};

export const demoCatalog: DemoSnippet[] = [gradientText, linkTag];
export const getDemoSnippet = (name: string) =>
  demoCatalog.find((s) => s.name === name) ?? demoCatalog[0];
