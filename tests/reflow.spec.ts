import { test, expect, type Page } from "@playwright/test";

const ROUTES = ["/", "/work", "/work/healthwarehouse", "/work/partner-portal", "/ai", "/about", "/contact"];

// WCAG 1.4.12's test values: the spacing a visitor's own stylesheet or
// extension may apply, which the page has to absorb without losing content.
const TEXT_SPACING = `
  * {
    line-height: 1.5 !important;
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
  }
  p { margin-bottom: 2em !important; }
`;

// Content a visitor can't get to: a horizontal page scroll, or text cut off
// by an overflow-hidden/clip box. Screen-reader-only text is clipped to 1px
// by design, and a box with no height at all is a collapsed disclosure,
// not clipped text, so neither counts.
async function lostContent(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const clipped: string[] = [];
    for (const el of document.querySelectorAll("body *")) {
      if (!(el instanceof HTMLElement) || el.closest(".sr-only") || !el.checkVisibility() || !el.innerText.trim())
        continue;
      const style = getComputedStyle(el);
      const clipsX = /hidden|clip/.test(style.overflowX) && el.scrollWidth > el.clientWidth + 1;
      const clipsY =
        /hidden|clip/.test(style.overflowY) && el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 1;
      if (clipsX || clipsY) clipped.push(`${el.tagName.toLowerCase()} "${el.innerText.trim().slice(0, 40)}"`);
    }
    return {
      horizontalScroll: root.scrollWidth - root.clientWidth,
      clipped,
    };
  });
}

test.describe("reflow and text spacing", () => {
  // Reduced motion: everything is in its settled place, nothing mid-fade.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  for (const route of ROUTES) {
    // 1.4.10: 320 CSS px is a 1280px window at 400% zoom.
    test(`${route} reflows at 320px with no horizontal scroll or clipped text`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 256 });
      await page.goto(route);
      expect(await lostContent(page)).toEqual({ horizontalScroll: 0, clipped: [] });
    });

    // 1.4.12, checked at both ends of the layout: the narrow one is where
    // wider letters run out of room first.
    for (const width of [320, 1280]) {
      test(`${route} keeps all content under WCAG text spacing at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(route);
        await page.addStyleTag({ content: TEXT_SPACING });
        expect(await lostContent(page)).toEqual({ horizontalScroll: 0, clipped: [] });
      });
    }
  }

  test("the open mobile menu reflows at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 256 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#mobile-nav-panel")).toHaveAttribute("data-nav-open", "");
    expect(await lostContent(page)).toEqual({ horizontalScroll: 0, clipped: [] });
    // Every menu link is reachable on a short screen too.
    for (const link of await page.locator("#mobile-nav-panel a").all()) {
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeInViewport();
    }
  });
});
