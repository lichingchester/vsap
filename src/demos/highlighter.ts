/*
 * THROWAWAY (detail-page /demos harness). A single shared Shiki highlighter so
 * every CodeBlock (static Source and the live-updating Usage) gets real syntax
 * highlighting client-side. Fine-grained langs/theme keep the bundle bounded.
 * Code tokens are *content* (the lit-cutout artwork), so multi-colour syntax is
 * fine here — the One-Filament rule governs chrome, not the code inside a block.
 */
import { createHighlighter, type Highlighter } from "shiki";

let hp: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!hp) {
    hp = createHighlighter({
      themes: ["github-dark-default"],
      langs: ["vue", "tsx", "jsx", "html", "bash", "css"],
    });
  }
  return hp;
}

export const SHIKI_THEME = "github-dark-default";
