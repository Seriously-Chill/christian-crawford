import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Tags } from "@/components/ui/Tags";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EmployerLogo, type Employer } from "@/components/ui/EmployerLogo";
import { FeaturePanel } from "@/components/ui/FeaturePanel";
import { textH2, textH3 } from "@/lib/type";
import { Section } from "@/components/layout/Section";

/**
 * One piece of evidence on Home: a contained feature panel on white, with
 * the problem and what I did on one side and what came of it on the other.
 * Home stacks three of these (architecture, product and UX, quality) in
 * place of a list of capabilities, so each claim arrives with its proof and
 * a link to the case study behind it. `flip` puts the outcomes on the left
 * from `md` up, so a stack of panels alternates instead of repeating.
 * `onGradient` sets the section on the page gradient instead of white; the
 * panel itself stays light, so its text colors and contrast don't change.
 * `evidence` is a figure that shows the claim rather than restating it; it
 * spans the panel's full width under both columns, and reveals on its own
 * so it fades in when it's reached, not with the top of the panel.
 */
export function ProofFeature({
  employer,
  kicker,
  title,
  body,
  tags,
  href,
  linkLabel,
  outcomes,
  flip = false,
  onGradient = false,
  evidence,
}: {
  employer: Employer;
  kicker: string;
  title: string;
  body: string;
  tags: string[];
  href: string;
  linkLabel: string;
  outcomes: { value: string; label: string }[];
  flip?: boolean;
  onGradient?: boolean;
  evidence?: ReactNode;
}) {
  return (
    <Section ground={onGradient ? "gradient" : "surface"}>
      <FeaturePanel>
        <div className={flip ? "md:order-2" : undefined}>
          <div className="flex text-subtle">
            <EmployerLogo employer={employer} labelled className="[--logo-h:2rem]" />
          </div>
          <p className="mt-space-2 text-label text-accent">{kicker}</p>
          <h2 className={`mt-space-2 max-w-xl text-accent ${textH2}`}>{title}</h2>
          <p className="mt-space-3 max-w-md text-body lg:mt-space-4 text-muted">{body}</p>
          <Tags items={tags} />
          <div className="mt-space-4">
            <Button href={href} variant="bordered">
              {linkLabel}
            </Button>
          </div>
        </div>
        <RevealOnScroll>
          <ul aria-label="What came of it" className="space-y-space-4">
            {outcomes.map((item) => (
              <li key={item.value}>
                <p className={`text-accent ${textH3}`}>{item.value}</p>
                <p className="mt-1 text-body text-muted">{item.label}</p>
              </li>
            ))}
          </ul>
        </RevealOnScroll>
        {evidence ? (
          <RevealOnScroll className="border-t border-hairline pt-space-4 md:order-3 md:col-span-2 md:pt-space-5">
            {evidence}
          </RevealOnScroll>
        ) : null}
      </FeaturePanel>
    </Section>
  );
}
