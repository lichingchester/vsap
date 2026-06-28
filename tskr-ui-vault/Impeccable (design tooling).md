# Impeccable (design tooling)

How contributors use **[Impeccable](https://github.com/pbakaus/impeccable)** in
this repo — a design-guidance toolkit for AI coding agents (grew out of
Anthropic's `frontend-design` skill). It adds an `/impeccable` skill + commands
and a deterministic **design detector** that flags AI "design tells" (Inter/Geist,
purple gradients, cards-in-cards, gray-on-color, side-stripe borders, …).

> [!note] Stance evolved from [[0008-design-directions-via-token-demo-harness]]
> ADR-0008 decided to keep the repo lean and run the detector **externally,
> on-demand** (`npx impeccable detect`), installing *nothing*. We've since
> installed it for real (skill + auto-hook + committed design context) because
> the design is now confirmed and worth guarding continuously. If we formalise
> this, it becomes a follow-up ADR; for now this note records the reversal.

## What's in the repo

| Path | Tracked? | What it is |
|---|---|---|
| `.claude/skills/impeccable/` | ✅ committed | The skill, 23 commands, and the detector. Tracked so the hook works for every contributor. |
| `.claude/settings.local.json` | 🚫 gitignored | Per-developer hook registration (PostToolUse design hook). |
| `.impeccable/config.local.json` | 🚫 gitignored | Per-developer detector settings (hook opt-in, ignores). |
| `.impeccable/*.cache.json` | 🚫 gitignored | Per-run detector cache. |
| `.impeccable/design.json` | ✅ committed | Sidecar for the live panel: tonal ramps, motion, component HTML/CSS. |
| `PRODUCT.md` (repo root) | ✅ committed | Strategic design context — register, users, voice, anti-references. |
| `DESIGN.md` (repo root) | ✅ committed | Visual system — "The Warm Terminal": tokens, type, components, do's/don'ts. |

`PRODUCT.md` / `DESIGN.md` are generated *from* [[0008-design-directions-via-token-demo-harness]]
and the real tokens in `src/styles/global.css`; they are the machine-readable
restatement the `/impeccable` commands read before doing any work. Treat ADR-0008
as the source of truth — if a token changes there, re-run `/impeccable document`
to refresh `DESIGN.md`.

## First-time setup (per contributor)

The skill files are committed, so there's usually **nothing to install**. Just:

1. **Reload your AI harness** (restart Claude Code) so the design hook activates —
   hooks load at session start.
2. That's it. `PRODUCT.md` / `DESIGN.md` already exist; you don't re-run
   `/impeccable init`.

If `.claude/settings.local.json` is missing for you (it's gitignored), re-enable
the hook with `/impeccable hooks on`, or reinstall locally with
`npx impeccable install --providers=claude --scope=project`.

> [!warning] Node version
> Impeccable wants **Node ≥ 24**; this repo targets **Node ≥ 22**. Everything
> tested fine on 22, but if an `/impeccable` command misbehaves, check your Node
> version first.

## How to use it

Everything runs through the one `/impeccable` skill. Most commands take an
optional target.

- `/impeccable` (alone) — context-aware menu of the highest-value next commands.
- `/impeccable critique <surface>` — scored UX review (e.g. a snippet detail page).
- `/impeccable audit <area>` — a11y / performance / responsive checks.
- `/impeccable polish <component>` — pre-ship quality pass.
- `/impeccable live` — pick elements in the browser and generate variants in
  place (Astro; self-configures on first run).
- `/impeccable document` — regenerate `DESIGN.md` after the design system changes.

Standalone detector (no AI needed, good for a quick check or CI):

```bash
npx impeccable detect src/        # scan a directory
npx impeccable detect --json .     # CI-friendly output
```

## The design hook

When enabled, the detector runs automatically after `Edit`/`Write`/`MultiEdit`
on UI files (`.vue`, `.astro`, `.css`, `.html`) and surfaces findings as a
system reminder — a fast, deterministic guard against the slop tells that
[[0008-design-directions-via-token-demo-harness]] exists to avoid. It is advisory
(it doesn't block the edit). Manage it with `/impeccable hooks <on|off|status>`.

> [!info] Snippets vs. site chrome
> The design system in `DESIGN.md` describes the **site itself**. Per
> [[0001-distribution-by-web-copy-paste]], copy-paste **snippets** use plain
> Tailwind and must not depend on the site tokens — so detector findings on a
> snippet are about that snippet's own quality, not conformance to the site theme.

## See also

- [[0008-design-directions-via-token-demo-harness]] — the confirmed design system.
- [[0001-distribution-by-web-copy-paste]] — why snippets stay token-independent.
- [[CONTEXT]] — glossary (Design direction, Snippet, Site chrome).
