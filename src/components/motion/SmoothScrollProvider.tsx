"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
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
 * Sitewide smooth scroll (docs/design-system/motion.md): Lenis's own
 * default duration and easing, with `touchMultiplier: 2` (the library
 * default is `1`) so touch scrolling keeps pace. This is the app's only
 * reason to reach for a client component for scrolling.
 *
 * Lenis measures the page by watching <html>'s size, so <html> must grow
 * with its content: lenis.css sets `height: auto` on it, and layout.tsx
 * sizes <body> with `min-h-dvh` rather than a fixed-height <html>. With
 * <html> pinned to the viewport, Lenis kept the first page's scroll limit
 * for the whole visit — land on a short page, navigate to a longer one,
 * and scrolling stopped at the short page's length.
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
