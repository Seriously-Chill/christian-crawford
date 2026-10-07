/**
 * The default (gray) theme, for the places CSS can't reach: the share image,
 * the web manifest, and the color picker's gray stop all read it from here.
 * Two copies can't import it and have to be kept in step by hand: the
 * first-paint fallbacks in globals.css (the lightness values) and
 * src/app/icon.svg (the hex values).
 */
export const DEFAULT_THEME = {
  /** HSL lightness of primary and secondary; hue 240, saturation 0. */
  primaryLightness: 32,
  secondaryLightness: 46.27,
  /** The same two colors as they render. */
  primary: "#525252",
  secondary: "#767676",
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
