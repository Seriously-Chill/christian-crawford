import type { HTMLAttributes, ReactNode } from "react";

type Tone = "frame" | "item" | "highlight";

const tones: Record<Tone, string> = {
  frame: "border-hairline",
  item: "border-line",
  highlight: "border-accent",
};

/**
 * The bordered box every HTML diagram is built from, so diagram boxes look
 * and change as one.
 *
 *  - frame: a lighter edge for a container that holds other boxes or a chart
 *  - item: one step, node or state inside a diagram
 *  - highlight: the step the diagram leads to, in `accent`
 *
 * `raised` fills it with `surface-raised` instead of `surface`, for boxes
 * that sit inside a white frame. `compact` keeps `space-2` padding at every
 * width, and `small` uses `radius-md`, for short steps in a narrow column.
 * Illustrations of a screen (BrandConfigDiagram's brand cards,
 * PortalShapingDiagram's orders list) are drawn on their own, not with this.
 */
export function DiagramBox({
  as: Tag = "div",
  tone = "item",
  raised = false,
  compact = false,
  small = false,
  className = "",
  children,
  ...rest
}: {
  as?: "div" | "li" | "section";
  tone?: Tone;
  raised?: boolean;
  compact?: boolean;
  small?: boolean;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={`${small ? "rounded-md" : "rounded-lg"} border ${tones[tone]} ${raised ? "bg-surface-raised" : "bg-surface"} ${
        compact ? "p-space-2" : "p-space-2 sm:p-space-3"
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
