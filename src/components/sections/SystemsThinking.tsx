import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { textH2, textH4 } from "@/lib/type";

/**
 * Generalizes facts already established on /work and /about into the
 * classes of problems they're instances of — no new claims, just a
 * different altitude on the same real history. Expanded copy below is
 * placeholder pending real review — flagged inline rather than written to
 * read as finished.
 */
const problemClasses = [
  {
    title: "Multi-tenant configuration",
    body: "Placeholder — expand on the HealthWarehouse white-label platform: what actually varies per brand (theming, feature flags, data), and where the line is drawn between configuration and a real fork.",
  },
  {
    title: "Accessibility at scale",
    body: "Placeholder — expand on turning WCAG compliance into an automated gate (Playwright/axe-core across ~50 routes) rather than a periodic audit, and what broke before that existed.",
  },
  {
    title: "Automated quality gates",
    body: "Placeholder — expand on the ~80-route SEO regression suite: what it actually catches, and why a manual checklist couldn't hold at that scale.",
  },
  {
    title: "Feature-flag driven UX",
    body: "Placeholder — expand on how flags let checkout/billing/prescriptions/autoreorder diverge per brand without diverging the underlying implementation.",
  },
  {
    title: "Legacy migration paths",
    body: "Placeholder — expand on the real WebSphere → AngularJS migration at Kroger: what made it safe to move incrementally instead of a rewrite.",
  },
  {
    title: "Design-to-code fidelity",
    body: "Placeholder — expand on what carries over from the design background (Ginghamsburg/Trivantis years) into how a design system gets implemented faithfully rather than approximated.",
  },
];

export function SystemsThinking() {
  return (
    <section className="mx-auto max-w-5xl px-space-3 py-space-7">
      <RevealOnScroll>
        <p className="text-label text-primary">How I think about systems</p>
        <h1 className={`mt-space-2 max-w-2xl text-ink ${textH2}`}>
          One system, many products — not many systems.
        </h1>
      </RevealOnScroll>

      <RevealOnScroll delayMs={100} className="mt-space-4 max-w-2xl space-y-space-3 text-body text-ink/72">
        <p>
          The problems worth solving rarely show up labeled &quot;architecture.&quot; They show up as a
          second brand that needs to launch without a second codebase, an accessibility bug that
          keeps reappearing because the last fix was a patch instead of a rule, or a UI that needs
          to behave differently for different customers without forking. The pattern underneath
          all three is the same: something is trying to be one system pretending to be several, or
          several systems that should have been one.
        </p>
        <p>
          At HealthWarehouse, that showed up as a white-label pharmacy platform — one Next.js/React
          codebase serving multiple brands through configuration and feature flags, rather than
          duplicating infrastructure per brand. It also showed up as accessibility: turning WCAG
          compliance from a one-time audit into something Playwright/axe-core checks automatically
          across the routes that matter, so it&apos;s a property of the system, not a task on a
          list.
        </p>
        <p>
          Earlier in the career arc, the same question showed up as a real migration path off
          WebSphere and onto AngularJS at Kroger, and as ten-plus client engagements at Ingage
          Partners where the job kept expanding from building interfaces to owning how the
          frontend systems around them were structured. Different stacks, same question: what has
          to be true about how this is built for it to stay simple as it grows?
        </p>
      </RevealOnScroll>

      <RevealOnScroll delayMs={200} className="mt-space-5">
        <h2 className={`text-ink ${textH4}`}>The classes of problem this keeps coming back to</h2>
        <div className="mt-space-3 max-w-2xl">
          <Accordion>
            {problemClasses.map((item) => (
              <AccordionItem key={item.title} title={item.title}>
                {item.body}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </RevealOnScroll>
    </section>
  );
}
