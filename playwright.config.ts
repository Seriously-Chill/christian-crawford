import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:4310",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Build first: `next start` serves whatever production build is on disk,
  // so without it the suite can silently test an old build of the site.
  webServer: {
    command: "npx next build && npx next start -p 4310",
    url: "http://127.0.0.1:4310",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
