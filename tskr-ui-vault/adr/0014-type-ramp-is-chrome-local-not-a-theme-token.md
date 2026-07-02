# The site type ramp lives in :root, not @theme

The site chrome's font sizes are consolidated into a named six-rung **type ramp**
(eyebrow / caption / body / ui / heading / title) defined as `:root` custom
properties in `src/styles/site.css` and consumed via `var()` by `site.css`,
`detail.css`, and `controls.css`. The ramp is deliberately **not** expressed as
`--text-*` tokens in the `@theme` block where the colour, font-family, and radius
design tokens live ([[0008-design-directions-via-token-demo-harness]]).

The trigger was legibility: the smallest labels — the **eyebrow tier** ("On this
page", "Props", category names, table headers) — had drifted to five different
sizes between 0.62rem and 0.72rem, uppercase, wide-tracked, in dim ink, which is
too small to read comfortably. The fix raises that tier to a 0.75rem floor in
muted ink and gives every rung a name so the tier can't silently drift again. The
[[0011-detail-page-copy-artifact-model-and-console-layout]] **Mono-Heading Rule**
is preserved: section headings stay at the `ui`/`heading` rung, so only the label
tier moved.

## Considered options

- **`--text-*` tokens in `@theme`** — idiomatic per ADR-0008 ("tokens live in
  `global.css` `@theme`") and would hand us `text-eyebrow` / `text-caption`
  utilities for free. Rejected: in Tailwind v4 a `--text-*` entry auto-generates a
  `text-<name>` utility and folds into the global font-size scale. Snippets are
  authored in plain Tailwind and must never depend on site tokens (CLAUDE.md), so
  minting site-chrome type utilities into the shared scale would blur that
  boundary and expose sizes snippets have no business using.
- **`:root` custom properties in `site.css`** (chosen) — the ramp becomes named,
  referenceable vocabulary without generating any Tailwind utility or touching the
  snippet-facing scale. It also matches where these sizes already lived: type
  sizes have always been chrome-local, unlike the shared colour/family tokens.

## Consequences

- The ramp is available to chrome CSS via `var()`, but **not** as Tailwind
  utilities — chrome markup uses `var()` or its existing bespoke classes, not a
  `text-eyebrow` class.
- `@theme` remains the home only for design tokens that snippets legitimately
  share by concept (colour, type family, radii); type *sizes* stay out of it.
- "Eyebrow tier" and "type ramp" enter the ubiquitous language (CONTEXT.md) so the
  one-tier-one-rung rule is enforceable in review rather than by inspection.
