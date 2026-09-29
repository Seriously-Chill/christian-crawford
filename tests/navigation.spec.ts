import { test, expect, type Page } from "@playwright/test";
import { tabKey } from "./keys";
import { waitForHydration } from "./hydration";

const ROUTES = ["/", "/work", "/work/healthwarehouse", "/work/partner-portal", "/ai", "/about", "/contact"];

// Next.js's route announcer: a live region in an open shadow root that
// reads the new page's name after a client-side navigation, the cue a
// screen reader user gets that the page changed without a full load. It
// reads document.title, or the h1 if the title is momentarily empty while
// Next streams the new metadata in; either names the new page. The old
// page's title would not.
//
// The announcer deliberately stays silent on a full page load, since a
// screen reader reads a freshly loaded page's title itself. If a key lands
// before the link has hydrated (a slow CI runner), the browser does a full
// load instead of a client-side navigation; then the new title is what the
// visitor hears, so that's what's checked. `markPage` tags the old page's
// window so the two cases can be told apart, and the test notes which one
// it saw.
async function markPage(page: Page) {
  await page.evaluate(() => ((window as Window & { __ccBeforeNav?: boolean }).__ccBeforeNav = true));
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Returns whether the navigation was client-side; the focus checks that
// follow only apply then, since a full load starts focus at the top.
async function expectAnnounced(page: Page, title: string) {
  const clientSide = await page.evaluate(
    () => (window as Window & { __ccBeforeNav?: boolean }).__ccBeforeNav === true,
  );
  test.info().annotations.push({ type: "navigation", description: clientSide ? "client-side" : "full load" });
  if (!clientSide) {
    await expect(page).toHaveTitle(title);
    return false;
  }
  const live = page.locator("next-route-announcer [aria-live]");
  await expect(live).toHaveAttribute("aria-live", "assertive");
  const h1 = (await page.getByRole("heading", { level: 1 }).innerText()).trim();
  await expect(live).toHaveText(new RegExp(`^(${escape(title)}|${escape(h1)})$`));
  return true;
}

test("every page has its own descriptive title", async ({ page }) => {
  const titles: string[] = [];
  for (const route of ROUTES) {
    await page.goto(route);
    titles.push(await page.title());
  }
  for (const title of titles) expect(title).toContain("Christian Crawford");
  expect(new Set(titles).size).toBe(ROUTES.length);
});

// Both with the page transition running and without it: the transition
// covers the swap, and the announcement and focus must survive it.
for (const motion of ["reduce", "no-preference"] as const) {
  test.describe(`client-side navigation (motion: ${motion})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: motion });
    });

    test("a nav link announces the new page and keeps focus in the header", async ({ page }) => {
      await page.goto("/");
      await waitForHydration(page);
      const main = page.getByRole("navigation", { name: "Main" });
      const about = main.getByRole("link", { name: "About", exact: true });
      await about.focus();
      await markPage(page);
      await page.keyboard.press("Enter");

      await expect(page).toHaveURL(/\/about$/);
      const clientSide = await expectAnnounced(page, "About — Christian Crawford");
      await expect(page.locator("[data-page-covered]")).toHaveCount(0);
      if (!clientSide) return;
      // The header persists across pages, so focus stays on the link just
      // used (now the current page) and Tab carries on from it.
      await expect(about).toBeFocused();
      await expect(about).toHaveAttribute("aria-current", "page");
      await page.keyboard.press(tabKey(page));
      await expect(main.getByRole("link", { name: "Contact", exact: true })).toBeFocused();
    });

    test("an in-page link announces the new page and Tab resumes at its content", async ({ page }) => {
      await page.goto("/work");
      await waitForHydration(page);
      await page.locator('#main-content a[href="/work/healthwarehouse"]').first().focus();
      await markPage(page);
      await page.keyboard.press("Enter");

      await expect(page).toHaveURL(/\/work\/healthwarehouse$/);
      const clientSide = await expectAnnounced(page, "HealthWarehouse — Christian Crawford");
      await expect(page.locator("[data-page-covered]")).toHaveCount(0);
      if (!clientSide) return;
      // The link that had focus is gone with the old page. The next Tab
      // must pick up at the top of the new page's content, not deep inside
      // it or off screen.
      await page.keyboard.press(tabKey(page));
      const first = await page.evaluate(() => {
        const main = document.getElementById("main-content");
        const firstControl = [...(main?.querySelectorAll<HTMLElement>("a[href], button, input, summary") ?? [])].find(
          (el) => el.checkVisibility(),
        );
        return { focusedIsFirst: document.activeElement === firstControl };
      });
      expect(first.focusedIsFirst).toBe(true);
      await expect(page.locator(":focus")).toBeInViewport();
    });
  });
}
