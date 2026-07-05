# Dark / Light Mode — Implementation Plan

> Build spec for adding a light theme to tskr/ui. The site is currently dark-only
> (ADR-0008, "warm amber on charcoal"). This adds a co-equal **light** skin that
> **defaults to the OS setting**, with a manual toggle that overrides and persists.
>
> Consider recording the decision itself as **ADR-0016** (extends ADR-0008); this
> file is the implementation spec.

---

## 1. Goal & non-goals

**Goal.** A light theme for the *site chrome*, the *preview stage frame*, and the
*code blocks*, switchable via a header toggle, defaulting to the visitor's OS
preference, flash-free, accessible (WCAG AA), and coherent with the warm-amber
brand.

**Non-goals.**
- **Snippet content is not re-themed.** Per CLAUDE.md, snippets use plain Tailwind
  (`bg-white`, `text-black`, …) and never read site tokens. A snippet authored on a
  white card stays a white card in either theme — it's the user's copied artifact.
  Only the *stage frame* around it themes.
- No tri-state UI, no per-page theme, no cross-tab sync (dropped by decision).

---

## 2. Locked decisions

| # | Decision | Choice |
|---|----------|--------|
| Scope | What themes | Chrome + preview **stage frame** + **code blocks**. Snippet content stays as-authored. |
| Default | First-visit theme | **Follow OS** (`prefers-color-scheme`); live until the user makes an explicit choice. |
| Model | Toggle shape | Binary **dark ⇄ light** icon button, reflecting the *resolved* theme. |
| Override | After a click | Explicit choice written to `localStorage`, overrides OS from then on. |
| Placement | Where | Right end of the nav action cluster, on **both** the home `.s-nav` and docs `.docs-header__right`. |
| Form | Control | Compact **icon button** (lucide sun/moon), `aria-pressed`, ≥44px tap target. |
| Mechanism | How applied | `data-theme` attribute on `<html>` + a `:root[data-theme="light"]` CSS override block. |
| Driver | Wiring | **Vanilla JS** module (no framework island) + inline pre-paint `<head>` script. |
| Persistence | Storage | `localStorage['tskr-theme']` = `"light" | "dark"`; absence = follow OS. |
| Cross-tab | storage event | **Dropped.** |
| Code blocks | Shiki | **Dual-theme via CSS vars**, `defaultColor: 'dark'`, pairing `github-dark-default` + `github-light-default`. No re-highlight. |
| Palette | Character | **Warm off-white** (brand-coherent), not cold neutral. |
| Accent | Light-mode contrast | **Split token:** new `--color-accent-text` for accent *ink/hairlines* (deep amber in light); `--color-accent` stays bright amber for *fills*. |
| Mobile | Extras | `theme-color` meta per theme, `color-scheme`, 44px target, no menu needed. |
| Motion | Transition | Short color/bg transition on toggle, disabled under `prefers-reduced-motion`; no first-paint animation. |

---

## 3. Token architecture

The dark palette lives in the Tailwind v4 `@theme` block in `global.css`. Because
that block is **non-inline**, utilities compile to `var(--color-*)` — so overriding
a custom property under a selector cascades to every utility *and* every `var()`
consumer automatically. No change to how dark works; we only **add overrides**.

- Dark stays the `:root` default (`@theme` values, untouched).
- Light is a plain CSS block: `:root[data-theme="light"] { --color-*: … }`.
- Add **one new token** `--color-accent-text`, defined in both themes (see §5).

Specificity: `:root[data-theme="light"]` = (0,2,0) beats `:root` (0,1,0), so overrides
win regardless of source order.

```css
/* global.css — appended after the @theme block */

:root {
  color-scheme: dark;
  /* accent used as INK/hairlines; in dark it's just the bright amber */
  --color-accent-text: var(--color-accent);
}

:root[data-theme="light"] {
  color-scheme: light;

  /* surfaces — warm off-white, not pure neutral */
  --color-canvas:   #fbfaf7;
  --color-surface:  #ffffff;
  --color-surface2: #f3f1eb;
  --color-inset:    #efebe1;  /* code-block / stage bg — warm, reads "inset" */

  /* lines */
  --color-line:  #e6e2d8;
  --color-line2: #d6d0c2;

  /* text (all AA on canvas AND surface) */
  --color-fg:    #1a1a1e;
  --color-muted: #55555e;
  --color-dim:   #6e6e77;

  /* accent — FILLS stay bright amber (dark ink on top reads great) */
  --color-accent:     #f5b544;
  --color-accent2:    #e9a62f;  /* hover: darken on light (dark hovers by brightening) */
  --color-accent-ink: #1a1206;  /* dark ink on amber fills — unchanged */
  --color-accent-soft: rgba(245, 181, 68, 0.22); /* active-bg tint, bumped so it reads on white */

  /* accent as INK/hairlines — deep amber that passes AA (see §5) */
  --color-accent-text: #8a5300;
}
```

---

## 4. Full light palette

| Token | Light value | On canvas `#fbfaf7` | Notes |
|-------|-------------|---------------------|-------|
| `--color-canvas` | `#fbfaf7` | — | warm paper base |
| `--color-surface` | `#ffffff` | — | cards, nav, code bar |
| `--color-surface2` | `#f3f1eb` | — | raised/hover |
| `--color-inset` | `#efebe1` | — | code body + stage bg |
| `--color-line` | `#e6e2d8` | — | hairlines |
| `--color-line2` | `#d6d0c2` | — | stronger dividers |
| `--color-fg` | `#1a1a1e` | ≈16.7:1 | AAA |
| `--color-muted` | `#55555e` | ≈6.8:1 | AA (normal), AAA (large) |
| `--color-dim` | `#6e6e77` | ≈4.6:1 | AA (normal) — the small mono labels |
| `--color-accent` | `#f5b544` | *fills only* | never used as small text in light |
| `--color-accent2` | `#e9a62f` | *fills only* | button hover |
| `--color-accent-ink` | `#1a1206` | on amber ≈9:1 | dark ink on fills |
| `--color-accent-soft` | `rgba(245,181,68,.22)` | tint | active-bg wash |
| `--color-accent-text` | `#8a5300` | ≈6.2:1 | accent ink/hairlines |

> Contrast figures are approximate — **verify each with a checker during
> implementation** against the *lightest* surface a token appears on (`#ffffff`,
> the worst case). If you want the accent to read more "amber" than "ochre," nudge
> `--color-accent-text` toward `#9a6000` (≈4.8:1, still AA). Do **not** go lighter.

---

## 5. The accent-in-light problem (the crux)

Bright amber `#f5b544` on white is ≈**1.6:1** — it fails AA *and* the 3:1
large-text floor. So anywhere the accent is used as **ink or a hairline** it would
be nearly invisible in light mode (this is the "accent may be hard to see" concern).
But as a **fill** (button bg, active pill) bright amber with dark ink looks great.

**Resolution — split the token:**

- `--color-accent` → **fills / backgrounds only** (buttons, active-bg, toggle-on
  tracks, swatch chips). Unchanged in dark.
- `--color-accent-text` → **all accent-colored text and thin borders.** Aliases
  `--color-accent` in dark (⇒ dark theme is pixel-identical), becomes deep amber
  `#8a5300` in light.

**Migration rule:** every `color: var(--color-accent)` and every accent-colored
`border`/`border-*-color: var(--color-accent)` becomes `--color-accent-text`.
Every `background`/`background-color: var(--color-accent)` **stays**.

**Find the sites:**

```bash
# accent-as-ink / hairline → migrate to --color-accent-text
grep -rnE '(color|border[a-z-]*color)\s*:\s*var\(--color-accent\)' src/styles src/detail src/controls src/pages
# accent-as-fill → leave as --color-accent (sanity check)
grep -rnE 'background[a-z-]*\s*:\s*var\(--color-accent\)' src/styles src/detail src/controls src/pages
```

Known ink usages to migrate (non-exhaustive — trust the grep): the brand `/ui`
spans (`.s-brand span`, `.home-word span` — **large but still fail 3:1**, so they
must migrate), `.home-cat`, `.home-stats b`, `.home-why b`, `.home-item:hover`,
`.s-bc__name`, `.s-navlinks a[aria-current]`, `.docs-link[aria-current]` (text
only; its bg is `accent-soft`), `.docs-toc a[aria-current]` (text **and**
`border-left-color`), `.api__name`, and the `/design` accents (`.ds-swatch__hex`,
`.ds-rung__name`, `.ds-radius__val`, callout eyebrows, `.ds-note code`).

Known fill usages to keep: `.s-btn--primary` bg, `.api-bool.is-on` track, the
`ds-flash` chip bg, `.vseg__btn[aria-pressed]` / `docs-link[aria-current]` bg
(`accent-soft`), `.ds-radius__shape` fill.

---

## 6. Theme resolution, persistence & no-flash

**Model:** resolved theme = stored choice if present, else the OS setting. While
no choice is stored, a `matchMedia` listener keeps the theme in sync with the OS
live. The first click writes an explicit choice and stops following the OS.

**Inline pre-paint script** — add to `Layout.astro` `<head>`, as early as possible,
**before** the stylesheet/font links, so light-preferring visitors never flash dark:

```html
<script is:inline>
  (() => {
    try {
      const stored = localStorage.getItem('tskr-theme'); // 'light' | 'dark' | null
      const theme = stored
        ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.dataset.theme = theme;
      const m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute('content', theme === 'light' ? '#fbfaf7' : '#0e0e11');
    } catch {}
  })();
</script>
<meta name="theme-color" content="#0e0e11" />
```

> `is:inline` keeps Astro from hoisting/bundling it — it must run synchronously in
> place. We always set `data-theme` explicitly (`"dark"` is redundant with the
> `:root` default but harmless, and lets the toggle read current state off the
> attribute).

**Runtime module** `src/detail/theme.ts` (or a top-level `src/theme.ts`; vanilla,
framework-free). Loaded by the toggle button:

```ts
const KEY = 'tskr-theme';
type Theme = 'light' | 'dark';

const mq = matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;
const meta = document.querySelector('meta[name="theme-color"]');

export function current(): Theme {
  return (root.dataset.theme as Theme) ?? (mq.matches ? 'dark' : 'light');
}

function apply(theme: Theme) {
  root.dataset.theme = theme;
  meta?.setAttribute('content', theme === 'light' ? '#fbfaf7' : '#0e0e11');
  // let any mounted toggles update their icon/aria
  window.dispatchEvent(new CustomEvent('tskr-theme-change', { detail: theme }));
}

export function toggle() {
  const next: Theme = current() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(KEY, next); } catch {}
  apply(next);
}

// Follow the OS live *until* the user has made an explicit choice.
mq.addEventListener('change', (e) => {
  let stored: string | null = null;
  try { stored = localStorage.getItem(KEY); } catch {}
  if (!stored) apply(e.matches ? 'dark' : 'light');
});
```

No `storage` listener (cross-tab dropped). No SSR access to `window` — this module
is imported only by the client-side toggle.

**Optional "reset to system":** not in the UI. If wanted later, a long-press or a
tiny "auto" affordance can `localStorage.removeItem('tskr-theme')` then re-apply
`mq.matches`. Out of scope for v1.

---

## 7. The toggle button

A vanilla button rendered in both navs. Two options for how it's authored:

- **(a) Plain Astro + `is:inline` handler** — a `<button>` in `Layout`/nav markup
  with a small inline script wiring `onclick → toggle()` and swapping the icon on
  `tskr-theme-change`. Zero framework, zero hydration.
- **(b) Tiny Vue island** (`client:load`) for consistency with `VariantSelector`.

**Recommendation: (a).** It's global chrome on a static nav; keep it out of the
hydration path. Inline the two lucide SVG paths (sun/moon) and toggle a `hidden`
attribute, or swap via CSS on `[data-theme]`.

**Markup sketch** (works in both `.s-nav` and `.docs-header__right`):

```html
<button type="button" class="s-theme" aria-label="Toggle light/dark theme" aria-pressed="false">
  <svg class="s-theme__sun"  …lucide sun … ></svg>
  <svg class="s-theme__moon" …lucide moon … ></svg>
</button>
```

```css
.s-theme {
  display: inline-grid; place-items: center;
  width: 2.75rem; height: 2.75rem;         /* 44px tap target (WCAG 2.5.5 / HIG) */
  margin: -0.4rem 0;                        /* keep visual size compact in the bar */
  border: 0; background: transparent; cursor: pointer;
  color: var(--color-dim); border-radius: var(--radius-md);
  transition: color .2s ease, background .2s ease;
}
.s-theme:hover { color: var(--color-fg); background: var(--color-surface); }
.s-theme:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.s-theme__sun  { display: none; }          /* dark active → show moon */
:root[data-theme="light"] .s-theme__moon { display: none; }
:root[data-theme="light"] .s-theme__sun  { display: block; }
```

Icon reflects the **current** theme (moon in dark, sun in light). Wire
`aria-pressed` (`true` when light) and `onclick` to `toggle()`; update both on the
`tskr-theme-change` event so a matchMedia-driven change also refreshes the button.

---

## 8. Code blocks (Shiki dual-theme)

The code-block **background** is already `var(--color-inset) !important`
(`detail.css:275`), so the container re-themes for free. Only the inline per-token
`color` needs the second theme.

**`highlighter.ts`:**

```ts
hp = createHighlighter({
  themes: ['github-dark-default', 'github-light-default'],
  langs: ['vue', 'tsx', 'jsx', 'html', 'bash', 'css'],
});
// replace the single-theme export:
export const SHIKI_THEMES = { light: 'github-light-default', dark: 'github-dark-default' } as const;
```

**`CodeBlock.vue` render():**

```ts
html.value = hl.codeToHtml(props.code, {
  lang: props.lang,
  themes: SHIKI_THEMES,
  defaultColor: 'dark',            // inline color = dark theme (our default)
});
```

`defaultColor: 'dark'` makes each span's inline `color` the dark value and stashes
light in `--shiki-light`. One CSS rule swaps on toggle — flash-free, no re-highlight:

```css
/* detail.css — near the .sd-code__body pre.shiki rules */
:root[data-theme="light"] .sd-code__body .shiki,
:root[data-theme="light"] .sd-code__body .shiki span {
  color: var(--shiki-light) !important;
}
```

Bundle cost: one extra theme JSON. The fallback (catch) plain-`<pre>` path inherits
`color` and themes for free.

---

## 9. Mobile

- **`theme-color` meta** — set per theme (`#0e0e11` / `#fbfaf7`) in the inline
  script *and* on toggle, so the mobile browser chrome (Safari/Chrome address bar)
  matches. Biggest visible mobile win.
- **`color-scheme`** — set on `:root` (`dark`) and `:root[data-theme="light"]`
  (`light`) so native scrollbars, form controls, and the system UI adapt.
- **Tap target** — the button is 44×44 CSS px (negative margin keeps it visually
  compact in the bar). Meets WCAG 2.5.5 / Apple HIG.
- **No menu to worry about** — the site has no hamburger/mobile nav collapse; both
  navs are inline at all widths. The single icon joins the action cluster and is
  always one tap. On the narrowest screens the *text* nav links (Snippets/Design/
  GitHub) are the crowding risk, not the toggle; if it ever crowds, the toggle
  should win priority over the text links.
- Layout is unchanged by theme — no reflow, so nothing else mobile-specific.

---

## 10. Motion

Follow the existing precedent (`detail.css:156` already honors reduced-motion).
Add a modest transition so a *manual* toggle feels intentional, but never animate
the first paint (the pre-paint script sets the attribute before transition styles
apply, so it won't):

```css
@media (prefers-reduced-motion: no-preference) {
  .s-root,
  .s-nav, .docs-header, .docs-side,
  .s-stage, .sd-code, .api, .s-btn {
    transition: background-color .2s ease, border-color .2s ease, color .2s ease;
  }
}
```

Keep the list bounded to themed chrome; don't blanket `*` (it makes the whole page
lurch and can fight snippet animations).

---

## 11. Hardcoded non-token colors to audit

A few chrome colors are literal `rgba(255,255,255,…)` / white-assuming and won't
auto-theme. Give each a light override (or express it via a token):

```bash
grep -rnE 'rgba\(255' src/styles src/detail src/controls
```

Known: the preview-stage dot grid `radial-gradient(... rgba(255,255,255,0.05) ...)`
(`site.css` `.s-stage`, `detail.css` `.sd-stage`) — invisible on light; give a
`:root[data-theme="light"]` variant using `rgba(0,0,0,0.05)`. Also check the
`color-mix(... var(--color-canvas) ...)` overlays (`detail.css:123`) — those follow
the token, so they're fine, but eyeball them once in light.

---

## 12. Files to touch

| File | Change |
|------|--------|
| `src/styles/global.css` | Append `:root` (`color-scheme`, `--color-accent-text` alias) + `:root[data-theme="light"]` override block. |
| `src/styles/site.css` | Migrate accent-**ink**/hairline usages → `--color-accent-text`; add `.s-theme` button styles; light override for `.s-stage` dot grid; motion block. |
| `src/styles/detail.css` | Shiki light-swap rule; `.sd-stage` dot-grid light override; migrate any accent-ink usages. |
| `src/styles/controls.css` / `demo.css` | Migrate accent-ink usages if any (grep). |
| `src/layouts/Layout.astro` | Inline pre-paint script + `theme-color` meta in `<head>`. |
| `src/pages/index.astro` | Add toggle button to `.s-nav`. |
| `src/layouts/SnippetLayout.astro` | Add toggle button to `.docs-header__right`. |
| `src/theme.ts` (new) | Vanilla resolve/toggle/matchMedia module. |
| `src/detail/highlighter.ts` | Load both themes; export `SHIKI_THEMES`. |
| `src/detail/CodeBlock.vue` | `themes` + `defaultColor: 'dark'`. |

---

## 13. Build order

1. **Tokens** — add the `:root[data-theme="light"]` block + `--color-accent-text`
   alias. Manually flip the attribute in devtools to smoke-test surfaces.
2. **Accent migration** — run the grep; move ink/hairline usages to
   `--color-accent-text`. Confirm dark is visually unchanged (diff should be inert
   in dark since it aliases `--color-accent`).
3. **Resolution + no-flash** — inline `<head>` script + `theme-color` meta +
   `src/theme.ts`. Verify no dark→light flash on a light-OS reload.
4. **Toggle button** — add to both navs, wire `toggle()`, icon/aria swap, 44px.
5. **Code blocks** — Shiki dual-theme + the light-swap CSS rule.
6. **Audit** — hardcoded whites (dot grids), `color-scheme`, motion block.
7. **A11y pass** — see §14.

---

## 14. Acceptance checklist

- [ ] Light-OS first visit renders light; dark-OS renders dark — **no flash** either way.
- [ ] Changing the OS setting live flips the site **only while** no explicit choice is stored.
- [ ] Clicking the toggle persists and overrides the OS thereafter.
- [ ] Dark theme is **visually identical** to before (accent split is inert in dark).
- [ ] All text passes **WCAG AA** in light on its actual surface (`fg`/`muted`/`dim`/`accent-text`); verify with a checker, worst case `#ffffff`.
- [ ] Amber **fills** (primary button, active pills, toggle-on) stay vibrant + legible in light.
- [ ] Code blocks read correctly in both themes; toggling is instant, no re-highlight flash.
- [ ] Preview **stage frame** (bg + dot grid) is visible in light; snippet **content** is unchanged in both themes.
- [ ] Mobile browser chrome (`theme-color`) matches the theme; toggle is a ≥44px target and always reachable.
- [ ] Keyboard: toggle is focusable, `aria-pressed` correct, visible focus ring.
- [ ] `prefers-reduced-motion`: no theme transition; still switches instantly.
- [ ] `npm run check` clean (no new type errors); `npm run build` succeeds.

---

## 15. Suggested commit

```
feat(theme): add OS-default light mode with accent-safe token split

- data-theme override block + --color-accent-text split (fills stay bright amber,
  ink/hairlines use a deep AA-safe amber in light)
- pre-paint head script follows prefers-color-scheme; toggle overrides + persists
- Shiki dual-theme (defaultColor dark) for flash-free code blocks
- header toggle (44px), theme-color meta + color-scheme for mobile
```
