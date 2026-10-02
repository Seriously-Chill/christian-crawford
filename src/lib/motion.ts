/**
 * Set on <html> by the inline script at the top of <body> when JS is
 * running; globals.css only hides `.reveal` content while it's present
 * (and only under `prefers-reduced-motion: no-preference`), so a no-JS or
 * reduced-motion visit renders everything visible from the first frame.
 */
const REVEAL_ATTR = "data-reveal";

/** Set on window by RevealOnScroll's module once it's able to reveal. */
export const REVEAL_READY_FLAG = "__ccRevealReady";

/** Set on <html> while an overlay covers the page; entrances wait for it to go. */
export const PAGE_COVERED_ATTR = "data-page-covered";
/** Fired on window as an overlay starts lifting; waiting entrances play. */
export const PAGE_REVEAL_EVENT = "cc:page-reveal";

/** The first-visit preloader's element id (layout.tsx). */
export const PRELOADER_ID = "cc-preloader";
/** Set on window once the preloader has lifted and been hidden. */
export const PRELOADER_DONE_FLAG = "__ccPreloaderDone";
/** sessionStorage key: the preloader plays once per browser session. */
const PRELOADER_SESSION_KEY = "cc-entered";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const q = JSON.stringify;

/**
 * Hides reveal content from the first paint, so nothing that's about to
 * animate is ever painted in place first and then yanked back. If the
 * client bundle never arrives to reveal it, the attribute is dropped after
 * a few seconds and the page shows as plain static content.
 */
export const revealInitScript = `(function(){var d=document.documentElement;d.setAttribute(${q(
  REVEAL_ATTR,
)},"");setTimeout(function(){if(!window[${q(REVEAL_READY_FLAG)}])d.removeAttribute(${q(REVEAL_ATTR)});},4000);})();`;

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
export const revealArrivalScript = `(function(){try{var d=document.documentElement;if(!d.hasAttribute(${q(
  REVEAL_ATTR,
)}))return;function go(){var line=innerHeight*${REVEAL_LINE},i=0;document.querySelectorAll(".reveal:not([data-revealed])").forEach(function(el){var r=el.getBoundingClientRect();if(r.top<line&&r.bottom>0){el.style.setProperty("--reveal-delay",Math.min(i++,${MAX_STAGGER_STEPS})*${STAGGER_MS}+"ms");el.setAttribute("data-revealed","");}});}if(d.hasAttribute(${q(
  PAGE_COVERED_ATTR,
)}))addEventListener(${q(PAGE_REVEAL_EVENT)},go,{once:true});else go();}catch(e){}})();`;

/**
 * The first-visit preloader (layout.tsx explains the markup). Skipped after
 * the first visit in a session and under reduced motion. Otherwise it marks
 * the page covered, then lifts once the document is parsed and the font is
 * ready (or after 1s), firing the reveal event as it goes. It looks the
 * element up again each time it acts, in case hydration replaced it.
 */
export const preloaderScript = `(function(){try{var k=${q(PRELOADER_SESSION_KEY)},d=document.documentElement;function $(){return document.getElementById(${q(
  PRELOADER_ID,
)})||{style:{}};}if(!document.getElementById(${q(PRELOADER_ID)}))return;if(sessionStorage.getItem(k)||matchMedia(${q(
  REDUCED_MOTION_QUERY,
)}).matches){window[${q(PRELOADER_DONE_FLAG)}]=true;$().style.display="none";return;}sessionStorage.setItem(k,"1");d.setAttribute(${q(
  PAGE_COVERED_ATTR,
)},"");var lifted=false;function lift(){if(lifted)return;lifted=true;d.removeAttribute(${q(
  PAGE_COVERED_ATTR,
)});window.dispatchEvent(new Event(${q(PAGE_REVEAL_EVENT)}));$().style.animation="page-transition-out var(--duration-page-reveal) ease forwards";setTimeout(function(){window[${q(
  PRELOADER_DONE_FLAG,
)}]=true;$().style.display="none";},500);}function ready(){(document.fonts?document.fonts.ready:Promise.resolve()).then(lift);setTimeout(lift,1000);}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready);else ready();}catch(e){}})();`;
