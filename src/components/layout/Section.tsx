import type { HTMLAttributes, ReactNode } from "react";

type Ground = "surface" | "gradient" | "header-gradient";
type Spacing = "md" | "lg" | "end";

const grounds: Record<Ground, string> = {
  surface: "bg-surface",
  gradient: "bg-page-gradient",
  "header-gradient": "bg-header-gradient",
};

const spacings: Record<Spacing, string> = {
  md: "py-space-6",
  lg: "py-space-7",
  end: "pb-space-7",
};

/**
 * Every page section's frame: the full-width ground, and inside it the
 * centered content column with the page gutter. Change the column width,
 * gutter or section padding here and every section follows.
 *
 *  - `ground`: what the section is painted with. A white section paints
 *    `surface` itself, since the page canvas underneath is the gradient.
 *  - `spacing`: `md` for narrative sections and intros, `lg` for sections
 *    that stand alone, `end` for one that continues the section above it
 *    and only needs padding at the bottom.
 *  - `after`: full-width content below the column, still inside the
 *    section, such as a `CurveDivider` that belongs to its ground.
 *
 * The ground sits on the full-width `<section>`, never the column: a
 * gradient spans whatever element carries it, so on the column it would
 * restart at the column's edges and leave a seam against the page's.
 */
export function Section({
  ground = "surface",
  spacing = "md",
  className = "",
  innerClassName = "",
  after,
  children,
  ...rest
}: {
  ground?: Ground;
  spacing?: Spacing;
  className?: string;
  innerClassName?: string;
  after?: ReactNode;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  return (
    <section className={`${grounds[ground]} ${className}`} {...rest}>
      <div className={`mx-auto max-w-content px-space-3 ${spacings[spacing]} ${innerClassName}`}>{children}</div>
      {after}
    </section>
  );
}
