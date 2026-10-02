import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { Tags } from "@/components/ui/Tags";
import { EmployerLogo, type Employer } from "@/components/ui/EmployerLogo";
import { StatList } from "@/components/ui/StatList";
import { StepChain } from "@/components/ui/StepChain";
import { textH3 } from "@/lib/type";

type Project = {
  employers: Employer[];
  title: string;
  body: string;
  tags: string[];
  link?: { href: string; label: string };
  panel: ReactNode;
};

const progression = ["Design", "Multimedia", "Creative Management", "Software Development", "Consulting", "Architecture"];

const projects: Project[] = [
  {
    employers: ["healthwarehouse"],
    title: "One pharmacy platform. Three brands.",
    body: "A team-built React and Next.js platform. I built the system that serves three brands from one shared core, and the accessibility testing around it.",
    tags: ["Architecture", "React", "Next.js", "GraphQL", "Accessibility"],
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
    employers: ["healthwarehouse"],
    title: "A partner portal, shaped before it was built.",
    body: "I wrote the pitch, reviewed it with frontend and backend engineers, and am building the portal that takes routine partner requests off email and out of engineers’ hands.",
    tags: ["Product shaping", "UX", "Next.js", "TypeScript", "Accessibility"],
    link: { href: "/work/partner-portal", label: "Explore the case study" },
    panel: <StatList items={[{ value: "9", label: "areas with working screens so far, from one written pitch" }]} />,
  },
  {
    employers: ["ingage"],
    title: "Ingage Partners",
    body: "More than ten client engagements, from early-stage products to enterprise modernization, with integrations including Mapbox, AWS, and Contentful.",
    tags: ["React", "Angular", "JAMstack"],
    panel: <StatList items={[{ value: "10+", label: "client engagements, from first release to enterprise modernization" }]} />,
  },
  {
    employers: ["kroger"],
    title: "Kroger",
    body: "Frontend modernization for ClickList and internal applications: responsive interfaces on evolving enterprise systems.",
    tags: ["React", "AngularJS", "Enterprise"],
    panel: <StatList items={[{ value: "WebSphere → AngularJS", label: "the enterprise UI move I helped carry out" }]} />,
  },
  {
    employers: ["cbts", "trivantis", "ginghamsburg"],
    title: "Earlier work",
    body: "I started out building digital experiences at CBTS, Trivantis, and Ginghamsburg. That foundation still shapes how I work.",
    tags: ["C#", "Drupal", "WordPress", "eLearning"],
    panel: <StepChain label="How the work changed" steps={progression} />,
  },
];

/**
 * `/work`'s projects as alternating rows: each project gets a full-width
 * moment, text on one side and a rounded `surface-raised` panel on the
 * other, swapping sides row by row. The panels hold real evidence
 * (numbers, the migration, the career arc) instead of photography.
 */
export function ProjectRows() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl space-y-space-7 px-space-3 py-space-7">
        {projects.map((project, i) => (
          <RevealOnScroll key={project.title} className="grid items-center gap-space-4 md:grid-cols-2 md:gap-space-5">
            <div className={i % 2 ? "md:order-2" : ""}>
              <div className="flex flex-wrap items-center gap-x-space-4 gap-y-space-2 text-ink/60 [--logo-h:2rem]">
                {project.employers.map((employer) => (
                  <EmployerLogo key={employer} employer={employer} labelled />
                ))}
              </div>
              <h2 className={`mt-space-2 text-accent ${textH3}`}>{project.title}</h2>
              <p className="mt-space-2 text-body text-ink/72">{project.body}</p>
              <Tags items={project.tags} />
              {project.link ? (
                <div className="mt-space-4">
                  <Button href={project.link.href} variant="bordered">
                    {project.link.label}
                  </Button>
                </div>
              ) : null}
            </div>
            <div className="rounded-xl bg-surface-raised p-space-3 sm:p-space-5">{project.panel}</div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
