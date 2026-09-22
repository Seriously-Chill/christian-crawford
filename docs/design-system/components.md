# Components

The shared building blocks, grouped by folder under `src/components/`. Use these before writing new markup. Each one already follows the tokens, works under every color theme, and passes the accessibility tests.

## Layout (`layout/`)

- **`Header`**: a sticky gradient bar holding the wordmark (a link home), `Nav` and `ColorPicker`, with a shallow curved bottom edge.
- **`Nav`**: the five top-level routes in a `<nav aria-label="Main">` landmark. The current page gets `aria-current="page"`.
  - Below `lg` the links collapse behind a menu toggle, which uses `aria-expanded` and swaps its label between "Open menu" and "Close menu".
  - The open panel is capped at the viewport height and scrolls, so every link stays reachable when zoomed.
  - Escape closes the panel and returns focus to the toggle.
- **`Footer`**: the solid `primary` band. It holds a closing line, the contact links, a `<nav aria-label="Footer">`, and a link to the site's source.

## UI (`ui/`)

- **`Button`**: the only button shape, a pill with the `label` text style.
  - **Variants:** `primary` (surface fill, accent label) on white or gradient; `bordered` on white; `bordered-inverse` on a gradient.
  - **Links vs. actions:** renders a link when given `href`, otherwise a `<button>`.
- **`CircleButton`**: a round, icon-only control, used for the stepper's arrows and the logo strip's pause.
  - **Label:** `label` is required and becomes the accessible name.
  - **Disabled:** uses `aria-disabled`, not the native attribute, so focus isn't lost when it disables itself.
- **`ColorPicker`**: the theme control in the header, a `<details>` popover with a hue slider and four swatches (Aqua, Gray, White, Black). It rewrites the color custom properties and stores the choice in `localStorage` (`cc-hue`). The slider reports its value as "Hue N°", and the swatches are toggle buttons.
- **`EvidenceCard`**: a card with a title (`h4`), body, and optional `tags` and `logo`. Use `onGradient` on colored sections: that variant gets a glass tint and the hover ripple. The default variant is for white sections.
- **`FeaturePanel`**: a large `surface-raised` panel with two columns from `md` up, used to lift one idea above the text around it.
- **`DetailGrid`**: a grid of small `surface-raised` tiles for short lists like tech stack or workflows.
- **`Tags`**: a pill list of technologies or categories, with an `onGradient` option.
- **`LineIcon`**: the icon set, available as an `inline` glyph or a round `badge`. Always decorative.
- **`EmployerLogo`**: an employer mark from `public/employers/`, drawn in `currentColor` so it follows the theme. Decorative by default; pass `labelled` when the logo stands in for the name.
- **`EmployerMarquee`**: the slowly drifting logo strip. It pauses on hover, has a pause button, and stays still under reduced motion.

## Sections (`sections/`)

Page sections, each owning its own background and padding:

- **`Opening`**: the home hero, with the display headline, tagline, two calls to action, and an "at a glance" panel.
- **`PageIntro`**: the top of every inner page, with a breadcrumb, kicker, h1, and optional tagline, `meta` row and logo. It sits on the gradient.
- **`CaseStudySection`**: a kicker, h2 and body, plus a slot for diagrams or cards. It's used for each part of the HealthWarehouse case study and for the prose on `/ai`.
- **`Contact`**: the contact page, with its h1 and the Email, LinkedIn, Résumé and location tiles.
- **Page-specific sections:**
  - Home: `HowIWork`, `Capabilities`, `ProjectFeature`, `NarrativeTeaser` and `AiBanner`
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
- **`GovernanceFlow`** (`/ai`) and **`PlatformDiagram`** (the HealthWarehouse architecture): diagrams built in HTML, so their text reflows, can be read aloud, and follows the theme.

## Writing a new component

- **Tokens and type:** use the tokens (`tokens.json`) and the heading classes in `src/lib/type.ts`, never literal colors or sizes.
- **Colored grounds:** on a gradient or primary band, use `on-header` for text and pass `onGradient` to any child that has the option.
- **Decoration and names:** mark decoration `aria-hidden`, and give icon-only controls a label.
- **Tests:** run `npm run test:a11y`. A new route also has to be added to the route lists in `tests/`.
