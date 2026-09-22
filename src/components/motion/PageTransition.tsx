"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * The real, sourced page-transition preloader (motion.md, corrected): a
 * plain, ungradiented full-viewport overlay holding a static 70px logo
 * mark that only fades, never spins — the earlier "blue-gradient
 * preloader" claim was wrong. One deliberate departure from the literal
 * source: the real overlay background is `#fff`, but the real logo mark
 * is white-fill-only (confirmed against the actual asset), so on the
 * source site this combination is genuinely invisible — almost certainly
 * an authoring oversight, not a considered choice, and we only have the
 * white-fill mark to show. Using `bg-primary` instead keeps the real
 * flat-color/no-gradient correction while keeping the mark visible.
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
      className="pointer-events-none fixed inset-0 z-10000 flex items-center justify-center bg-primary motion-safe:animate-page-transition-out motion-reduce:hidden"
    >
      <Image src="/logo-mark.svg" alt="" width={70} height={82} />
    </div>
  );
}
