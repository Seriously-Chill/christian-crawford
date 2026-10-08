# Components

The shared building blocks, grouped by folder under `src/components/`. Use these before writing new markup. Each one already follows the tokens, works under every color theme, and passes the accessibility tests.

## Layout (`layout/`)

- **`Section`**: every page section's frame: the full-width ground (`surface`, `gradient` or `header-gradient`), and inside it the content column (`max-w-content`) with the page gutter and section padding (`md`, `lg` or `end`). Every section component is built on it, so the column width, gutter and padding change in one place. `after` holds full-width content below the column, like a `CurveDivider`.
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
- **`Pill`**: the one label pill (a tag, a step, a file name), never a control. `tone` is `default`, `on-gradient` or `on-accent`; `filled` adds a `surface` fill and `compact` narrows the padding. `mono` sets it in the system monospace, only for a real identifier (a file path, an ARIA role, a config key), never as decoration. Tags, StepChain, the AI banner and every diagram pill use it.
- **`ExternalLink`**: a link to another site, opened in a new tab. It adds a visually hidden "(opens in a new tab)" after the visible text, so the accessible name still starts with what's on screen. Use it for every new-tab link.
- **`ColorPicker`**: the theme control in the header, a `<details>` popover framed as evidence ("One system, several expressions": the site reads its colors from one config, like the pharmacy platform's brands), with a hue slider and five swatches (Spruce, Aqua, Gray, White, Black). It rewrites the color custom properties and stores the choice in `localStorage` (`cc-hue`). The slider reports its value as "Hue N°", and the swatches are toggle buttons.
- **`EvidenceCard`**: a card with a title (`h4`) and body. Use `onGradient` on colored sections: that variant uses `glass` and gets the hover ripple. The default variant is `surface-raised` with no border, for white sections.
- **`EvidenceGrid`**: a row of `EvidenceCard`s from `{ title, body }` items. Three sit three across; two or four sit two across.
- **`FeaturePanel`**: a large `surface-raised` panel with two columns from `md` up, used to lift one idea above the text around it.
- **`DetailGrid`**: a grid of small `surface-raised` tiles for short lists like tech stack or workflows.
- **`TileList`**: titled `surface-raised` tiles, two across, for a case study's role and next steps. `accent` colors the titles.
- **`StatList`**: headline figures on a light panel, each value large in `accent` with its label underneath.
- **`StepChain`**: a short sequence as pills joined by arrows, like the redesign phases. Built on `Pill`.
- **`ComparisonTable`**: a small comparison with ARIA table roles: a quiet table from `sm` up, one card per row on phones.
- **`Tags`**: a pill list, with `onGradient` and `mono` options. Built on `Pill`. Use it for identifiers (`/ai`'s governed files) and the site's own stack, not as a row of technologies under every project: a plain `·`-separated line says that more quietly.
- **`LineIcon`**: the icon set. `className` sizes it (the default is the inline size beside text). Always decorative.
- **`EmployerLogo`**: an employer mark from `public/employers/`, drawn in `currentColor` so it follows the theme. Decorative by default; pass `labelled` when the logo stands in for the name.

## Sections (`sections/`)

Page sections, each owning its own background and padding:

- **`Opening`**: the home hero: the display headline across the top, then the introduction and calls to action beside `BrandConfigDiagram` on glass, the thesis drawn from real work. What I'm doing now is one line, not a panel.
- **`CaseSummary`**: the 30-second path at the top of a case study: Problem, Rule and Proof in three columns, each linking down to the section that argues it. The proof's rule is `accent`.
- **`PageIntro`**: the top of every inner page, with a breadcrumb, kicker, h1, and optional tagline, `meta` row and logo. It sits on the gradient.
- **`NarrativeSection`**: an h2, optional body, and a slot for diagrams, cards or a call to action. White by default; `onGradient` puts it on the page gradient. Every part of both case studies, most of `/ai`, and the teasers on Home and `/about` are built with it. Reach for it before writing a new section.
- **`Contact`**: the contact page, with its h1 and the Email, LinkedIn, Résumé and location tiles.
- **Page-specific sections:**
  - Home: `ProofFeature` (statement → figure → explanation beside the result → case study link) and `AiBanner`
  - `/work`: `ProjectRows`
  - `/about`: `CareerProgression` (each era with the habit it carried forward; its `eras` also feed Home's `CareerArc`), `DesignBackground` and `CurrentInterests`
  - `/ai`: `GovernanceOverview`

## Motion (`motion/`)

These are covered in `motion.md`:
- **`SmoothScrollProvider`**: Lenis smooth scrolling
- **`PageTransition`**: the gradient overlay between pages
- **`RevealOnScroll`**: fades a diagram or piece of evidence in on scroll. Never wrap headings or body text in it

## Visuals (`visuals/`)

- **`CurveDivider`**: the shallow curve where two section tones meet. Set `above` and `below` to the two tones (`surface`, `primary`, `gradient-page` or `gradient-header`).
- **`DiagramBox`**: the bordered box every HTML diagram is built from. `tone` is `frame` (a container), `item` (a step or node) or `highlight` (the step the diagram leads to, in `accent`); `raised`, `compact` and `small` cover the variations. Build new diagram boxes with it, not with inline borders. Drawings of a screen are the exception.
- **`FigureCaption`**: the caption under every diagram and evidence figure, one style for all of them.
- **`FlowArrow`**: the down arrow between steps in the HTML diagrams. Pass `className` to place or rotate it.
- **`GovernanceFlow`** (`/ai`) and **`DifferenceRouting`** (the HealthWarehouse forking rule): diagrams built in HTML, so their text reflows, can be read aloud, and follows the theme.
- **Evidence figures** show a claim instead of restating it, drawn only from real project artifacts: `BrandConfigDiagram` (the three brand configs, on the hero's glass, so its lines and text use the on-header colors), `DifferenceRouting`, `PortalShapingDiagram` (email → pitch → the orders screen, no data) and `DialogFixExample` (one fix's before and after) on Home, `CareerArc` (the habit each era left) on Home, and `MenuAnnouncementExample` (an approach that failed, and the one that shipped) on the HealthWarehouse case study. Pass one to `ProofFeature` through `evidence`. Add a figure only when it explains a relationship that would otherwise take several paragraphs.

## Writing a new component

- **Tokens and type:** use the tokens (`tokens.json`) and the heading classes in `src/lib/type.ts`, never literal colors, sizes or opacities.
- **Colored grounds:** on a gradient or primary band, use `on-header` for text and pass `onGradient` to any child that has the option.
- **Decoration and names:** mark decoration `aria-hidden`, and give icon-only controls a label.
- **Tests:** run `npm run test:a11y`. A new route also has to be added to `tests/routes.ts`.
