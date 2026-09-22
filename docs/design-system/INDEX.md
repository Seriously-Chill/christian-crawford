# Christian Crawford Design System — full export

This folder is a complete local copy of the "Christian Crawford" Design System
artifact (https://claude.ai/artifact/GfSd73TxtDmjCwXQvShur6), exported so any
Claude session working on this repo — including one with no access to that
artifact — has the full source material on disk instead of needing the live
link.

## What's real vs. inherited

The design system was built by reverse-engineering a real, saved copy of a
website (`igel.ua`, a Ukrainian household-cleaning brand) and was later
renamed "Christian Crawford" throughout. Two different things now share that
name:

1. **The visual language** — `tokens.json` (color/type/spacing/radius, each
   with a real sourcing note), `motion.md` (three real, sourced
   interactions), and the `Button` / `Header` / `Footer` / `Hero` / `Cover`
   component patterns. This is genuinely what this site (`../../src`) is
   built from — see `../IMPLEMENTATION_MAP.md` for the token-by-token and
   component-by-component mapping into production code.

2. **The original site's content and page-specific components** —
   `content/*.md`, `sitemap.md`, and the `ContactForm` / `NewsCard` /
   `ProductCategoryCard` / `ProductGrid` / `RetailerLogos` component docs.
   These describe igel.ua's actual pages (products, retailers, news
   articles) and have nothing to do with this portfolio. They're included
   here only because this is a *full*, uncurated export — never pull
   product/retailer copy or routes from these files into the site. The
   site's real content comes from Christian's résumé.

## Contents

- `README.md` — the design system's own root README (voice, visual
  foundations, iconography, motion)
- `tokens.json` — raw color/type/spacing/radius tokens
- `motion.md` — the three real interactions (smooth scroll, card ripple,
  page-transition preloader)
- `sitemap.md` — the original igel.ua site's route map (historical
  reference only, not this site's routes)
- `design-system.json` — the artifact's own manifest, including every
  asset's blob ID
- `components/` — one folder per documented component (README + a
  standalone preview.html), verbatim
- `content/` — the original igel.ua site's page-by-page copy, verbatim
  (again: not this portfolio's content)
- `assets/Logos/` — the two real brand marks (`logo-mark.svg`,
  `logo-pr.png`); copies of what's already in `../../public/`
- `assets/Retailers/README.md` — note only. The 22 real retailer logo
  files (Ukrainian supermarket marks) were **not** copied into this repo —
  they're irrelevant to this portfolio. Their blob IDs are preserved in
  `design-system.json` if they're ever actually needed.

## Where this actually lives in the app

`src/app/globals.css` implements the token set as Tailwind v4 `@theme`
values; `src/lib/type.ts` implements the real per-breakpoint type scale;
`src/components/ui/Button.tsx` and `EvidenceCard.tsx` (ripple) and
`src/components/layout/Header.tsx` / `Footer.tsx` implement the component
patterns, adapted for a single-page site. `../IMPLEMENTATION_MAP.md`
documents that mapping in full.
