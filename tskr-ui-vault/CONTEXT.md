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
The per-snippet, per-variant declaration of what a user must already have for a pasted snippet to work — npm dependencies (e.g. gsap, three), assumed tooling (e.g. "Tailwind v4 configured"), and any global CSS to add (`@keyframes`, `@theme` tokens). The honest replacement for a blanket "no setup" promise.
_Avoid_: requirements, dependencies (when referring to the whole block rather than just npm packages)

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
A throwaway page under `/demos` that renders the shared, token-driven site chrome under one design direction, across both judged surfaces (home + a snippet detail page), so directions can be compared in context. Demos exist only to choose a direction and are deleted on promotion.
_Avoid_: preview (reserved for a snippet's live render), playground
