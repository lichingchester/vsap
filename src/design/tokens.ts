/*
 * The /design page catalog (ADR-0008). Token NAMES + human usage notes only —
 * the actual VALUES live in global.css `@theme` / site.css `:root` and are read
 * live at runtime (getComputedStyle) so this page can never drift from the real
 * tokens. Docs-only site chrome; never copied into a user's project.
 */

export interface TokenDoc {
  /** the CSS custom property, e.g. "--color-accent" */
  var: string;
  /** short display name, e.g. "accent" */
  name: string;
  /** one-line usage note */
  note: string;
}
export interface TokenGroup {
  label: string;
  tokens: TokenDoc[];
}

/** Color, grouped surfaces → lines → text → accent (ADR-0008). */
export const colorGroups: TokenGroup[] = [
  {
    label: "Surfaces",
    tokens: [
      { var: "--color-canvas", name: "canvas", note: "the page background" },
      { var: "--color-surface", name: "surface", note: "raised panels, hover fills" },
      { var: "--color-surface2", name: "surface2", note: "double-raised / active" },
      { var: "--color-inset", name: "inset", note: "recessed wells, preview stage" },
    ],
  },
  {
    label: "Lines",
    tokens: [
      { var: "--color-line", name: "line", note: "hairline borders, dividers" },
      { var: "--color-line2", name: "line2", note: "stronger borders, chips" },
    ],
  },
  {
    label: "Text",
    tokens: [
      { var: "--color-fg", name: "fg", note: "primary text" },
      { var: "--color-muted", name: "muted", note: "secondary text, AA on canvas" },
      { var: "--color-dim", name: "dim", note: "tertiary / captions, AA on canvas" },
    ],
  },
  {
    label: "Accent",
    tokens: [
      { var: "--color-accent", name: "accent", note: "the warm amber for links, ticks, primary" },
      { var: "--color-accent2", name: "accent2", note: "hover / brighter amber" },
      { var: "--color-accent-ink", name: "accent-ink", note: "text ON accent (near-black)" },
      { var: "--color-accent-soft", name: "accent-soft", note: "12% amber wash for active-row tint" },
    ],
  },
];

export interface FontDoc {
  var: string;
  name: string;
  role: string;
  sample: string;
}
/** The three families (ADR-0008). Sample is set IN the family via var(). */
export const fonts: FontDoc[] = [
  {
    var: "--font-display",
    name: "Bricolage Grotesque",
    role: "display · the wordmark & big titles",
    sample: "Copy, paste, ship.",
  },
  {
    var: "--font-ui",
    name: "Hanken Grotesk",
    role: "ui · body & interface prose",
    sample: "A copy-paste collection of UI.",
  },
  {
    var: "--font-mono",
    name: "JetBrains Mono",
    role: "mono · code, labels, headings",
    sample: "const snippet = copy()",
  },
];

export interface RampDoc {
  var: string;
  name: string;
  note: string;
}
/** The 6-rung type ramp (ADR-0014), smallest → largest. */
export const ramp: RampDoc[] = [
  { var: "--text-eyebrow", name: "eyebrow", note: "uppercase mono labels, the 12px floor" },
  { var: "--text-caption", name: "caption", note: "chips, hex readouts" },
  { var: "--text-body", name: "body", note: "table cells, TOC links" },
  { var: "--text-ui", name: "ui", note: "default interface text" },
  { var: "--text-heading", name: "heading", note: "section headings at 1rem, Mono-Heading Rule" },
  { var: "--text-title", name: "title", note: "page title, fluid clamp()" },
];

export interface RadiusDoc {
  var: string;
  name: string;
  note: string;
}
export const radii: RadiusDoc[] = [
  { var: "--radius-sm", name: "sm", note: "chips, swatches, ticks" },
  { var: "--radius-md", name: "md", note: "buttons, inputs" },
  { var: "--radius-lg", name: "lg", note: "cards, the preview stage" },
];

/** TOC anchors for the right-hand rail, in page order. */
export const sections = [
  { id: "color", label: "Color" },
  { id: "type", label: "Typography" },
  { id: "radii", label: "Radii" },
  { id: "motion", label: "Motion" },
  { id: "buttons", label: "Buttons" },
  { id: "controls", label: "Controls" },
  { id: "render-kinds", label: "API render-kinds" },
];
