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

Sections fade in and rise 20px as they scroll into view (`RevealOnScroll`, `--duration-entrance` 700ms on `--ease-entrance`). Most of the movement is done by the time the eye lands.

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

- **Buttons** change color over 300ms.
- **Nav links** change opacity over 400ms.
- **Evidence cards on a gradient** get a soft ripple on hover (`EvidenceCard`, 800ms ease-out, growing from 1× to 3.5× while fading out). It only plays for pointers that can hover, and only on the gradient variant, never on white sections.
- **The How I Work stepper** opens a step over 1s on `--ease-accordion`, animating its height to the content. It's the slowest motion on the site, so keep that pace for this kind of reveal, and nothing faster-paced. Below `md` every step stays open.

## Ambient motion

The employer logo strip drifts in a slow 60s linear loop. Because it moves on its own:
- it pauses on hover
- it has a pause button (WCAG 2.2.2)
- it stays still under reduced motion

Nothing else on the site loops.

## Adding motion

- **Reuse** an existing timing token before adding a new one.
- **Keep it modest:** don't spread the ripple to other cards or buttons, and don't use the accordion's 1s easing for anything quick.
- **Give it an off switch:** anything that moves on its own needs a way to pause it, and must stop under reduced motion.
- **Test it:** check it with the tests' reduced-motion runs and with the page transition running (`tests/navigation.spec.ts`).
