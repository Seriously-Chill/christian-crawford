import { Opening } from "@/components/sections/Opening";
import { NarrativeTeaser } from "@/components/sections/NarrativeTeaser";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EvidenceCard } from "@/components/ui/EvidenceCard";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Christian Crawford",
      jobTitle: "Senior Software Engineer",
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

      <NarrativeTeaser
        kicker="Selected work"
        title="A white-label pharmacy platform, one shared codebase."
        body="At HealthWarehouse.com, one Next.js/React codebase serves multiple pharmacy
          brands — configuration and feature flags carry the differences, not duplicated
          infrastructure. It also carries the platform's critical patient workflows: checkout,
          billing, prescriptions, autoreorder."
        href="/work"
        linkLabel="See the case study"
        onGradient
      >
        <RevealOnScroll delayMs={100} className="mt-space-4 grid gap-space-3 sm:grid-cols-2">
          <EvidenceCard onGradient title="One codebase, multiple brands">
            Configuration and feature flags carry the differences between brands — not separate
            applications duplicating the same infrastructure.
          </EvidenceCard>
          <EvidenceCard onGradient title="Accessibility, tested automatically">
            200+ issues addressed across two platforms, backed by automated Playwright/axe-core
            testing across ~50 routes — not a one-time audit.
          </EvidenceCard>
        </RevealOnScroll>
      </NarrativeTeaser>

      <NarrativeTeaser
        kicker="How I think about systems"
        title="One system, many products — not many systems."
        body="Multi-tenant configuration, accessibility as an architectural property instead of
          an audit, legacy migrations, feature-flag driven UX — different problems that all
          resolve to the same question: what has to be true for this to stay simple as it grows?"
        href="/systems"
        linkLabel="See how I think about systems"
      />

      <NarrativeTeaser
        kicker="How this happened"
        title="Not a framework. A way of working with complexity."
        body="Twenty years across design, development, consulting, and architecture — the same
          question asked in different rooms: why did this get complicated, and how do you make
          it something people can actually work with?"
        href="/about"
        linkLabel="See the full path"
      />

      <NarrativeTeaser
        kicker="What I'm thinking about now"
        title="If code gets easier to generate, what has to get harder to maintain?"
        body="The interesting question about AI-assisted development was never how to use it to
          write code faster — it's what happens to architecture, testing, and review once
          generating the code stops being the bottleneck."
        href="/thinking"
        linkLabel="Read the notes"
      />

      <ClosingCta />
    </>
  );
}
