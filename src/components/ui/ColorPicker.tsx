"use client";

import { useEffect, useRef } from "react";

const STORAGE_KEY = "cc-hue";
const DEFAULT_HUE_PRIMARY = 211.68;
const HUE_OFFSET = 211.68 - 194.37; // real, sourced gap between primary/secondary hues
const SAT_PRIMARY = 69.7;
const SAT_SECONDARY = 73.96;
const BASE_L_PRIMARY = 45.29;
const BASE_L_SECONDARY = 62.35;
const MIN_CONTRAST = 4.5;

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [r + m, g + m, b + m];
}

function relativeLuminance(h: number, s: number, l: number) {
  const [r, g, b] = hslToRgb(h, s, l);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

// White text's own luminance is 1 — solve the WCAG contrast formula for the
// max background luminance that still clears `MIN_CONTRAST`, then binary
// search for the highest HSL lightness (at this hue/saturation) that stays
// at or under it. Guarantees on-header white text stays readable at every
// hue on the wheel, not just the ones close to the real sourced blue.
function maxSafeLightness(hue: number, saturation: number, baseline: number) {
  const maxLuminance = (1 + 0.05) / MIN_CONTRAST - 0.05;
  if (relativeLuminance(hue, saturation, baseline) <= maxLuminance) return baseline;
  let lo = 0;
  let hi = baseline;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (relativeLuminance(hue, saturation, mid) <= maxLuminance) lo = mid;
    else hi = mid;
  }
  return lo;
}

function applyHue(hue: number) {
  const secondaryHue = hue - HUE_OFFSET;
  const lPrimary = maxSafeLightness(hue, SAT_PRIMARY, BASE_L_PRIMARY);
  const lSecondary = maxSafeLightness(secondaryHue, SAT_SECONDARY, BASE_L_SECONDARY);
  const root = document.documentElement.style;
  root.setProperty("--hue-primary", String(hue));
  root.setProperty("--hue-secondary", String(secondaryHue));
  root.setProperty("--l-primary", `${lPrimary}%`);
  root.setProperty("--l-secondary", `${lSecondary}%`);
}

/**
 * Small, playful gradient-hue picker — not a theme switch, just one slider
 * that rotates `--color-primary`/`--color-secondary` (see globals.css)
 * together across the full hue wheel, keeping each color's own real
 * saturation and clamping lightness per-hue so on-header white text stays
 * at or above 4.5:1 contrast everywhere on the wheel (some hues, yellow/
 * green especially, read far lighter than blue at the same raw lightness).
 * Built on native `<details>/<summary>` for free keyboard and
 * screen-reader disclosure semantics — no custom popover/ARIA needed.
 * Persists to localStorage; reduced-motion is handled for free by the
 * sitewide `prefers-reduced-motion` rule in globals.css, which already
 * collapses any transition this triggers to near-instant.
 */
export function ColorPicker() {
  // Uncontrolled on purpose: the slider's value and the CSS custom
  // properties it drives are both DOM state, not something this
  // component's own JSX needs to re-render for — so restoring the saved
  // hue on mount is a direct ref/DOM write inside the effect, not a
  // `setState` call. (`localStorage` doesn't exist during the server
  // render, so this can only happen post-hydration either way.)
  const inputRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored !== null ? Number(stored) : NaN;
    const initial = Number.isFinite(parsed) ? parsed : DEFAULT_HUE_PRIMARY;
    if (inputRef.current) inputRef.current.value = String(initial);
    applyHue(initial);
  }, []);

  // Native <details> only closes via its own <summary> toggle — this adds
  // the click-outside-to-close behavior visitors expect from a popover,
  // as a direct DOM write (`.open = false`), not React state.
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (detailsRef.current?.open && !detailsRef.current.contains(e.target as Node)) {
        detailsRef.current.open = false;
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function handleChange(next: number) {
    applyHue(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  }

  function handleReset() {
    if (inputRef.current) inputRef.current.value = String(DEFAULT_HUE_PRIMARY);
    applyHue(DEFAULT_HUE_PRIMARY);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <details ref={detailsRef} className="relative">
      <summary
        className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-full border border-on-header/40 [&::-webkit-details-marker]:hidden"
        style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}
        aria-label="Personalize the site's color"
      >
        <span className="sr-only">Personalize the site&apos;s color</span>
      </summary>
      <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-lg border border-on-header/20 bg-primary p-space-3 shadow-lg">
        <label htmlFor="hue-picker-input" className="text-label text-on-header">
          Pick a hue
        </label>
        <input
          ref={inputRef}
          id="hue-picker-input"
          type="range"
          min={0}
          max={359}
          step={1}
          defaultValue={DEFAULT_HUE_PRIMARY}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="mt-space-2 w-full"
        />
        <button
          type="button"
          onClick={handleReset}
          className="mt-space-2 inline-block py-1 text-label text-on-header underline-offset-2 hover:underline focus-visible:underline"
        >
          Reset to default
        </button>
      </div>
    </details>
  );
}
