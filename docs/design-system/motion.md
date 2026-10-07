# Motion

Motion on this site is quiet and purposeful. It shows where things came from, what just changed, or what can be touched, and never gets in the way of reading.

**Reduced motion turns all of it off.** When the visitor asks for reduced motion:
- there's no smooth scrolling, entrance, page transition or logo drift
- every remaining transition is cut to 0.01ms (`globals.css`)
- the content is fully visible from the first frame

The timing values live in `globals.css`, and `tokens.json` lists them.

## Smooth scroll

Lenis runs sitewide (`src/components/motion/SmoothScrollProvider.tsx`) with `touchMultiplier: 2`. Any area that scrolls on its own, like the mobile menu panel, carries `data-lenis-prevent` so it keeps native scrolling.

## Entrances

Diagrams and evidence fade in and rise 20px as they scroll into view (`RevealOnScroll`, `--duration-entrance` 700ms on `--ease-entrance`). Most of the movement is done by the time the eye lands.

Headings, body copy and the home hero don't animate: they're on the page from the first frame. In `NarrativeSection` only the children slot fades in; in `ProofFeature` the outcomes and the evidence figure; in `ProjectRows` each row's evidence panel. Motion marks the proof, so it shouldn't touch every line of text.

- Elements that arrive together play one after another, 70ms apart, for at most 5 steps.
- A reveal starts once the element's top edge is 88% of the way down the viewport (`REVEAL_LINE` in `src/lib/motion.ts`).
- The first screen reveals from an inline script as soon as the HTML is parsed, without waiting for the app to load.
- Content is hidden only while JavaScript is running and motion is welcome. If the script never arrives, everything shows after 4 seconds.

## Page transition

A gradient overlay (`bg-page-transition-gradient`, with the name set in `h3`) covers the page when an internal link is clicked (`PageTransition.tsx`):

1. It fades in over 300ms.
2. It holds for 100ms once the new route has rendered.
3. It fades out over 400ms.

Details:
- Only a plain left click on a same-site link is taken over. New-tab clicks, downloads and external links behave normally.
- Back and forward still get the hold and fade-out.
- The first visit of a session opens with the same overlay as a preloader. It lifts when fonts are ready, or after 1s at the latest.
- New-page entrances wait for the overlay to lift, so they play where they can be seen.

## Hover and state changes

- **Buttons, tiles and round controls** change color over `duration-hover` (300ms).
- **Nav links** change opacity over `duration-nav` (400ms), the same as the mobile menu sliding open.
- **Evidence cards on a gradient** get a soft ripple on hover (`EvidenceCard`, 800ms ease-out, growing from 1× to 3.5× while fading out). It only plays for pointers that can hover, and only on the gradient variant, never on white sections.
- **Open/close motion** uses `--ease-accordion`, a standard ease-in-out: the menu toggle's bars over `duration-toggle` (300ms), the color picker's panel over `duration-popover` (320ms) and its ring over `duration-spin` (700ms). A swatch or the slider thumb grows over `duration-press` (200ms).
- **Never type a duration** (`duration-300`, `400ms`). Use the token for the role, or add one in `globals.css`.

## Ambient motion

The employer logo strip drifts one full set of logos every 60s, linearly. Because it moves on its own:
- it pauses on hover and while being dragged
- it has a pause button (WCAG 2.2.2)
- it stays still under reduced motion

People can also move it themselves instead of waiting: drag with a mouse, swipe on touch or a trackpad, or step one logo at a time with the back and forward buttons (a 450ms ease-out step that lands on a tile edge). The drift picks up again 2s after they stop. The timing lives in `EmployerMarquee.tsx`, since it's driven by an animation-frame loop rather than CSS.

Nothing else on the site loops.

## Adding motion

- **Reuse** an existing timing token before adding a new one.
- **Don’t reveal text.** Wrap a diagram or a piece of evidence in `RevealOnScroll`, never a heading or paragraph.
- **Keep it modest:** don't spread the ripple to other cards or buttons.
- **Give it an off switch:** anything that moves on its own needs a way to pause it, and must stop under reduced motion.
- **Test it:** check it with the tests' reduced-motion runs and with the page transition running (`tests/navigation.spec.ts`).
