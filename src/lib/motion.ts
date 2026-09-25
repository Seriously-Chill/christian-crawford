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
