# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

All project documentation lives in the **Obsidian vault at `tskr-ui-vault/`**. A root **`CONTEXT-MAP.md`** redirects there:

- **`CONTEXT-MAP.md`** at the repo root — read it first; it points at the canonical `CONTEXT.md` in the vault.
- **`tskr-ui-vault/CONTEXT.md`** — the glossary / ubiquitous language.
- **`tskr-ui-vault/adr/`** — read ADRs that touch the area you're about to work in. **New ADRs go here**, not `docs/adr/`.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

Single context, but the docs live in the Obsidian vault (browsable in Obsidian), with a root map redirecting to it:

```
/
├── CONTEXT-MAP.md            ← redirect for skills
├── tskr-ui-vault/            ← the Obsidian vault (all docs)
│   ├── CONTEXT.md            ← glossary
│   ├── adr/
│   │   ├── 0001-….md
│   │   └── …
│   ├── Home.md               ← vault index (MOC)
│   └── log/                  ← process write-ups
└── src/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 — but worth reopening because…_
