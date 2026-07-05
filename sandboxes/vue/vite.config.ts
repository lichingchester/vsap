import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from "@tailwindcss/vite";

// See sandboxes/react/vite.config.ts for the rationale — the snippet source
// lives outside this app root, so serve up to the repo root and alias `@` there.
const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwind()],
  resolve: {
    alias: { "@": repoRoot },
  },
  server: {
    fs: { allow: [repoRoot] },
  },
});
