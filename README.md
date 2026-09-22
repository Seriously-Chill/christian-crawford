This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

```bash
npm run lint              # ESLint
npm run typecheck         # tsc --noEmit
npm run test:a11y         # Playwright, in Chromium and WebKit
npm run test:lighthouse   # Lighthouse CI on every page
```

Both test commands build the site first, so they always test the current code.

- **`test:a11y`** runs every spec in `tests/`:
  - `a11y.spec.ts`: axe WCAG 2.2 AA scans, heading order, landmarks
  - `a11y-colors.spec.ts`: contrast at all 28 color-picker settings
  - `keyboard.spec.ts`: Tab order, visible focus, menus
  - `reflow.spec.ts`: 320px reflow and WCAG text spacing
  - `navigation.spec.ts`: page titles, route announcements, and where focus lands after navigating

  Run a single browser with `-- --project=webkit` (or `chromium`).
- **`test:lighthouse`** fails if any page scores under 90 for performance or under 100 for accessibility, best practices or SEO, or exceeds the LCP, TBT or CLS limits in `lighthouserc.cjs`. Reports are written to `.lighthouseci/`.
- **CI:** `.github/workflows/test.yml` runs all of the above on every pull request and on pushes to `main`.
- **Manual checks:** what automation can't hear is covered in [docs/screen-reader-checklist.md](docs/screen-reader-checklist.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
