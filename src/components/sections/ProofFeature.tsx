import { Button } from "@/components/ui/Button";
import { Tags } from "@/components/ui/Tags";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EmployerLogo, type Employer } from "@/components/ui/EmployerLogo";
import { FeaturePanel } from "@/components/ui/FeaturePanel";
import { textH2, textH3 } from "@/lib/type";

/**
 * One piece of evidence on Home: a contained feature panel on white, with
 * the problem and what I did on one side and what came of it on the other.
 * Home stacks three of these (architecture, product and UX, quality) in
 * place of a list of capabilities, so each claim arrives with its proof and
 * a link to the case study behind it. `flip` puts the outcomes on the left
 * from `md` up, so a stack of panels alternates instead of repeating.
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
}) {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-space-3 pt-space-7">
        <RevealOnScroll>
          <FeaturePanel>
            <div className={flip ? "md:order-2" : undefined}>
              <div className="flex text-ink/60">
                <EmployerLogo employer={employer} labelled className="[--logo-h:2rem]" />
              </div>
              <p className="mt-space-2 text-label text-accent">{kicker}</p>
              <h2 className={`mt-space-2 max-w-xl text-accent ${textH2}`}>{title}</h2>
              <p className="mt-space-3 max-w-md text-body lg:mt-space-4 text-ink/72">{body}</p>
              <Tags items={tags} />
              <div className="mt-space-4">
                <Button href={href} variant="bordered">
                  {linkLabel}
                </Button>
              </div>
            </div>
            <ul aria-label="What came of it" className="space-y-space-2">
              {outcomes.map((item) => (
                <li key={item.value} className="rounded-lg border border-ink/10 bg-surface p-space-2 sm:p-space-3">
                  <p className={`text-accent ${textH3}`}>{item.value}</p>
                  <p className="mt-1 text-body text-ink/72">{item.label}</p>
                </li>
              ))}
            </ul>
          </FeaturePanel>
        </RevealOnScroll>
      </div>
    </section>
  );
}
