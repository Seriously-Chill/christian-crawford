import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { CareerProgression } from "@/components/sections/CareerProgression";
import { DesignBackground } from "@/components/sections/DesignBackground";
import { CurrentInterests } from "@/components/sections/CurrentInterests";
import { CurveDivider } from "@/components/visuals/CurveDivider";

export const metadata: Metadata = {
  title: "About",
  description:
    "From design and development to consulting and frontend architecture: the experiences that shape how I work.",
};

export default function AboutPage() {
  return (
    <>
      <PageIntro
        breadcrumb="About"
        kicker="How this happened"
        title="A career shaped by changing perspectives."
        tagline="Designer, then developer, then consultant and architect. The job stayed the same: take the tangled thing and make it simple, without losing what makes it work."
      />
      <CurveDivider above="gradient-page" below="surface" />
      <CareerProgression />
      <DesignBackground />
      <CurrentInterests />
      <CurveDivider above="surface" below="primary" />
    </>
  );
}
