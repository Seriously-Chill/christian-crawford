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
| Header gradient / page-transition gradient (`motion.md`) | `--gradient-header` / `--gradient-page-transition` custom properties |

## Components

| Design System source | Production component | Used in | Server/Client |
|---|---|---|---|
| `Button/preview.html` | `components/ui/Button.tsx` | Opening, Selected Work, Contact | Server |
| `Header/preview.html` | `components/layout/Header.tsx` (static nav) + `components/layout/MobileNavToggle.tsx` (open/close) | Root layout | Header: Server · Toggle: **Client** (needs open/close state) |
| `Footer/preview.html` | `components/layout/Footer.tsx` | Root layout | Server |
| `Hero/preview.html` | `components/sections/Opening.tsx` ("What I Build") | Home, top | Server |
| `ProductCategoryCard` (ripple hover) | `components/ui/EvidenceCard.tsx` — same real ripple keyframes, pure CSS `:hover`, no JS | Complexity section | Server (CSS-only motion) |
| `ProductGrid` | `components/ui/DetailGrid.tsx` — same tile pattern, repurposed for workflow/route lists | Complexity section | Server |
| `NewsCard` | `components/ui/HighlightCard.tsx` — repurposed for discovered-metric callouts (200+ issues, ~50/~80 routes) | Complexity section | Server |
| `ContactForm/preview.html` | Visual treatment only (on-gradient panel) reused in `components/sections/Contact.tsx` — no form fields; spec calls for a simple ending, not a lead-gen form | Contact | Server |
| Lenis smooth scroll (`motion.md`) | `components/motion/SmoothScrollProvider.tsx` | Wraps `<body>` children in root layout | **Client** (Lenis lifecycle) |
| Page-transition preloader (`motion.md`) | `components/motion/PageTransition.tsx` | Root layout, route-change only | **Client** (listens to pathname) |
| — (new, not in DS) | `components/motion/RevealOnScroll.tsx` — small IntersectionObserver wrapper used across every narrative section for progressive disclosure | Complexity, Selected Work, Career, Design Background, AI section | **Client** (IO + respects `prefers-reduced-motion`) |
| `Cover/preview.html` | Not used — that's a Design-System-gallery-only pattern, not a site pattern | — | — |
| `RetailerLogos` + `Retailers` assets | Not used — nothing in the résumé plays that role (per earlier decision) | — | — |

## New narrative sections (content-driven, built from the primitives above — no new visual language)

| Section | Component | Notes |
|---|---|---|
| Opening — "What I Build" | `components/sections/Opening.tsx` | Reuses Hero's shape (display headline, one tagline, two CTAs) |
| Complexity | `components/sections/Complexity.tsx` | Built from `EvidenceCard` + `DetailGrid` + `HighlightCard` |
| Selected Work (HealthWarehouse case study) | `components/sections/SelectedWork.tsx` | Prose + `DetailGrid` for the architecture ideas list |
| Career progression | `components/sections/CareerProgression.tsx` | Custom layout (no 1:1 DS component) but uses only DS tokens/type scale; wrapped in `RevealOnScroll` for progressive disclosure, not a visible-on-load timeline |
| Design background | `components/sections/DesignBackground.tsx` | Prose section |
| AI & architecture | `components/sections/AiArchitecture.tsx` | Prose section, open-question framing |
| Contact | `components/sections/Contact.tsx` | Real email/LinkedIn only |

## Client/Server boundary summary

Only four Client Components exist in the whole app:

1. `MobileNavToggle` — header's mobile menu open/close state
2. `SmoothScrollProvider` — Lenis needs the DOM/lifecycle
3. `PageTransition` — needs the current pathname to key the transition
4. `RevealOnScroll` — IntersectionObserver, degrades to "always visible" under `prefers-reduced-motion` or if JS fails

Every section, every card, and the Button/Header/Footer markup itself render as
Server Components. Nothing else in the tree needs `"use client"`.
