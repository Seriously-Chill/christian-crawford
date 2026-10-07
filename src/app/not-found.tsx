import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { CurveDivider } from "@/components/visuals/CurveDivider";
import { textH1 } from "@/lib/type";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * The site's 404, inside the normal layout (header and footer) instead of
 * Next's bare default, on the page gradient like every other page intro,
 * with a way back to the places people are usually looking for.
 */
export default function NotFound() {
  return (
    <>
      <Section ground="gradient" spacing="lg">
        <p className="text-label text-on-header-muted">404</p>
        <h1 className={`mt-space-2 max-w-[15em] text-on-header lg:mt-space-3 ${textH1}`}>
          This page doesn’t exist, but the work does.
        </h1>
        <div className="mt-space-5 flex flex-wrap gap-space-2">
          <Button href="/">Go home</Button>
          <Button href="/work" variant="bordered-inverse">
            See the work
          </Button>
        </div>
      </Section>
      <CurveDivider above="gradient-page" below="primary" />
    </>
  );
}
