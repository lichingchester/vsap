# 2026-06-29 — detail-page redesign (console layout)

Redesigned the snippet **detail page** around the copy job, explored via a fresh
throwaway `/demos` round (same harness discipline as
[[0008-design-directions-via-token-demo-harness]]) and promoted. See
[[0011-detail-page-copy-artifact-model-and-console-layout]] and [[CONTEXT]] (the
**Copy artifact** / **Install** / **Source** / **Usage** / **Variant
preference** terms).

## The brief

Four points from the user:
1. If the props change, the copied code should follow the props.
2. The source-copy is the core; a framework component needs two parts (source +
   usage), not one.
3. The sections need adjustment.
4. Other improvements welcome — and explore it via `/demos`.

## How we worked

Grilled the design tree to a shared model, captured the glossary inline, then
built throwaway demos to compare layouts in context before committing.

- **Round 1** — three layouts (Stacked / Workbench-toggle / Console two-column)
  on the confirmed tokens. **Stacked won.**
- **Round 2** — three *stacked* variations exploring section design, the right
  TOC, headings, and the code block: **Ledger** (numbered ruled headings +
  left-border TOC rail), **Slab** (label-tag headings + boxed dot TOC, selector
  in the code bar), **Console** (sticky mini-headers + scroll-progress TOC + IDE
  code blocks). Also removed the framework/style selector from the page head —
  it lives only in the header (global) and at the code block. **Console won.**

## The model (confirmed + promoted)

- **Copy artifacts: Install · Source · Usage**, each conditional; HTML collapses
  Source+Usage.
- **Usage is generated** from a `meta.usage` descriptor + prop values, per
  framework — so the playground controls drive the copied code (**props→code**).
- **Persisted two-axis variant preference** (framework + styling), header +
  code-block, `localStorage` + URL, nearest-fallback to the reference variant.
- **Console layout**: sticky mono headers (hairline-underlined, amber tick),
  Shiki IDE code blocks (line numbers, wrap, filename + copy feedback), a
  scroll-progress TOC rail, reduced-motion + visible focus.

## Impeccable pass

Ran the deterministic detector (clean) and the `/impeccable typeset` flow against
`DESIGN.md`. Fixes applied:
- `con-title` → DESIGN.md **Title** token scale + line-height 1.15 + `text-wrap:
  balance` (it had shrunk below the documented scale and inherited the 1.55 body
  leading).
- `con-h` → **Heading** token: 1rem + a **hairline underline** (the Mono-Heading
  Rule, which the sticky tick had replaced) + line-height 1.4.
- Micro-labels → `+0.12em` tracking (the Label rule).
- `sd-ctl__val` → `tabular-nums` so the live degree/speed readout stops jittering
  as a slider drags.
- Earlier hook fixes: progress fill animates `transform` not `height`; the 3px
  tick/rail are square (radius scale); the swatch-remove badge uses `radius-sm`,
  not a pill.

## State

- **Promoted to the live site.** `meta.ts` gained `usage` / `controls` /
  `previewProps` / `previewClass`; detail components live in `src/detail/`
  (generator, view, persisted store, Shiki, the `SnippetDetail` island, a
  `previews.ts` registry because a live component can't cross Astro's JSON island
  boundary). `SnippetLayout` header carries the global selector. `shiki` added as
  a dev dep.
- **Removed:** `SnippetTabs`, `GradientTextPlayground`, `ApiTable.astro`,
  `OnThisPage.astro`, and the `/demos` harness (trail in git + the ADRs).
- `npm run build` green (home + 2 detail pages); `astro check` clean for the new
  files (the 7 remaining errors are pre-existing legacy test / `next/link`).
- Branch `design-system` → worktree branch `worktree-detail-page-redesign`.

## Still open

- Migrate remaining legacy components (Aurora, SplitText) into `src/snippets/`
  and remove VitePress/jsrepo cruft (issue #6).
- As snippets grow, `previews.ts` is hand-maintained (one line per live preview);
  revisit if it becomes a glob.
