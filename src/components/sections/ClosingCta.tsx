import { Button } from "@/components/ui/Button";
import { textH3 } from "@/lib/type";

/**
 * Real, confirmed layout pattern: every captured page (Home, Products,
 * About, ...) ends on the same reused solid-primary-blue full-bleed band
 * before the footer — identical element IDs (8a636f6/ec2b3f1) appear
 * verbatim across pages, not a homepage-only flourish. This is that band,
 * generalized from the homepage-only `HomeContactCta` so every page gets
 * the same closing punctuation instead of trailing off on plain white.
 * Points at /contact rather than duplicating its email/LinkedIn buttons —
 * Contact is its own destination.
 */
export function ClosingCta() {
  return (
    <section className="bg-header-gradient">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7 text-center">
        <p className={`text-on-header ${textH3}`}>
          If any of this sounds like the problem you&apos;re working on —
        </p>
        <div className="mt-space-5">
          <Button href="/contact" variant="bordered-inverse">
            Get in touch
          </Button>
        </div>
      </div>
    </section>
  );
}
