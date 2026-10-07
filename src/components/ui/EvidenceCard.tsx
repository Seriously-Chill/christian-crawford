import type { ReactNode } from "react";
import { textH4 } from "@/lib/type";

/**
 * `onGradient` is for colored sections: a translucent white glass tint plus
 * the ripple hover (docs/design-system/motion.md), on hover-capable pointers
 * only. The default variant, for white sections, is `surface-raised` with
 * no border and no ripple.
 *
 * The ripple's texture, `public/ripple.png`, carries its ring shape almost
 * entirely in its alpha channel (its RGB is nearly pure white), so painting
 * it as a `background-image` can't darken anything, even under
 * `mix-blend-mode: multiply`: multiplying by white is a no-op. It's used
 * as a `mask-image` instead, which only reads alpha, over a low-opacity
 * `ink` fill that `multiply` can darken with; `blur-xl` softens the mask's
 * hard edge into a diffuse glow.
 *
 * The ripple is sized to the card's height, not its width: these are short,
 * wide text cards, so width-based sizing would blow the texture up past the
 * card and `overflow-hidden` would crop it to its bright, ringless center.
 * Sizing to the smaller dimension keeps the rings in frame.
 */
export function EvidenceCard({
  title,
  children,
  onGradient = false,
}: {
  title: string;
  children: ReactNode;
  onGradient?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg p-space-2 sm:p-space-3
        ${
          onGradient
            ? `glass
               after:pointer-events-none after:absolute after:left-1/2 after:top-1/2 after:z-10
               after:aspect-square after:h-full after:-translate-x-1/2 after:-translate-y-1/2
               after:scale-0 after:opacity-0 after:content-[''] after:bg-ink/25 after:blur-xl
               after:mask-[url('/ripple.png')] after:mask-center after:mask-contain after:mask-no-repeat
               after:mix-blend-multiply hover:after:animate-ripple`
            : "bg-surface-raised"
        }`}
    >
      <h3 className={`${onGradient ? "text-on-header" : "text-ink"} ${textH4}`}>{title}</h3>
      <div className={`mt-space-2 text-body ${onGradient ? "text-on-header-muted" : "text-muted"}`}>{children}</div>
    </div>
  );
}
