/*
 * THROWAWAY (detail-page /demos harness). Pure assembly of a detail page's copy
 * artifacts (Install / Source / Usage) from a snippet + the variant preference
 * + current prop values. All three layouts (A/B/C) render the same view, so the
 * model lives here and only the arrangement differs per layout.
 */
import type { DemoSnippet, DemoVariant } from "./catalog";
import {
  renderUsage,
  renderInstall,
  noteLines,
  resolveVariant,
  type VariantPref,
} from "./usage";

export interface CodeArtifact {
  filename: string;
  lang: string;
  code: string;
  kind: "source" | "usage";
}

export interface DetailView {
  variant: DemoVariant;
  fellBack: boolean;
  fallbackNote: string | null;
  install: string | null;
  notes: string[];
  isHtml: boolean;
  sources: CodeArtifact[];
  /** null when the HTML variant collapses Source and Usage into one. */
  usage: CodeArtifact | null;
  referenceLabel: string;
}

const FW_LABEL: Record<string, string> = { vue: "Vue", react: "React", html: "HTML" };
const ST_LABEL: Record<string, string> = { tailwind: "Tailwind", css: "CSS" };

export function buildView(
  snippet: DemoSnippet,
  pref: VariantPref,
  propValues: Record<string, unknown>,
): DetailView {
  const { variant, fellBack } = resolveVariant(snippet, pref);
  const isHtml = variant.framework === "html";

  const sources: CodeArtifact[] = [
    { filename: variant.filename, lang: variant.lang, code: variant.source, kind: "source" },
  ];
  if (variant.extra) {
    sources.push({
      filename: variant.extra.filename,
      lang: variant.extra.lang,
      code: variant.extra.source,
      kind: "source",
    });
  }

  const fam = variant.framework.startsWith("react")
    ? "react"
    : variant.framework.startsWith("vue")
      ? "vue"
      : "html";
  const usage: CodeArtifact | null = isHtml
    ? null
    : {
        filename: fam === "react" ? "App.tsx" : "App.vue",
        lang: fam === "react" ? "tsx" : "vue",
        code: renderUsage(snippet, variant, propValues),
        kind: "usage",
      };

  const requested =
    pref.framework === "html" || !snippet.hasStylingAxis
      ? FW_LABEL[pref.framework]
      : `${FW_LABEL[pref.framework]} + ${ST_LABEL[pref.styling]}`;
  const fallbackNote = fellBack ? `no ${requested} variant — showing the reference` : null;

  const ref = snippet.variants.find((v) => v.reference) ?? snippet.variants[0];

  return {
    variant,
    fellBack,
    fallbackNote,
    install: renderInstall(variant),
    notes: noteLines(variant),
    isHtml,
    sources,
    usage,
    referenceLabel: ref.label,
  };
}
