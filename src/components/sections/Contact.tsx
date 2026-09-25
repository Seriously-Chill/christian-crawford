import { CurveDivider } from "@/components/visuals/CurveDivider";
import { LineIcon } from "@/components/ui/LineIcon";
import { textH1, textH5 } from "@/lib/type";

const tile = "rounded-lg border border-on-header/10 bg-on-header/10 p-space-3 text-left";
const linkTile = `${tile} block transition-colors duration-300 hover:bg-on-header/20`;

/**
 * Own destination now (was the page's closing panel) — still the header's
 * own gradient. Contact details are the reference's contact tiles
 * (Address / Email / Phone / Social): each one its own glass card, the two
 * reachable ones linking straight through.
 */
export function Contact() {
  return (
    <section className="bg-header-gradient">
      <div className="mx-auto max-w-5xl px-space-3 py-space-7 text-center">
        <h1 className={`text-on-header ${textH1}`}>
          Let&apos;s talk about what you’re building.
        </h1>
        <ul className="mt-space-5 grid gap-space-3 sm:grid-cols-3">
          <li>
            <a href="mailto:christian.crawford@pm.me" className={linkTile}>
              <span className={`flex items-center gap-space-1 text-on-header ${textH5}`}>
                <LineIcon name="mail" />
                Email
              </span>
              <span className="mt-space-1 block text-body text-on-header/80">christian.crawford@pm.me</span>
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/christiancrawford"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
              className={linkTile}
            >
              <span className={`flex items-center gap-space-1 text-on-header ${textH5}`}>
                <LineIcon name="external" />
                LinkedIn
              </span>
              <span className="mt-space-1 block text-body text-on-header/80">in/christiancrawford</span>
            </a>
          </li>
          <li className={tile}>
            <span className={`flex items-center gap-space-1 text-on-header ${textH5}`}>
              <LineIcon name="pin" />
              Based in
            </span>
            <span className="mt-space-1 block text-body text-on-header/80">Cincinnati, Ohio</span>
          </li>
        </ul>
      </div>
      <CurveDivider above="gradient-header" below="primary" />
    </section>
  );
}
