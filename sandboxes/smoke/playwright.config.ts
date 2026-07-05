import { defineConfig, devices } from "@playwright/test";

// One managed dev server per sandbox. Playwright boots each (unless one is
// already running on that port — reuseExistingServer) and tears it down after.
// Ports are pinned in each app's `dev` script (--port --strictPort).
const APPS = [
  { name: "react", port: 4331, cwd: "../react" },
  { name: "vue", port: 4332, cwd: "../vue" },
  { name: "html", port: 4333, cwd: "../html" },
];

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    ...devices["Desktop Chrome"],
    headless: true,
  },
  webServer: APPS.map((a) => ({
    command: "npm run dev",
    cwd: a.cwd,
    url: `http://localhost:${a.port}`,
    timeout: 120_000,
    reuseExistingServer: true,
  })),
});
