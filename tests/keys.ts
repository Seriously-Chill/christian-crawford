import type { Page } from "@playwright/test";

// Safari's default keyboard setting moves Tab between form controls only;
// Option+Tab is how a Safari keyboard user reaches links too. WebKit keeps
// that default, so on it the walk uses Option+Tab to cover every control.
export function tabKey(page: Page, { shift = false } = {}) {
  const webkit = page.context().browser()?.browserType().name() === "webkit";
  return `${shift ? "Shift+" : ""}${webkit ? "Alt+" : ""}Tab`;
}
