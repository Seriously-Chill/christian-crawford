import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";

/**
 * Real DS behavior preserved: the header's own gradient (bg-header-gradient,
 * the exact 90deg/~90%-opacity stops from motion.md/Header README), the
 * white/on-header wordmark treatment, and the sticky positioning. The nav
 * itself — six real routes, exact order/label, mobile collapse — lives in
 * `Nav` (a Client Component; it needs the current pathname for the active
 * state and open/close state for the mobile panel). Everything else here
 * stays a Server Component.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-header-gradient">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-space-2 px-space-2 py-space-2 sm:px-space-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-[10px] rounded-sm focus-visible:outline-offset-4"
          aria-label="Christian Crawford — home"
        >
          <Image src="/logo-mark.svg" alt="" width={26} height={31} priority className="shrink-0" />
          <span className="truncate text-sm text-on-header sm:text-label">Christian Crawford</span>
        </Link>

        <Nav />
      </div>
    </header>
  );
}
