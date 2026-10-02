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
 * A shallow upward bow where two genuinely different tones meet, in normal
 * document flow: `below` is the following section's background, `above` the
 * dome drawn over it. The dome's `<linearGradient>` uses the same
 * `--color-primary`/`--color-secondary` properties as every other gradient,
 * so the color picker updates it too.
 */
export function CurveDivider({
  above,
  below,
}: {
  above: Tone;
  below: Tone;
}) {
  const id = useId();
  const isGradient = above === "gradient-page" || above === "gradient-header";
  const stopOpacity = above === "gradient-header" ? 0.9 : 1;

  return (
    <div aria-hidden="true" className={`h-4 w-full sm:h-6 ${belowBg[below]}`}>
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
