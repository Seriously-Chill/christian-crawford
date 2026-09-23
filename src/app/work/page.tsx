import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Complexity } from "@/components/sections/Complexity";
import { ClosingCta } from "@/components/sections/ClosingCta";

export const metadata: Metadata = {
  title: "Work",
  description:
    "A white-label pharmacy platform at HealthWarehouse.com — one Next.js/React codebase serving multiple brands, and the accessibility work that shipped alongside it.",
};

export default function WorkPage() {
  return (
    <>
      <PageIntro
        breadcrumb="Work"
        kicker="Selected work"
        title="A white-label pharmacy platform, one shared codebase."
      />
      <SelectedWork />
      <Complexity />
      <ClosingCta />
    </>
  );
}
