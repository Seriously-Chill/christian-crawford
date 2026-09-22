/**
 * Set on <html> by the inline head script when JS is running; globals.css
 * only hides `.reveal` content while it's present (and only under
 * `prefers-reduced-motion: no-preference`), so a no-JS or reduced-motion
 * visit renders everything visible from the first frame.
 */
export const REVEAL_ATTR = "data-reveal";

/** Set on window by RevealOnScroll's module once it's able to reveal. */
export const REVEAL_READY_FLAG = "__ccRevealReady";

/**
 * Hides reveal content from the first paint, so nothing that's about to
 * animate is ever painted in place first and then yanked back. If the
 * client bundle never arrives to reveal it, the attribute is dropped after
 * a few seconds and the page shows as plain static content.
 */
export const revealInitScript = `(function(){var d=document.documentElement;d.setAttribute(${JSON.stringify(
  REVEAL_ATTR,
)},"");setTimeout(function(){if(!window[${JSON.stringify(REVEAL_READY_FLAG)}])d.removeAttribute(${JSON.stringify(
  REVEAL_ATTR,
)});},4000);})();`;

/** Gap between elements that reveal together (30–80ms is the usual range). */
export const STAGGER_MS = 70;
/** Past this many steps a long batch would feel like it's dragging. */
export const MAX_STAGGER_STEPS = 5;
/** A reveal plays once its top edge is this far down into the viewport. */
export const REVEAL_LINE = 0.88;

/**
 * Plays the arrival batch (whatever's on the first screen) as soon as the
 * HTML is parsed, from an inline script at the end of <body>, so the first
 * screen isn't held hidden until the client bundle downloads and hydrates.
 * Same selection, order and stagger as RevealOnScroll's batches; behind
 * the first-visit preloader it waits for the page-reveal event like they
 * do. RevealOnScroll skips anything this already revealed.
 */
export const revealArrivalScript = `(function(){try{var d=document.documentElement;if(!d.hasAttribute(${JSON.stringify(
  REVEAL_ATTR,
)}))return;function go(){var line=innerHeight*${REVEAL_LINE},i=0;document.querySelectorAll(".reveal:not([data-revealed])").forEach(function(el){var r=el.getBoundingClientRect();if(r.top<line&&r.bottom>0){el.style.setProperty("--reveal-delay",Math.min(i++,${MAX_STAGGER_STEPS})*${STAGGER_MS}+"ms");el.setAttribute("data-revealed","");}});}if(d.hasAttribute("data-page-covered"))addEventListener("cc:page-reveal",go,{once:true});else go();}catch(e){}})();`;
