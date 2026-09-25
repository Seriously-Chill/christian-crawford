import { Opening } from "@/components/sections/Opening";
import { HowIWork } from "@/components/sections/HowIWork";
import { Capabilities } from "@/components/sections/Capabilities";
import { ProjectFeature } from "@/components/sections/ProjectFeature";
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

      <CurveDivider above="gradient-page" below="surface" />

      <HowIWork />

      <CurveDivider above="surface" below="gradient-page" />

      <Capabilities />

      <CurveDivider above="gradient-page" below="surface" />

      <ProjectFeature />

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
