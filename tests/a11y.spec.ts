import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page has no automatically detectable WCAG 2.2 AA violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  if (results.violations.length > 0) {
    console.log(JSON.stringify(results.violations, null, 2));
  }
  expect(results.violations).toEqual([]);
});

test("skip link is the first focusable element and jumps to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const active = await page.evaluate(() => document.activeElement?.textContent?.trim());
  expect(active).toBe("Skip to main content");

  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => window.location.hash)).toBe("#main-content");
});

test("heading hierarchy has exactly one h1 and no skipped levels", async ({ page }) => {
  await page.goto("/");
  const levels = await page.$$eval("h1, h2, h3, h4, h5, h6", (els) =>
    els.map((el) => Number(el.tagName[1])),
  );
  expect(levels.filter((l) => l === 1)).toHaveLength(1);

  let maxSeen = levels[0];
  for (const level of levels) {
    expect(level).toBeLessThanOrEqual(maxSeen + 1);
    maxSeen = Math.max(maxSeen, level);
  }
});

test("reduced motion: content is visible without waiting on animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("contact links have real, correct destinations", async ({ page }) => {
  await page.goto("/");
  const email = page.getByRole("link", { name: /christian\.crawford@pm\.me/ });
  await expect(email).toHaveAttribute("href", "mailto:christian.crawford@pm.me");

  const linkedin = page.getByRole("link", { name: /LinkedIn/ });
  await expect(linkedin).toHaveAttribute("href", "https://www.linkedin.com/in/christiancrawford");
  await expect(linkedin).toHaveAttribute("target", "_blank");
  await expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
});
