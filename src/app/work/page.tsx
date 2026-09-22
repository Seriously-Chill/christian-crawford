import type { Metadata } from "next";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Complexity } from "@/components/sections/Complexity";

export const metadata: Metadata = {
  title: "Work",
  description:
    "A white-label pharmacy platform at HealthWarehouse.com — one Next.js/React codebase serving multiple brands, and the accessibility work that shipped alongside it.",
};

export default function WorkPage() {
  return (
    <>
      <SelectedWork />
      <Complexity />
    </>
  );
}
