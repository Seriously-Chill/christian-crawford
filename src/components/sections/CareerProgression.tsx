import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { textH4 } from "@/lib/type";

/**
 * Spec section 7: not a résumé timeline immediately visible on the page —
 * a progressive-disclosure narrative (RevealOnScroll, staggered) tracing
 * the real design → implementation → systems → architecture arc without
 * naming it that literally. Every date, employer, and technology below is
 * from the source résumé (spec section 11) — nothing invented.
 */
const eras = [
  {
    range: "2005–2008",
    role: "Web Designer",
    org: "Ginghamsburg Church",
    body:
      "Built an organization's first cohesive digital identity from nothing, in TYPO3 — web design, multimedia, and the print/digital standards that held it together.",
  },
  {
    range: "2008–2013",
    role: "Multimedia Designer, then Creative Manager",
    org: "Trivantis",
    body:
      "Interactive web and eLearning experiences in Flash and ActionScript, then Drupal and WordPress systems at scale — plus mentoring designers moving toward more technical roles.",
  },
  {
    range: "2013–2016",
    role: "Senior Application Developer, then UI Developer",
    org: "CBTS · Kroger",
    body:
      "Full-stack applications in C#/Razor, then enterprise UI work — responsive interfaces and a real migration path off WebSphere and onto AngularJS.",
  },
  {
    range: "2017–2021",
    role: "Frontend Developer, then Senior Consultant",
    org: "Ingage Partners",
    body:
      "10+ client engagements — React, Angular, JAMstack — where the job kept expanding from building interfaces to owning how frontend systems were structured and maintained.",
  },
  {
    range: "2022–Present",
    role: "Senior Software Engineer",
    org: "HealthWarehouse.com",
    body:
      "Frontend architecture for complex healthcare products — Next.js, React, GraphQL, configuration-driven platforms — and, more recently, how AI-assisted development changes what that architecture needs to hold up.",
  },
];

export function CareerProgression() {
  return (
    <section id="evolution" className="bg-surface">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7">
        <ol className="space-y-space-5 border-l border-ink/10 pl-space-4">
          {eras.map((era, i) => (
            <li key={era.range}>
              <RevealOnScroll delayMs={i * 100}>
                <p className="text-label text-ink/60">
                  {era.range} · {era.org}
                </p>
                <h2 className={`mt-space-1 text-ink ${textH4}`}>{era.role}</h2>
                <p className="mt-space-2 max-w-xl text-body text-ink/72">{era.body}</p>
              </RevealOnScroll>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
