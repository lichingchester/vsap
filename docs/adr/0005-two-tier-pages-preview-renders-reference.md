# Two-tier snippet pages; the live preview always renders the reference variant

A default snippet page has one **live preview** (running the Vue + Tailwind reference variant as a single island), a row of **variant tabs** that switch the displayed code block, and a **copy button** per variant. Switching a tab changes the *code shown*, not the running preview — the preview always renders the canonical reference, and a React/HTML user trusts that their variant's code reproduces what they see. Interactive per-prop **playgrounds** (color pickers, sliders) are opt-in via `meta.ts` `playground: true` and reserved for a few flagship snippets.

Why: per-snippet playgrounds and genuine per-framework live previews are the most expensive part of a page and, multiplied across the matrix, would sink the publishing velocity the whole project optimises for. Honest per-framework previews can be added later for specific snippets, but never as the default.
