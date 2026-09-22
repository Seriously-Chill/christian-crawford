import { Button } from "@/components/ui/Button";
import { textDisplay } from "@/lib/type";

/**
 * Production form of the Design System's Hero pattern (display headline,
 * one tagline line, primary + secondary CTA side by side — see the
 * artifact's Hero/README) carrying the spec's "What I Build" positioning
 * instead of the source's marketing copy. Generous vertical padding via
 * space-7 (80px) — the token's own usage note calls it out for exactly
 * this: "used sparingly between hero-scale sections."
 */
export function Opening() {
  return (
    <section className="mx-auto max-w-5xl px-space-3 py-space-7">
      <p className="text-label text-primary mb-space-3">Christian Crawford</p>
      <h1 className={`max-w-3xl text-ink ${textDisplay}`}>
        Frontend architecture. Complex product systems.
      </h1>
      <p className="mt-space-4 max-w-xl text-h5 text-ink/72">
        I build things from scratch. I also spend a lot of time figuring out
        why existing systems got complicated in the first place — and how to
        make them simpler for the people who have to work with them.
      </p>
      <div className="mt-space-5 flex flex-wrap gap-space-2">
        <Button href="#work">See the work</Button>
        <Button href="#contact" variant="bordered">
          Get in touch
        </Button>
      </div>
    </section>
  );
}
