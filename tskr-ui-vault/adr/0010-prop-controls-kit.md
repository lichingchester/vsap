# A custom prop-controls kit ("Terminal" controls), promoted from a /demo exploration

[[0007-lean-playground-is-the-live-preview]] established that flagship snippets
ship an **opt-in interactive playground** built from **native inputs, no
component library** — the `GradientTextPlayground` used `<input type="range">`,
`<input type="color">`, and hand-rolled add/remove buttons. That kept the repo
lean while the design was unconfirmed. Native inputs, however, can't be styled to
match "The Warm Terminal" (ADR-0008): the range track, the color-picker popover,
and the select menu are OS-rendered, so the controls always looked foreign next
to the site chrome.

With the design now confirmed and guarded (ADR-0008, [[0009-adopt-impeccable-as-installed-design-gate]]),
we explored **custom-styled controls** on a throwaway `/demo` page: six skins
across two axes (Density: bare/carded/inset · Personality: terminal/refined/
brutalist), each rendering the same seven control types (slider, color, color
list, toggle, segmented, select, text). We chose the **Terminal** skin — mono,
uppercase, `#`-prefixed labels, near-black wells, tight radii, a squared switch —
because it matches the Terminal·Masthead home more closely than any other.

We decided:

- **Promote the chosen controls into a reusable kit at `src/controls/`.** Seven
  components (`Slider`, `Toggle`, `Segmented`, `Select`, `TextField`,
  `ColorPicker`, `ColorList`) + a shared internal `Swatch`, the `useSlider` /
  `usePopover` composables, and `color.ts` (HSV⇄hex). The kit is **top-level**,
  NOT under `src/components/` — the dev-scanner stub plugin (added with the
  Astro 7 migration) stubs any import from a nested `src/components/<dir>/`, so a
  nested kit would fail to resolve `vue`/`lucide`. `src/controls/` sits alongside
  `src/lib`, `src/snippets` and is safe.
- **Fully custom widgets, accessibility hand-built.** No native inputs and no
  component library (the ADR-0007 "no component library" stance holds — this kit
  IS our component, not a dependency). The slider is a div with pointer + arrow/
  Home/End handling; the select is a `role=listbox` popover; the color picker is
  a full HSV canvas + hue strip + hex + preset row; the toggle is `role=switch`.
  Keyboard nav, focus rings, Esc/outside-click and ARIA roles are owned by the
  kit.
- **The kit carries its own styling.** One Terminal-look stylesheet
  (`controls.css`, `tk-`-prefixed, reading the global design tokens) is imported
  by each component, so consumers wire nothing. It is **docs-only site chrome**
  (like `GradientTextPlayground`, `SnippetTabs`) — never copied into a user's
  project, so it may depend on the site tokens, unlike a snippet
  ([[0001-distribution-by-web-copy-paste]]).
- **Retrofit the live playground.** `GradientTextPlayground` now consumes the kit
  (`ColorList` + two `Slider`s), replacing all native inputs. The no-drift rule
  ([[0004-single-source-snippet-structure]]) is unaffected: the kit drives the
  controls, the reference variant is still the mounted preview.
- **`/demo` is kept as the exploration record**, intentionally disposable. Its
  six-skin components live separately under `src/demo/` and are NOT the kit; when
  the exploration is no longer useful the directory can be deleted without
  touching `src/controls/`.
- **Both control stylesheets are waived in the Impeccable config.** `demo.css`
  (exploration) and `controls.css` (the promoted kit) carry intentionally tight
  radii and — in the color picker — the full colour spectrum, which the detector
  flags as off-scale. These are intentional, not drift; see the waiver flow in
  [[Impeccable (design tooling)]].

## Considered options

- **Keep native inputs (ADR-0007 as-is).** Leanest, fully accessible for free,
  but permanently off-theme — the credibility argument (our own site must look
  hand-made, not generated) is exactly what native OS controls undermine.
- **Adopt a headless component library (Reka UI, etc.).** Gives accessibility +
  styling hooks, but reintroduces a dependency the project deliberately avoids,
  and the styling work to match Terminal is similar either way.
- **Build the custom kit (chosen).** More code and we own the a11y, but total
  visual control, zero dependencies, and a reusable surface for every future
  playground.

## See also

- [[0007-lean-playground-is-the-live-preview]] — the playground this kit upgrades.
- [[0008-design-directions-via-token-demo-harness]] — the confirmed design system.
- [[0001-distribution-by-web-copy-paste]] — why docs-only chrome ≠ snippets.
- [[Impeccable (design tooling)]] — the design-control waiver flow.
