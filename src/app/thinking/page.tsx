import type { Metadata } from "next";
import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { PageIntro } from "@/components/sections/PageIntro";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { essays } from "@/lib/essays";
import { textH4 } from "@/lib/type";

export const metadata: Metadata = {
  title: "Thinking",
  description:
    "Notes on AI-assisted development, architecture, maintainability, and where software engineering is headed.",
};

export default function ThinkingPage() {
  return (
    <>
      <PageIntro
        breadcrumb="Thinking"
        kicker="Thinking"
        title="Notes on AI, architecture, and maintainability."
        tagline="Open questions more than declared answers — the same thread running through the work and the systems, written out on its own."
      />
      <section className="bg-surface">
        <div className="mx-auto max-w-5xl px-space-3 py-space-7">
          <ul className="space-y-space-4">
            {essays.map((essay, i) => (
              <li key={essay.slug}>
                <RevealOnScroll delayMs={i * 100}>
                  <Link href={`/thinking/${essay.slug}`} className="group block rounded-sm focus-visible:outline-offset-4">
                    <h2 className={`text-ink ${textH4} group-hover:text-primary`}>{essay.title}</h2>
                    <p className="mt-space-1 max-w-xl text-body text-ink/72">{essay.description}</p>
                  </Link>
                </RevealOnScroll>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
