import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { EmployerLogo, type Employer } from "@/components/ui/EmployerLogo";
import { StatList } from "@/components/ui/StatList";
import { textH3, textH4 } from "@/lib/type";
import { Section } from "@/components/layout/Section";

type CaseStudy = {
  title: string;
  body: string;
  stack: string[];
  link: { href: string; label: string };
  panel: ReactNode;
};

type Earlier = {
  employers: Employer[];
  title: string;
  body: string;
  stack: string[];
};

const caseStudies: CaseStudy[] = [
  {
    title: "One pharmacy platform for three brands.",
    body: "A team-built React and Next.js platform. I built the system that serves three brands from one shared core, and the accessibility testing around it.",
    stack: ["React", "Next.js", "GraphQL"],
    link: { href: "/work/healthwarehouse", label: "Explore the case study" },
    panel: (
      <StatList
        items={[
          { value: "210 / 210", label: "axe scans clean: 42 routes in five browser and device profiles" },
          { value: "~80", label: "routes covered by automated SEO regression testing" },
        ]}
      />
    ),
  },
  {
    title: "A partner portal, shaped before it was built.",
    body: "I wrote the pitch, reviewed it with frontend and backend engineers, and am building the portal that takes routine partner requests off email and out of engineers’ hands.",
    stack: ["Next.js", "TypeScript", "GraphQL"],
    link: { href: "/work/partner-portal", label: "Explore the case study" },
    panel: (
      <StatList
        items={[
          { value: "9 of 10", label: "areas in the written pitch with working screens so far" },
          { value: "1 tab stop", label: "into each results table, with arrow keys between rows" },
        ]}
      />
    ),
  },
];

const earlier: Earlier[] = [
  {
    employers: ["ingage"],
    title: "Ingage Partners",
    body: "More than ten client engagements, from early-stage products to enterprise modernization, with integrations including Mapbox, AWS, and Contentful.",
    stack: ["React", "Angular", "JAMstack"],
  },
  {
    employers: ["kroger"],
    title: "Kroger",
    body: "Frontend modernization for ClickList and internal applications, including the move from WebSphere to AngularJS: responsive interfaces on evolving enterprise systems.",
    stack: ["React", "AngularJS", "Enterprise"],
  },
  {
    employers: ["cbts", "trivantis", "ginghamsburg"],
    title: "Earlier work",
    body: "I started out building digital experiences at CBTS, Trivantis, and Ginghamsburg. That foundation still shapes how I work.",
    stack: ["C#", "Drupal", "WordPress", "eLearning"],
  },
];

function Stack({ items }: { items: string[] }) {
  return <p className="mt-space-2 text-label text-subtle">{items.join(" · ")}</p>;
}

/**
 * `/work`: the two case studies as alternating rows, each with a rounded
 * `surface-raised` panel of real figures from it, then the work before
 * them as a plain list. The earlier engagements have no case study, so
 * they get no panel: a box of numbers there would only balance the grid.
 * Stacks are a quiet line, not pills.
 */
export function ProjectRows() {
  return (
    <Section spacing="lg">
      <div className="space-y-space-7">
        {caseStudies.map((project, i) => (
          <div key={project.title} className="grid items-center gap-space-4 md:grid-cols-2 md:gap-space-5">
            <div className={i % 2 ? "md:order-2" : ""}>
              <div className="flex text-subtle [--logo-h:2rem]">
                <EmployerLogo employer="healthwarehouse" labelled />
              </div>
              <h2 className={`mt-space-2 text-ink ${textH3}`}>{project.title}</h2>
              <p className="mt-space-2 text-body text-muted">{project.body}</p>
              <Stack items={project.stack} />
              <div className="mt-space-4">
                <Button href={project.link.href} variant="bordered">
                  {project.link.label}
                </Button>
              </div>
            </div>
            <RevealOnScroll className="rounded-xl bg-surface-raised p-space-3 sm:p-space-5">{project.panel}</RevealOnScroll>
          </div>
        ))}
      </div>

      <h2 className={`mt-space-7 text-ink ${textH3}`}>Before HealthWarehouse</h2>
      <ul className="mt-space-4 border-t border-hairline">
        {earlier.map((item) => (
          <li
            key={item.title}
            className="grid gap-space-2 border-b border-hairline py-space-4 md:grid-cols-[1fr_2fr] md:gap-space-5"
          >
            <div>
              <div className="flex flex-wrap items-center gap-x-space-3 gap-y-space-2 text-subtle [--logo-h:1.5rem]">
                {item.employers.map((employer) => (
                  <EmployerLogo key={employer} employer={employer} labelled />
                ))}
              </div>
              <h3 className={`mt-space-2 text-ink ${textH4}`}>{item.title}</h3>
            </div>
            <div>
              <p className="text-body text-muted">{item.body}</p>
              <Stack items={item.stack} />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
