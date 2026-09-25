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
