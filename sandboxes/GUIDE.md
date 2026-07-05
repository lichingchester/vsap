# Contributor guide — verifying variants in the sandboxes

The site only ever *runs* the **Vue + Tailwind reference** variant. Your React
port, your CSS port, your HTML fragment — they ship as copy-paste text that the
site never executes. The **sandboxes** are where you prove they actually work in
a real framework before you open a PR.

This is a step-by-step walkthrough. For the one-paragraph version and the app
table, see [`README.md`](./README.md); for *why* it exists, see
`tskr-ui-vault/adr/0017-sandboxes-verify-the-ports-the-site-never-runs.md`.

---

## 0. One-time setup

Each app is an **independent** project (its own `node_modules`) — install the
ones you'll use. You don't need all three unless you're touching all three
frameworks.

```bash
cd sandboxes/react && npm install && cd -
cd sandboxes/vue   && npm install && cd -
cd sandboxes/html  && npm install && cd -
```

Requires **Node ≥ 24** (same as the main repo). Nothing here is committed to
`node_modules`; you install locally.

---

## 1. Verify a port you just wrote (the main workflow)

Say you've written or edited a React port at
`src/snippets/text-animations/gradient-text/react-tailwind/GradientText.tsx`.

**Step 1 — start the matching sandbox.**

```bash
cd sandboxes/react
npm run dev            # → http://localhost:4331   (vue: 4332 · html: 4333)
```

**Step 2 — open it and pick your variant.** The left rail lists every variant
the sandbox discovered, grouped by snippet. Click yours — it mounts on its own,
rendered with the snippet's `previewProps` from `meta.ts` (so you see the
intended output, not a blank component).

You can also deep-link straight to it — the URL is
`?variant=<snippet-name>--<variant-id>`:

```
http://localhost:4331/?variant=gradient-text--react-tailwind
```

**Step 3 — check it against four things:**

1. **It renders** — no blank stage, no error overlay.
2. **It matches the reference.** Open the reference (`vue-tailwind`) on the site
   or in `sandboxes/vue` and confirm your port looks the same. Ports must not
   drift from the reference.
3. **The console is clean.** Open DevTools → Console. No errors, no warnings.
4. **The Prerequisites footer is honest.** The panel under the stage shows what
   `meta.ts` *declares* this variant needs. Does it match what your file actually
   imports? If your `.tsx` imports `gsap` but the footer is empty, your
   `meta.ts` `prerequisites` are wrong — fix them (that's half the point of this
   harness).

**Step 4 — for one-shot effects, use Replay.** If the snippet is `replayable`
(a reveal that plays once), a **↻ Replay** button appears — it remounts the
component so you can watch the animation again without a full reload.

The dev server hot-reloads: edit the source file under `src/snippets/**` and the
sandbox updates live. Iterate until it's right.

---

## 2. Run the smoke pass before you PR

The smoke suite drives all three sandboxes headlessly and fails if any variant
throws, logs a `console.error`, or renders empty. Run it once your port looks
right by eye.

```bash
# the three apps must be installed (step 0) — the tests boot their dev servers
cd sandboxes/smoke
npm install            # first time only; also downloads a Chromium binary
npm test
```

You do **not** need to start the dev servers yourself — Playwright boots and
tears them down. Expected output:

```
  react: 5 variant(s) → …
  ✓  react: every variant mounts clean
  ✓  vue: every variant mounts clean
  ✓  html: every variant mounts clean
  3 passed
```

Debug a failure interactively with `npm run test:ui`.

There is no matrix to update — the smoke test reads each sandbox's own variant
list, so a new snippet is covered automatically.

---

## 3. Adding a new snippet — usually nothing to do here

Sandboxes discover variants by globbing `src/snippets/**` (the same mechanism as
the site registry). Add a snippet the normal way (see the root `CLAUDE.md` →
"Adding a snippet") and its variants **appear in the sandboxes automatically**.
Just run through §1 and §2 for each variant you added.

You only touch a sandbox in the two cases below.

### 3a. Your variant needs a new npm dependency

If a variant imports a library that isn't already installed in that sandbox
(today the apps carry `gsap`, and vue also carries `vue-router`), you'll see the
dev server or `npm run build` fail to resolve the import.

Fix it in two places — they must agree:

1. Declare it in the variant's `meta.ts` `prerequisites` (this is what users
   copy; see ADR-0012).
2. Add it to that sandbox's `package.json` and re-run `npm install`.

Example — a new effect that uses `three` in its React port:

```bash
cd sandboxes/react
npm install three
```

Install the **version the `meta.ts` prerequisite declares**, not "latest" — the
sandbox is testing that the declared version actually works.

### 3b. Your variant is `react-next` or `vue-nuxt`

These are **out of scope** and intentionally excluded — they need a real
Next/Nuxt runtime, not plain Vite. Don't try to add them to these sandboxes;
verify those by hand in a scratch Next/Nuxt project.

---

## 4. Troubleshooting

| Symptom | Cause & fix |
| --- | --- |
| **My variant isn't in the sidebar.** | The sandbox lists variants from `meta.ts`. Check the variant's `framework` (must be `vue`/`react`/`html`) and that its `entry` filename exactly matches the file on disk. `react-next`/`vue-nuxt` are excluded by design. |
| **A `-tailwind` variant renders unstyled.** | Tailwind scans `src/snippets/**` via `@source` in the app's `index.css`. If you used a class Tailwind can't see statically (e.g. a fully dynamic string), it won't be generated — use a static class or an inline style. |
| **Dev/build fails: "failed to resolve import 'x'".** | The variant imports a dependency not installed in that sandbox → §3a: add it to the sandbox `package.json` *and* declare it in `meta.ts`. |
| **Smoke test can't reach a server.** | Install the three apps first (§0). If a port (4331–4333) is busy, stop the process using it or the pinned `--strictPort` dev script will fail. |
| **HTML variant looks dead.** | HTML runs in an `iframe`; open DevTools and select the iframe's context to see its console. Confirm the fragment's own `<script>`/CDN tags are present and correct. |

---

## What the sandboxes are *not*

- **Not the published site.** They never deploy; they're a local dev tool.
- **Not a design playground.** "Playground" means the site's interactive live
  preview of the reference (ADR-0007). These run the *ports*.
- **Not a visual-regression suite.** The smoke test checks "runs clean and
  renders something," not pixel-accuracy. Your eyes are still the judge of
  whether a port matches the reference.
