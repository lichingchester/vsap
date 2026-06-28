/*
 * Placeholder catalog for the design-direction demos (ADR-0008).
 *
 * Two entries are real (gradient-text, link-tag); the rest are placeholders so
 * the sidebar, grid, and gallery show what a *full* tskr/ui looks like — many
 * snippets across categories — instead of two lonely cards. Throwaway demo data.
 */

export interface CatalogSnippet {
  name: string;
  title: string;
  kind: "component" | "effect" | "layout" | "utility";
  category: string;
  categoryLabel: string;
  blurb: string;
  /** One of the two real, shippable snippets. */
  real?: boolean;
}

export const catalog: CatalogSnippet[] = [
  // Backgrounds
  { name: "aurora", title: "Aurora", kind: "effect", category: "backgrounds", categoryLabel: "Backgrounds", blurb: "A drifting aurora gradient rendered on a full-bleed WebGL canvas." },
  { name: "gradient-mesh", title: "Gradient Mesh", kind: "effect", category: "backgrounds", categoryLabel: "Backgrounds", blurb: "An animated multi-stop mesh gradient that slowly breathes behind content." },
  { name: "noise-field", title: "Noise Field", kind: "effect", category: "backgrounds", categoryLabel: "Backgrounds", blurb: "A grainy animated noise overlay for adding texture to flat surfaces." },
  { name: "dot-grid", title: "Dot Grid", kind: "effect", category: "backgrounds", categoryLabel: "Backgrounds", blurb: "A parallax dot grid that reacts subtly to the pointer." },
  { name: "particle-drift", title: "Particle Drift", kind: "effect", category: "backgrounds", categoryLabel: "Backgrounds", blurb: "Soft particles drifting upward on a configurable density and speed." },
  { name: "waves", title: "Waves", kind: "effect", category: "backgrounds", categoryLabel: "Backgrounds", blurb: "Layered sine waves animating across the foot of a hero section." },

  // Text Animations
  { name: "gradient-text", title: "Gradient Text", kind: "effect", category: "text-animations", categoryLabel: "Text Animations", blurb: "Text painted with an animated linear gradient that flows across the letters.", real: true },
  { name: "split-text", title: "Split Text", kind: "effect", category: "text-animations", categoryLabel: "Text Animations", blurb: "Reveals text per-character or per-word with a staggered entrance." },
  { name: "glitch-text", title: "Glitch Text", kind: "effect", category: "text-animations", categoryLabel: "Text Animations", blurb: "A chromatic-aberration glitch pass on hover or in a loop." },
  { name: "shiny-text", title: "Shiny Text", kind: "effect", category: "text-animations", categoryLabel: "Text Animations", blurb: "A sweeping highlight that travels across the glyphs like a shine." },
  { name: "count-up", title: "Count Up", kind: "effect", category: "text-animations", categoryLabel: "Text Animations", blurb: "Animates a number from zero to its target when it enters the viewport." },
  { name: "typewriter", title: "Typewriter", kind: "effect", category: "text-animations", categoryLabel: "Text Animations", blurb: "Types and deletes a rotating list of phrases with a blinking caret." },

  // Buttons
  { name: "magnetic-button", title: "Magnetic Button", kind: "component", category: "buttons", categoryLabel: "Buttons", blurb: "A button whose label is magnetically pulled toward the cursor." },
  { name: "shimmer-button", title: "Shimmer Button", kind: "component", category: "buttons", categoryLabel: "Buttons", blurb: "A border shimmer that orbits the button on an idle loop." },
  { name: "ripple-button", title: "Ripple Button", kind: "component", category: "buttons", categoryLabel: "Buttons", blurb: "A material-style ripple that expands from the click point." },

  // Components
  { name: "tilt-card", title: "Tilt Card", kind: "component", category: "components", categoryLabel: "Components", blurb: "A 3D tilt-on-hover card with a configurable glare highlight." },
  { name: "spotlight-card", title: "Spotlight Card", kind: "component", category: "components", categoryLabel: "Components", blurb: "A card with a radial spotlight that tracks the pointer." },
  { name: "dock", title: "Dock", kind: "component", category: "components", categoryLabel: "Components", blurb: "A macOS-style dock with magnifying icons on hover." },
  { name: "marquee", title: "Marquee", kind: "component", category: "components", categoryLabel: "Components", blurb: "An infinite, pausable horizontal marquee for logos or testimonials." },

  // Loaders
  { name: "orbit-loader", title: "Orbit Loader", kind: "effect", category: "loaders", categoryLabel: "Loaders", blurb: "Dots orbiting a center point at staggered radii and speeds." },
  { name: "pixel-loader", title: "Pixel Loader", kind: "effect", category: "loaders", categoryLabel: "Loaders", blurb: "A retro pixel-fill loading indicator with a configurable palette." },

  // Layouts
  { name: "bento-grid", title: "Bento Grid", kind: "layout", category: "layouts", categoryLabel: "Layouts", blurb: "A responsive bento grid with featured spans and tidy gaps." },
  { name: "sticky-header", title: "Sticky Header", kind: "layout", category: "layouts", categoryLabel: "Layouts", blurb: "A header that condenses and gains a backdrop blur on scroll." },

  // Utilities
  { name: "link-tag", title: "Link Tag", kind: "utility", category: "utils", categoryLabel: "Utilities", blurb: "A universal link that renders the right element for the context.", real: true },
  { name: "use-mounted", title: "Use Mounted", kind: "utility", category: "utils", categoryLabel: "Utilities", blurb: "A tiny hook/composable that reports when the component has mounted." },
];

/** Ordered category groups, preserving first-seen order. */
export function groupedCatalog(): { category: string; label: string; items: CatalogSnippet[] }[] {
  const groups: { category: string; label: string; items: CatalogSnippet[] }[] = [];
  for (const s of catalog) {
    let g = groups.find((x) => x.category === s.category);
    if (!g) {
      g = { category: s.category, label: s.categoryLabel, items: [] };
      groups.push(g);
    }
    g.items.push(s);
  }
  return groups;
}
