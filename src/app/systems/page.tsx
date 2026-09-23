import type { Metadata } from "next";
import { PageIntro } from "@/components/sections/PageIntro";
import { SystemsThinking } from "@/components/sections/SystemsThinking";
import { ClosingCta } from "@/components/sections/ClosingCta";

export const metadata: Metadata = {
  title: "Systems",
  description:
    "The kinds of complex product problems worth solving: multi-tenant configuration, accessibility at scale, and systems built to stay simple as they grow.",
};

export default function SystemsPage() {
  return (
    <>
      <PageIntro
        breadcrumb="Systems"
        kicker="How I think about systems"
        title="One system, many products — not many systems."
      />
      <SystemsThinking />
      <ClosingCta />
    </>
  );
}
