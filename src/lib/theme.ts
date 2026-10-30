/**
 * The default Aqua theme, the site's signature color, for the places
 * CSS can't reach: the share image, the web manifest, and the color
 * picker's Aqua hue all read it from here. Two copies can't import it
 * and have to be kept in step by hand: the first-paint fallbacks in
 * globals.css (the HSL values) and src/app/icon.svg (the hex values).
 *
 * The Aqua hue uses light blue and turquoise grounds with dark ink text.
 * These values match the color picker's Aqua preset so first paint, share
 * cards, and the manifest all use the same theme.
 */
export const DEFAULT_THEME = {
  primaryHue: 197,
  secondaryHue: 179.69,
  primarySaturation: 69.7,
  secondarySaturation: 74,
  primaryLightness: 62.6,
  secondaryLightness: 47.8,
  accentLightness: 27.5,
  /** The same colors as they render. */
  primary: "#5dbce2",
  secondary: "#20d4d3",
  accent: "#155b77",
  onHeader: "#1b1b1d",
} as const;

/**
 * localStorage key holding the color picker's chosen custom properties as a
 * `{ "--name": "value" }` JSON object. ColorPicker writes it; the inline
 * script below applies it to <html> while the document is still parsing, so
 * a saved color is painted from the first frame instead of flashing the
 * default until React hydrates.
 */
export const THEME_STORAGE_KEY = "cc-theme";

// Only `--`-prefixed names are applied, so a tampered or stale value can't
// set arbitrary style properties.
export const themeInitScript = `(function(){try{var v=JSON.parse(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})||"null");if(!v||typeof v!=="object")return;var s=document.documentElement.style;for(var k in v){if(k.indexOf("--")===0&&typeof v[k]==="string")s.setProperty(k,v[k]);}}catch(e){}})();`;
