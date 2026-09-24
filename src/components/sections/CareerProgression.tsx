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
      "Created the organization’s first cohesive digital presence in TYPO3, bringing its website, multimedia, and print and digital standards together.",
  },
  {
    range: "2008–2013",
    role: "Multimedia Designer, then Creative Manager",
    org: "Trivantis",
    body:
      "Built interactive web and eLearning experiences, then worked on Drupal and WordPress platforms. As Creative Manager, I also mentored designers growing into more technical roles.",
  },
  {
    range: "2013–2016",
    role: "Senior Application Developer, then UI Developer",
    org: "CBTS · Kroger",
    body:
      "Built full-stack applications with C# and Razor, then moved into enterprise UI development at Kroger, contributing to responsive interfaces and the transition from WebSphere to AngularJS.",
  },
  {
    range: "2017–2021",
    role: "Frontend Developer, then Senior Consultant",
    org: "Ingage Partners",
    body:
      "Across more than ten client engagements, I built with React, Angular, and JAMstack tools. The work grew from delivering interfaces to shaping how frontend systems were organized and maintained.",
  },
  {
    range: "2022–Present",
    role: "Senior Software Engineer",
    org: "HealthWarehouse.com",
    body:
      "I lead frontend architecture for healthcare products built with Next.js, React, and GraphQL. The work includes a configurable pharmacy platform, accessibility and testing improvements, and practical standards for AI-assisted development within HealthWarehouse’s own codebases.",
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
