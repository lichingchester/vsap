# Single-purpose snippets: splitting static from animated

GradientText shipped as one snippet whose identity was the motion — an *animated* linear gradient clipped to text, with `colors`, `degree`, and `animationSpeed`. A user who only wanted a still gradient had to copy the file and strip the `@keyframes`, the `animation` line, and the oversized-`background-size` machinery that exists solely to feed the animation. That friction runs against the copy-paste model (ADR-0001): the unit a user copies should be clean to use *and* edit, with no dead code for the mode they didn't pick.

The instinct is to add a mode toggle — an `animate` boolean, or `animationSpeed: 0` meaning "off". We rejected that: a toggle always leaves the unused branch (the keyframes, the `isVertical`/`background-size` trick) sitting in the copied file. In a copy-paste collection, a mode toggle **is** dead code by another name.

We decided that **snippets are single-purpose, and features that would otherwise be toggles become separate snippets.** For gradient text that means a split, and the split follows an asymmetry worth naming:

- **Static gradient-to-text is shape-agnostic.** Clipping a gradient to glyphs (`background-clip: text; color: transparent`) does not care whether the background is `linear-gradient` or `radial-gradient` — shape lives entirely in the gradient value, not the component logic. One static component covers linear, radial, and conic with zero branching.
- **The animation is shape-specific.** The current effect oversizes one axis (`100% 300%` / `300% 100%`) and slides `background-position` — a trick that only makes sense for a *linear* gradient at a known angle. A radial gradient does not flow along an axis; it pulses (`background-size`) or drifts (its center). Different keyframes, different props (`degree` is meaningless for radial). Motion cannot be shared across shapes without a branch.

So the split is along the grain of that asymmetry, not a naive static-vs-animated *and* linear-vs-radial cross-product:

- **`gradient-text`** — the existing snippet, **de-animated**. Static, `colors` + `degree`, keyframes and the `background-size` machinery removed (the Vue + Tailwind reference collapses to `bg-clip-text` + an inline `background-image`, no `<style>`). Keeps a lean playground (`colors`, `degree`). This is the shape-flexible base.
- **`animated-gradient-text`** — new, the current animation verbatim, renamed `AnimatedGradientText` with its class/keyframe namespaced (`animated-gradient-text` / `animated-gradient-text-move`) so a project can paste both without a CSS collision. Full flagship playground (`colors`, `degree`, `animationSpeed`).
- **Radial / conic** — deferred. Static radial rides in `gradient-text`'s concept for free; **animated** radial is a genuinely different effect and becomes its own snippet only when that motion is designed — never a `type` prop on an existing one.

Both stay in the `text-animations` category. A static gradient in a category named "animations" is a mild contradiction we accept while the catalog is tiny; a rename to `text-effects` is a separate call best forced by a third snippet, not bundled here.

## The trilemma (why this costs a whole extra snippet)

You cannot simultaneously have (a) zero animation code in the static file, (b) no separate static snippet, and (c) no toggle — pick two. This decision picks (a) + (c) by paying for a separate static snippet. That cost is *in budget*: the copy-paste model already accepts self-contained duplication (ADR-0001) as the price of a snippet you can paste and own. The animated snippet duplicating the base gradient math is the same trade the whole collection already makes.

## Consequences

- **Duplication is the accepted cost.** A `colors`/`degree` bugfix in the gradient math must land in both snippets (2 × 5 variants). This is the copy-paste tax, not a smell.
- **No mode-toggle props anywhere.** Snippets do not gain `animate` / `type` / `variant` booleans that leave dead branches in copied code. If a "mode" is worth shipping, it is worth its own snippet — subject to the same "does the code genuinely differ" test as ADR-0006's port cells.
- **Discoverability is by description + index adjacency.** There is no `seeAlso` mechanism; the two snippets cross-reference in prose ("see Animated Gradient Text" / "see Gradient Text") and sit next to each other in the home index. A dedicated related-snippets feature is not worth building for two entries.
- The flashier product (the animation) now lives at a **new** URL (`/snippets/text-animations/animated-gradient-text`); the original `gradient-text` URL is now the humble static page. Acceptable while the site is early.
