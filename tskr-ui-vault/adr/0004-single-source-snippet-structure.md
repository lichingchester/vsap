# Single-source snippet structure (no-drift rule)

Snippets live in this same repo under `src/snippets/<category>/<snippet>/`, with one folder per `framework-styling` variant (`vue-tailwind/` is always the reference; other cells appear only when a port exists) plus a `meta.ts` declaring the snippet's kind, category, available variants, and per-variant Prerequisites. The Astro site reads `meta.ts` to build each page.

The governing constraint is the **no-drift rule**: the live preview and the copy-button payload are produced from the *same* variant file on disk — the site `import`s it as an island for the preview and `?raw`-imports it for the code block. There is never a hand-maintained second copy of a snippet's code. This is deliberate and load-bearing; do not add a separate "copy string" or duplicated preview, however convenient — it reintroduces exactly the drift this structure exists to prevent.

## Consequences

- The Astro site must live in the same repo as the snippets (cross-repo imports would defeat the rule).
- A variant folder is self-contained: it carries its own companion files (`styles.css`, `.glsl` shaders, etc.).
