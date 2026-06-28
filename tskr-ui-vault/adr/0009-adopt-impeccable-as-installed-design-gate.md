# Impeccable is installed as a hooked design gate, with PRODUCT.md / DESIGN.md as committed design context

[[0008-design-directions-via-token-demo-harness]] decided the anti-slop gate
would be **external and on-demand**: *"We install neither impeccable nor
taste-skill into the lean repo. We run `npx impeccable detect` against each demo
build as an objective slop-gate."* That was the right call **while the design was
being explored** — the `/demos` harness was throwaway, and committing a tool to
guard an unconfirmed design would have been premature.

That condition no longer holds. The design is **confirmed and promoted** to the
live site (ADR-0008: amber `#F5B544` on charcoal, the Terminal·Masthead home, the
docs detail shell). A confirmed design is worth guarding **continuously**, not
just sampled on-demand, and the project's whole credibility argument — *a
copy-paste UI library whose own site must not look AI-generated* — is exactly
what Impeccable's detector checks. So we install it for real.

We decided:

- **Install Impeccable into the repo, scoped to Claude Code at project level.**
  The skill, its 23 commands, and the deterministic detector live under
  `.claude/skills/impeccable/` and are **committed**, so the design hook works
  for every contributor without a per-clone install step.
- **Run the detector as an always-on, advisory hook.** A `PostToolUse` hook
  (`Edit`/`Write`/`MultiEdit` on UI files) runs the detector and surfaces findings
  as a system reminder. It does **not** block the edit — it is a guard, not a
  gate that fails the build. On-demand `npx impeccable detect` (the ADR-0008
  mechanism) still works for CI or a manual sweep.
- **Commit the design context, keep per-developer state out.** `PRODUCT.md`
  (strategic: register, users, voice, anti-references) and `DESIGN.md`
  ("The Warm Terminal": tokens, type, components, do's/don'ts) plus the
  `.impeccable/design.json` sidecar are committed and are the machine-readable
  restatement of this ADR + the real `global.css` tokens. `settings.local.json`,
  `config.local.json`, and `*.cache.json` are gitignored as per-developer state.
- **ADR-0008 remains the source of truth for the design itself.** `DESIGN.md` is
  derived, not canonical: when tokens change in ADR-0008 / `global.css`, re-run
  `/impeccable document` to refresh it rather than hand-editing.

## Considered options

- **Keep ADR-0008's stance (external, on-demand only).** Leanest, but an
  on-demand gate is only as good as the discipline to run it; a confirmed design
  drifts between manual sweeps. Rejected now that there's a real design to protect.
- **Install the skill but not the hook.** Gives the `/impeccable` commands without
  the automatic guard. Rejected as the weaker half — the always-on detector is the
  part that catches slop *as it's written*; the hook is advisory, so the cost is low.
- **Adopt Impeccable as a design system.** Category error, already rejected in
  ADR-0008: it ships guidance, not tokens. Our tokens stay in `global.css`.

## Consequences

- This **supersedes the "install neither… into the lean repo" decision** of
  ADR-0008. The rest of ADR-0008 (the confirmed tokens, type, layout, sidebar
  rule) stands unchanged.
- The repo is no longer strictly dependency-/tool-free, a small concession to the
  lean ethos accepted because the tool is dev-only (never shipped to users, never
  copied into a snippet) and the design context is now worth guarding.
- **Snippets stay token-independent** (ADR-0001). The design system in `DESIGN.md`
  describes the **site chrome**; detector findings on a copy-paste snippet are
  about that snippet's own quality, not conformance to the site theme.
- Contributor usage and the tracked-vs-gitignored split are documented in
  [[Impeccable (design tooling)]] (linked from [[Home]]).
- **Node caveat:** Impeccable targets Node ≥ 24; this repo targets Node ≥ 22.
  Verified working on 22, but version-sensitive command failures should check Node
  first.
