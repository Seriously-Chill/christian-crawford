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
 * Real behavior from motion.md: Lenis runs site-wide with no custom
 * duration/easing/wheelMultiplier override anywhere in the source bundle,
 * so this deliberately passes zero custom options — Lenis's own defaults.
 * This is the app's only reason to reach for a client component for scrolling.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return <ReactLenis root>{children}</ReactLenis>;
}
