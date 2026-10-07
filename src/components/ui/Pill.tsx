import type { ReactNode } from "react";

type Tone = "default" | "on-gradient" | "on-accent";

const tones: Record<Tone, string> = {
  default: "border-line text-muted",
  "on-gradient": "border-on-header-line text-on-header-muted",
  "on-accent": "border-on-accent-line text-surface",
};

/**
 * The site's one label pill: a tag, a step, a file name. Not a control;
 * a pill that does something is a `Button`. Tags and StepChain are built
 * on it, and so is every pill in a diagram, so the shape changes here.
 *
 *  - `tone`: `default` on white, `on-gradient` on the page gradient,
 *    `on-accent` on an `accent` fill (the AI banner)
 *  - `filled`: a `surface` fill, for pills that sit on a tinted panel
 *  - `compact`: `space-1` side padding, for long labels in a narrow column
 */
export function Pill({
  as: Tag = "span",
  tone = "default",
  filled = false,
  compact = false,
  className = "",
  children,
}: {
  as?: "span" | "li";
  tone?: Tone;
  filled?: boolean;
  compact?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={`rounded-pill border ${tones[tone]} ${filled ? "bg-surface" : ""} ${
        compact ? "px-space-1" : "px-space-2"
      } py-1 text-label ${className}`}
    >
      {children}
    </Tag>
  );
}
