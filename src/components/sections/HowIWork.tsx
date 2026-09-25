"use client";

import { useState } from "react";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { CircleButton } from "@/components/ui/CircleButton";
import { textH2, textH5 } from "@/lib/type";

const steps = [
  {
    title: "Untangle",
    body: "Map the competing requirements, the legacy constraints, and the people who actually use it.",
  },
  {
    title: "Shape",
    body: "Find the smallest structure that holds all of it: shared where it can be, configurable where it has to differ.",
  },
  {
    title: "Build",
    body: "Ship it in React, Next.js, and GraphQL, with a design system doing the repetitive work.",
  },
  {
    title: "Verify",
    body: "Back accessibility, SEO, and real interactions with automated tests, so simple stays simple.",
  },
];

/**
 * Home §2. Production form of the reference's vertical stepper (About's
 * "Production technology", `.vertical-acc` in motion.md): numbered steps
 * whose number sits at 40% until hovered or active, one step open at a
 * time, stepped with round up/down buttons, opening on the site's slow
 * accordion timing (`--duration-accordion` / `--ease-accordion`).
 *
 * From `md` up only the active step's description is open. Below `md`
 * every description stays open and the arrows go away: the reference turns
 * this into a swipe carousel on small screens, but a plain stack reads
 * better and needs no gestures. The descriptions are only ever collapsed
 * visually, never removed, so assistive tech always gets all four; the
 * active one is marked `aria-current="step"`.
 */
export function HowIWork() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7">
        <RevealOnScroll className="grid gap-space-5 rounded-xl bg-header-gradient p-space-3 sm:p-space-5 md:grid-cols-2 md:items-center">
          <div>
            <h2 className={`text-on-header ${textH2}`}>Simple is the hard part.</h2>
            <p className="mt-space-3 max-w-md text-body lg:mt-space-4 text-on-header/80">
              Most of my work starts messy: competing requirements, legacy systems, or a blank
              page. The job is finding the shape that makes it simple to use and simple to build on.
            </p>
          </div>
          <div className="flex items-center gap-space-2">
            <div className="hidden shrink-0 flex-col gap-space-1 md:flex">
              <CircleButton
                icon="up"
                label="Previous step"
                onClick={() => setActive((i) => i - 1)}
                disabled={active === 0}
              />
              <CircleButton
                icon="down"
                label="Next step"
                onClick={() => setActive((i) => i + 1)}
                disabled={active === steps.length - 1}
              />
            </div>
            <ol className="flex-1 space-y-space-2">
              {steps.map((step, i) => {
                const isActive = i === active;
                return (
                  <li
                    key={step.title}
                    aria-current={isActive ? "step" : undefined}
                    className="group rounded-lg bg-surface p-space-2 sm:px-space-3"
                  >
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className="flex w-full items-baseline gap-space-2 text-left"
                    >
                      <span
                        aria-hidden="true"
                        className={`w-6 shrink-0 text-accent transition-opacity duration-300 group-hover:opacity-100 ${textH5} ${
                          isActive ? "opacity-100" : "opacity-40"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className={`text-ink ${textH5}`}>{step.title}</span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-(--duration-accordion) ease-(--ease-accordion) ${
                        isActive ? "grid-rows-[1fr]" : "grid-rows-[1fr] md:grid-rows-[0fr]"
                      }`}
                    >
                      <p className="overflow-hidden pl-[calc(1.5rem+var(--spacing-space-2))] text-body text-ink/72">
                        <span className="block pt-1">{step.body}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
