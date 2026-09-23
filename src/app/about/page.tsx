import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { CareerProgression } from "@/components/sections/CareerProgression";
import { DesignBackground } from "@/components/sections/DesignBackground";
import { ClosingCta } from "@/components/sections/ClosingCta";

export const metadata: Metadata = {
  title: "About",
  description:
    "Twenty years moving from design to development to consulting to architecture — and why that path, not a single framework, is the actual throughline.",
};

export default function AboutPage() {
  return (
    <>
      <PageIntro
        breadcrumb="About"
        kicker="How this happened"
        title="Not a framework. A way of working with complexity."
        tagline="The common thread across twenty years isn't a technology. It's the same question, asked in different rooms: why did this get complicated, and how do you make it something people can actually work with?"
      />
      <CareerProgression />
      <DesignBackground />
      <ClosingCta />
    </>
  );
}
