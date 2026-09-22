import type { ReactNode } from "react";
import { textH5 } from "@/lib/type";

/**
 * Production form of ProductCategoryCard's real ripple hover (motion.md):
 * same 0.8s ease-out, scale(1→3)/opacity(0.6→0), mix-blend-mode: multiply,
 * hover-capable-pointers-only pulse — approximated with a radial-gradient
 * the same way the Design System's own preview does, since the source's
 * ripple.png texture was never captured (see motion.md).
 */
export function EvidenceCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-surface-raised p-space-3
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
