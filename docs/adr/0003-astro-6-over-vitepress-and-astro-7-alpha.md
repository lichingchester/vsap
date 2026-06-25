# Astro 6 stable for the site, over VitePress and over Astro 7 alpha

The site was built on VitePress, which renders only Vue. The pivot to a multi-framework collection requires showing live Vue **and** React (and plain HTML) snippet previews on the same page, which VitePress fights. Astro's islands mount different-framework components side by side, making it the right fit — so Astro replaces VitePress entirely.

We build on **Astro 6 (stable, released March 2026)**, not Astro 7. As of June 2026 Astro 7 is still in alpha; its headline changes (Rust compiler default, Vite 8) are internal/perf, not features this site needs. Building a rewrite we intend to rely on atop a moving alpha — with an integration ecosystem that lags it — isn't worth the edge. We will bump to Astro 7 via `@astrojs/upgrade` once it is stable.
