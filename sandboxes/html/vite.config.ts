import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// The HTML fragments live at <repo>/src/snippets, outside this app root, and are
// pulled in as ?raw text — so the dev server must be allowed to read the repo.
const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  server: {
    fs: { allow: [repoRoot] },
  },
});
