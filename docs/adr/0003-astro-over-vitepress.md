# Astro (current stable) for the site, replacing VitePress

The site was built on VitePress, which renders only Vue. The pivot to a multi-framework collection requires live Vue **and** React (and plain HTML) previews on the same page, which VitePress fights. Astro's islands mount different-framework components side by side, so Astro replaces VitePress entirely.

We build on the **current stable Astro major — Astro 7 (`latest` 7.0.2 as of June 2026)** — with `@astrojs/vue@7`, `@astrojs/react@6`, and Tailwind v4 via `@tailwindcss/vite`.

## Note on the version (why this was nearly Astro 6)

An earlier draft of this ADR chose Astro **6** because a May 2026 source reported Astro 7 as still an alpha, and we did not want to build a rewrite on a moving target. By the time we scaffolded (June 2026), Astro 7 had shipped **stable** as npm `latest` (7.0.2) — confirmed via `npm view astro dist-tags` (`latest: 7.0.2`, with 7.x beta/alpha trailing behind it) — and its Vue/React integrations were published as stable. That removed the only reason to prefer 6, so we start on 7 to avoid an immediate major upgrade. Recorded so the 6-vs-7 question isn't reopened from the stale "7 is alpha" premise.
