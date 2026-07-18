# A co-equal light mode that defaults to the OS, via a `data-theme` override block and an accent-safe token split

[[0008-design-directions-via-token-demo-harness]] confirmed the site's identity as
**warm amber `#F5B544` on charcoal `#0E0E11`** — and shipped it dark-only. A
dark-only dev-tool site is defensible, but a copy-paste UI library is visited in
daylight as much as at night, and a visitor whose OS is set to light and who is
handed a black page reads it as *unfinished*, not *opinionated*. We decided to add
a **co-equal light skin** — not a grudging inversion, a first-class second face of
the same brand.

Four decisions shaped how, captured first as an implementation spec
([[Dark-Light Mode (implementation plan)]]) and recorded here as the decision that
extends [[0008-design-directions-via-token-demo-harness]].

- **It defaults to the OS, and follows it live until the user chooses.** First
  visit resolves to `prefers-color-scheme`; a `matchMedia` listener keeps the site
  in sync with the OS *until* an explicit toggle is clicked, at which point the
  choice is written to `localStorage['tskr-theme']` and overrides the OS from then
  on. Absence of the key means "follow OS" — there is no third tri-state control,
  just presence/absence of an override. Cross-tab sync (a `storage` listener) was
  considered and **dropped** as not worth the complexity for a docs site.

- **Light is an *override block*, not a second `@theme`.** Because the dark palette
  lives in a **non-inline** Tailwind v4 `@theme` block, every utility compiles to
  `var(--color-*)`. So light mode is a plain CSS cascade layer —
  `:root[data-theme="light"] { --color-canvas: …; … }` — that redefines the custom
  properties and thereby recolours every utility *and* every raw `var()` consumer
  at once. Specificity `(0,2,0)` beats `:root` `(0,1,0)`, so order doesn't matter.
  Dark is untouched: it stays the `:root` default, so the dark site is
  **pixel-identical to before**. The palette itself is a **warm off-white**
  (`#fbfaf7` canvas), not a cold neutral — brand-coherent with the amber, and a
  deliberate rejection of the generic cool-grey light theme.

- **The accent splits into a fill token and an ink token — the crux.** Bright amber
  `#f5b544` on white is ≈1.6:1: it *fails* AA and even the 3:1 large-text floor, so
  as **ink or a hairline** it is nearly invisible in light. But as a **fill** (a
  button background, an active pill) with dark ink on top it looks great. So the
  single accent token splits: **`--color-accent` = fills/backgrounds only**
  (unchanged in dark), and a new **`--color-accent-text` = all accent-coloured text
  and thin borders**, which *aliases* `--color-accent` in dark (⇒ dark is inert)
  and becomes a deep, AA-safe amber `#8a5300` (≈6.2:1) in light. The migration rule
  is mechanical: every `color`/accent-`border` usage of `--color-accent` moves to
  `--color-accent-text`; every `background` usage stays. This is the one structural
  addition light mode makes to the token system; everything else is a value
  override.

- **No flash, and code blocks re-theme without re-highlighting.** An `is:inline`
  pre-paint script in `Layout.astro`'s `<head>` — before the stylesheet/font links
  — sets `data-theme` (and the `theme-color` meta) synchronously, so a light-OS
  visitor never sees a dark flash. Shiki emits **dual-theme** output
  (`github-dark-default` + `github-light-default`, `defaultColor: 'dark'`), stashing
  the light colour in a `--shiki-light` CSS var; one `:root[data-theme="light"]`
  rule swaps to it instantly with no re-highlight. The toggle itself is a **vanilla,
  framework-free** module + a plain `<button>` in both navs — global chrome kept out
  of the hydration path.

## Scope

Themed: **site chrome**, the **preview stage frame**, and the **code blocks**.

**Not themed: snippet content.** Per [[0001-distribution-by-web-copy-paste]] and
CLAUDE.md, snippets use plain Tailwind (`bg-white`, `text-black`, …) and never read
site tokens — a snippet authored on a white card stays a white card in either
theme, because it is the user's copied artifact, not our chrome. Only the *stage
frame* around it themes. (This is the same boundary [[0005-two-tier-pages-preview-renders-reference]]
draws between site and snippet, applied to colour.)

## Considered options

- **Stay dark-only.** Rejected: a light-OS visitor reads an unrequested black page
  as broken, and the brand is strong enough to survive daylight.
- **A second full `@theme` / a separate stylesheet per theme.** Rejected — it would
  duplicate the source of truth and risk the two themes drifting. The override-block
  approach keeps *one* palette definition (dark) and expresses light purely as a
  diff.
- **Re-highlight code on toggle.** Rejected — a flash and a runtime cost for what a
  dual-theme CSS-var swap does for free.
- **A framework island for the toggle** (for parity with `VariantSelector`).
  Rejected — it is static global chrome on every page; a vanilla button + inline
  pre-paint script costs zero hydration and is the only thing that can run *before
  first paint* anyway.

## Consequences

- **Dark is provably unchanged.** The accent split aliases in dark and the override
  block only adds a `[data-theme="light"]` selector, so promoting light mode is
  visually inert for existing (dark) users — the acceptance checklist gates on this.
- **One new token in the system: `--color-accent-text`.** Contributors adding chrome
  now choose *fill vs ink* for accent — `--color-accent` for backgrounds,
  `--color-accent-text` for text/hairlines. This is the durable rule the split
  leaves behind; it is not a per-theme concern.
- **A11y is a first-class gate.** Every text token is specified AA on its *worst-case*
  surface (`#ffffff`), the toggle is a ≥44px target with correct `aria-pressed` and a
  visible focus ring, `theme-color`/`color-scheme` adapt the mobile browser chrome
  and native controls, and the theme transition is disabled under
  `prefers-reduced-motion`.
- **Hardcoded non-token colours had to be audited.** A few literal
  `rgba(255,255,255,…)` chrome values (the preview-stage dot grid) don't auto-theme
  and got explicit `[data-theme="light"]` variants. New chrome should prefer tokens
  so this stays a closed set.
- **The lean-repo ethos holds.** Cost is one extra Shiki theme JSON and a small
  vanilla module — no framework, no config, no `tailwind.config.js` (the
  override-block trick is exactly why the non-inline `@theme` was worth keeping).
- Shipped in `feat(theme): add OS-default light mode with accent-safe token split`.
