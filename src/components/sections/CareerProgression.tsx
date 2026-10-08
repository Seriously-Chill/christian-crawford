import { EmployerLogo, type Employer } from "@/components/ui/EmployerLogo";
import { textH4 } from "@/lib/type";
import { Section } from "@/components/layout/Section";

/**
 * The design → implementation → systems → architecture arc, told as what
 * each era taught rather than as a résumé timeline. Every date, employer,
 * and technology below is from the résumé; nothing is invented. `carried`
 * is the habit the era left, in a sentence, drawn from its own work: the
 * part that carried forward into the next one. `short` names the era in
 * one or two words for Home's compact arc (`CareerArc`).
 */
export const eras: {
  range: string;
  role: string;
  short: string;
  org: string;
  logos: Employer[];
  body: string;
  carried: string;
}[] = [
  {
    range: "2005–2008",
    role: "Web Designer",
    short: "Design",
    org: "Ginghamsburg Church",
    logos: ["ginghamsburg"],
    body:
      "Created the organization’s first cohesive digital presence in TYPO3, bringing its website, multimedia, and print and digital standards together.",
    carried: "Notice the moment a product asks something of the person using it.",
  },
  {
    range: "2008–2013",
    role: "Multimedia Designer, then Creative Manager",
    short: "Multimedia",
    org: "Trivantis",
    logos: ["trivantis"],
    body:
      "Built interactive web and eLearning experiences, then worked on Drupal and WordPress platforms. As Creative Manager, I also mentored designers growing into more technical roles.",
    carried: "Explain an idea clearly enough that someone else can build on it.",
  },
  {
    range: "2013–2016",
    role: "Senior Application Developer, then UI Developer",
    short: "Development",
    org: "CBTS · Kroger",
    logos: ["cbts", "cincinnati-bell", "kroger"],
    body:
      "Built full-stack applications in C# and Razor, then moved to enterprise UI at Kroger, helping move from WebSphere to AngularJS.",
    carried: "Change a system people rely on without stopping it.",
  },
  {
    range: "2017–2021",
    role: "Frontend Developer, then Senior Consultant",
    short: "Consulting",
    org: "Ingage Partners",
    logos: ["ingage"],
    body:
      "More than ten client engagements in React, Angular, and JAMstack. The work grew from building interfaces to shaping how frontend systems were organized.",
    carried: "Organize a codebase so the next team can find their way in it.",
  },
  {
    range: "2022–Present",
    role: "Senior Software Engineer",
    short: "Architecture",
    org: "HealthWarehouse.com",
    logos: ["healthwarehouse"],
    body:
      "I lead frontend architecture for healthcare products in Next.js, React, and GraphQL: a configurable pharmacy platform, accessibility and testing, and standards for AI-assisted development.",
    carried: "Put each difference where it belongs, and keep it there with tests.",
  },
];

export function CareerProgression() {
  return (
    <Section id="evolution" spacing="lg">
      <ol className="space-y-space-5 border-l border-hairline pl-space-4">
        {eras.map((era) => (
          <li key={era.range}>
            <div className="mb-space-2 flex flex-wrap items-center gap-x-space-3 gap-y-space-2 text-subtle [--logo-h:1.5rem]">
              {era.logos.map((employer) => (
                <EmployerLogo key={employer} employer={employer} />
              ))}
            </div>
            <p className="text-label text-subtle">
              {era.range} · {era.org}
            </p>
            <h2 className={`mt-space-1 text-ink ${textH4}`}>{era.role}</h2>
            <p className="mt-space-2 max-w-xl text-body text-muted">{era.body}</p>
            <p className="mt-space-2 flex max-w-xl gap-space-2 text-body text-ink">
              <span aria-hidden="true" className="w-1 shrink-0 rounded-pill bg-accent" />
              <span>
                <span className="text-accent">Carried forward: </span>
                {era.carried}
              </span>
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
