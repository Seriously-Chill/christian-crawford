import Image from "next/image";
import { Button } from "@/components/ui/Button";

/**
 * Real DS behavior preserved: the header's own gradient (bg-header-gradient,
 * the exact 90deg/~90%-opacity stops from motion.md/Header README), the
 * white/on-header wordmark treatment, and the sticky positioning.
 *
 * One deliberate adaptation: the source site's header carried a 6-item
 * primary nav + mobile hamburger, because igel.ua is a 6-route multi-page
 * site. This is a single scrolling page (spec section 2/17 — an experience,
 * not a stack of conventional pages/nav targets), so there's nothing real
 * for a multi-item nav or a collapse-behind-a-hamburger pattern to point
 * at. Rather than inventing anchor links the spec never asked for, the nav
 * is reduced to what's real here: the wordmark and one way to get in touch.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-header-gradient">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-space-2 px-space-2 py-space-2 sm:px-space-3">
        <a
          href="#main-content"
          className="flex min-w-0 items-center gap-[10px] rounded-sm focus-visible:outline-offset-4"
          aria-label="Christian Crawford — back to top"
        >
          <Image src="/logo-mark.svg" alt="" width={26} height={31} priority className="shrink-0" />
          <span className="truncate text-sm text-on-header sm:text-label">Christian Crawford</span>
        </a>

        <Button href="#contact" variant="bordered-inverse" className="shrink-0">
          Contact
        </Button>
      </div>
    </header>
  );
}
