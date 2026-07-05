/*
 * Detail page. A single shared Shiki highlighter so
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
      themes: ["github-dark-default", "github-light-default"],
      langs: ["vue", "tsx", "jsx", "html", "bash", "css"],
    });
  }
  return hp;
}

// Dual-theme (ADR-0016): `defaultColor: 'dark'` makes each token's inline `color`
// the dark value (our default) and stashes the light value in `--shiki-light`, so
// a single CSS rule under `:root[data-theme="light"]` swaps them with no re-highlight.
export const SHIKI_THEMES = {
  light: "github-light-default",
  dark: "github-dark-default",
} as const;
