"use client";

import { ReactLenis } from "lenis/react";
import { useSyncExternalStore, type ReactNode } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// Server/first-paint default: assume reduced motion so Lenis never mounts
// before we actually know the user's preference. useSyncExternalStore
// reconciles this against the real client value without a hydration mismatch.
function getServerSnapshot() {
  return true;
}

/**
 * Real behavior from motion.md, corrected: the source's Lenis init is
 * explicit, not "no options" — `new Lenis({ duration: 1.2, easing: (t) =>
 * Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 2, ... })`,
 * found inline on every page. `duration`/`easing` happen to match Lenis's
 * own library defaults (so leaving them unset is equivalent), but
 * `touchMultiplier: 2` is a real override — the library default is `1`.
 * This is the app's only reason to reach for a client component for scrolling.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ touchMultiplier: 2 }}>
      {children}
    </ReactLenis>
  );
}
