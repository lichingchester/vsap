/*
 * THROWAWAY (detail-page /demos harness). The props->code engine behind the
 * confirmed model: the Usage copy artifact is *generated* from a snippet's
 * `usage` descriptor + the current prop values, rendered into each framework's
 * syntax. Because it takes plain prop values, the playground controls drive it
 * live and copying reflects the chosen props. Deleted on promotion (the chosen
 * layout's generator moves into the real site).
 */
import type { DemoSnippet, DemoVariant } from "./catalog";

export type FrameworkAxis = "vue" | "react" | "html";
export type StylingAxis = "tailwind" | "css";
export interface VariantPref {
  framework: FrameworkAxis;
  styling: StylingAxis;
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

/** Render a JS value as source text, single-quoted to match the house style. */
function jsValue(v: unknown): string {
  if (Array.isArray(v)) return "[" + v.map(jsValue).join(", ") + "]";
  if (typeof v === "string") return `'${v}'`;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (v && typeof v === "object")
    return JSON.stringify(v).replace(/"([^"]+)":/g, "$1: ").replace(/"/g, "'");
  return String(v);
}

function attr(framework: FrameworkAxis, name: string, value: unknown): string {
  const isString = typeof value === "string";
  if (framework === "react") {
    if (isString) return `${name}="${value}"`;
    if (value === true) return name; // boolean shorthand
    return `${name}={${jsValue(value)}}`;
  }
  // vue
  const n = kebab(name);
  if (isString) return `${n}="${value}"`;
  return `:${n}="${jsValue(value)}"`;
}

/** The import line that precedes a usage example (none for raw HTML). */
function importLine(framework: FrameworkAxis, tag: string): string | null {
  if (framework === "html") return null;
  if (framework === "react") return `import ${tag} from './${tag}'`;
  return `import ${tag} from './${tag}.vue'`;
}

/**
 * Generate the Usage artifact for a variant at the given prop values.
 * For the self-contained HTML variant, Source *is* the usage, so callers
 * collapse the two — this returns the markup unchanged in that case.
 */
export function renderUsage(
  snippet: DemoSnippet,
  variant: DemoVariant,
  propValues: Record<string, unknown>,
): string {
  const framework = variant.framework.startsWith("react")
    ? "react"
    : variant.framework.startsWith("vue")
      ? "vue"
      : "html";
  if (framework === "html") return variant.source.trim();

  const { tag, children, props: usageProps } = snippet.usage;
  const attrs = usageProps
    .map((p) => attr(framework as FrameworkAxis, p, propValues[p]))
    .filter(Boolean);

  // One attr per line once it gets long; otherwise keep it on the tag.
  const inline = attrs.join(" ");
  const openTag =
    inline.length <= 48
      ? `<${tag}${attrs.length ? " " + inline : ""}`
      : `<${tag}\n  ${attrs.join("\n  ")}\n`;

  const el = children
    ? `${openTag}${inline.length <= 48 ? ">" : ">"}\n  ${children}\n</${tag}>`
    : `${openTag} />`;

  const imp = importLine(framework as FrameworkAxis, tag);
  return imp ? `${imp}\n\n${el}` : el;
}

/** The Install artifact: npm deps for a variant, or null when there are none. */
export function renderInstall(variant: DemoVariant): string | null {
  const pkgs = (variant.prerequisites ?? [])
    .map((p) => p.npm)
    .filter((x): x is string => Boolean(x));
  return pkgs.length ? `npm i ${pkgs.join(" ")}` : null;
}

/** Tooling / CSS prerequisite notes (everything that isn't an npm install). */
export function noteLines(variant: DemoVariant): string[] {
  return (variant.prerequisites ?? [])
    .filter((p) => p.note)
    .map((p) => (p.npm ? `${p.npm} — ${p.note}` : (p.note as string)));
}

/**
 * Resolve a global variant preference to a concrete variant of this snippet,
 * falling back to the reference variant with a flag when the exact combo is
 * absent. Utilities (no styling axis) match on framework family only.
 */
export function resolveVariant(
  snippet: DemoSnippet,
  pref: VariantPref,
): { variant: DemoVariant; fellBack: boolean } {
  const fam = (f: string): FrameworkAxis =>
    f.startsWith("react") ? "react" : f.startsWith("vue") ? "vue" : "html";

  const exact = snippet.variants.find((v) => {
    if (fam(v.framework) !== pref.framework) return false;
    if (!snippet.hasStylingAxis || pref.framework === "html") return true;
    return v.styling === pref.styling;
  });
  if (exact) return { variant: exact, fellBack: false };

  // Framework matched but styling didn't — prefer same framework's reference.
  const sameFw = snippet.variants.find((v) => fam(v.framework) === pref.framework);
  if (sameFw) return { variant: sameFw, fellBack: true };

  const ref =
    snippet.variants.find((v) => v.reference) ?? snippet.variants[0];
  return { variant: ref, fellBack: true };
}
