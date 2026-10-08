import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EmployerLogo, type Employer } from "@/components/ui/EmployerLogo";
import { textH2 } from "@/lib/type";
import { Section } from "@/components/layout/Section";

/**
 * One piece of evidence on Home, in the order an argument goes: the claim
 * as a statement, the figure that shows it, then one short explanation
 * beside the concrete result, and the case study behind it. Home stacks
 * three (architecture, product and UX, accessibility) in place of a list of
 * capabilities.
 *
 * The figure is the section's centerpiece, at full width and not inside a
 * card; it reveals on its own so it fades in when it's reached. The result
 * is the one thing marked in `accent`, since it's the outcome the figure
 * leads to. It's set in the flat 20px `text-h5`: the responsive h5 steps
 * down to 14px on phones, below the body text beside it.
 *
 * White by default. `onGradient` sets it on the page gradient, with the
 * content on a white sheet so the figures' ink and line colors don't
 * change.
 */
export function ProofFeature({
  employer,
  kicker,
  title,
  body,
  result,
  href,
  linkLabel,
  evidence,
  onGradient = false,
}: {
  employer: Employer;
  kicker: string;
  title: string;
  body: string;
  result: string;
  href: string;
  linkLabel: string;
  evidence: ReactNode;
  onGradient?: boolean;
}) {
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-x-space-2 gap-y-space-1 text-subtle">
        <EmployerLogo employer={employer} labelled className="[--logo-h:1.5rem]" />
        <span aria-hidden="true" className="hidden sm:inline">
          ·
        </span>
        <p className="w-full text-label text-muted sm:w-auto">{kicker}</p>
      </div>
      <h2 className={`mt-space-3 max-w-3xl text-ink ${textH2}`}>{title}</h2>
      <RevealOnScroll className="mt-space-5">{evidence}</RevealOnScroll>
      <div className="mt-space-5 grid gap-space-4 border-t border-hairline pt-space-4 md:grid-cols-2 md:gap-space-5">
        <p className="max-w-xl text-body text-muted">{body}</p>
        <div>
          <div className="flex gap-space-2">
            <span aria-hidden="true" className="w-1 shrink-0 rounded-pill bg-accent" />
            <div>
              <p className="text-label text-accent">Result</p>
              <p className="mt-space-1 text-h5 text-ink">{result}</p>
            </div>
          </div>
          <div className="mt-space-4">
            <Button href={href} variant="bordered">
              {linkLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Section ground={onGradient ? "gradient" : "surface"}>
      {onGradient ? <div className="rounded-xl bg-surface p-space-3 sm:p-space-5">{content}</div> : content}
    </Section>
  );
}
