# 2026-06-28 — design-system exploration (demo harness)

Process + result log for giving the site a real, documented design system,
explored on the `design-system` branch via the throwaway `/demos` harness.
See [[0008-design-directions-via-token-demo-harness]] and [[CONTEXT]] (the
**Design direction** / **Demo** terms).

## How we worked

Token-driven shared chrome: each **design direction** is a CSS-variable token
set under `[data-direction="…"]`; comparing directions is a token swap, and the
winner becomes the system. Two real snippets (Gradient Text, Link Tag) plus a
throwaway placeholder **catalog** (`src/components/demos/catalog.ts`, ~25 items)
populate every demo. Each build is checked with `npx impeccable detect` as an
objective anti-slop gate (no skill installed); taste-skill's dials are spec
vocabulary only.

## The trail

1. **Reframe.** The two repos the user brought (impeccable, taste-skill) are AI
   *guidance skills*, not design systems. React Bits is the closest analog and
   the liked reference — but its violet-glow-gradient identity is both
   competitor-derivative and the canonical "AI slop" palette.
2. **Direction B** — React Bits' UX, our own identity: **amber `#F5B544`** on
   charcoal `#0E0E11`, warm chrome so cool glowy previews pop. Shared sidebar
   shell (header + left sidebar + contained main).
3. **Direction C** — a sidebar-less bento gallery (structural-divergence escape
   hatch) to avoid "B with different colours."
4. **Direction D** — synthesis: amber + sidebar shell + simple home + **live
   props controls** on the detail page.
5. **Direction E** — landing → docs split: **no sidebar on the home**, sidebar
   on detail. Corrected the earlier "sidebar always."
6. **Homepage round** — Centered / Bento / Split / Terminal; then three Terminal
   treatments (Masthead / Boot / Split).
7. **Detail round** — a docs page (shadcn / React Bits style); explored three
   props-control field styles (Panel / Inline / Table).

## Confirmed design

- **Colour:** amber `#F5B544` on charcoal `#0E0E11` (full token set in
  `src/styles/demos.css`, `[data-direction="b"]` ≈ the system).
- **Type:** Bricolage Grotesque (display) · Hanken Grotesk (UI) · JetBrains Mono
  (code + terminal wordmark/index). Radii 4/6/8. Muted/dim raised for WCAG AA.
- **Homepage = Terminal · Masthead** (`/demos/home/terminal-masthead`), **no
  sidebar:** wordmark, tagline, CTA (browse / GitHub), mono stats row, "Why
  tskr/ui" as `#` comment lines, then a monospace index of every snippet.
- **Detail = stacked docs page** (`/demos/detail/panel`), **with sidebar:**
  - left sidebar = snippet **name only**, monospace
  - breadcrumb = group muted, snippet name in **accent**
  - **no** prose description
  - sections **Preview → Props → API → Usage**, right-hand "On this page" TOC
  - props controls = **Panel** style; **API table** = Prop / Type / Default /
    Description
- **Sidebar rule:** none on the home, present on detail pages.

## State

- Confirmed **and promoted to the live site** (commit `eb3742d`). `/demos` and
  `data-direction` are kept in place for the next session.
- Branch `design-system` (off `develop`); commits `f64f18e` → `eb3742d`.
- B, C, D, E and all homepage/detail variants are preserved as the trail.

### What promotion changed (real site)

- `global.css` — amber-on-charcoal tokens in Tailwind v4 `@theme`.
- `src/styles/site.css` — real chrome (terminal home + docs detail), clean
  class names, decoupled from the throwaway demo CSS.
- `Layout.astro` (base shell + fonts) + `SnippetLayout.astro` (docs shell:
  header + name-only mono sidebar + main).
- `src/lib/snippets.ts` — `import.meta.glob` registry powering the home index
  and the sidebar (replaced the hand-listed array).
- `index.astro` — Terminal · Masthead home; detail pages rebuilt as docs pages
  (breadcrumb + Preview / Props / Usage + "On this page" TOC); `ApiTable` +
  `OnThisPage` components.
- `SnippetMeta.props` (`PropDoc[]`) added; both metas document their real props
  → API tables generate from `meta.ts`.
- `GradientTextPlayground` + `SnippetTabs` restyled to the tokens (docs-only).

## Deferred to a later session (same `/demos` pattern)

- Remaining detail polish, other surfaces, pruning the rejected directions,
  and eventually deleting `/demos` once exploration is done.
- (Done this session: tokens → `@theme`; props schema → `meta.ts`.)
