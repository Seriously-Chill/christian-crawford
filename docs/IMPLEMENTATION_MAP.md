# Implementation map

What each route is built from, and where the code lives. For the visual language itself, see `design-system/`: its `README.md`, plus `tokens.json`, `motion.md` and `components.md`.

## Where things live

| Concern | Location |
|---|---|
| Tokens (color, type, spacing, radius, motion) | `src/app/globals.css` `@theme` block (Tailwind v4) |
| Responsive heading scale | `src/lib/type.ts` |
| Theme switching | `src/components/ui/ColorPicker.tsx`, applying custom properties on `<html>` |
| Motion constants and the inline scripts (reveal, preloader) | `src/lib/motion.ts` |
| Site URL, contact links, nav routes, source repo, résumé | `src/lib/links.ts` |
| Routes, metadata, sitemap | `src/app/` |

## Routes and the sections that fill them

Every route sits on the gradient canvas. White sections paint their own `bg-surface`, and a `CurveDivider` marks each change of tone. Every page ends on the footer's solid `primary` band.

| Route | Sections, in order | Purpose |
|---|---|---|
| `/` | `Opening` (with `BrandConfigDiagram` on glass) → three `ProofFeature`s, each built around an evidence figure (Architecture → the forking rule, `DifferenceRouting`; Product and UX → partner portal, `PortalShapingDiagram`; Accessibility → `DialogFixExample`) → `NarrativeSection` with `CareerArc` → `AiBanner` | States the thesis and proves it in the first screen, then shows one piece of evidence for each part of the work, then points to `/about` and `/ai` |
| `/work` | `PageIntro` → `ProjectRows` | The two case studies as alternating rows with their figures, then Ingage, Kroger and earlier work as a plain list |
| `/work/healthwarehouse` | `PageIntro` (with `tagline`, `meta`) → `CaseSummary` → `NarrativeSection`s: What changed (`BrandScreens`, `EvidenceGrid`) → The problem (`ComparisonTable`) → The rule (`DifferenceRouting`, `EvidenceGrid`) → Where it bent (`EvidenceGrid`) → The test (`StepChain`, `ComparisonTable`) → Accessibility (`DialogFixExample`, `MenuAnnouncementExample`, `FeaturePanel` with `StatList`) → What I'd change (`TileList`) → Role (`TileList`) | The in-depth case study: the forking rule, its costs, and the brand that tested it |
| `/work/partner-portal` | `PageIntro` (with `meta`) → `CaseSummary` → `NarrativeSection`s: The problem (`PartnerRequestFlow`) → Shaping (`EvidenceGrid`) → The key decision (`EvidenceGrid`) → Architecture (`SheetStackDiagram`, `EvidenceGrid`) → The hard part (`EvidenceGrid`) → Where it stands (`DetailGrid`) → Role (`TileList`) | The product-shaping and UX case study |
| `/ai` | `PageIntro` → `WorkShiftDiagram` → `GovernanceOverview` → `GovernanceFlow` → why governance files → why this subset → what the hooks catch (`NarrativeSection onGradient`, `EvidenceCard onGradient` ×3) → how this site is built (`FeaturePanel` with `StatList`) | How AI fits the workflow, told through this repo's Claude Code governance hooks |
| `/about` | `PageIntro` → `CareerProgression` → `DesignBackground` → `CurrentInterests` | Career timeline, the path from design to engineering, current interests |
| `/contact` | `Contact` | Contact tiles; the page is its own closing band |

## Client/Server boundary

Everything renders as a Server Component except these five Client Components:

1. `Nav`: the current route, and the mobile menu's open state
2. `SmoothScrollProvider`: Lenis
3. `PageTransition`: intercepting clicks and tracking the pathname
4. `RevealOnScroll`: IntersectionObserver. Content stays visible under reduced motion or without JS.
5. `ColorPicker`: the slider and the stored choice

## Other pieces

- **Share card:** `src/app/opengraph-image.tsx` (re-exported by `twitter-image.tsx`) generates the link-preview image at build time from the site's type and default colors. It loads `src/fonts/PlusJakartaSans-Regular.ttf`, a static weight-400 instance cut from the variable font with fontTools, because the image renderer crashes on variable fonts.
- **Tests:** see the README's Testing section.
