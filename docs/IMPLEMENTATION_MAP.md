# Implementation map — Design System → production

Source: the "Christian Crawford" Design System artifact (real tokens/components
pulled from a saved copy of igel.ua, then rebranded — see the artifact's own
README/motion.md for provenance). This maps every real pattern in that artifact
to the production component that carries it forward, where it's used, and
whether it's a Server or Client Component.

## Design tokens

| Source | Production |
|---|---|
| `tokens.json` colors/spacing/radius | `src/app/globals.css` `@theme` block (Tailwind v4 CSS-first theme) |
| `tokens.json` type styles (display/h2/h3/h4/h5/body/label) | Same `@theme` block, as `--text-*` tuples; Montserrat loaded via `next/font/google` in `layout.tsx` |
| Header gradient (`motion.md`) | `bg-header-gradient` utility. The page-transition overlay is **not** a gradient — corrected, see below. |
| Entrance-system + accordion timing (`motion.md`, corrected) | `--duration-entrance` (1250ms), `--duration-entrance-slow` (2000ms), `--duration-accordion` (1000ms), `--ease-accordion` (`cubic-bezier(0.4,0,0.2,1)`) custom properties |

## Components

| Design System source | Production component | Used in | Server/Client |
|---|---|---|---|
| `Button/preview.html` | `components/ui/Button.tsx` | Opening, Selected Work, Contact | Server |
| `Header/preview.html` | `components/layout/Header.tsx` (gradient bar, wordmark) + `components/layout/Nav.tsx` (six real routes, active state, mobile collapse) | Root layout | Header: Server · Nav: **Client** (needs pathname for active state + open/close state) |
| `Footer/preview.html` | `components/layout/Footer.tsx` | Root layout | Server |
| `Hero/preview.html` | `components/sections/Opening.tsx` ("What I Build") | Home, top | Server |
| `ProductCategoryCard` (ripple hover) | `components/ui/EvidenceCard.tsx` — same real ripple keyframes, pure CSS `:hover`, no JS. Card surface corrected: real card is a translucent `#FFFFFF1A` glass tint (not `surface-raised`), only legible on a colored ground — inverted to an ink-tinted equivalent (`bg-ink/3 border-ink/10`) for our light page | Complexity section | Server (CSS-only motion) |
| `ProductGrid` | `components/ui/DetailGrid.tsx` — same tile pattern, repurposed for workflow/route lists | Complexity section | Server |
| `NewsCard` | `components/ui/HighlightCard.tsx` — repurposed for discovered-metric callouts (200+ issues, ~50/~80 routes) | Complexity section | Server |
| `ContactForm/preview.html` | Visual treatment only (on-gradient panel) reused in `components/sections/Contact.tsx` — no form fields; spec calls for a simple ending, not a lead-gen form | Contact | Server |
| Accordion (`.vertical-acc`, About-us page — new mapping, not in the original DS export) | `components/ui/Accordion.tsx` — real `1s cubic-bezier(0.4,0,0.2,1)` height/margin expand, `scrollHeight`-measured (CSS can't transition to `height:auto`) | Systems ("classes of problem"), placeholder copy pending real content | **Client** (open/close state + DOM measurement) |
| Lenis smooth scroll (`motion.md`, corrected) | `components/motion/SmoothScrollProvider.tsx` — real init is explicit (`duration:1.2, easing:<exp-out>, touchMultiplier:2`), not "no options"; `touchMultiplier:2` is now set, the rest already matched Lenis's own defaults | Wraps `<body>` children in root layout | **Client** (Lenis lifecycle) |
| Page-transition preloader (`motion.md`, corrected) | `components/motion/PageTransition.tsx` — real overlay is a flat, ungradiented full-viewport fade (`700ms`, static `70px` logo), not a blue gradient; first visit still uses the inline-script preloader in `layout.tsx` (session-scoped entrance) with matching corrected timing/size. Both use `bg-primary` rather than the source's literal white — the source's white-fill logo mark is invisible on its own white overlay, almost certainly an authoring oversight, not worth reproducing | Root layout | **Client** (keys off pathname) |
| — (new, not in DS) | `components/motion/RevealOnScroll.tsx` — IntersectionObserver wrapper for progressive disclosure. Timing corrected against the real sitewide entrance system: `durationMs` defaults to 1250ms ("animated"), hero-tier sections pass 2000ms ("animated-slow") via `playOnLoad`; callers stagger `delayMs` in ~100ms steps to match the real per-element cadence | Every narrative section; `playOnLoad` on Opening (hero) | **Client** (IO + respects `prefers-reduced-motion`) |
| `Cover/preview.html` | Not used — that's a Design-System-gallery-only pattern, not a site pattern | — | — |
| `RetailerLogos` + `Retailers` assets | Not used — nothing in the résumé plays that role (per earlier decision) | — | — |

## Routes and the sections that fill them

A real multi-page site now, not one scrolling page — see `../docs/design-system/components/Header/README.md`
for why: the source site's 6-item nav implies 6 real destinations, not anchors.

| Route | Sections | Notes |
|---|---|---|
| `/` (Home) | `Opening` + a `NarrativeTeaser` per other route + `HomeContactCta` | Introduces the site; each teaser links out rather than duplicating the full page |
| `/work` | `SelectedWork` + `Complexity` | Case study + the evidence backing it |
| `/systems` | `SystemsThinking` | New copy generalizing facts already established on `/work`/`/about` into problem classes |
| `/about` | `CareerProgression` + `DesignBackground` | Full career timeline + the design→engineering throughline |
| `/thinking` (index) + `/thinking/[slug]` | `AiArchitecture` (first essay, slug `ai-assisted-development`) | Same index+article shape as the DS's own News section (`sitemap.md`); essay list lives in `lib/essays.ts` |
| `/contact` | `Contact` | Promoted from the old page-ending panel to its own destination |

| Component | Notes |
|---|---|
| `Opening.tsx` | Reuses Hero's shape (display headline, one tagline, two CTAs) |
| `NarrativeTeaser.tsx` | Shared homepage-teaser shape (kicker, h2, body, CTA) — not a DS component, built only from DS tokens/type scale |
| `Complexity.tsx` | Built from `EvidenceCard` + `DetailGrid` + `HighlightCard` |
| `SelectedWork.tsx` | Prose + `DetailGrid`; carries the page's `h1` on `/work` |
| `SystemsThinking.tsx` | Prose + `Accordion` (placeholder copy); carries the page's `h1` on `/systems` |
| `CareerProgression.tsx` | Wrapped in `RevealOnScroll` for progressive disclosure, not a visible-on-load timeline; carries the page's `h1` on `/about` |
| `DesignBackground.tsx` | Prose section, no heading of its own |
| `AiArchitecture.tsx` | Open-question framing; carries the page's `h1` on the essay route |
| `Contact.tsx` | Real email/LinkedIn only; carries the page's `h1` on `/contact` |
| `HomeContactCta.tsx` | Homepage-only bookend pointing at `/contact`, no email/LinkedIn duplicated |

## Client/Server boundary summary

Client Components in the app:

1. `Nav` — active-route state (needs pathname) + mobile menu open/close
2. `SmoothScrollProvider` — Lenis needs the DOM/lifecycle
3. `PageTransition` — needs the current pathname to key the transition
4. `RevealOnScroll` — IntersectionObserver, degrades to "always visible" under `prefers-reduced-motion` or if JS fails
5. `AccordionItem` — open/close state + `scrollHeight` measurement for the height transition

Every section, every card, and the Button/Header/Footer markup itself render as
Server Components. Nothing else in the tree needs `"use client"`.
