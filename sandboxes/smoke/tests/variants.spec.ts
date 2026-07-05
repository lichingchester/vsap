import { test, expect } from "@playwright/test";

/**
 * Smoke pass (ADR-0017): for every variant each sandbox discovers, load it via
 * the switcher's `?variant=` deep-link and assert it mounts clean —
 *   • no uncaught page error
 *   • no console.error
 *   • a non-empty mount (or, for HTML, a non-empty iframe body)
 *
 * The variant list is read from the switcher's own `[data-variant]` buttons, so
 * this shares ONE source of truth with the manual mode and auto-covers any new
 * snippet — no matrix to maintain here.
 */

interface AppUnderTest {
  name: string;
  base: string;
  /** HTML runs each fragment inside an iframe, so the content is one level down. */
  isHtml?: boolean;
}

const APPS: AppUnderTest[] = [
  { name: "react", base: "http://localhost:4331" },
  { name: "vue", base: "http://localhost:4332" },
  { name: "html", base: "http://localhost:4333", isHtml: true },
];

for (const app of APPS) {
  test(`${app.name}: every variant mounts clean`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`[console.error] ${m.text()}`);
    });

    await page.goto(app.base, { waitUntil: "networkidle" });

    const keys = await page.$$eval("[data-variant]", (els) =>
      Array.from(
        new Set(
          els
            .map((e) => e.getAttribute("data-variant"))
            .filter((k): k is string => !!k),
        ),
      ),
    );
    expect(keys, `${app.name} discovered no variants`).not.toHaveLength(0);
    console.log(`  ${app.name}: ${keys.length} variant(s) → ${keys.join(", ")}`);

    for (const key of keys) {
      errors.length = 0;
      await page.goto(`${app.base}/?variant=${encodeURIComponent(key)}`, {
        waitUntil: "networkidle",
      });

      const mount = page.locator("[data-mount]");
      await expect(mount, `${key}: no mount region`).toBeVisible();

      if (app.isHtml) {
        const body = page
          .frameLocator("[data-mount] iframe")
          .locator("body");
        await expect(body, `${key}: empty iframe body`).not.toBeEmpty();
      } else {
        await expect(mount, `${key}: empty mount`).not.toBeEmpty();
      }

      // Let the lazy chunk + any mount effects (GSAP, etc.) settle, then assert
      // nothing threw or logged an error while rendering this variant.
      await page.waitForTimeout(500);
      expect(errors, `${key} logged:\n${errors.join("\n")}`).toEqual([]);
    }
  });
}
