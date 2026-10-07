# Components

The shared building blocks, grouped by folder under `src/components/`. Use these before writing new markup. Each one already follows the tokens, works under every color theme, and passes the accessibility tests.

## Layout (`layout/`)

- **`Header`**: a sticky gradient bar holding the wordmark (a link home), `Nav` and `ColorPicker`, with a shallow curved bottom edge.
- **`Nav`**: the five top-level routes (`NAV_LINKS` in `src/lib/links.ts`, shared with the footer) in a `<nav aria-label="Main">` landmark. The current page gets `aria-current="page"`.
  - Below `lg` the links collapse behind a menu toggle, which uses `aria-expanded` and swaps its label between "Open menu" and "Close menu".
  - The open panel is capped at the viewport height and scrolls, so every link stays reachable when zoomed.
  - Escape closes the panel and returns focus to the toggle.
- **`Footer`**: the solid `primary` band. It holds a closing line, the contact links, a `<nav aria-label="Footer">`, and a link to the site's source.

## UI (`ui/`)

- **`Button`**: the only button shape, a pill with the `label` text style.
  - **Variants:** `primary` (surface fill, accent label) on a gradient or other colored ground, never a white section, where it has no visible edge; `bordered` on white; `bordered-inverse` on a gradient.
  - **Always a link:** every button on the site navigates. `external` opens it in a new tab through `ExternalLink`.
- **`CircleButton`**: a round, icon-only control: the logo strip's back, pause and forward. `label` is required and becomes the accessible name.
- **`ExternalLink`**: a link to another site, opened in a new tab. It adds a visually hidden "(opens in a new tab)" after the visible text, so the accessible name still starts with what's on screen. Use it for every new-tab link.
- **`ColorPicker`**: the theme control in the header, a `<details>` popover with a hue slider and four swatches (Aqua, Gray, White, Black). It rewrites the color custom properties and stores the choice in `localStorage` (`cc-hue`). The slider reports its value as "Hue N°", and the swatches are toggle buttons.
- **`EvidenceCard`**: a card with a title (`h4`) and body. Use `onGradient` on colored sections: that variant gets a glass tint and the hover ripple. The default variant is for white sections.
- **`EvidenceGrid`**: a row of `EvidenceCard`s from `{ title, body }` items. Three sit three across; two or four sit two across.
- **`FeaturePanel`**: a large `surface-raised` panel with two columns from `md` up, used to lift one idea above the text around it.
- **`DetailGrid`**: a grid of small `surface-raised` tiles for short lists like tech stack or workflows.
- **`TileList`**: titled `surface-raised` tiles, two across, for a case study's role and next steps. `accent` colors the titles.
- **`StatList`**: headline figures on a light panel, each value large in `accent` with its label underneath.
- **`StepChain`**: a short sequence as pills joined by arrows, like the redesign phases or the career arc on `/work`.
- **`ComparisonTable`**: a small comparison with ARIA table roles: a quiet table from `sm` up, one card per row on phones.
- **`Tags`**: a pill list of technologies or categories, with an `onGradient` option.
- **`LineIcon`**: the icon set. `className` sizes it (the default is the inline size beside text). Always decorative.
- **`EmployerLogo`**: an employer mark from `public/employers/`, drawn in `currentColor` so it follows the theme. Decorative by default; pass `labelled` when the logo stands in for the name.
- **`EmployerMarquee`**: the slowly drifting logo strip (one full pass per 60s). People can drag it with a mouse, swipe it on touch or a trackpad, or step one logo at a time with back and forward buttons; the drift resumes two seconds after they stop. It pauses on hover, has a pause button, and stays still under reduced motion.

## Sections (`sections/`)

Page sections, each owning its own background and padding:

- **`Opening`**: the home hero, with the display headline, tagline, two calls to action, and an "at a glance" panel.
- **`PageIntro`**: the top of every inner page, with a breadcrumb, kicker, h1, and optional tagline, `meta` row and logo. It sits on the gradient.
- **`NarrativeSection`**: an optional kicker, an h2, optional body, and a slot for diagrams, cards or a call to action. White by default; `onGradient` puts it on the page gradient. Every part of both case studies, most of `/ai`, and the teasers on Home and `/about` are built with it. Reach for it before writing a new section.
- **`Contact`**: the contact page, with its h1 and the Email, LinkedIn, Résumé and location tiles.
- **Page-specific sections:**
  - Home: `ProofFeature` and `AiBanner`
  - `/work`: `ProjectRows`
  - `/about`: `CareerProgression`, `DesignBackground` and `CurrentInterests`
  - `/ai`: `GovernanceOverview`

## Motion (`motion/`)

These are covered in `motion.md`:
- **`SmoothScrollProvider`**: Lenis smooth scrolling
- **`PageTransition`**: the gradient overlay between pages
- **`RevealOnScroll`**: wraps anything that should fade in on scroll

## Visuals (`visuals/`)

- **`CurveDivider`**: the shallow curve where two section tones meet. Set `above` and `below` to the two tones (`surface`, `primary`, `gradient-page` or `gradient-header`).
- **`FigureCaption`**: the caption under every diagram and evidence figure, one style for all of them.
- **`FlowArrow`**: the down arrow between steps in the HTML diagrams. Pass `className` to place or rotate it.
- **`GovernanceFlow`** (`/ai`) and **`DifferenceRouting`** (the HealthWarehouse forking rule): diagrams built in HTML, so their text reflows, can be read aloud, and follows the theme.
- **Evidence figures** show a claim instead of restating it, drawn only from real project artifacts: `BrandConfigDiagram` (the three brand configs), `PortalShapingDiagram` (email → pitch → the orders screen, no data), `AccessibilityTrail` (found → fixed → verified → kept fixed) on Home, and `DialogFixExample` (one fix's before and after) and `MenuAnnouncementExample` (an approach that failed, and the one that shipped) on the HealthWarehouse case study. Pass one to `ProofFeature` through `evidence`.

## Writing a new component

- **Tokens and type:** use the tokens (`tokens.json`) and the heading classes in `src/lib/type.ts`, never literal colors or sizes.
- **Colored grounds:** on a gradient or primary band, use `on-header` for text and pass `onGradient` to any child that has the option.
- **Decoration and names:** mark decoration `aria-hidden`, and give icon-only controls a label.
- **Tests:** run `npm run test:a11y`. A new route also has to be added to `tests/routes.ts`.
