import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { Tags } from "@/components/ui/Tags";
import { EmployerLogo, type Employer } from "@/components/ui/EmployerLogo";
import { textH2, textH3 } from "@/lib/type";

type Project = {
  employers: Employer[];
  title: string;
  body: string;
  tags: string[];
  link?: { href: string; label: string };
  panel: ReactNode;
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className={`text-accent ${textH2}`}>{value}</p>
      <p className="mt-1 text-body text-ink/72">{label}</p>
    </div>
  );
}

const progression = ["Design", "Multimedia", "Creative Management", "Software Development", "Consulting", "Architecture"];

const projects: Project[] = [
  {
    employers: ["healthwarehouse"],
    title: "One pharmacy platform. Three brands.",
    body: "I built it from the ground up in React and Next.js, then shaped it to serve three brands from one shared core, with accessibility and automated testing built in.",
    tags: ["Architecture", "React", "Next.js", "GraphQL", "Accessibility"],
    link: { href: "/work/healthwarehouse", label: "Explore the case study" },
    panel: (
      <div className="grid gap-space-4">
        <Stat value="200+" label="accessibility issues addressed across two platforms" />
        <Stat value="~80" label="routes covered by automated SEO regression testing" />
      </div>
    ),
  },
  {
    employers: ["ingage"],
    title: "Ingage Partners",
    body: "More than ten client engagements, from early-stage products to enterprise modernization, with integrations including Mapbox, AWS, and Contentful.",
    tags: ["React", "Angular", "JAMstack"],
    panel: <Stat value="10+" label="client engagements, from first release to enterprise modernization" />,
  },
  {
    employers: ["kroger"],
    title: "Kroger",
    body: "Frontend modernization for ClickList and internal applications: responsive interfaces on evolving enterprise systems.",
    tags: ["React", "AngularJS", "Enterprise"],
    panel: <Stat value="WebSphere → AngularJS" label="the enterprise UI move I helped carry out" />,
  },
  {
    employers: ["cbts", "trivantis", "ginghamsburg"],
    title: "Earlier work",
    body: "I started out building digital experiences at CBTS, Trivantis, and Ginghamsburg. That foundation still shapes how I work.",
    tags: ["C#", "Drupal", "WordPress", "eLearning"],
    panel: (
      <ol aria-label="How the work changed" className="flex flex-wrap items-center gap-x-space-1 gap-y-space-2">
        {progression.map((step, i) => (
          <li key={step} className="flex items-center gap-space-1">
            <span className="rounded-pill border border-ink/15 bg-surface px-space-2 py-1 text-label text-ink/70">{step}</span>
            {i < progression.length - 1 ? (
              <span aria-hidden="true" className="text-ink/30">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    ),
  },
];

/**
 * `/work`'s projects as the reference's alternating rows (Innovations page):
 * each project gets a full-width moment, text on one side and a rounded
 * `surface-raised` panel on the other, swapping sides row by row. The
 * panels hold real evidence (numbers, the migration, the career arc)
 * instead of photography.
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
