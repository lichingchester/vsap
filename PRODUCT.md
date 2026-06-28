# Product

## Register

product

## Users

Web developers building UI — working in Vue, React, or plain HTML, with
Tailwind or native CSS. They arrive on tskr/ui looking for a specific component,
visual effect, or layout (a gradient-text animation, a background effect, a util)
and want to lift it straight into their own codebase. Their context is mid-task:
they don't want to install a package, learn an API, or adopt a dependency — they
want to read the source, understand its prerequisites, copy it, and move on.

The job to be done: **find a snippet, see it run, read its props/prerequisites,
copy the source.** The detail page (live preview + Props/API + Usage) is where
that job is done; the home is the index that gets them there.

## Product Purpose

tskr/ui is a **copy-paste collection** of UI components, effects, and layouts for
the web. There is no install, no CLI, no package (ADR-0001) — users copy a
snippet's source directly from the site into their project. Each snippet is
self-contained and declares its external dependencies (gsap, three) as explicit
**prerequisites** rather than assuming them present.

It exists because the alternative — a versioned component library — forces
adoption, version churn, and lock-in for what is often a single self-contained
effect. tskr/ui inverts that: the source lives in *your* repo, owned by you.

Success looks like a developer landing on a snippet, understanding it in under a
minute, and pasting working code that needs no further wiring beyond its stated
prerequisites.

## Brand Personality

**Technical · deliberate · lean.**

The voice is a confident dev tool, not a marketing site. Terminal and monospace
cues (the `tskr/ui` wordmark, `#` comment lines, the typographic snippet index)
signal "made by people who ship code." Every design choice is intentional and
anti-slop: the warm amber-on-charcoal identity is a deliberate 180° from the
cool-violet, purple-gradient, glow-heavy palette that the closest analog (React
Bits) uses and that anti-slop tooling exists to flag (ADR-0008). Lean is an
ethos, not just an aesthetic — the shipped site stays minimal, the chrome
recedes, and the snippet previews are the loud thing.

Honest by construction: "prerequisites, not magic" — a snippet states exactly
what it needs; nothing is hidden.

## Anti-references

- **React Bits' identity** — dark canvas + violet + purple-gradient + glow +
  Geist. We take its UX (dark canvas, generous spacing, restrained chrome,
  animated-gradient accent treatment) and explicitly reject its look (ADR-0008).
- **Generic AI-SaaS scaffold** — `bg-neutral-950 / text-neutral-100` with Inter
  or Geist, gradient hero text, the hero-metric template, identical icon-card
  grids, per-section uppercase eyebrows. This site's own credibility as a UI
  library depends on *not* looking AI-generated.
- **Heavy docs frameworks** — the retired VitePress/jsrepo "component registry"
  era. The site is a separate concern from the snippets and stays lean.

## Design Principles

1. **The chrome recedes; the snippet is the loud thing.** On a detail page the
   live preview (often cool, glowy, animated) must dominate. Site chrome is warm,
   quiet, and never competes with the content it frames.
2. **Practice what you preach.** A copy-paste UI library whose own site looks
   generic undercuts itself. The site is held to the craft bar it implies.
3. **Prerequisites, not magic.** Be explicit about what a snippet needs and what
   the user is copying. No hidden dependencies, no implied install.
4. **Lean by default.** Ship the minimum that serves the job. No exploration
   scaffolding, no dead chrome, no framework weight that the content doesn't earn.
5. **Deliberate over default.** Reach past the first training-data reflex for
   palette, type, and structure. If a choice could be guessed from the category
   alone, reconsider it.

## Accessibility & Inclusion

- **Target: WCAG 2.2 AA.** Body text ≥ 4.5:1, large text ≥ 3:1 against the dark
  canvas. The `--color-muted` / `--color-dim` tokens are already tuned for AA on
  `#0E0E11` (ADR-0008); keep them there.
- **Reduced motion.** Animated effects are core content here, so motion is
  unavoidable in previews — but every animated snippet and the site chrome must
  honor `prefers-reduced-motion: reduce` with a calm fallback (crossfade or
  static state), never a blank or broken preview.
- Keyboard-navigable interactive controls (the detail-page props panel, nav,
  code tabs); visible focus states on the dark canvas.
