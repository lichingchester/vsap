# Vue + Tailwind is the reference variant; other variants are opportunistic ports

Snippets can target three frameworks (Vue, React, native HTML) and two styling approaches (Tailwind, native CSS) — up to six cells per snippet. Committing to all six for every snippet would destroy the velocity needed to keep publishing new snippets, and the matrix isn't even uniform (a WebGL effect has no CSS-only cell; a pure-CSS effect's framework cells are near-identical).

We decided: **Vue + Tailwind is the hand-authored reference variant** and source of truth for every snippet. All other variants (React, native HTML, native CSS) are **ports**, derived from the reference **on demand, per snippet** — only the cells that are meaningful and worth maintaining. Snippets are not required to ship a full matrix before publishing.

## Consequences

- Each snippet declares which framework/styling targets it actually supports.
- Output speed is preserved; a new snippet ships as soon as its Vue+Tailwind reference is done.
- Ports risk drifting from the reference; the reference is always the one to update first.
- `utility` snippets are exempt: their per-framework versions are **native variants** (idiomatic, independent implementations), not ports of a Vue reference — there is no single canonical source to translate. LinkTag is the first such case.
