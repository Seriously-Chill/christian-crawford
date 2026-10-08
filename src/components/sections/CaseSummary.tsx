import { Section } from "@/components/layout/Section";
import { textH2 } from "@/lib/type";

type Part = { text: string; href: string; linkLabel: string };

const parts = [
  { key: "problem", label: "Problem" },
  { key: "rule", label: "Rule" },
  { key: "proof", label: "Proof" },
] as const;

/**
 * The 30-second path at the top of a case study: the problem, the rule I
 * worked to, and the proof that it held, each linking down to the section
 * that argues it in full. Three plain columns divided by a top rule rather
 * than cards; the proof's rule is `accent`, since it's the outcome the
 * other two lead to. One column per row on phones.
 */
export function CaseSummary({ problem, rule, proof }: { problem: Part; rule: Part; proof: Part }) {
  const content = { problem, rule, proof };
  return (
    <Section aria-labelledby="case-summary-heading">
      <h2 id="case-summary-heading" className={`text-ink ${textH2}`}>
        The short version.
      </h2>
      <dl className="mt-space-5 grid gap-space-4 md:grid-cols-3 md:gap-space-5">
        {parts.map(({ key, label }) => (
          <div
            key={key}
            className={`border-t-2 pt-space-3 ${key === "proof" ? "border-accent" : "border-hairline"}`}
          >
            <dt className={`text-label ${key === "proof" ? "text-accent" : "text-muted"}`}>{label}</dt>
            <dd className="mt-space-2 text-body text-ink">
              {content[key].text}
              <a
                href={content[key].href}
                className="mt-space-2 block text-label text-accent underline underline-offset-4"
              >
                {content[key].linkLabel}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
