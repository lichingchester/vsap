# sandboxes — a real-framework verification harness

The site only ever *runs* the **Vue + Tailwind reference** variant (ADR-0005,
ADR-0007). Every port — `react-tailwind`, `react-css`, `vue-css`, `html` — ships
as raw copy-paste text that is executed **nowhere** (the Astro dev scanner even
stubs their imports). So a React port can be committed broken and nothing
notices.

These sandboxes fix that: three real per-framework Vite apps that glob-import the
actual snippet source and **run the ports the site refuses to**, plus a Playwright
smoke pass. Dev-only — never deployed. See **ADR-0017** for the full rationale.

> **New here?** [`GUIDE.md`](./GUIDE.md) is the step-by-step contributor
> walkthrough — verify a port, run the smoke pass, add a dependency, troubleshoot.
> This README is the quick reference.

| App | What it runs | Prereqs baked in |
| --- | --- | --- |
| `react/` | `react`, `react-tailwind`, `react-css` variants in React 19 + Vite | gsap, Tailwind v4 |
| `vue/` | `vue`, `vue-tailwind`, `vue-css` variants in Vue 3.5 + Vite | gsap, vue-router, Tailwind v4 |
| `html/` | `html` fragments, each in an `iframe srcdoc` so inline/CDN `<script>` runs | none (CDN-loaded) |
| `smoke/` | Playwright pass over all three switchers | — |

`react-next` / `vue-nuxt` are **out of scope** — they need a real Next/Nuxt
runtime, not plain Vite.

## Quick start

Each app is an **independent** project (its own `package.json` / `node_modules`,
no workspace) — this mirrors a user's separate project and keeps the prerequisite
list honest. Install and run the one you care about:

```bash
cd sandboxes/react   # or vue, or html
npm install
npm run dev          # react :4331 · vue :4332 · html :4333
```

A left-hand switcher lists every discovered variant; pick one and it mounts in
isolation, rendered with the snippet's `meta.ts` `previewProps` and its declared
`prerequisites` shown beneath. Effects (`replayable`) get a **↻ Replay** button.

Deep-link a specific variant with `?variant=<snippet>--<variantId>`, e.g.
`http://localhost:4331/?variant=gradient-text--react-tailwind`.

## Smoke tests (local only)

```bash
# install all three apps first (the servers the tests drive), then:
cd sandboxes/smoke
npm install          # also downloads the Chromium binary (postinstall)
npm test
```

Playwright boots the three dev servers, reads each switcher's own
`[data-variant]` list (one source of truth with the manual mode — a new snippet
is auto-covered), and for every variant asserts: **no uncaught error, no
`console.error`, non-empty mount** (or non-empty iframe body for HTML). No
screenshot baselines — GSAP/scroll timing is too flaky for that. Not wired into
CI, by design; the shape supports adding a workflow later.

## Adding a snippet

Nothing to wire up. The apps discover variants via `import.meta.glob` over
`src/snippets/**` (the same mechanism as `src/lib/snippets.ts`), so a new snippet
appears in the relevant sandboxes automatically. You only touch a sandbox when a
variant introduces a **new npm prerequisite** (e.g. `three`) — add it to that
app's `package.json`.
