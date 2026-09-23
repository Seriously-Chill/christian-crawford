import type { ReactNode } from "react";
import { textH4 } from "@/lib/type";
import { Tags } from "@/components/ui/Tags";

/**
 * Production form of ProductCategoryCard: same 24px radius, same real
 * padding (16px mobile / 24px desktop), and the real ripple hover
 * (motion.md) — 0.8s ease-out, scale(1→3.5)/opacity(0.22→0), hover-capable
 * pointers only, reproduced as a soft *darkening* pulse per the live
 * reference. The real `ripple.png` texture carries its ring shape almost
 * entirely in its *alpha* channel (its RGB is nearly pure white
 * throughout), so painting it directly as a `background-image` — even
 * under `mix-blend-mode: multiply` — can't darken anything: multiplying
 * by white is a no-op, confirmed by A/B-testing `multiply` vs `normal`
 * against the live hover state, which render identically. Using the same
 * file as a `mask-image` instead sidesteps that: a mask only reads
 * alpha, so the real ring geometry still comes from the real asset, and
 * `mix-blend-mode: multiply` on the resulting solid dark fill actually
 * darkens. A first pass at this mask approach read as a flat, hard-edged
 * disc next to the reference's soft, edge-free wash — `blur-xl` on the
 * pseudo softens that hard mask cutoff into a diffuse glow, and the fill
 * is a low `ink` opacity (not a stronger tone) to keep the whole thing
 * barely-there, matching the reference's subtlety.
 *
 * The site only ever applies this hover on the colored/blue product
 * cards, never on a white section — so it's wired to `onGradient` only.
 * The real card surface is a translucent white glass tint (`#FFFFFF1A`
 * fill + border) that likewise only reads on a colored ground (see
 * ProductCategoryCard/README.md); the default variant (used on `/work`'s
 * Complexity section, which sits on a plain white page) gets an
 * ink-tinted equivalent at the same real 10% opacity and no ripple.
 *
 * The ripple's base size is `h-full` (the card's *height*), not `w-full`
 * like the real card uses — the real card is nearly square (591×521px),
 * so sizing to width barely clips the texture's outer rings. Ours is a
 * short, wide text card (no product photo under the copy), so the same
 * width-based sizing would blow the square up far past the card's
 * height, and `overflow-hidden` would crop it down to just the
 * texture's bright, ringless center — a solid white-looking patch
 * instead of the real delicate concentric rings. Sizing to the smaller
 * dimension keeps the whole texture, rings included, in frame.
 *
 * Alignment/title scale corrected against a live re-measurement of the
 * real card (getComputedStyle on the rendered site, not just its CSS
 * text): the card is a centered flex column — title, body, and button all
 * `text-align: center` — and the title itself measures 28px/500 (this
 * design system's `h4` tier), not the smaller `h5` this previously used.
 * ProductCategoryCard/README.md didn't document alignment at all and
 * named the wrong tier for the title — both corrected there too.
 */
export function EvidenceCard({
  title,
  children,
  tags,
  onGradient = false,
}: {
  title: string;
  children: ReactNode;
  tags?: string[];
  onGradient?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg p-space-2 text-center sm:p-space-3
        ${
          onGradient
            ? `border border-on-header/10 bg-on-header/10
               after:pointer-events-none after:absolute after:left-1/2 after:top-1/2 after:z-10
               after:aspect-square after:h-full after:-translate-x-1/2 after:-translate-y-1/2
               after:scale-0 after:opacity-0 after:content-[''] after:bg-ink/25 after:blur-xl
               after:mask-[url('/ripple.png')] after:mask-center after:mask-contain after:mask-no-repeat
               after:mix-blend-multiply hover:after:animate-ripple`
            : "border border-ink/10 bg-ink/3"
        }`}
    >
      <h3 className={`${onGradient ? "text-on-header" : "text-ink"} ${textH4}`}>{title}</h3>
      <div className={`mt-space-2 text-body ${onGradient ? "text-on-header/80" : "text-ink/72"}`}>{children}</div>
      {tags ? <Tags items={tags} onGradient={onGradient} align="center" /> : null}
    </div>
  );
}
