/**
 * The default (spruce) theme, the site's signature color, for the places
 * CSS can't reach: the share image, the web manifest, and the color
 * picker's spruce stop all read it from here. Two copies can't import it
 * and have to be kept in step by hand: the first-paint fallbacks in
 * globals.css (the HSL values) and src/app/icon.svg (the hex values).
 *
 * A deep green-teal ground with white text: white keeps ≥4.5:1 at 80% even
 * on glass at the gradient's lighter end. `accent` is the same hue, lighter
 * than primary so it reads as a color rather than as ink on white (6.5:1).
 */
export const DEFAULT_THEME = {
  primaryHue: 186,
  secondaryHue: 170,
  primarySaturation: 42,
  secondarySaturation: 38,
  primaryLightness: 18,
  secondaryLightness: 26,
  accentLightness: 30,
  /** The same colors as they render. */
  primary: "#1b3d41",
  secondary: "#295b53",
  accent: "#2c666d",
  onHeader: "#ffffff",
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
