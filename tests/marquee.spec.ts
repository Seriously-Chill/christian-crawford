import { test, expect, type Page } from "@playwright/test";
import { waitForHydration } from "./hydration";

// The home page's employer logo strip: it drifts on its own, and people can
// pause it, drag it, or step it one logo at a time instead of waiting.

const strip = (page: Page) => page.getByRole("list", { name: /Where I.ve worked/ });

// How far the track has moved left, in px, and one list's width (the
// distance after which it wraps).
async function position(page: Page) {
  return strip(page).evaluate((list) => {
    const translate = (list.parentElement as HTMLElement).style.translate;
    return { offset: -parseFloat(translate || "0"), period: (list as HTMLElement).offsetWidth };
  });
}

// Distance moved from `a` to `b`, allowing for the wrap.
function moved(a: { offset: number; period: number }, b: { offset: number }) {
  const d = (((b.offset - a.offset) % a.period) + a.period) % a.period;
  return d > a.period / 2 ? d - a.period : d;
}

test.describe("logo strip", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await waitForHydration(page);
    // Scroll by the pause button: the strip itself is always moving, so
    // Playwright never considers it stable enough to scroll to.
    await page.getByRole("button", { name: "Pause logo scroll" }).scrollIntoViewIfNeeded();
  });

  test("drifts on its own, and the pause button stops it", async ({ page }) => {
    // Keep the mouse off the strip, since hovering also pauses it.
    await page.mouse.move(0, 0);
    const start = await position(page);
    await expect.poll(async () => moved(start, await position(page))).toBeGreaterThan(5);

    const pause = page.getByRole("button", { name: "Pause logo scroll" });
    await pause.click();
    await expect(pause).toHaveAttribute("aria-pressed", "true");
    await page.mouse.move(0, 0);
    const paused = await position(page);
    await page.waitForTimeout(800);
    expect(moved(paused, await position(page))).toBe(0);
  });

  test("dragging with a mouse moves it with the pointer", async ({ page }) => {
    await page.getByRole("button", { name: "Pause logo scroll" }).click();
    const box = (await strip(page).boundingBox())!;
    const y = box.y + box.height / 2;
    const x = box.x + 300;
    const before = await position(page);

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 100, y, { steps: 5 });
    await page.mouse.move(x - 200, y, { steps: 5 });
    await page.mouse.up();

    expect(moved(before, await position(page))).toBeCloseTo(200, 0);
  });

  test("back and forward step one logo at a time", async ({ page }) => {
    await page.getByRole("button", { name: "Pause logo scroll" }).click();
    const tile = await strip(page).evaluate((list) => {
      const first = list.firstElementChild as HTMLElement;
      return first.offsetWidth + parseFloat(getComputedStyle(list).columnGap);
    });

    await page.getByRole("button", { name: "Scroll logos forward" }).click();
    await page.mouse.move(0, 0);
    // Lands on a tile edge: its distance to the nearest edge is ~0.
    await expect
      .poll(async () => {
        const r = (await position(page)).offset % tile;
        return Math.min(r, tile - r);
      })
      .toBeCloseTo(0, 0);
    const afterForward = await position(page);

    await page.getByRole("button", { name: "Scroll logos back" }).click();
    await page.mouse.move(0, 0);
    await expect.poll(async () => moved(afterForward, await position(page))).toBeCloseTo(-tile, 0);
  });
});

test("under reduced motion the strip stays still and hides its controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await waitForHydration(page);
  await expect(page.getByRole("button", { name: "Pause logo scroll" })).toBeHidden();
  await page.waitForTimeout(500);
  expect(await strip(page).evaluate((list) => (list.parentElement as HTMLElement).style.translate)).toBe("");
});
