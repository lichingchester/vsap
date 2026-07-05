import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

// This app lives at <repo>/sandboxes/react. The snippet source it verifies
// lives at <repo>/src/snippets, OUTSIDE this app's root — so the dev server
// must be allowed to read up to the repo root, and `@` must resolve there
// (some variants import `@/…`, the project alias — see CLAUDE.md).
const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: { "@": repoRoot },
  },
  server: {
    fs: {
      // Serve files from the whole repo, not just sandboxes/react — the
      // switcher glob-imports ../../../src/snippets/** at runtime.
      allow: [repoRoot],
    },
  },
});
