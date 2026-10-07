import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmployerLogo } from "@/components/ui/EmployerLogo";
import { LineIcon } from "@/components/ui/LineIcon";
import { RESUME_PDF } from "@/lib/links";
import { textDisplay } from "@/lib/type";

// What the current role actually covers, in the About page's own words:
// sentences rather than loose figures, which read as résumé filler here.
const now = [
  "Leading frontend architecture for healthcare products",
  "A configurable pharmacy platform in Next.js, React, and GraphQL",
  "Accessibility, automated testing, and standards for AI-assisted development",
];

/**
 * The home hero, with an "at a glance" panel beside it. Near full viewport:
 * `min-height: calc(100dvh - 64px)`, 64px being the header's height. It
 * doesn't animate in: the first thing on the site is there when it loads.
 */
export function Opening() {
  return (
    <Section
      ground="gradient"
      className="relative overflow-hidden"
      innerClassName="relative grid min-h-[calc(100dvh-64px)] content-center gap-space-6 md:grid-cols-[3fr_2fr] md:items-center md:gap-space-5"
    >
      <div>
        <h1 className={`max-w-[11em] text-on-header ${textDisplay}`}>
          I make complicated software simple.
        </h1>
        <p className="mt-space-4 max-w-xl text-h5 lg:mt-space-5 text-on-header-muted">
          I’m a senior frontend engineer who came up through design. I take product
          problems from “what should this be?” to a shipped, tested interface on an
          architecture other engineers can live with.
        </p>
        <div className="mt-space-5 flex flex-wrap gap-space-2">
          <Button href="/work">See the work</Button>
          <Button href="/contact" variant="bordered-inverse">
            Get in touch
          </Button>
        </div>
        <p className="mt-space-3 text-body text-on-header-muted">
          Open to senior frontend and frontend architecture roles: remote, or hybrid in
          Cincinnati.
        </p>
        <a
          href={RESUME_PDF}
          className="mt-space-2 inline-flex items-center gap-space-1 py-1 text-body text-on-header underline-offset-4 hover:underline focus-visible:underline"
        >
          <LineIcon name="download" />
          Download résumé (PDF)
        </a>
      </div>
      <div className="rounded-xl glass p-space-3 sm:p-space-4">
        <p className="text-label text-on-header-muted">Now</p>
        <div className="mt-space-2 flex text-on-header [--logo-h:1.75rem]">
          <EmployerLogo employer="healthwarehouse" labelled />
        </div>
        <p className="mt-space-2 text-body text-on-header">Senior Software Engineer</p>
        <ul className="mt-space-3 space-y-space-2 border-t border-on-header-hairline pt-space-3">
          {now.map((item) => (
            <li key={item} className="flex gap-space-2 text-body text-on-header">
              <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-circle bg-on-header/60" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-space-3 border-t border-on-header-hairline pt-space-3 text-body text-on-header-muted">
          Twenty years of experience, from design and consulting to enterprise UI at Ingage,
          Kroger, CBTS, and Trivantis.
        </p>
      </div>
    </Section>
  );
}
