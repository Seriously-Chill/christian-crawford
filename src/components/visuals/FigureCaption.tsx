import type { ReactNode } from "react";

/** The caption under every diagram and evidence figure. `id` names the figure. */
export function FigureCaption({ id, children }: { id: string; children: ReactNode }) {
  return (
    <figcaption id={id} className="mt-space-3 max-w-xl text-body text-ink/72">
      {children}
    </figcaption>
  );
}
