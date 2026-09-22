import type { ReactNode } from "react";
import { textH5 } from "@/lib/type";

/**
 * Production form of ProductCategoryCard: same 24px radius, same real
 * padding (16px mobile / 24px desktop), and the same ripple hover
 * (motion.md) — 0.8s ease-out, scale(1→3)/opacity(0.6→0), mix-blend-mode:
 * multiply, hover-capable-pointers-only, approximated with a
 * radial-gradient since the source's ripple.png texture was never
 * captured.
 *
 * Correction: the real card surface is a translucent white glass tint
 * (`#FFFFFF1A` fill + border), not a filled `surface-raised` gray box —
 * but that treatment only reads on a colored/dark ground (see
 * ProductCategoryCard/README.md), and this card sits on a plain white
 * page. Inverted to an ink-tinted equivalent at the same real 10%
 * opacity so the "barely-there glass" character survives on a light
 * ground instead of disappearing.
 */
export function EvidenceCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-ink/10 bg-ink/3 p-space-2 sm:p-space-3
        after:pointer-events-none after:absolute after:left-1/2 after:top-1/2 after:z-10
        after:aspect-square after:w-full after:-translate-x-1/2 after:-translate-y-1/2
        after:scale-0 after:rounded-full after:opacity-0 after:content-['']
        after:[background:radial-gradient(circle,var(--color-primary)_0%,transparent_70%)]
        after:[mix-blend-mode:multiply]
        hover:after:animate-ripple"
    >
      <h3 className={`text-ink ${textH5}`}>{title}</h3>
      <div className="mt-space-2 text-body text-ink/72">{children}</div>
    </div>
  );
}
