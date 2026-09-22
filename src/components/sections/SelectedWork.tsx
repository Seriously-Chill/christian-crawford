import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { textH2, textH4 } from "@/lib/type";

const architecture = [
  "Next.js App Router",
  "React",
  "GraphQL",
  "Zustand",
  "MUI",
  "Configuration-driven",
  "Feature flags",
  "Accessibility",
];

/**
 * The primary case study (spec section 6). No screenshots or confidential
 * data — the source material is explicit that none exists to show, so the
 * section argues the architecture in prose and a real technology list
 * rather than inventing a visual.
 */
export function SelectedWork() {
  return (
    <section id="work" className="mx-auto max-w-5xl px-space-3 py-space-7">
      <RevealOnScroll>
        <p className="text-label text-primary">Selected work</p>
        <h1 className={`mt-space-2 max-w-2xl text-ink ${textH2}`}>
          A white-label pharmacy platform, one shared codebase.
        </h1>
      </RevealOnScroll>

      <RevealOnScroll delayMs={100} className="mt-space-4 max-w-2xl space-y-space-3 text-body text-ink/72">
        <p>
          At HealthWarehouse.com, the platform serves multiple pharmacy brands. The obvious
          path — and the one it deliberately avoided — was splitting each brand into its own
          application. That duplicates infrastructure for every new brand and multiplies the
          cost of every future change.
        </p>
        <p>
          Instead, the architecture is configuration-driven: one Next.js/React codebase,
          with feature flags and configuration carrying what&apos;s different between brands.
          The real question wasn&apos;t which framework to use — it was how to let multiple
          products behave differently without duplicating the system underneath them.
        </p>
        <p>
          That same codebase carries the platform&apos;s critical patient workflows —
          checkout, billing, prescriptions, autoreorder — where accessibility, performance,
          and healthcare requirements all have to hold at once, not trade off against each
          other.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delayMs={200} className="mt-space-5">
        <h2 className={`text-ink ${textH4}`}>The architecture underneath it</h2>
        <div className="mt-space-3">
          <DetailGrid items={architecture} />
        </div>
      </RevealOnScroll>
    </section>
  );
}
