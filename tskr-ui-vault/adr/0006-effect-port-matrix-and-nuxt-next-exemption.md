# Effect port matrix: cells, folder naming, and the Nuxt/Next exemption

GradientText is the first **effect** with `hasStylingAxis: true`, so it is the first snippet that actually fans out across the framework × styling matrix. LinkTag (a `utility`, `hasStylingAxis: false`) shipped `vue`, `vue-nuxt`, `react-next`, and `html` cells. Naively copying that shape onto an effect would have produced a `vue-nuxt` cell that is **byte-identical** to the Vue cell and a `react-next` cell that imports nothing from Next — copies whose only possible future is to drift.

The difference is that a `utility`'s per-framework versions are **native variants** (ADR-0002): genuinely different idiomatic code (`vue-router` vs `NuxtLink` vs `next/link`). The Nuxt and Next cells earn their existence because the code is actually different. A visual effect has no such per-framework API surface — the gradient mechanics are the same raw CSS everywhere; only the wrapper syntax and the styling approach change.

We decided the following conventions for **port-model snippets** (effects, components, layouts):

- **Folder/id = `<framework>-<styling>`** when `hasStylingAxis: true` (e.g. `vue-tailwind`, `vue-css`, `react-tailwind`, `react-css`). `vue-tailwind` is always the reference. (Utilities with `hasStylingAxis: false` keep bare framework folders like `vue`, `react-next`.)
- **Use the plain framework target (`vue`, `react`), not the meta-framework one (`vue-nuxt`, `react-next`), unless the snippet uses a framework-specific API.** An effect that touches no router/link/meta-framework feature ships `react`, never `react-next`. There is no Nuxt cell for such effects, because it would equal the Vue cell.
- **The styling axis is populated only where a cell is meaningfully different.** GradientText ships a single `html` cell (CSS-based) rather than a symmetric `html-tailwind` + `html-css` pair, because the gradient still needs raw `@keyframes` either way, making the two ~95% identical.

GradientText's resulting cells: `vue-tailwind` (reference), `vue-css`, `react-tailwind`, `react-css`, `html`.

## Consequences

- The matrix is **not uniform across snippets**, and that is intended: cells exist where the code genuinely differs, not to satisfy symmetry. A reader comparing LinkTag's `vue-nuxt` to GradientText's absence of one should read this ADR, not assume an oversight.
- The no-drift rule (ADR-0004) is strengthened: we never ship a cell that is a copy of another cell, because a copy can only drift.
- A future framework-specific effect (one that *does* use Nuxt or Next APIs) may legitimately add `vue-nuxt`/`react-next` cells — the rule is "different API ⇒ its own cell," not "effects never get meta-framework cells."
