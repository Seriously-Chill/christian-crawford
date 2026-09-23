"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * The real, sourced page-transition preloader (motion.md): the header
 * gradient at a steeper, near-vertical angle and full opacity
 * (`linear-gradient(174deg, primary 0%, secondary 100%)`, confirmed via
 * `.elementor-kit-6 e-page-transition`), holding a static 70px logo mark
 * that only fades, never spins. A previous pass wrongly called this a
 * flat white overlay based on a less-specific `e-page-transition{
 * background:#fff}` fallback rule elsewhere in the same stylesheet — the
 * descendant selector above has higher specificity and wins regardless of
 * source order, so the gradient is what actually renders.
 *
 * The source plays this on route change — this app was single-page until
 * now, so it only ever ran once per session as an entrance (still true,
 * see layout.tsx). With real routes this fires on every client-side
 * navigation: a fresh element (keyed by the new pathname) mounts at full
 * opacity and fades out over the real 700ms duration, instead of fading
 * in — nothing to cover while the next page is still loading.
 */
export function PageTransition() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const [transitionKey, setTransitionKey] = useState<string | null>(null);

  useEffect(() => {
    if (previous.current !== pathname) {
      previous.current = pathname;
      setTransitionKey(pathname);
    }
  }, [pathname]);

  if (!transitionKey) return null;

  return (
    <div
      key={transitionKey}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10000 flex items-center justify-center bg-page-transition-gradient motion-safe:animate-page-transition-out motion-reduce:hidden"
    >
      <Image src="/logo-mark.svg" alt="" width={70} height={82} />
    </div>
  );
}
