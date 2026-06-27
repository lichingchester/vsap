# Site design is explored on a branch via a token-driven demo harness

The site's own visual design had grown by accident — a bare `bg-neutral-950 / text-neutral-100` Tailwind scaffold, which is exactly the generic palette that makes an AI-built frontend look generic. We want a **real, documented design system** (tokens in Tailwind v4 `@theme`), but a copy-paste *UI library* whose own site looks like every other AI SaaS undercuts its credibility, so the look has to be deliberate. Rather than design tokens up front, we **explore design directions on the `design-system` branch and let the demos earn the tokens**.

We decided:

- **A direction is a token set, not a mockup.** One set of chrome components (`Nav`, `Hero`, snippet grid, snippet detail) hard-codes nothing visual — every colour, font, radius, space, shadow, and motion value reads from a CSS variable. A **design direction** is one filling of those variables, swapped via a `data-direction` attribute. Comparing directions and building the system are therefore the *same* activity: the winning direction already *is* the token set, with no mockup-to-tokens translation step.
- **Directions are judged on two real surfaces, not a swatch board.** Each direction renders the home page (hero + snippet grid) *and* a real snippet **detail** page (live preview + code tabs). The detail page carries the binding constraint that an ordinary marketing site doesn't have: **the chrome must recede so the snippet previews are the loud thing.** A direction can ace a hero and still drown a glowy preview; only the detail surface exposes that.
- **`/demos` is throwaway scaffolding.** When a direction wins, its tokens are promoted into the real `global.css @theme` and `Layout.astro`, and `/demos` is deleted before merge. The shipped site stays lean (project ethos).
- **The anti-slop gate is external and on-demand.** We install neither [impeccable](https://github.com/pbakaus/impeccable) nor [taste-skill](https://github.com/Leonxlnx/taste-skill) into the lean repo. We run `npx impeccable detect` against each demo *build* as an objective slop-gate, and borrow taste-skill's three dials (variance / motion / density) purely as vocabulary to spec a direction.

## Considered options

- **Restyle directly, no system.** Faster, but produces no reusable tokens and no honest way to compare alternatives — rejected because the Q1 deliverable is a documented system.
- **Adopt React Bits' look.** React Bits is the closest analog (a copy-paste animated-component collection) and the reference we like — but its identity is dark canvas + violet + purple-gradient + glow + Geist, which is both (a) derivative of a direct competitor and (b) the canonical "AI slop" palette the anti-slop tools exist to flag. We take its *UX* (dark canvas, generous spacing, restrained chrome, animated-gradient accent treatment) and reject its *identity* (see Direction B below).
- **Adopt a ready-made design system / the two reference repos as systems.** Rejected on a category error: impeccable and taste-skill are AI-guidance skills, not design systems — they ship no tokens, type, or components.

## Consequences

- The first direction explored is **Direction B**: warm amber/gold accent (`#F5B544`) on a neutral charcoal canvas (`#0E0E11`), tight radii, a non-Inter/non-Geist type pairing — a deliberate 180° from React Bits' cool violet, chosen so the cool, glowy snippet previews pop against warm chrome. **Direction C** (a deliberate-contrast alternative) follows in a later pass.
- The site temporarily carries a `/demos` route and a `data-direction` token mechanism that exist only to choose a design; both disappear on promotion.
- Whichever direction wins is adopted by *promotion of its token set*, not a redesign — the demos are the design system in embryo.
