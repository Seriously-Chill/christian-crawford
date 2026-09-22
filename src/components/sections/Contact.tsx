import { Button } from "@/components/ui/Button";
import { textH2 } from "@/lib/type";

/** Own destination now (was the page's closing panel) — still the header's own gradient. */
export function Contact() {
  return (
    <section className="bg-header-gradient">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7 text-center">
        <h1 className={`text-on-header ${textH2}`}>
          If any of this sounds like the problem you&apos;re working on —
        </h1>
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
      </div>
    </section>
  );
}
