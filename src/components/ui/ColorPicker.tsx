"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const STORAGE_KEY = "cc-hue";
const DEFAULT_HUE_PRIMARY = 197; // blue-leaning aqua
const HUE_OFFSET = 211.68 - 194.37; // real, sourced gap between primary/secondary hues
const SAT_PRIMARY = 69.7;
const SAT_SECONDARY = 73.96;
const BASE_L_PRIMARY = 45.29;
const BASE_L_SECONDARY = 62.35;
// WCAG AA is 4.5:1, but the browser rounds each channel to 8 bits after
// this math — clamping to exactly 4.5 lands at 4.47–4.49 on some hues
// (caught by tests/a11y-colors.spec.ts). Aim a little high for headroom.
const MIN_CONTRAST = 4.6;

// Stored positions 0–359 are hues; past the wheel, three neutral stops,
// each a 40-wide zone (grey 360–399, white 400–439, black 440–479). The
// slider itself only covers hues now — the neutrals are swatch buttons —
// but the encoding stays, so saved choices and tests keep working.
const HUE_END = 360;
const STOP_WIDTH = 40;
const STOPS = ["grey", "white", "black"] as const;
type Stop = (typeof STOPS)[number];
const SLIDER_MAX = HUE_END + STOPS.length * STOP_WIDTH - 1;
const stopPosition = (stop: Stop) => HUE_END + STOPS.indexOf(stop) * STOP_WIDTH + STOP_WIDTH / 2;

// Fixed tokens per neutral stop. Grey keeps white on-header text at ≥4.5:1
// (46.53% is the lightest grey that does); white flips on-header and
// accent to ink, since primary itself is white there, and gives the
// white primary button an ink edge so it doesn't vanish.
const INK = "#1b1b1d";
const STOP_TOKENS: Record<
  Stop,
  {
    s: [number, number];
    l: [number, number];
    onHeader?: string;
    accent?: string;
    buttonEdge?: string;
  }
> = {
  grey: { s: [0, 0], l: [32, 46.53] },
  white: {
    s: [0, 3],
    l: [100, 85.5],
    onHeader: INK,
    accent: INK,
    buttonEdge: INK,
  },
  black: { s: [3.6, 3], l: [11, 24] },
};

function stopAt(position: number): Stop | null {
  if (position < HUE_END) return null;
  return STOPS[Math.min(STOPS.length - 1, Math.floor((position - HUE_END) / STOP_WIDTH))];
}

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

// The exact primary/secondary a hue produces — shared by the live tokens,
// the slider track and the swatches, so every preview is what you get.
function hueColors(hue: number) {
  const secondaryHue = hue - HUE_OFFSET;
  return {
    hue,
    secondaryHue,
    lPrimary: maxSafeLightness(hue, SAT_PRIMARY, BASE_L_PRIMARY),
    lSecondary: maxSafeLightness(secondaryHue, SAT_SECONDARY, BASE_L_SECONDARY),
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

function stopGradient(stop: Stop) {
  const t = STOP_TOKENS[stop];
  return `linear-gradient(135deg, hsl(240 ${t.s[0]}% ${t.l[0]}%), hsl(240 ${t.s[1]}% ${t.l[1]}%))`;
}

function hueGradient(hue: number) {
  const c = hueColors(hue);
  return `linear-gradient(135deg, hsl(${c.hue} ${SAT_PRIMARY}% ${round(c.lPrimary)}%), hsl(${round(c.secondaryHue)} ${SAT_SECONDARY}% ${round(c.lSecondary)}%))`;
}

// Gradients below reach the DOM as custom properties, never as inline
// `background`: browsers normalize an inline hsl() to rgb(), which React
// flags as a hydration mismatch. Custom property values stay verbatim.

// Hue stops every 15°, at each hue's real clamped lightness — the track
// previews the muted colors the site actually becomes, not neon.
const HUE_STOPS = Array.from({ length: 25 }, (_, i) => {
  const h = i * 15;
  return `hsl(${h} ${SAT_PRIMARY}% ${round(maxSafeLightness(h, SAT_PRIMARY, BASE_L_PRIMARY))}%)`;
});
const TRACK_GRADIENT = `linear-gradient(90deg, ${HUE_STOPS.join(", ")})`;
const RING_GRADIENT = `conic-gradient(${HUE_STOPS.join(", ")})`;

const SWATCHES: {
  id: "default" | Stop;
  label: string;
  position: number;
  background: string;
}[] = [
  {
    id: "default",
    label: "Default",
    position: DEFAULT_HUE_PRIMARY,
    background: hueGradient(DEFAULT_HUE_PRIMARY),
  },
  ...STOPS.map((stop) => ({
    id: stop,
    label: stop[0].toUpperCase() + stop.slice(1),
    position: stopPosition(stop),
    background: stopGradient(stop),
  })),
];

// The custom properties a position sets on <html>; `null` means "remove, fall
// back to globals.css". Also persisted as-is (see `THEME_STORAGE_KEY`) so the
// pre-paint script in layout.tsx can restore them without this math.
function themeVars(position: number): Record<string, string | null> {
  const stop = stopAt(position);
  if (stop) {
    const t = STOP_TOKENS[stop];
    return {
      "--hue-primary": "240",
      "--hue-secondary": "240",
      "--s-primary": `${t.s[0]}%`,
      "--s-secondary": `${t.s[1]}%`,
      "--l-primary": `${t.l[0]}%`,
      "--l-secondary": `${t.l[1]}%`,
      "--on-header": t.onHeader ?? null,
      "--accent": t.accent ?? null,
      "--button-edge": t.buttonEdge ?? null,
    };
  }
  const c = hueColors(position);
  return {
    "--hue-primary": String(c.hue),
    "--hue-secondary": String(c.secondaryHue),
    "--s-primary": `${SAT_PRIMARY}%`,
    "--s-secondary": `${SAT_SECONDARY}%`,
    "--l-primary": `${c.lPrimary}%`,
    "--l-secondary": `${c.lSecondary}%`,
    "--on-header": null,
    "--accent": null,
    "--button-edge": null,
  };
}

function applyPosition(position: number) {
  const root = document.documentElement.style;
  for (const [name, value] of Object.entries(themeVars(position))) {
    if (value === null) root.removeProperty(name);
    else root.setProperty(name, value);
  }
}

function persist(position: number) {
  try {
    if (position === DEFAULT_HUE_PRIMARY) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(THEME_STORAGE_KEY);
      return;
    }
    const vars = Object.fromEntries(Object.entries(themeVars(position)).filter(([, v]) => v !== null));
    window.localStorage.setItem(STORAGE_KEY, String(position));
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(vars));
  } catch {
    // Storage blocked (private mode, disabled site data): the choice just
    // won't survive a reload.
  }
}

function describePosition(position: number) {
  if (position === DEFAULT_HUE_PRIMARY) return "Default";
  const stop = stopAt(position);
  return stop ? stop[0].toUpperCase() + stop.slice(1) : `Hue ${position}°`;
}

/**
 * Small, playful color picker — not a theme switch. A hue slider rotates
 * `--color-primary`/`--color-secondary` (see globals.css) together across
 * the wheel, keeping each color's own real saturation and clamping
 * lightness per-hue so on-header white text stays at or above 4.5:1
 * everywhere (yellow/green read far lighter than blue at the same raw
 * lightness). A swatch row below covers the default and the grey/white/
 * black stops as one-tap presets.
 *
 * Styled to match the rest of the design system: the trigger is a hue
 * ring around a dot of the live gradient; the panel is the same
 * translucent "glass" as the cards on gradients (with a backdrop blur so
 * content behind it doesn't read through), and it grows out of its
 * trigger on open. Built on native `<details>/<summary>` for free
 * keyboard and screen-reader disclosure semantics. Persists to
 * localStorage; reduced motion is handled by the sitewide
 * `prefers-reduced-motion` rule in globals.css.
 */
export function ColorPicker() {
  // Uncontrolled on purpose: the slider value, the swatches' pressed state
  // and the CSS custom properties are all DOM state, not something this
  // component's JSX needs to re-render for — restoring the saved choice on
  // mount is a direct DOM write in the effect, not a `setState` call.
  // (`localStorage` doesn't exist during the server render either way.)
  //
  // The page's colors are already right before this runs — layout.tsx's
  // inline <head> script restores them pre-paint. This layout effect syncs
  // the picker's own controls, re-applies the tokens (dev Strict Mode's
  // remount resets <html>'s attributes), and re-persists so a choice saved
  // before the pre-paint script existed gains its stored tokens.
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const swatchRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function sync(position: number) {
    applyPosition(position);
    const input = inputRef.current;
    const stop = stopAt(position);
    if (input) {
      if (!stop) input.value = String(position);
      input.setAttribute("aria-valuetext", describePosition(Number(input.value)));
      input.dataset.inactive = stop ? "true" : "false";
    }
    if (nameRef.current) nameRef.current.textContent = describePosition(position);
    SWATCHES.forEach((swatch, i) => {
      swatchRefs.current[i]?.setAttribute("aria-pressed", String(swatch.position === position));
    });
  }

  useLayoutEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {}
    const parsed = stored !== null ? Number(stored) : NaN;
    const initial = Number.isFinite(parsed) && parsed >= 0 && parsed <= SLIDER_MAX ? parsed : DEFAULT_HUE_PRIMARY;
    sync(initial);
    persist(initial);
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

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && detailsRef.current?.open) {
      detailsRef.current.open = false;
      summaryRef.current?.focus();
    }
  }

  function choose(position: number) {
    sync(position);
    persist(position);
  }

  return (
    <details ref={detailsRef} className="group relative" onKeyDown={handleKeyDown}>
      <summary
        ref={summaryRef}
        className="relative flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 [&::-webkit-details-marker]:hidden"
        aria-label="Personalize the site's color"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-(image:--ring) transition-transform duration-700 ease-accordion group-open:rotate-180"
          style={{ "--ring": RING_GRADIENT } as CSSProperties}
        />
        <span
          aria-hidden="true"
          className="relative h-6.5 w-6.5 rounded-full border-2 border-white shadow-sm"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
          }}
        />
      </summary>
      <div className="color-panel absolute right-0 top-[calc(100%+12px)] z-50 w-64 origin-top-right rounded-lg p-space-3">
        <div className="flex items-baseline justify-between gap-space-2">
          <label htmlFor="hue-picker-input" className="text-label text-on-header">
            Color
          </label>
          <span ref={nameRef} className="text-sm text-on-header/80" aria-live="polite">
            Default
          </span>
        </div>
        <input
          ref={inputRef}
          id="hue-picker-input"
          type="range"
          min={0}
          max={HUE_END - 1}
          step={1}
          defaultValue={DEFAULT_HUE_PRIMARY}
          onChange={(e) => choose(Number(e.target.value))}
          className="color-slider mt-space-2 w-full"
          style={{ "--track": TRACK_GRADIENT } as CSSProperties}
        />
        <div
          role="group"
          aria-label="Presets"
          className="mt-space-3 flex items-center justify-between border-t border-on-header/15 pt-space-3"
        >
          {SWATCHES.map((swatch, i) => (
            <button
              key={swatch.id}
              ref={(el) => {
                swatchRefs.current[i] = el;
              }}
              type="button"
              aria-label={swatch.label}
              title={swatch.label}
              onClick={() => choose(swatch.position)}
              className="color-swatch h-9 w-9 rounded-full"
              style={{ "--swatch": swatch.background } as CSSProperties}
            />
          ))}
        </div>
      </div>
    </details>
  );
}
