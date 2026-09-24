import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { textH2 } from "@/lib/type";

/**
 * Generic kicker/title/body + children slot for the HealthWarehouse case
 * study's narrative beats — same shape as `NarrativeTeaser`, minus the
 * forced CTA, reused across Problem/Architecture/Evidence/Product/Result/
 * Role instead of one bespoke component per section.
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
        <RevealOnScroll className="text-center">
          {kicker ? <p className="text-label text-accent">{kicker}</p> : null}
          <h2 className={`mt-space-2 text-ink ${textH2}`}>{title}</h2>
          {body ? <p className="mx-auto mt-space-3 max-w-xl text-body text-ink/72">{body}</p> : null}
        </RevealOnScroll>
        {children ? (
          <RevealOnScroll delayMs={100} className="mt-space-5">
            {children}
          </RevealOnScroll>
        ) : null}
      </div>
    </section>
  );
}
