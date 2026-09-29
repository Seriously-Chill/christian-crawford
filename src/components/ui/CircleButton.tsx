import type { MouseEventHandler } from "react";
import { IconGlyph, type IconName } from "@/components/ui/LineIcon";

/**
 * Round icon-only controls (the logo strip's back, pause, and forward):
 * `radius-circle`, a hairline border,
 * an icon only, hover filling with `accent` the way `Button` does. Icon-only,
 * so `label` is required and becomes the accessible name.
 *
 * `disabled` is `aria-disabled`, not the native attribute: a control that
 * becomes disabled the moment it's pressed would otherwise drop keyboard
 * focus to the page.
 */
export function CircleButton({
  icon,
  label,
  onClick,
  disabled = false,
  pressed,
}: {
  icon: IconName;
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      aria-label={label}
      aria-pressed={pressed}
      className="flex size-10 items-center justify-center rounded-circle border border-ink/15 bg-surface text-ink/70 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-surface aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:border-ink/15 aria-disabled:hover:bg-surface aria-disabled:hover:text-ink/70"
    >
      <IconGlyph name={icon} className="size-5" />
    </button>
  );
}
