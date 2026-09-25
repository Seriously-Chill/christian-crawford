import { test, expect, type Page } from "@playwright/test";

const ROUTES = ["/", "/work", "/work/healthwarehouse", "/ai", "/about", "/contact"];

/** Upper bound on Tab presses per walk; well past any page's control count. */
const MAX_STEPS = 150;

type Stop = {
  id: string;
  label: string;
  focusVisible: boolean;
  hasIndicator: boolean;
  inViewport: boolean;
  obscured: boolean;
};

// Where focus is right now, and whether a sighted keyboard user can see it:
// a real focus indicator (2.4.7), on screen, and not entirely hidden behind
// author content such as the sticky header (2.4.11) — hit-tested, so
// anything painted over it counts. Returns null when focus is on <body>.
async function focusStop(page: Page): Promise<Stop | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    el.dataset.kbId ??= String(document.querySelectorAll("[data-kb-id]").length);
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const points = [0.1, 0.5, 0.9].flatMap((fx) =>
      [0.1, 0.5, 0.9].map((fy) => [rect.left + rect.width * fx, rect.top + rect.height * fy]),
    );
    const obscured = !points.some(([x, y]) => {
      const hit = document.elementFromPoint(x, y);
      return !!hit && (el.contains(hit) || hit.contains(el));
    });
    return {
      id: el.dataset.kbId,
      label: `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40)}"`,
      focusVisible: el.matches(":focus-visible"),
      hasIndicator:
        (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== "none",
      inViewport: rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth,
      obscured,
    };
  });
}

// Everything a keyboard user should be able to reach: focusable, rendered,
// not inert, not tabindex=-1.
async function tabbableCount(page: Page) {
  return page.evaluate(() => {
    const selector = "a[href], button, input, select, textarea, summary, [tabindex]";
    return [...document.querySelectorAll<HTMLElement>(selector)].filter((el) => {
      if (el.tabIndex < 0 || el.closest("[inert]") || (el as HTMLButtonElement).disabled) return false;
      // Controls inside a closed <details> (other than its summary) are skipped by Tab.
      const details = el.closest("details");
      if (details && !details.open && el.tagName !== "SUMMARY") return false;
      return el.checkVisibility({ visibilityProperty: true });
    }).length;
  });
}

async function walk(page: Page, key: "Tab" | "Shift+Tab") {
  const stops: Stop[] = [];
  for (let i = 0; i < MAX_STEPS; i++) {
    await page.keyboard.press(key);
    const stop = await focusStop(page);
    // Back out of the document (to the browser chrome / <body>): the walk is done.
    if (!stop) break;
    // Wrapped around to a control already visited: the cycle is complete.
    if (stops.some((s) => s.id === stop.id)) break;
    stops.push(stop);
  }
  return stops;
}

function expectVisibleFocus(stops: Stop[]) {
  for (const stop of stops) {
    expect.soft(stop.focusVisible, `${stop.label} matches :focus-visible`).toBe(true);
    expect.soft(stop.hasIndicator, `${stop.label} has a focus indicator`).toBe(true);
    expect.soft(stop.inViewport, `${stop.label} is scrolled into view`).toBe(true);
    expect.soft(stop.obscured, `${stop.label} is not hidden under other content`).toBe(false);
  }
}

test.describe("keyboard", () => {
  // Reduced motion: no smooth scrolling or entrance fades, so every stop is
  // measured where it settles rather than mid-animation.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  for (const route of ROUTES) {
    test(`${route}: Tab reaches every control with visible, unobscured focus`, async ({ page }) => {
      await page.goto(route);
      const expected = await tabbableCount(page);
      const stops = await walk(page, "Tab");

      expect(stops[0]?.label).toContain("Skip to main content");
      expect(stops.length, stops.map((s) => s.label).join("\n")).toBe(expected);
      expectVisibleFocus(stops);
    });

    test(`${route}: Shift+Tab walks back with visible, unobscured focus`, async ({ page }) => {
      await page.goto(route);
      // Tab off the end of the page first, so the walk back starts at the
      // last control with the page scrolled to the bottom, as it would for
      // a visitor. Going up is where a sticky header covers focus.
      await walk(page, "Tab");
      const stops = await walk(page, "Shift+Tab");

      expect(stops.at(-1)?.label).toContain("Skip to main content");
      expect(stops.length, stops.map((s) => s.label).join("\n")).toBe(await tabbableCount(page));
      expectVisibleFocus(stops);
    });
  }

  test("skip link moves the Tab sequence into main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("#main-content"))).toBe(true);
  });

  test("Enter on a nav link navigates", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation").getByRole("link", { name: "Work", exact: true }).first().focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/work$/);
  });

  test("Enter on a nav link navigates with the page transition running", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.getByRole("navigation").getByRole("link", { name: "About", exact: true }).first().focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("[data-page-covered]")).toHaveCount(0);
  });

  test.describe("mobile menu", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 760 });
      await page.goto("/");
    });

    test("closed menu links are out of the Tab order", async ({ page }) => {
      const stops = await walk(page, "Tab");
      const panelLinks = await page.locator("#mobile-nav-panel a").count();
      expect(panelLinks).toBeGreaterThan(0);
      expect(stops.length).toBe(await tabbableCount(page));
      expectVisibleFocus(stops);
    });

    test("Enter opens it, Tab moves through its links, Escape closes and returns focus", async ({ page }) => {
      // Its accessible name flips between "Open menu" and "Close menu".
      const toggle = page.locator('[aria-controls="mobile-nav-panel"]');
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(toggle).toHaveAccessibleName("Close menu");

      for (const label of ["Home", "Work", "AI", "About", "Contact"]) {
        await page.keyboard.press("Tab");
        await expect(page.locator("#mobile-nav-panel").getByRole("link", { name: label, exact: true })).toBeFocused();
      }

      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toBeFocused();
    });

    test("Space toggles it closed again from the button", async ({ page }) => {
      const toggle = page.locator('[aria-controls="mobile-nav-panel"]');
      await toggle.focus();
      await page.keyboard.press("Space");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Space");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    });

    test("Enter on a menu link navigates and closes the menu", async ({ page }) => {
      await page.getByRole("button", { name: "Open menu" }).focus();
      await page.keyboard.press("Enter");
      await page.locator("#mobile-nav-panel").getByRole("link", { name: "Contact", exact: true }).focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/contact$/);
      await expect(page.locator('[aria-controls="mobile-nav-panel"]')).toHaveAttribute("aria-expanded", "false");
    });
  });

  test.describe("color picker", () => {
    const hue = (page: Page) =>
      page.evaluate(() => document.documentElement.style.getPropertyValue("--hue-primary"));

    test("fully operable by keyboard", async ({ page }) => {
      await page.goto("/");
      const summary = page.locator("header summary");
      const details = page.locator("header details");

      // Closed: its controls are out of the Tab order.
      await summary.focus();
      await page.keyboard.press("Tab");
      await expect(page.locator("#hue-picker-input")).not.toBeFocused();

      await summary.focus();
      await page.keyboard.press("Enter");
      await expect(details).toHaveJSProperty("open", true);

      await page.keyboard.press("Tab");
      const slider = page.locator("#hue-picker-input");
      await expect(slider).toBeFocused();
      await page.keyboard.press("ArrowRight");
      expect(await hue(page)).toBe("198");
      await expect(slider).toHaveAttribute("aria-valuetext", "Hue 198°");

      await page.keyboard.press("Tab");
      await expect(page.getByRole("button", { name: "Default" })).toBeFocused();
      await page.keyboard.press("Tab");
      const grey = page.getByRole("button", { name: "Grey" });
      await expect(grey).toBeFocused();
      await page.keyboard.press("Space");
      await expect(grey).toHaveAttribute("aria-pressed", "true");
      expect(await hue(page)).toBe("240");

      await page.keyboard.press("Escape");
      await expect(details).toHaveJSProperty("open", false);
      await expect(summary).toBeFocused();
    });
  });
});
