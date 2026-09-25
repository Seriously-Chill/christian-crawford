import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { LineIcon, type IconName } from "@/components/ui/LineIcon";
import { textH2, textH5 } from "@/lib/type";

const principles: { icon: IconName; title: string; body: string }[] = [
  { icon: "person", title: "Start with the person", body: "Find the moment the product asks something of the person using it." },
  { icon: "layers", title: "Share the core", body: "Build one foundation, and configure what really differs." },
  { icon: "shield", title: "Check every change", body: "Accessibility and real interactions tested automatically, not audited once." },
  { icon: "people", title: "Sit in every seat", body: "Product, design, and engineering deciding together what to build." },
];

/**
 * About §3, woven in as explanation rather than a marketing claim.
 * Production form of the reference's "History and mission" band: the
 * story on the left, on the page gradient, and the working principles it
 * produced as four glass tiles on the right, each with its icon as the
 * reference's value tiles have.
 */
export function DesignBackground() {
  return (
    <section className="bg-page-gradient">
      <div className="mx-auto grid max-w-5xl gap-space-5 px-space-3 py-space-7 md:grid-cols-[5fr_6fr] md:items-center">
        <RevealOnScroll>
          <h2 className={`text-on-header ${textH2}`}>Why the design years still matter.</h2>
          <div className="mt-space-3 space-y-space-3 text-body text-on-header/80 lg:mt-space-4">
            <p>
              Design training leaves a habit: noticing the moment a product asks something of the
              person using it. I still look for that moment first — it usually tells me more about
              the right architecture than the requirements doc does.
            </p>
            <p>
              It&apos;s also why I rarely stay in one lane. The interesting work happens where
              product, design, and engineering are still deciding what to build — and I&apos;ve sat
              in all three seats.
            </p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll>
          <ul aria-label="How that shapes my work" className="grid gap-space-2 sm:grid-cols-2">
            {principles.map((item) => (
              <li key={item.title} className="rounded-lg border border-on-header/10 bg-on-header/10 p-space-2 sm:p-space-3">
                <h3 className={`flex items-center gap-space-1 text-on-header ${textH5}`}>
                  <LineIcon name={item.icon} />
                  {item.title}
                </h3>
                <p className="mt-1 text-body text-on-header/80">{item.body}</p>
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}
