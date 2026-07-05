# Sandboxes: a real-framework harness that runs the ports the site never executes

The site only ever *runs* one thing. [[0005-two-tier-pages-preview-renders-reference]]
made the live preview always render the **Vue + Tailwind reference**, and
[[0007-lean-playground-is-the-live-preview]] collapsed the flagship playground
onto that same reference island. Every other cell in the matrix
([[0006-effect-port-matrix-and-nuxt-next-exemption]]) — `react-tailwind`,
`react-css`, `vue-css`, `html` — ships as **raw copy-paste text**
([[0001-distribution-by-web-copy-paste]]) that is executed *nowhere*. The Astro
dev scanner doesn't merely skip those files, it **stubs their imports** (the
`ignoreUnexecutedImports` plugin in `astro.config.mjs`) so `gsap` / `next/link` /
`@/` never resolve during a build.

[[0004-single-source-snippet-structure]]'s no-drift rule guarantees the code a
reader *sees* equals the code that *would* run — but only for the reference,
because the reference is the only variant that runs. For a port, "would run" is
an untested claim. A React port can be committed broken; a `Prerequisites`
declaration ([[0012-prerequisites-not-install]]) can be incomplete, and nothing
catches it. The site is architecturally the wrong place to catch it: its whole
economy ([[0005-two-tier-pages-preview-renders-reference]]) is built on *not*
running the matrix.

We decided to add **`sandboxes/`**, a top-level, developer-only verification
harness that runs exactly the variants the site refuses to:

- **Real per-framework apps, not the site.** Three genuine Vite apps —
  `sandboxes/vue`, `sandboxes/react`, `sandboxes/html` — each the idiomatic
  environment a copy-paste user actually lands in, not an Astro island. You
  `cd sandboxes/react && npm i && npm run dev` and watch the React port run in a
  real React app. This is deliberately *not* reachable from the published site;
  it never deploys.
- **Independent installs, no workspace.** Each app owns its `package.json` and
  `node_modules`; the repo is not made a workspace. Hoisting would let a sandbox
  borrow the site's already-installed `gsap`/`react`, which would make a missing
  **Prerequisite** ([[0012-prerequisites-not-install]]) *unfalsifiable* — the
  whole point is that the app declares only what the variant declares, so a
  forgotten dependency actually breaks. It also keeps the fiddly Astro 7 /
  Rolldown build at zero blast radius.
- **Glob-import the real source; never copy.** The apps discover variants with
  the same `import.meta.glob` over `src/snippets/**` that the registry uses
  (`src/lib/snippets.ts`). The file that ships *is* the file that runs — no
  second copy to drift. This extends no-drift ([[0004-single-source-snippet-structure]])
  to the harness: a new snippet appears in the sandboxes with no wiring.
- **A meta-driven switcher, one variant at a time, isolated.** Each app reads
  `meta.ts` for the variant list and renders each selection *alone* with its
  `previewProps` / `previewClass`, so an effect gets a clean mount/unmount and a
  failure is unambiguously that variant's. The variant's declared
  `prerequisites` are shown beside the render — a cheap manual check that the
  [[0012-prerequisites-not-install]] metadata matches reality.
- **HTML runs in an `iframe`, not `innerHTML`.** HTML cells are fragments, and
  some carry inline and CDN `<script>` (Split Text loads GSAP from jsDelivr and
  runs a script). Scripts injected via `innerHTML` never execute, so each
  fragment is wrapped in a minimal document and set as an iframe `srcdoc` — the
  true "I pasted this into a blank page" test. Because those fragments self-load
  their deps from CDN, the HTML app needs **no npm prerequisites** — the purest
  cell.
- **`react-next` / `vue-nuxt` are out of scope.** They need a real Next/Nuxt
  runtime, not plain Vite — the same meta-framework line
  [[0006-effect-port-matrix-and-nuxt-next-exemption]] drew. The harness targets
  plain `vue` / `react` / `html`; meta-framework cells are a separate, later
  concern.
- **The automated layer is Playwright over the same switcher, local-only.** A
  `sandboxes/smoke` project boots the three apps and walks each switcher's *own*
  variant list (one source of truth with the manual mode), asserting per variant:
  no uncaught error, no `console.error`, and a non-empty mount. No screenshot
  baselines — GSAP/ScrollTrigger timing is too flaky for a v1 — and no CI yet,
  though the design (glob-enumerated matrix, headless run) is shaped so a
  workflow bolts on without rework.

## Consequences

- **A new top-level `sandboxes/`**, a sibling of `src/`. It is invisible to the
  Astro build — outside the `src/` scan, imported by no page — so it cannot
  perturb production, and it adds nothing to the root `package.json`.
- **"Playground" stays reserved for the site's live preview**
  ([[0007-lean-playground-is-the-live-preview]]). This is a *sandbox* / *harness*
  — the deliberate inverse of [[0005-two-tier-pages-preview-renders-reference]]:
  where the site runs only the reference, the sandboxes run only the non-reference
  ports (and the reference too, for parity).
- **Ports gain an execution guarantee for the first time.** No-drift
  ([[0004-single-source-snippet-structure]]) says *shown == would-run*; the
  harness proves *would-run actually runs*. A broken React port or a dead HTML
  script is now catchable — manually by eye, or by the smoke pass.
- **Prerequisites become testable claims.** Because each app installs only what
  its variants declare ([[0012-prerequisites-not-install]]), an incomplete or
  wrong `prerequisites` list surfaces as a real failure, not just a doc nobody
  verifies.
- **Maintenance is bounded.** Discovery is automatic (glob), so a new snippet is
  covered with zero harness edits; only a genuinely new framework or a new
  bundled dependency (e.g. `three`, added when the first three.js snippet lands)
  touches the sandboxes at all.
