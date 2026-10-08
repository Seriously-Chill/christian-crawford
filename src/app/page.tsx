import { Opening } from "@/components/sections/Opening";
import { ProofFeature } from "@/components/sections/ProofFeature";
import { NarrativeSection } from "@/components/sections/NarrativeSection";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { AiBanner } from "@/components/sections/AiBanner";
import { Button } from "@/components/ui/Button";
import { DifferenceRouting } from "@/components/visuals/DifferenceRouting";
import { PortalShapingDiagram } from "@/components/visuals/PortalShapingDiagram";
import { DialogFixExample } from "@/components/visuals/DialogFixExample";
import { CareerArc } from "@/components/visuals/CareerArc";
import { EMAIL, LINKEDIN_URL, SITE_URL } from "@/lib/links";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Christian Crawford",
      jobTitle: "Senior Frontend Engineer",
      url: SITE_URL,
      email: `mailto:${EMAIL}`,
      sameAs: [LINKEDIN_URL],
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
      url: SITE_URL,
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
        title="Each difference goes to the smallest place that can hold it."
        body="Three pharmacy brands needed their own colors, typefaces, features, and legal copy: the kind of requirements that usually split a product into separate apps. I built the multi-brand system that keeps them on one shared core, and the rule the team follows when a brand needs something new."
        result="PharmcoRx joined as a config file, env files, and build scripts. Its redesign got its own typefaces, header, and homepage, and the other two brands came out unchanged."
        href="/work/healthwarehouse#architecture"
        linkLabel="See the architecture"
        evidence={<DifferenceRouting />}
      />

      <CurveDivider above="surface" below="gradient-page" />

      <ProofFeature
        onGradient
        employer="healthwarehouse"
        kicker="Product and UX"
        title="A partner portal, shaped before it was built."
        body="Pharmacy partners ran orders, reports, and API changes through email and engineers. I wrote the pitch for a self-service portal, reviewed it with frontend and backend engineers, and am building it around the operations staff who’ll use it."
        result="Working screens for 9 of the pitch’s 10 areas. API keys wait on a decision the pitch flagged at the start."
        href="/work/partner-portal"
        linkLabel="Read the case study"
        evidence={<PortalShapingDiagram />}
      />

      <CurveDivider above="gradient-page" below="surface" />

      <ProofFeature
        employer="healthwarehouse"
        kicker="Accessibility"
        title="Fixed for what a screen reader hears, not for how it looks."
        body="Audits kept finding markup that looked fine and told a screen reader something wrong: forms that failed silently, controls a keyboard couldn’t reach, dialogs nested inside dialogs. I fixed most of them on the way to a third-party accessibility seal, then wrote the Playwright and axe-core suites that re-check them."
        result="210 of 210 axe-core scans clean: 42 routes in five browser and device profiles. The suites run by hand, not yet in CI."
        href="/work/healthwarehouse#evidence"
        linkLabel="See the evidence"
        evidence={<DialogFixExample />}
      />

      <NarrativeSection
        title="Different rooms, same habit."
        body="Design, development, consulting, architecture: in every role, I notice how something gets used, then build toward that instead of around it. Each one left a habit the next one still uses."
      >
        <CareerArc />
        <div className="mt-space-4">
          <Button href="/about" variant="bordered">
            More about me
          </Button>
        </div>
      </NarrativeSection>

      <AiBanner />

      <CurveDivider above="surface" below="primary" />
    </>
  );
}
