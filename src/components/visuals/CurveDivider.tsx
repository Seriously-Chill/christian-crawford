import { useId } from "react";

type Tone = "surface" | "primary" | "gradient-page" | "gradient-header";

const belowBg: Record<Tone, string> = {
  surface: "bg-surface",
  primary: "bg-primary",
  "gradient-page": "bg-page-gradient",
  "gradient-header": "bg-header-gradient",
};

const flatFill: Partial<Record<Tone, string>> = {
  surface: "var(--color-surface)",
  primary: "var(--color-primary)",
};

/**
 * A small, shallow "upward bow" between two sections, sitting in normal
 * document flow (no absolute positioning or negative margins needed) —
 * `below` sets its own background (the section that follows), `above`
 * sets the dome shape drawn on top of it (the section before it), so the
 * boundary reads as the upper section's color bowing gently up into the
 * lower one at the center, full depth at the edges. Deliberately shallow
 * (a single quadratic curve, ~24px of deviation) — not a wave or blob,
 * and only used where two genuinely different tones actually meet.
 *
 * The two gradient tones fill the dome with an SVG `<linearGradient>`
 * built from the same `--color-primary`/`--color-secondary` custom
 * properties every other gradient on the site uses (not a baked hex
 * copy), so the hue picker (`ColorPicker.tsx`) updates these curves too,
 * automatically, with no separate logic.
 */
export function CurveDivider({
  above,
  below,
  className = "",
}: {
  above: Tone;
  below: Tone;
  className?: string;
}) {
  const id = useId();
  const isGradient = above === "gradient-page" || above === "gradient-header";
  const stopOpacity = above === "gradient-header" ? 0.9 : 1;

  return (
    <div aria-hidden="true" className={`h-4 w-full sm:h-6 ${belowBg[below]} ${className}`}>
      <svg viewBox="0 0 200 24" preserveAspectRatio="none" className="block h-full w-full">
        {isGradient ? (
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={stopOpacity} />
              <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={stopOpacity} />
            </linearGradient>
          </defs>
        ) : null}
        <path d="M0,24 Q100,0 200,24 L200,0 L0,0 Z" fill={isGradient ? `url(#${id})` : flatFill[above]} />
      </svg>
    </div>
  );
}
