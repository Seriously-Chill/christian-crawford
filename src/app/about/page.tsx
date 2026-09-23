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
        tagline="I started in design, moved into development, and grew into consulting and architecture. Across each role, I’ve kept coming back to the same things: how people experience a product, how teams build it, and the discipline of making a tangled system simpler without losing what makes it work."
      />
      <CurveDivider above="gradient-page" below="surface" />
      <CareerProgression />
      <DesignBackground />
      <CurrentInterests />
      <CurveDivider above="surface" below="primary" />
    </>
  );
}
