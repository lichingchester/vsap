# Flagship playgrounds are lean and dependency-free; the playground is the live preview

GradientText is the first snippet with `playground: true` (ADR-0005), so it sets the pattern for how an interactive playground is actually built on the Astro site. Two questions had to be answered for the first time.

**1. What renders the playground UI?** The old VitePress `Preview.vue` was built on a real component stack — shadcn-vue `Slider`/`Input`/`Select`, `reka-ui`, a custom `ColorPicker`, a hand-built circular degree dial, and `lucide` icons. None of it is in the new site's dependencies, and the Astro rewrite has stayed deliberately dependency-light (it avoids even `@tailwindcss/vite`). Porting that stack in for one playground would commit the whole project to it.

**2. How does the playground relate to the "live preview" of ADR-0005?** A default page has one static live preview that renders the reference variant. A playground also renders the reference variant — live, with controls. Having both would mount the reference twice and show the same component side by side with itself.

We decided:

- **Playgrounds are lean and dependency-free.** Controls are native inputs (`<input type="color">`, `<input type="range">`) styled with Tailwind to match the site theme — no shadcn-vue/reka-ui. The circular degree dial (the single most complex piece of the old playground) is replaced by a range slider; it conveys the same value with none of the drag-math. The playground island lives in `src/components/` (docs-only, like `SnippetTabs.vue`) and is **never copied** — it is not part of the snippet.
- **For a `playground: true` snippet, the playground *is* the live preview.** One island mounts the reference variant with reactive props and wraps it in controls; there is no separate static preview. This refines ADR-0005: "live preview" and "playground" collapse into a single interactive island for opt-in snippets. The no-drift rule still holds — the playground imports the same `vue-tailwind` file the page `?raw`-imports for the code tab.

## Consequences

- The site gains zero runtime/UI dependencies from adding a playground. The next flagship playground copies this lean pattern rather than reaching for a component library.
- Playground UIs are less polished out-of-the-box than a shadcn build, accepted in exchange for dependency-minimalism on a developer-facing gallery.
- ADR-0005's "one live preview + opt-in playground" should be read as: opt-in playgrounds *replace* the static preview, they do not sit beside it.
- The playground wrapper is docs-only code with no no-drift obligation; only the reference variant it mounts is the copyable, single-source artifact.
