import { Button } from "@/components/ui/Button";
import { textH3 } from "@/lib/type";

/** Spec section 10: simple, and bookends the page by reusing the header's own gradient. */
export function Contact() {
  return (
    <section id="contact" className="bg-header-gradient">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7 text-center">
        <p className={`text-on-header ${textH3}`}>
          If any of this sounds like the problem you&apos;re working on —
        </p>
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
