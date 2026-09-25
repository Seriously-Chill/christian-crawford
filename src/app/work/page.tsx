import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { ProjectRows } from "@/components/sections/ProjectRows";
import { CurveDivider } from "@/components/visuals/CurveDivider";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work in frontend architecture, product development, and enterprise modernization — including a configurable pharmacy platform and more than ten client engagements.",
};

export default function WorkPage() {
  return (
    <>
      <PageIntro
        breadcrumb="Work"
        kicker="Selected work"
        title="Products and platforms I've helped build."
      />
      <CurveDivider above="gradient-page" below="surface" />
      <ProjectRows />
      <CurveDivider above="surface" below="primary" />
    </>
  );
}
