import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { textH2 } from "@/lib/type";

/**
 * One narrative beat: an optional kicker, an h2, optional body copy, and a
 * slot for diagrams, cards or a call to action, revealed after the text.
 * Every part of both case studies is one, as is most of `/ai` and the
 * teaser sections on Home and `/about`.
 *
 * White by default. `onGradient` sets it on the page gradient with
 * `on-header` text; children on it pass their own `onGradient`.
 */
export function NarrativeSection({
  kicker,
  title,
  body,
  children,
  id,
  onGradient = false,
}: {
  kicker?: string;
  title: string;
  body?: string;
  children?: ReactNode;
  id?: string;
  onGradient?: boolean;
}) {
  const muted = onGradient ? "text-on-header/80" : "text-ink/72";
  return (
    <section id={id} className={onGradient ? "bg-page-gradient" : "bg-surface"}>
      <div className="mx-auto max-w-5xl px-space-3 py-space-6">
        <RevealOnScroll>
          {kicker ? <p className={`text-label ${onGradient ? "text-on-header/80" : "text-accent"}`}>{kicker}</p> : null}
          <h2
            className={`${kicker ? "mt-space-2 lg:mt-space-3" : ""} ${onGradient ? "text-on-header" : "text-accent"} ${textH2}`}
          >
            {title}
          </h2>
          {body ? <p className={`mt-space-3 max-w-xl text-body lg:mt-space-4 ${muted}`}>{body}</p> : null}
        </RevealOnScroll>
        {children ? <RevealOnScroll className="mt-space-5">{children}</RevealOnScroll> : null}
      </div>
    </section>
  );
}
