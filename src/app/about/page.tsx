import type { Metadata } from "next";
import { CareerProgression } from "@/components/sections/CareerProgression";
import { DesignBackground } from "@/components/sections/DesignBackground";

export const metadata: Metadata = {
  title: "About",
  description:
    "Twenty years moving from design to development to consulting to architecture — and why that path, not a single framework, is the actual throughline.",
};

export default function AboutPage() {
  return (
    <>
      <CareerProgression />
      <DesignBackground />
    </>
  );
}
