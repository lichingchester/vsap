---
name: tskr/ui
description: Copy-paste UI snippets on a warm-terminal canvas — amber on charcoal, monospace-forward, chrome that recedes so the preview glows.
colors:
  charcoal-canvas: "#0e0e11"
  surface: "#151519"
  surface-raised: "#1b1b21"
  inset: "#0a0a0c"
  line: "#26262e"
  line-strong: "#34343f"
  ink: "#f4f4f5"
  muted: "#b4b4bc"
  dim: "#8a8a93"
  filament-amber: "#f5b544"
  filament-amber-bright: "#ffc65a"
  amber-ink: "#1a1206"
  amber-soft: "#f5b5441f"
typography:
  display:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "clamp(2.2rem, 5vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "clamp(1.6rem, 3.5vw, 2.1rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.7rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.12em"
  brand:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
components:
  button-primary:
    backgroundColor: "{colors.filament-amber}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.md}"
    padding: "0.55rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.filament-amber-bright}"
    textColor: "{colors.amber-ink}"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.55rem 1rem"
  button-ghost-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  nav-link:
    textColor: "{colors.muted}"
  nav-link-hover:
    textColor: "{colors.ink}"
  sidebar-link:
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "0.38rem 0.6rem"
  sidebar-link-active:
    backgroundColor: "{colors.amber-soft}"
    textColor: "{colors.filament-amber}"
    rounded: "{rounded.sm}"
---

# Design System: tskr/ui

## 1. Overview

**Creative North Star: "The Warm Terminal"**

tskr/ui is a copy-paste UI library, and its site is a dev console you read code
in. The whole surface is charcoal (`#0e0e11`) with a single warm amber accent
(`#f5b544`), monospace-forward type, and `#` comment lines on the home. It should
feel like a terminal that someone designed on purpose: technical, deliberate,
lean — never a generic dark-mode SaaS page.

The system runs on one binding constraint (ADR-0008): **the chrome must recede so
the snippet previews are the loud thing.** Snippet previews are often cool, glowy,
and animated; the warm, quiet chrome that frames them is chosen precisely so those
cool previews pop against it. Every site-chrome decision — flat surfaces, hairline
borders, amber used sparingly — serves that contrast. The chrome is the matte
frame; the artwork is the user's snippet.

This system explicitly rejects the React Bits identity it sits closest to:
cool violet, purple gradients, decorative glow, Geist/Inter. It rejects the
`bg-neutral-950 / text-neutral-100` AI-SaaS scaffold, gradient hero text, the
hero-metric template, and identical icon-card grids. A UI library whose own site
looks AI-generated undercuts itself; this one is held to the bar it implies.

**Key Characteristics:**
- Warm amber-on-charcoal, not cool violet-on-black.
- Monospace carries the headings and wordmarks; the terminal cue is the brand.
- Flat by construction — depth is tonal layering + 1px hairlines, never shadow.
- One accent, used to point — never to decorate.
- Tight radii (4/6/8px). Nothing is soft or pill-shaped.

## 2. Colors

A single warm accent against a four-step charcoal ramp; everything else is a
neutral grey carrying text and hairlines. The palette is restrained — one voice,
amber, on a quiet dark stage.

### Primary
- **Filament Amber** (`#f5b544`): The one accent. The warm glow of a filament
  against the dark. Used only where it must point: the `/ui` in the wordmark,
  the active sidebar/TOC link, prop names in the API table, category labels,
  stat figures, the primary button. Its rarity is the point.
- **Filament Amber Bright** (`#ffc65a`): The lift on hover — primary buttons
  warm to this on hover, nowhere else.
- **Amber Ink** (`#1a1206`): Near-black brown for text *on* an amber fill
  (primary button label). Never used as a surface.
- **Amber Soft** (`#f5b5441f`, `rgba(245,181,68,0.12)`): A 12% amber wash behind
  the active sidebar link — presence without a second border.

### Neutral
- **Charcoal Canvas** (`#0e0e11`): The body. The dark stage everything sits on.
- **Surface** (`#151519`): One step up — hovered rows, ghost-button hover,
  raised panels.
- **Surface Raised** (`#1b1b21`): Two steps up, for the rare nested raise.
- **Inset** (`#0a0a0c`): One step *down* — the recessed preview stage, darker
  than the canvas so the live preview reads as a lit cutout.
- **Line** (`#26262e`): The default 1px hairline — dividers, borders, section
  rules. The workhorse boundary.
- **Line Strong** (`#34343f`): A slightly brighter hairline for emphasis
  (ghost-button border, table header underline).
- **Ink** (`#f4f4f5`): Primary text. Near-white, never pure `#fff`.
- **Muted** (`#b4b4bc`): Secondary text — body copy, nav links, sidebar links.
  Tuned for WCAG AA on the canvas.
- **Dim** (`#8a8a93`): Tertiary text — labels, kinds, defaults, footer. The
  quietest readable grey; also AA-tuned.

### Named Rules
**The One Filament Rule.** Amber is the only chromatic color in the entire site
chrome. It appears on a small fraction of any screen and always to *point* — an
active state, a name, a brand mark, a call to action. The moment amber decorates
rather than guides, it is wrong.

**The Lit-Cutout Rule.** The preview stage is the one surface *darker* than the
canvas (`inset #0a0a0c`), so the snippet inside reads as lit. Chrome goes up the
tonal ramp; the content well goes down.

## 3. Typography

**Display / Mono Font:** JetBrains Mono (with ui-monospace, SFMono-Regular fallback)
**Body Font:** Hanken Grotesk (with ui-sans-serif, system-ui fallback)
**Brand Font:** Bricolage Grotesque (with ui-sans-serif fallback)

**Character:** A deliberate three-way split, paired on contrast, never on
similarity. JetBrains Mono does the terminal work — mastheads, section headings,
labels, the snippet index — because monospace *is* the dev-tool signal. Hanken
Grotesk, a humanist sans, carries running prose so paragraphs stay readable.
Bricolage Grotesque, a characterful display sans, appears only as the brand
wordmark in the docs header. Mono + humanist-sans + display-sans: three real
axes, no two doing the same job.

### Hierarchy
- **Display / Masthead** (Mono 500, `clamp(2.2rem, 5vw, 3rem)`, -0.02em): The
  home wordmark `tskr/ui`. The single largest type on the site.
- **Title** (Mono 500, `clamp(1.6rem, 3.5vw, 2.1rem)`, -0.02em): The snippet
  name at the top of a detail page.
- **Heading** (Mono 500, `1rem`): Section headers (`Preview`, `Props`, `API`,
  `Usage`), set off by a hairline underline rather than size.
- **Body** (Hanken 400, `1rem`, line-height 1.55): Running prose. Capped at
  ~58ch (`max-width: 58ch`) for readability.
- **Label** (Mono 400, ~`0.7rem`, +0.12em tracking, uppercase): Category names,
  kinds, table column heads, TOC title. The mono micro-type that grids the page.
- **Brand** (Bricolage 700, `1.05rem`, -0.01em): The docs-header wordmark only.

### Named Rules
**The Mono-Heading Rule.** Headings and wordmarks are monospace, not the body
sans. Size and a hairline underline carry hierarchy — heads are not dramatically
larger, they are mono and ruled. This is what makes the page read as a terminal,
not a marketing site.

**The Restrained-Scale Rule.** Display tops out at ~3rem. The site never shouts
with type; if a heading needs to be louder, it is wrong about its hierarchy, not
its size.

## 4. Elevation

**Flat by construction. There are no box-shadows anywhere in the site chrome.**
Depth is conveyed three ways, never by drop shadow:

1. **Tonal layering** — the charcoal ramp (`inset` < `canvas` < `surface` <
   `surface-raised`) places elements in front or behind by lightness alone.
2. **Hairline borders** — a single `1px` `line`/`line-strong` boundary separates
   regions. One pixel, never a glow.
3. **Backdrop blur on sticky chrome** — the sticky nav and docs header use
   `backdrop-filter: blur(10px)` over a `color-mix` translucent canvas, so
   content scrolls *under* them legibly. This is the only "lift" in the system,
   and it is functional, not decorative.

### Named Rules
**The No-Shadow Rule.** Drop shadows are forbidden in site chrome. A surface that
needs to feel raised goes up the tonal ramp or gains a hairline — it never gains
a shadow. Glow belongs to the snippet previews, never to the frame around them.

## 5. Components

**Component philosophy: "Recede, then point."** Surfaces are flat and quiet;
amber appears only where it must guide the eye. Tight radii throughout (4/6/8px).

### Buttons
- **Shape:** Tight 6px radius (`rounded.md`); Hanken UI font, weight 600, ~0.9rem.
- **Primary:** Filament Amber fill (`#f5b544`) with Amber Ink text (`#1a1206`),
  padding `0.55rem 1rem`. The one place the accent is a *surface*.
- **Ghost:** Transparent fill, Ink text, a `line-strong` (`#34343f`) hairline
  border.
- **Hover:** Primary warms to Filament Amber Bright (`#ffc65a`); Ghost fills to
  Surface (`#151519`). Transition ~0.2s on background/border only.

### Navigation
- **Style:** Sticky, hairline bottom border, `backdrop-filter: blur(10px)` over a
  translucent canvas. Brand wordmark left (Bricolage on the docs header, Mono on
  the home), links right.
- **Links:** Mono/UI, Muted (`#b4b4bc`) at rest → Ink (`#f4f4f5`) on hover. No
  underline, no pill.
- **Brand wordmark:** `tskr` in Ink, `/ui` in Filament Amber.

### Sidebar (docs detail)
- **Style:** Fixed 15rem column, hairline right border, mono links at ~0.83rem.
- **States:** Muted at rest; hover gains Surface background + Ink text; the active
  item gets Amber Soft background (`#f5b5441f`) + Filament Amber text. Active =
  amber wash, never a side stripe.

### Snippet Index (home — signature component)
- **Style:** A typographic list, not cards. Each row is a mono `category/name`
  path (`category/` in Dim, name in Ink) with a right-aligned uppercase `kind`
  label in Dim, on a 1fr/auto grid.
- **Hover:** The row gains a Surface background, the text turns Filament Amber,
  and the whole row **nudges right** (`padding-left` animates from 0.25rem to
  0.6rem) — a terminal-cursor tell. The `category/` prefix also turns amber.

### Preview Stage (detail — signature component)
- **Style:** A recessed well: Inset background (`#0a0a0c`, darker than canvas),
  hairline border, 8px radius, `place-items: center`, min-height 12rem, and a
  faint radial dot-grid (`rgba(255,255,255,0.05)` dots on a 22px lattice).
- **Purpose:** The lit cutout the snippet renders into. The dot grid reads as
  graph paper / a workbench surface; the darkness makes glowy previews pop.

### API Table
- **Style:** Borderless except hairline row dividers (`line`) and a `line-strong`
  header underline. Column heads are Dim uppercase mono micro-labels. Prop names
  are Filament Amber mono; types are Ink mono; defaults are Dim mono.

### On-This-Page TOC (detail)
- **Style:** Sticky right rail, mono micro-label title, links with a `line`
  left-border that turns Filament Amber on the active item. This is the *one*
  sanctioned use of a left border — it is a 2px rail on inert text links, a
  reading-position indicator, not a colored accent stripe on a card.

## 6. Do's and Don'ts

### Do:
- **Do** keep the canvas charcoal (`#0e0e11`) and the accent the single warm
  Filament Amber (`#f5b544`). One voice.
- **Do** reach for monospace (JetBrains Mono) for headings, wordmarks, labels,
  and code-adjacent UI. The terminal cue is the brand.
- **Do** convey depth with tonal layering and 1px hairlines. A surface raises by
  moving up the charcoal ramp, not by gaining a shadow.
- **Do** let the preview stage go *darker* than the canvas (Inset `#0a0a0c`) so
  the snippet reads as lit. The chrome recedes; the snippet is the loud thing.
- **Do** keep radii tight (4/6/8px) and text near-white (`#f4f4f5`), never pure
  `#fff`, never pill-shaped.
- **Do** keep body text on Muted (`#b4b4bc`) or brighter and cap prose near
  58–75ch. Muted and Dim are AA-tuned on the canvas; don't darken them further.

### Don't:
- **Don't** adopt the React Bits identity: cool violet, purple-to-blue gradients,
  decorative glow, Geist. The amber-on-charcoal warmth is a deliberate 180° from it.
- **Don't** ship the `bg-neutral-950 / text-neutral-100` AI-SaaS scaffold with
  Inter/Geist — that generic dark mode is exactly what this site exists to refute.
- **Don't** use gradient text (`background-clip: text`), the hero-metric template,
  glassmorphism as decoration, or identical icon-card grids.
- **Don't** add drop shadows to site chrome. Glow belongs to snippet previews,
  never to the frame around them.
- **Don't** use a colored left/right border as a stripe accent on cards, list
  items, or callouts. The only sanctioned left border is the inert 2px TOC reading
  rail.
- **Don't** let amber decorate. If it isn't pointing at an active state, a name, a
  brand mark, or a primary action, it doesn't belong.
- **Don't** make headings dramatically large to signal hierarchy. Mono weight + a
  hairline underline carry it; display tops out near 3rem.
