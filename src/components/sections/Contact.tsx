import { Button } from "@/components/ui/Button";
import { ContactVisual } from "@/components/visuals/ContactVisual";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { textH1 } from "@/lib/type";

/** Own destination now (was the page's closing panel) — still the header's own gradient. */
export function Contact() {
  return (
    <section className="bg-header-gradient">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7 text-center">
        <h1 className={`text-on-header ${textH1}`}>
          Let&apos;s talk about what you’re building.
        </h1>
        <div className="mt-space-5 flex justify-center">
          <ContactVisual />
        </div>
        <div className="mt-space-5 flex flex-wrap justify-center gap-space-3">
          <Button href="mailto:christian.crawford@pm.me" variant="bordered-inverse">
            christian.crawford@pm.me
          </Button>
          <Button
            href="https://www.linkedin.com/in/christiancrawford"
            variant="bordered-inverse"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens in a new tab)"
          >
            LinkedIn
          </Button>
        </div>
        <p className="mt-space-6 text-label text-on-header/60">
          Based in Cincinnati, Ohio.
        </p>
      </div>
      <CurveDivider above="gradient-header" below="primary" />
    </section>
  );
}
