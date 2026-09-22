import type { Metadata } from "next";
import { SystemsThinking } from "@/components/sections/SystemsThinking";

export const metadata: Metadata = {
  title: "Systems",
  description:
    "The kinds of complex product problems worth solving: multi-tenant configuration, accessibility at scale, and systems built to stay simple as they grow.",
};

export default function SystemsPage() {
  return <SystemsThinking />;
}
