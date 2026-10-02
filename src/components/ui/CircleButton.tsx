import type { MouseEventHandler } from "react";
import { LineIcon, type IconName } from "@/components/ui/LineIcon";

/**
 * Round icon-only controls (the logo strip's back, pause, and forward):
 * `radius-circle`, a hairline border, an icon only, hover filling with
 * `accent` the way `Button` does. Icon-only, so `label` is required and
 * becomes the accessible name.
 */
export function CircleButton({
  icon,
  label,
  onClick,
  pressed,
}: {
  icon: IconName;
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className="flex size-10 items-center justify-center rounded-circle border border-ink/15 bg-surface text-ink/70 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-surface"
    >
      <LineIcon name={icon} className="size-5" />
    </button>
  );
}
