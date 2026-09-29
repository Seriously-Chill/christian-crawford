import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EmployerLogo, type Employer } from "@/components/ui/EmployerLogo";
import { textH4 } from "@/lib/type";

/**
 * The design → implementation → systems → architecture arc, told as a
 * staggered narrative rather than a résumé timeline and without naming the
 * arc literally. Every date, employer, and technology below is from the
 * résumé; nothing is invented.
 */
const eras: { range: string; role: string; org: string; logos: Employer[]; body: string }[] = [
  {
    range: "2005–2008",
    role: "Web Designer",
    org: "Ginghamsburg Church",
    logos: ["ginghamsburg"],
    body:
      "Created the organization’s first cohesive digital presence in TYPO3, bringing its website, multimedia, and print and digital standards together.",
  },
  {
    range: "2008–2013",
    role: "Multimedia Designer, then Creative Manager",
    org: "Trivantis",
    logos: ["trivantis"],
    body:
      "Built interactive web and eLearning experiences, then worked on Drupal and WordPress platforms. As Creative Manager, I also mentored designers growing into more technical roles.",
  },
  {
    range: "2013–2016",
    role: "Senior Application Developer, then UI Developer",
    org: "CBTS · Kroger",
    logos: ["cbts", "cincinnati-bell", "kroger"],
    body:
      "Built full-stack applications in C# and Razor, then moved to enterprise UI at Kroger, helping move from WebSphere to AngularJS.",
  },
  {
    range: "2017–2021",
    role: "Frontend Developer, then Senior Consultant",
    org: "Ingage Partners",
    logos: ["ingage"],
    body:
      "More than ten client engagements in React, Angular, and JAMstack. The work grew from building interfaces to shaping how frontend systems were organized.",
  },
  {
    range: "2022–Present",
    role: "Senior Software Engineer",
    org: "HealthWarehouse.com",
    logos: ["healthwarehouse"],
    body:
      "I lead frontend architecture for healthcare products in Next.js, React, and GraphQL: a configurable pharmacy platform, accessibility and testing, and standards for AI-assisted development.",
  },
];

export function CareerProgression() {
  return (
    <section id="evolution" className="bg-surface">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7">
        <ol className="space-y-space-5 border-l border-ink/10 pl-space-4">
          {eras.map((era) => (
            <li key={era.range}>
              <RevealOnScroll>
                <div className="mb-space-2 flex flex-wrap items-center gap-x-space-3 gap-y-space-2 text-ink/60 [--logo-h:1.5rem]">
                  {era.logos.map((employer) => (
                    <EmployerLogo key={employer} employer={employer} />
                  ))}
                </div>
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
