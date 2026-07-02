# The API table depicts prop defaults, it doesn't print them: render kinds + control-echoing depictions

[[0011-detail-page-copy-artifact-model-and-console-layout]] gave the detail page
its Console shape and its **API table**, generated from `meta.props`. That table
rendered **Type** and **Default** as flat mono text: every value the same weight,
a colour array shown as its raw literal `['#ffaa40', …]`, a boolean as the bare
word `false`, and a required prop as a quiet `—`. The one row a reader most needs
to notice (required) was the faintest, and the gallery's most common default (a
list of colours) read as a long string. It looked like undifferentiated text.

We decided:

- **The API table *depicts* a default, it doesn't just print it.** Each row's
  Default (and its Type) is rendered through its meaning, not reproduced as flat
  source text.
- **A pure `classifyDefault(prop) → render kind` dispatch.** Four kinds:
  `colors` (the default parses to colour literal(s) — hex / `rgb()` / `hsl()`),
  `boolean` (`type === "boolean"`), `union` (`type` is a `|` of string literals),
  and `code` (everything else). Detection reads the **default / type strings**,
  not the prop name, so it needs no naming convention. `ApiTable.vue` stays
  declarative — the template switches on the kind.
- **Depiction echoes control.** A default is depicted in the *static* visual
  language of the control that would edit it in the playground ([[0010-prop-controls-kit]]):
  colour → **swatch** (echoes the `Swatch` control), boolean → **toggle glyph**
  (echoes `Toggle`), union → **option chips** (echoes `Segmented`). The playground
  and the API table then speak one language — the way you'd change a prop is the
  way its default is drawn.
- **Echo, don't import.** The depictions are lightweight, non-interactive markup
  that share the controls' CSS vocabulary — **not** the live `Swatch` / `Toggle` /
  `Segmented` components, which own popovers, state, and event emits (`Swatch.vue`
  alone is 5.5K). An API cell is an illustration, not a control; it must be inert.
- **Two containers, separated by shape not hue.** Type is a **type chip**
  (ghost / hairline outline, transparent fill); Default is a **default token**
  (filled code token). No per-kind colour-coding — the site is single-accent amber
  on charcoal ([[0008-design-directions-via-token-demo-harness]]), and a rainbow of
  type hues (string=green, number=blue, …) is explicitly rejected. The
  outline-vs-fill contrast tells the two columns apart with **zero new colour**;
  amber stays reserved for the prop name.
- **`required` replaces the em-dash.** A prop with no default shows a dim ghost
  `required` tag in the Default cell — the slot where a reader looks for "what
  happens if I don't pass this" — instead of a near-invisible `—`. It stays in
  the muted register, not amber.
- **Colour depiction is adaptive; the empty string is labelled.** A single colour
  shows swatch + inline hex (room to spare); a colour array shows swatches only
  with hex on hover, killing the long literal. Swatches are small rounded squares
  (ADR-0008 tight radii, the `Swatch` shape). An empty-string default `''` renders
  inside the token as `""` with a faint `empty` label so the cell doesn't read as
  blank.
- **Classify `union` now, render it later.** The classifier recognises `union`
  today, but no union prop exists in the corpus yet, so its option-chips renderer
  is deferred — a union falls through to `code` until the first union prop ships.
  No renderer is built for a shape that doesn't exist ([[0007-lean-playground-is-the-live-preview]]
  restraint).
- **Scope: the depiction language at desktop, plus two cheap overflow safety
  nets** — drop the `white-space: nowrap` on Type/Default and wrap the table in
  `overflow-x-auto`. A stacked-card mobile layout (each prop a labelled block below
  a breakpoint) is a separate task, deliberately deferred; this change is about the
  visual token language, not a responsive rework.

## Considered options

- **Hue-code types by kind** (string / number / boolean each a colour) — the
  obvious API-docs pattern, rejected: it breaks the single-accent identity
  ([[0008-design-directions-via-token-demo-harness]]) and would make the table look
  like a different site.
- **Import the interactive controls in a readonly mode** — maximum cohesion, but
  drags popover / state / event machinery into an inert cell; the depiction only
  needs the *look*, so we share the CSS vocabulary instead.
- **Build a full type-rendering engine up front** (union chips, number treatments,
  Record expansion) — rejected as speculative; classify-now / render-later covers
  it without shipping code for absent shapes.

## See also

- [[0011-detail-page-copy-artifact-model-and-console-layout]] — the page and the API table this refines.
- [[0010-prop-controls-kit]] — the control kit whose visual language the depictions echo.
- [[0008-design-directions-via-token-demo-harness]] — the single-accent system that forbids hue-coding.
- [[0014-type-ramp-is-chrome-local-not-a-theme-token]] — the eyebrow tier the table headers are set in.
