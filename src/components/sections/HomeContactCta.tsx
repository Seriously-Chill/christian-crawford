import { Button } from "@/components/ui/Button";
import { textH3 } from "@/lib/type";

/**
 * Bookends the homepage with the header's own gradient (the real DS
 * closing-panel motif) without duplicating the full Contact page's
 * email/LinkedIn buttons — Contact is its own destination, this just
 * points at it.
 */
export function HomeContactCta() {
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
