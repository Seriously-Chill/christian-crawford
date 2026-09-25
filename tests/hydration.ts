import type { Page } from "@playwright/test";

// The color picker writes `--hue-primary` onto <html> when it hydrates,
// so its presence means the client handlers (Link, the page transition's
// click capture) are attached. A key pressed in the few milliseconds
// before that can be lost in WebKit; no visitor is that fast, a test is.
export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => document.documentElement.style.getPropertyValue("--hue-primary") !== "");
}
