import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Christian Crawford by email or LinkedIn.",
};

export default function ContactPage() {
  return <Contact />;
}
