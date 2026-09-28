// Lighthouse CI: `npm run test:lighthouse`. Builds nothing itself — run
// `next build` first (the npm script does), since `next start` serves
// whatever production build is on disk.
const PORT = 4311;
const ROUTES = ["/", "/work", "/work/healthwarehouse", "/ai", "/about", "/contact"];
// Lighthouse simulates a slow phone by scaling the CPU time it observes, so
// a slower machine inflates blocking time directly: the home page measures
// ~15ms on a laptop and ~320ms on a GitHub runner. CI gets a looser TBT
// budget that still catches a real regression; local runs keep the strict one.
const TBT_BUDGET_MS = process.env.CI ? 600 : 200;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx next start -p ${PORT}`,
      startServerReadyPattern: "Ready",
      url: ROUTES.map((route) => `http://127.0.0.1:${PORT}${route}`),
      // Median of three runs per page smooths out single-run noise.
      numberOfRuns: 3,
      settings: {
        // Lighthouse's default: a mid-range phone on throttled 4G.
        chromeFlags: "--headless=new",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9, aggregationMethod: "median-run" }],
        "categories:accessibility": ["error", { minScore: 1, aggregationMethod: "median-run" }],
        "categories:best-practices": ["error", { minScore: 1, aggregationMethod: "median-run" }],
        "categories:seo": ["error", { minScore: 1, aggregationMethod: "median-run" }],
        // Budgets sit just above where the site measures today (LCP ~2.6–3.3s,
        // TBT under 30ms, no layout shift), so a regression fails here even
        // while the rolled-up performance score still clears 90.
        "largest-contentful-paint": ["error", { maxNumericValue: 3600, aggregationMethod: "median-run" }],
        "total-blocking-time": ["error", { maxNumericValue: TBT_BUDGET_MS, aggregationMethod: "median-run" }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.02, aggregationMethod: "median-run" }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci/reports",
    },
  },
};
