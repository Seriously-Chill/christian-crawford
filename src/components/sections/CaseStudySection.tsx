import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { textH2 } from "@/lib/type";

/**
 * One narrative beat of the HealthWarehouse case study (Problem,
 * Architecture, Evidence, Role): the same shape as `NarrativeTeaser`, minus
 * the forced CTA.
 */
export function CaseStudySection({
  kicker,
  title,
  body,
  children,
  id,
}: {
  kicker?: string;
  title: string;
  body?: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="bg-surface">
      <div className="mx-auto max-w-5xl px-space-3 py-space-6">
        <RevealOnScroll>
          {kicker ? <p className="text-label text-accent">{kicker}</p> : null}
          <h2 className={`mt-space-2 text-accent lg:mt-space-3 ${textH2}`}>{title}</h2>
          {body ? <p className="mt-space-3 max-w-xl lg:mt-space-4 text-body text-ink/72">{body}</p> : null}
        </RevealOnScroll>
        {children ? (
          <RevealOnScroll className="mt-space-5">
            {children}
          </RevealOnScroll>
        ) : null}
      </div>
    </section>
  );
}
