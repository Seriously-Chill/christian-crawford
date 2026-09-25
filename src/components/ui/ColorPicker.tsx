"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const STORAGE_KEY = "cc-hue";
// The original blue-leaning aqua: now a preset, no longer the default.
const AQUA_HUE = 197;
const HUE_OFFSET = 211.68 - 194.37; // real, sourced gap between primary/secondary hues
const SAT_PRIMARY = 69.7;
const SAT_SECONDARY = 73.96;
// Hues are light grounds with ink text (like the white stop), so lightness
// is solved per hue for a target relative luminance rather than clamped
// under white text's ceiling — equal luminance reads as equally light
// across the wheel (yellow needs far less HSL lightness than blue). 0.44/
// 0.52 keep ink at 80% opacity ≥4.7:1 on both, even under the cards' 10%
// ink tint. Accent (hue text on white sections, focus rings) is a deep
// shade of the same hue: 0.09 is ≥7.5:1 on white and ≥3:1 against the
// gradient, so focus outlines stay visible on it. The browser rounds each
// channel to 8 bits after this math, so the targets leave headroom.
const Y_PRIMARY = 0.44;
const Y_SECONDARY = 0.52;
const Y_ACCENT = 0.09;

// Stored positions 0–359 are hues; past the wheel, three neutral stops,
// each a 40-wide zone (gray 360–399, white 400–439, black 440–479). The
// slider itself only covers hues now — the neutrals are swatch buttons —
// but the encoding stays, so saved choices and tests keep working.
const HUE_END = 360;
const STOP_WIDTH = 40;
const STOPS = ["gray", "white", "black"] as const;
type Stop = (typeof STOPS)[number];
const SLIDER_MAX = HUE_END + STOPS.length * STOP_WIDTH - 1;
const stopPosition = (stop: Stop) => HUE_END + STOPS.indexOf(stop) * STOP_WIDTH + STOP_WIDTH / 2;
// The site's default look: charcoal gray. globals.css's first-paint
// fallbacks match it, so a first visit paints gray with no flash.
const DEFAULT_POSITION = stopPosition("gray");

// Fixed tokens per neutral stop. Gray and black are the only dark grounds,
// so they flip on-header to white (46.53% is the lightest gray that keeps
// white at ≥4.5:1) and shade the picker panel with black instead of white.
// That leaves gray no headroom, so its transition name stays fully opaque.
// White sets accent to ink, since primary itself is white there, and gives
// the white primary button an ink edge so it doesn't vanish.
const INK = "#1b1b1d";
const STOP_TOKENS: Record<
  Stop,
  {
    s: [number, number];
    l: [number, number];
    onHeader?: string;
    accent?: string;
    buttonEdge?: string;
    panelShade?: string;
    fadeAlpha?: string;
  }
> = {
  gray: { s: [0, 0], l: [32, 46.53], onHeader: "#ffffff", panelShade: "#000000", fadeAlpha: "100%" },
  white: {
    s: [0, 3],
    l: [100, 85.5],
    onHeader: INK,
    accent: INK,
    buttonEdge: INK,
  },
  black: { s: [3.6, 3], l: [11, 24], onHeader: "#ffffff", panelShade: "#000000" },
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

// Binary search for the HSL lightness (at this hue/saturation) whose
// relative luminance hits `target`. Luminance rises monotonically with
// lightness, so this converges at every hue on the wheel.
function lightnessFor(hue: number, saturation: number, target: number) {
  let lo = 0;
  let hi = 100;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (relativeLuminance(hue, saturation, mid) < target) lo = mid;
    else hi = mid;
  }
  return hi;
}

// The exact primary/secondary a hue produces — shared by the live tokens,
// the slider track and the swatches, so every preview is what you get.
function hueColors(hue: number) {
  const secondaryHue = hue - HUE_OFFSET;
  return {
    hue,
    secondaryHue,
    lPrimary: lightnessFor(hue, SAT_PRIMARY, Y_PRIMARY),
    lSecondary: lightnessFor(secondaryHue, SAT_SECONDARY, Y_SECONDARY),
    lAccent: lightnessFor(hue, SAT_PRIMARY, Y_ACCENT),
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

// Hue stops every 15°, at each hue's real solved lightness — the track
// previews the colors the site actually becomes.
const HUE_STOPS = Array.from({ length: 25 }, (_, i) => {
  const h = i * 15;
  return `hsl(${h} ${SAT_PRIMARY}% ${round(lightnessFor(h, SAT_PRIMARY, Y_PRIMARY))}%)`;
});
const TRACK_GRADIENT = `linear-gradient(90deg, ${HUE_STOPS.join(", ")})`;
const RING_GRADIENT = `conic-gradient(${HUE_STOPS.join(", ")})`;

const SWATCHES: {
  id: "aqua" | Stop;
  label: string;
  position: number;
  background: string;
}[] = [
  {
    id: "aqua",
    label: "Aqua",
    position: AQUA_HUE,
    background: hueGradient(AQUA_HUE),
  },
  ...STOPS.map((stop) => ({
    id: stop,
    label: stop[0].toUpperCase() + stop.slice(1),
    position: stopPosition(stop),
    background: stopGradient(stop),
  })),
];

// The custom properties a position sets on <html>; `null` means "remove, fall
// back to globals.css". The fallbacks there are the gray default's, so
// anything gray differs on (hues' ink text, white panel shade, faded
// transition name) is set explicitly rather than left to fall back. Also
// persisted as-is (see `THEME_STORAGE_KEY`) so the
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
      "--l-accent": `${t.l[0]}%`,
      "--on-header": t.onHeader ?? null,
      "--accent": t.accent ?? null,
      "--button-edge": t.buttonEdge ?? null,
      "--panel-shade": t.panelShade ?? "#ffffff",
      "--fade-alpha": t.fadeAlpha ?? "75%",
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
    "--l-accent": `${c.lAccent}%`,
    "--on-header": INK,
    "--accent": null,
    "--button-edge": null,
    "--panel-shade": "#ffffff",
    "--fade-alpha": "75%",
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
    if (position === DEFAULT_POSITION) {
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
  if (position === AQUA_HUE) return "Aqua";
  const stop = stopAt(position);
  return stop ? stop[0].toUpperCase() + stop.slice(1) : `Hue ${position}°`;
}

/**
 * Small, playful color picker — not a theme switch. A hue slider rotates
 * `--color-primary`/`--color-secondary` (see globals.css) together across
 * the wheel, keeping each color's own real saturation and solving
 * lightness per-hue to one target luminance, so every hue is equally
 * light and ink on-header text stays above 4.5:1 everywhere (yellow/green
 * read far lighter than blue at the same raw lightness). A swatch row below covers aqua and the gray/white/
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
    const initial = Number.isFinite(parsed) && parsed >= 0 && parsed <= SLIDER_MAX ? parsed : DEFAULT_POSITION;
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
            Gray
          </span>
        </div>
        <input
          ref={inputRef}
          id="hue-picker-input"
          type="range"
          min={0}
          max={HUE_END - 1}
          step={1}
          defaultValue={AQUA_HUE}
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
