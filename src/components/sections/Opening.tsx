import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { LineIcon } from "@/components/ui/LineIcon";
import { BrandConfigDiagram } from "@/components/visuals/BrandConfigDiagram";
import { RESUME_PDF } from "@/lib/links";
import { textDisplay } from "@/lib/type";

/**
 * The home hero: the belief as a full-width statement, then on glass, the
 * proof of it, drawn from real work (`BrandConfigDiagram`), beside the
 * introduction. What I'm doing now is one line under the calls to action,
 * not a panel of its own; on phones it comes after the figure, so the
 * figure starts inside the first screen.
 *
 * From `md` up it fills the first viewport (`100dvh - 64px`, 64px being the
 * header's height). On phones it takes only the height it needs rather
 * than a forced full screen. It doesn't animate in: the first thing on the
 * site is there when it loads.
 */
export function Opening() {
  return (
    <Section
      ground="gradient"
      className="relative overflow-hidden"
      innerClassName="relative grid gap-space-4 pt-space-4 md:min-h-[calc(100dvh-64px)] md:grid-cols-[1fr_1fr] md:grid-rows-[auto_auto_1fr] md:content-center md:gap-x-space-6 md:gap-y-space-5 md:pt-space-5"
    >
      <h1 className={`max-w-[17em] text-on-header md:col-span-2 ${textDisplay}`}>
        I make complicated software simple,{" "}
        <span className="text-on-header-muted">without losing what makes it work.</span>
      </h1>
      <div className="md:col-start-1 md:row-start-2">
        <p className="max-w-xl text-h5 text-on-header-muted">
          I’m a senior frontend engineer who came up through design. I take product problems from
          “what should this be?” to a shipped, tested interface on an architecture other engineers
          can live with.
        </p>
        <div className="mt-space-4 flex flex-wrap gap-space-2">
          <Button href="/work">See the work</Button>
          <Button href="/contact" variant="bordered-inverse">
            Get in touch
          </Button>
        </div>
      </div>
      <div className="rounded-xl glass p-space-3 sm:p-space-4 md:col-start-2 md:row-span-2 md:row-start-2 md:self-start">
        <BrandConfigDiagram />
      </div>
      <div className="md:col-start-1 md:row-start-3">
        <p className="max-w-xl text-body text-on-header-muted">
          <span className="text-on-header">Now:</span> Senior Software Engineer at HealthWarehouse,
          leading frontend architecture. Open to senior frontend and architecture roles, remote or
          hybrid in Cincinnati.
        </p>
        <a
          href={RESUME_PDF}
          className="mt-space-2 inline-flex items-center gap-space-1 py-1 text-body text-on-header underline-offset-4 hover:underline focus-visible:underline"
        >
          <LineIcon name="download" />
          Download résumé (PDF)
        </a>
      </div>
    </Section>
  );
}
