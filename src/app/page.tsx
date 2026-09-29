import { Opening } from "@/components/sections/Opening";
import { ProofFeature } from "@/components/sections/ProofFeature";
import { NarrativeTeaser } from "@/components/sections/NarrativeTeaser";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EmployerMarquee } from "@/components/ui/EmployerMarquee";
import { AiBanner } from "@/components/sections/AiBanner";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Christian Crawford",
      jobTitle: "Senior Frontend Engineer",
      url: "https://christiancrawford.dev",
      email: "mailto:christian.crawford@pm.me",
      sameAs: ["https://www.linkedin.com/in/christiancrawford"],
      knowsAbout: [
        "Frontend Architecture",
        "React",
        "Next.js",
        "GraphQL",
        "Accessibility",
        "Design Systems",
      ],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Full Sail University",
      },
      worksFor: {
        "@type": "Organization",
        name: "HealthWarehouse.com, Inc.",
      },
    },
    {
      "@type": "WebSite",
      name: "Christian Crawford",
      url: "https://christiancrawford.dev",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Opening />

      <CurveDivider above="gradient-page" below="surface" />

      <ProofFeature
        employer="healthwarehouse"
        kicker="Architecture"
        title="Three pharmacy brands. One codebase. No forks."
        body="Every new brand brought requirements of its own: the kind that usually splits a product into separate apps. I built the platform from the ground up so they all run on one shared core, with configuration and feature flags carrying the differences."
        tags={["Next.js", "React", "GraphQL", "Zustand", "MUI"]}
        href="/work/healthwarehouse"
        linkLabel="Read the case study"
        outcomes={[
          { value: "No forks", label: "Every brand runs on one shared codebase instead of its own copy." },
          { value: "Brand three", label: "added with a config file, env files, and build scripts, then given its own fonts, colors, and corners while the other two stayed pixel-identical." },
        ]}
      />

      <CurveDivider above="surface" below="gradient-page" />

      <ProofFeature
        flip
        onGradient
        employer="healthwarehouse"
        kicker="Product and UX"
        title="A partner portal, shaped before it was built."
        body="Pharmacy partners ran orders, reports, and API changes through email and engineers. I wrote the pitch for a self-service portal, reviewed it with frontend and backend engineers, and am building it, with the UX decided around the operations staff who'll use it."
        tags={["Product shaping", "UX", "Next.js", "TypeScript", "GraphQL"]}
        href="/work/partner-portal"
        linkLabel="Read the case study"
        outcomes={[
          { value: "The pitch", label: "Problem, solution, rabbit holes, and what's out of scope, reviewed before any code." },
          { value: "Labeled filters", label: "chosen over a search box with chips, because of who uses it." },
          { value: "9 areas", label: "with working screens so far. Still in progress." },
        ]}
      />

      <CurveDivider above="gradient-page" below="surface" />

      <ProofFeature
        employer="healthwarehouse"
        kicker="Quality"
        title="200+ accessibility issues, fixed and kept fixed."
        body="Audits kept finding problems: forms that failed silently for screen readers, controls a keyboard couldn't operate, dialogs nested inside dialogs. I led the work through the findings to a WCAG 2.2 AA seal, then added automated tests so the fixes stay fixed."
        tags={["WCAG 2.2", "Playwright", "axe-core", "Screen readers"]}
        href="/work/healthwarehouse#evidence"
        linkLabel="See the evidence"
        outcomes={[
          { value: "200+", label: "accessibility issues addressed across two platforms, and a WCAG 2.2 AA seal." },
          { value: "Announced", label: "Form errors and confirmations now reach screen readers across checkout, payments, and account forms." },
          { value: "~50 routes", label: "re-checked by axe-core in five browser and device profiles." },
        ]}
      />

      <NarrativeTeaser
        kicker="How this happened"
        title="Different rooms, same habit."
        body="Design, development, consulting, architecture: in every role, I notice how something
          gets used, then build toward that instead of around it."
        href="/about"
        linkLabel="More about me"
      >
        <RevealOnScroll className="mt-space-5">
          <EmployerMarquee
            label="Where I’ve worked"
            employers={["healthwarehouse", "ingage", "kroger", "cbts", "cincinnati-bell", "trivantis", "ginghamsburg"]}
          />
        </RevealOnScroll>
      </NarrativeTeaser>

      <AiBanner />

      <CurveDivider above="surface" below="primary" />
    </>
  );
}
