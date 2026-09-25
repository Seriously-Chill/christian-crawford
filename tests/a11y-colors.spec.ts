import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Every color the picker (src/components/ui/ColorPicker.tsx) can produce,
// seeded through its own localStorage key before load. Hues are sampled
// every 15° — lightness clamping is continuous across the wheel, so this
// catches any band that dips under contrast — plus the default (197) and
// the three neutral stops past the wheel. Stop positions mirror the
// component's HUE_END/STOP_WIDTH layout: grey 360–399, white 400–439,
// black 440–479.
const HUES = Array.from({ length: 24 }, (_, i) => i * 15);
const POSITIONS: { name: string; value: number }[] = [
  ...HUES.map((h) => ({ name: `hue ${h}`, value: h })),
  { name: "default (hue 197)", value: 197 },
  { name: "grey", value: 380 },
  { name: "white", value: 420 },
  { name: "black", value: 460 },
];

const ROUTES = ["/", "/work", "/work/healthwarehouse", "/ai", "/about", "/contact"];

// The picker applies its colors at hydration. Under reduced motion every
// property still gets a 0.01ms transition (globals.css), and a transition
// only completes on the next frame, so for one frame text can keep its old
// color over the new background. Two frames later everything has settled;
// scanning before that measures a single frame no visitor ever sees.
async function settleTheme(page: Page) {
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
}

for (const { name, value } of POSITIONS) {
  for (const route of ROUTES) {
    test(`${name} — ${route} has no WCAG 2.2 AA violations`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript((v) => window.localStorage.setItem("cc-hue", String(v)), value);
      await page.goto(route);
      await page.waitForFunction(
        () => document.documentElement.style.getPropertyValue("--hue-primary") !== "",
      );
      await settleTheme(page);
      // The picker's own popover sits on `primary` too — check it open.
      await page.evaluate(() => {
        const details = document.querySelector("header details");
        if (details instanceof HTMLDetailsElement) details.open = true;
      });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      if (results.violations.length > 0) {
        console.log(name, route, JSON.stringify(results.violations, null, 2));
      }
      expect(results.violations).toEqual([]);
    });
  }

  // The mobile menu panel is its own translucent, blurred surface over
  // the page — check its contrast at phone width with it open.
  test(`${name} — open mobile menu has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 760 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript((v) => window.localStorage.setItem("cc-hue", String(v)), value);
    await page.goto("/");
    await page.waitForFunction(
      () => document.documentElement.style.getPropertyValue("--hue-primary") !== "",
    );
    await settleTheme(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#mobile-nav-panel")).toHaveAttribute("data-nav-open", "");

    const results = await new AxeBuilder({ page })
      .include("header")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    if (results.violations.length > 0) {
      console.log(name, "mobile menu", JSON.stringify(results.violations, null, 2));
    }
    expect(results.violations).toEqual([]);
  });
}
