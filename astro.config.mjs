import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import react from "@astrojs/react";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Vue handles .vue files, React handles .jsx/.tsx — no overlap, so both
  // framework islands can render on the same page (the multi-framework preview).
  // Tailwind v4 is wired via PostCSS (postcss.config.mjs) rather than the
  // @tailwindcss/vite plugin, which is incompatible with Astro 7's Rolldown Vite.
  integrations: [vue(), react()],
});
