import type { Metadata } from "next";
import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { essays } from "@/lib/essays";
import { textH2, textH4 } from "@/lib/type";

export const metadata: Metadata = {
  title: "Thinking",
  description:
    "Notes on AI-assisted development, architecture, maintainability, and where software engineering is headed.",
};

export default function ThinkingPage() {
  return (
    <section className="mx-auto max-w-5xl px-space-3 py-space-7">
      <RevealOnScroll>
        <p className="text-label text-primary">Thinking</p>
        <h1 className={`mt-space-2 max-w-2xl text-ink ${textH2}`}>
          Notes on AI, architecture, and maintainability.
        </h1>
        <p className="mt-space-3 max-w-xl text-body text-ink/72">
          Open questions more than declared answers — the same thread running through the work
          and the systems, written out on its own.
        </p>
      </RevealOnScroll>

      <ul className="mt-space-6 space-y-space-4 border-t border-ink/10 pt-space-4">
        {essays.map((essay, i) => (
          <li key={essay.slug}>
            <RevealOnScroll delayMs={i * 60}>
              <Link href={`/thinking/${essay.slug}`} className="group block rounded-sm focus-visible:outline-offset-4">
                <h2 className={`text-ink ${textH4} group-hover:text-primary`}>{essay.title}</h2>
                <p className="mt-space-1 max-w-xl text-body text-ink/72">{essay.description}</p>
              </Link>
            </RevealOnScroll>
          </li>
        ))}
      </ul>
    </section>
  );
}
