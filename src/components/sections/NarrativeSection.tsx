import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { textH2 } from "@/lib/type";
import { Section } from "@/components/layout/Section";

/**
 * One narrative beat: an h2, optional body copy, and a slot for diagrams,
 * cards or a call to action. No kicker: the heading carries the section on
 * its own. The heading and body show at once; only the slot fades in, so
 * motion marks the evidence rather than every line of text. `body` is one
 * paragraph as a string, or several as `<p>`s.
 *
 * Every part of both case studies is one, as is most of `/ai` and the
 * teaser sections on Home and `/about`.
 *
 * White by default. `onGradient` sets it on the page gradient with
 * `on-header` text; children on it pass their own `onGradient`.
 */
export function NarrativeSection({
  title,
  body,
  children,
  id,
  onGradient = false,
}: {
  title: string;
  body?: ReactNode;
  children?: ReactNode;
  id?: string;
  onGradient?: boolean;
}) {
  const muted = onGradient ? "text-on-header-muted" : "text-muted";
  return (
    <Section id={id} ground={onGradient ? "gradient" : "surface"}>
      <h2 className={`${onGradient ? "text-on-header" : "text-accent"} ${textH2}`}>{title}</h2>
      {typeof body === "string" ? (
        <p className={`mt-space-3 max-w-xl text-body lg:mt-space-4 ${muted}`}>{body}</p>
      ) : body ? (
        <div className={`mt-space-3 max-w-xl space-y-space-3 text-body lg:mt-space-4 ${muted}`}>{body}</div>
      ) : null}
      {children ? <RevealOnScroll className="mt-space-5">{children}</RevealOnScroll> : null}
    </Section>
  );
}
