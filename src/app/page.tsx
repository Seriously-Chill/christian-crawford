import { Opening } from "@/components/sections/Opening";
import { HardProblems } from "@/components/sections/HardProblems";
import { Capabilities } from "@/components/sections/Capabilities";
import { ProjectFeature } from "@/components/sections/ProjectFeature";
import { NarrativeTeaser } from "@/components/sections/NarrativeTeaser";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { EmployerLogoRow } from "@/components/ui/EmployerLogo";

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

      <HardProblems />

      <CurveDivider above="surface" below="gradient-page" />

      <Capabilities />

      <ProjectFeature compact />

      <CurveDivider above="gradient-page" below="surface" />

      <NarrativeTeaser
        kicker="How this happened"
        title="Twenty years, one throughline."
        body="Design, development, consulting, architecture — different rooms, same habit: notice
          how something gets used, then build toward that instead of around it."
        href="/about"
        linkLabel="More about me"
      >
        <EmployerLogoRow
          label="Where I’ve worked"
          employers={["healthwarehouse", "ingage", "kroger", "cbts", "cincinnati-bell", "trivantis", "ginghamsburg"]}
          className="mt-space-5 text-ink/60"
        />
      </NarrativeTeaser>

      <CurveDivider above="surface" below="primary" />
    </>
  );
}
