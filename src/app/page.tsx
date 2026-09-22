import { Opening } from "@/components/sections/Opening";
import { NarrativeTeaser } from "@/components/sections/NarrativeTeaser";
import { HomeContactCta } from "@/components/sections/HomeContactCta";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { HighlightCard } from "@/components/ui/HighlightCard";

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
      >
        <RevealOnScroll delayMs={80} className="mt-space-4 grid gap-space-3 sm:grid-cols-3">
          <HighlightCard value="200+" label="accessibility issues addressed across two platforms" />
          <HighlightCard value="~50" label="routes covered by automated accessibility testing" />
          <HighlightCard value="~80" label="routes covered by automated SEO regression testing" />
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

      <HomeContactCta />
    </>
  );
}
