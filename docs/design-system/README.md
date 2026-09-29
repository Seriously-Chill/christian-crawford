# Design system

The visual language of this site. The code is the source of truth:

- `src/app/globals.css` holds the tokens.
- `src/lib/type.ts` holds the responsive type scale.
- `src/components/` holds the components.

These docs explain the intent behind the code, so new work stays consistent with it.

- `tokens.json`: color, type, spacing, radius and motion tokens, with what each is for
- `motion.md`: how things move, and when they don't
- `components.md`: the shared components and when to use each one

## Voice

Write the way the site already reads:

- **First person and plain.** Use short, direct sentences.
- **Lead with the outcome, then the evidence.** Back claims with specifics: "One codebase serving three pharmacy brands, with configuration instead of forks." "Playwright and axe-core across ~50 routes, keyboard paths, and checkout flows."
- **Name the real tools and numbers,** not adjectives. Leave out superlatives and buzzwords.
- **Headings are short statements,** e.g. "Simple is the hard part." "Different rooms, same habit."

Content comes from Christian's own work and résumé. Don't invent roles, figures or quotes.

## Color

Every color is a token, and every token follows the visitor's choice in the color picker (`src/components/ui/ColorPicker.tsx`). Never hard-code a color in a component. If a color bypasses the tokens, it breaks as soon as someone picks another theme.

- **The default theme is charcoal gray.** Primary is `#525252`, secondary is `#777777`, and the default text on colored surfaces (`on-header`) is white. The fallbacks in `globals.css` match it, so the first paint never flashes another color.
- **Hue themes** work around the whole color wheel.
  - The picker solves each hue's lightness for a fixed brightness (relative luminance), so every hue reads equally light.
  - On a hue theme, colored surfaces are light, so the text on them (`on-header`) switches to ink.
  - `accent` is a deep shade of the same hue. It's used for text and focus rings on white.
- **Neutral stops:** gray (the default), white and black. Each sets its own values for `on-header`, `accent` and the button edge.
- **Contrast is tested, not assumed.** Every page is checked for WCAG 2.2 AA at 28 picker settings (`tests/a11y-colors.spec.ts`). A new color pairing has to pass there too.

## Type

- **Font:** Plus Jakarta Sans, a self-hosted variable font in `src/fonts/`, used for everything.
- **Headings:** use the class strings in `src/lib/type.ts` (`textDisplay`, `textH1` … `textH5`). They scale across six breakpoints and balance their line breaks so no line is left with a lone word.
- **Body and label** text stay at 16px at every breakpoint. Paragraphs use `text-wrap: pretty`.
- **Alignment:** left-align by default: section headers, paragraphs, lists, card and diagram text. Centered lines have no fixed starting edge, so the eye has to find the start of each one, which slows reading once text wraps. Center only text that stays within two or three lines at every width: a short pull quote, a single-word chip, the preloader name.

Headings follow the page outline: one h1 per page, and no skipped levels. The tests enforce this.

## Surfaces and layout

- **The page canvas is a full-strength gradient** (`bg-page-gradient`). Any section meant to be white has to paint `bg-surface` itself; leaving the background out shows the gradient.
- **The header** uses `bg-header-gradient`, the same gradient at 90% opacity. The page-transition overlay uses a steeper version of it (`bg-page-transition-gradient`).
- **Where two tones meet,** use a shallow curve (`CurveDivider`), not a straight edge.
- **Spacing** uses the `space-1`…`space-7` scale (8px to 80px), and corners use the radius tokens. Cards are `radius-lg` and buttons are `radius-pill`.

## Icons and images

- **Icons:** `LineIcon` is the one icon set: a 24px grid, 1.5px round strokes, drawn in `currentColor`. Icons are always decorative, next to text that says the same thing.
- **Employer logos:** these live in `public/employers/`. They're official assets, with their sources listed in that folder's README.
- **Imagery:** the site runs on type, color and diagrams. Add an image only where a section clearly needs one.

## Accessibility baseline

- **Focus:** every focusable element shows a 2px `accent` outline. The sticky header never covers the focused element (`scroll-padding-top`).
- **Reduced motion** switches off the smooth scrolling, entrances and page transitions (see `motion.md`).
- **Tests:** keyboard access, reflow at 320px, text spacing, landmarks and route announcements are all tested (see the README's Testing section). Checks that need a screen reader are in `docs/screen-reader-checklist.md`.
