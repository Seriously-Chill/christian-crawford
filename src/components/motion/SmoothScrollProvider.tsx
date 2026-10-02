"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { useSyncExternalStore, type ReactNode } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Server/first-paint default: assume reduced motion so Lenis never mounts
// before we actually know the user's preference. useSyncExternalStore
// reconciles this against the real client value without a hydration mismatch.
function getServerSnapshot() {
  return true;
}

/**
 * Sitewide smooth scroll (docs/design-system/motion.md): Lenis's defaults,
 * except `touchMultiplier: 2` (default `1`) so touch scrolling keeps pace.
 *
 * Lenis measures the page by watching <html>'s size, so <html> must grow
 * with its content: lenis.css sets `height: auto` on it, and layout.tsx
 * sizes <body> with `min-h-dvh`. With <html> pinned to the viewport, Lenis
 * kept the first page's scroll limit for the whole visit, so scrolling
 * stopped short on any longer page navigated to afterward.
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
