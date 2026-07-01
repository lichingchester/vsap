# tskr/ui

tskr/ui is a copy-paste collection of UI components, visual effects, and layouts for the web. Users copy a snippet's source code directly into their own project — nothing is installed from tskr/ui as a runtime library.

## Language

### Units

**Collection**:
The whole tskr/ui library — the site and its full set of snippets. The brand-level noun. (`/ui` is the umbrella for all kinds, including effects and layouts, not just UI components.)
_Avoid_: registry, library (when referring to the atomic unit)

**Snippet**:
The atomic unit a user copies — one self-contained component, effect, or layout. The thing a "copy" button copies.
_Avoid_: block, component (when referring to the unit rather than a Vue/React component)

**Kind**:
What a snippet is, as a classification: `component`, `effect`, `layout`, or `utility`.

**Category**:
The user-facing grouping a snippet is filed under in the sidebar and URL (e.g. backgrounds, text-animations, utils). Independent of Kind.

**Prerequisites**:
The per-snippet, per-variant declaration of what a user must already have for a pasted snippet to work — third-party dependencies (e.g. gsap, three), assumed tooling (e.g. "Tailwind v4 configured"), and any global CSS to add (`@keyframes`, `@theme` tokens). The honest replacement for a blanket "no setup" promise. On the detail page this is the name of the **section** (formerly mistitled "Install"): a state the user checks, not an action they perform. It renders the **Install** command for its dependencies plus any tooling/CSS notes, and is **hidden entirely** when a variant needs nothing. A tooling note may carry a doc link (e.g. "Tailwind v4 configured" → the Tailwind install guide) rather than reproduce setup the site doesn't own. See [[0012-prerequisites-not-install]].
_Avoid_: requirements, dependencies (when referring to the whole block rather than just the packages), Install (that is only the dependency command inside this section)

### Variants

**Framework target**:
One of the UI technologies a snippet can be authored for: Vue, React, or native HTML. Vue is the reference; React and HTML are optional.

**Styling target**:
One of the styling approaches a snippet can be authored for: Tailwind or native CSS. Tailwind is the reference; native CSS is optional.

**Variant**:
A single concrete implementation of a snippet for one framework target combined with one styling target (e.g. "React + native CSS").

**Reference variant**:
The canonical, source-of-truth implementation every snippet starts from: **Vue + Tailwind**. Authored first and by hand; all other variants are derived from it.
_Avoid_: canonical version, primary version

**Port**:
Any non-reference variant of a visual snippet (component, effect, layout), produced by translating the reference variant into another framework and/or styling target. Created on demand, not up front.

**Native variant**:
A variant of a `utility` snippet that is a genuinely independent, idiomatic implementation per framework (e.g. LinkTag uses `vue-router` in Vue, `next/link` or react-router in React, a plain `<a>` in HTML) rather than a translation of a reference. Utility snippets are exempt from the reference/port model because there is no single canonical source to translate from.

### Site design

**Design direction**:
A complete candidate look for the site, expressed primarily as one **token set** (canvas, accent, type, radii, spacing, shadow, motion) filling a fixed set of CSS variables. A direction may also bring its own **layout** when it needs to explore a genuinely different structure rather than a recolour (the escape hatch). Directions are explored before one is adopted: "B" (warm amber on the shared sidebar shell), "C" (a sidebar-less gallery). The winning direction's tokens — and at most one chosen layout — are promoted into the real `@theme`. See [[0008-design-directions-via-token-demo-harness]].
_Avoid_: theme, skin, mockup

**Demo**:
A throwaway page under `/demos` used to compare candidate designs **in context** before one is promoted, then deleted. Originally one per **design direction** (a token set, ADR-0008); reused since for any in-context comparison on the confirmed system — e.g. competing **detail-page** layouts under the fixed amber-on-charcoal tokens. Demos exist only to choose, and are removed on promotion (the trail survives in git + the ADR).
_Avoid_: preview (reserved for a snippet's live render), playground

### Detail page

**Copy artifact**:
One of the discrete, separately-copyable blocks the detail page exposes for a snippet variant: the **Install** command (nested inside the **Prerequisites** section), **Source**, and **Usage**. Each appears only when it has content (a variant with no dependencies shows no Install and, if it needs no tooling either, no Prerequisites section at all; the self-contained HTML variant collapses Source and Usage into one). Copying the source is the product's core job, so each artifact carries its own copy button.
_Avoid_: snippet (the whole unit, not one block of it), code block

**Install**:
The copyable dependency-setup command shown *inside* the **Prerequisites** section for the selected variant — `npm i gsap@^3.12` for a Vue/React variant, or the equivalent CDN `<script>` line for the HTML variant (which has no npm). The version is *known-good* (the range the reference was written against), guidance not a mandatory pin. No longer a top-level section heading of its own; renders only when the variant has a real dependency (tooling/CSS-only prerequisites stay as notes). See [[0012-prerequisites-not-install]].
_Avoid_: the section title (that is **Prerequisites**); implying the snippet itself is installable

**Source**:
The copy artifact holding the component file the user pastes into their project — the literal variant source (`GradientText.vue`). Static: it does not change as playground controls move (it is the file, not a call of it).
_Avoid_: code, snippet

**Usage**:
The copy artifact holding the generated call-site example for the selected variant — the import plus an invocation with the current prop values (`<GradientText :colors="…">…`). Generated from `meta` (tag + a children example) and the props, rendered into each framework's syntax, so the playground controls drive it live and copying reflects the chosen props.
_Avoid_: example, demo

**Variant preference**:
The visitor's persisted choice of **framework target** + **styling target**, set once via the header toggles and honored by every detail page (one source of truth in `localStorage`, mirrored by the per-page selector). Expressed as the two axes — not a concrete **variant** id — because ids differ per snippet; each page resolves it to its nearest available variant, falling back to the **reference variant** with a quiet note when the exact combo is absent.
_Avoid_: variant (the resolved implementation, not the saved preference), setting
