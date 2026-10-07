"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  MAX_STAGGER_STEPS,
  PAGE_COVERED_ATTR,
  PAGE_REVEAL_EVENT,
  REVEAL_LINE,
  REVEAL_READY_FLAG,
  STAGGER_MS,
} from "@/lib/motion";

/**
 * Diagrams and evidence enter through this one component: a fade plus a
 * short rise, one duration, one curve (the `--*-entrance` tokens and
 * `.reveal` rule in globals.css). Headings and running text don't use it;
 * they're on the page from the start.
 *
 * Staggering is automatic. All reveals share one IntersectionObserver, and
 * whatever it reports visible in the same callback is revealed as one
 * batch, in document order, `STAGGER_MS` apart. An element that scrolls in
 * on its own starts immediately, so callers don't pass delays.
 *
 * Content in view when the page arrives plays on arrival too, not only on
 * scroll. Arrivals behind the page-transition overlay wait for it to lift
 * (`PAGE_REVEAL_EVENT`), so they play where they can be seen.
 *
 * Content is hidden only by CSS under `html[data-reveal]` (see
 * lib/motion.ts), only under `prefers-reduced-motion: no-preference`, so
 * no-JS and reduced-motion visits are simply visible. It's hidden from
 * the first paint, so nothing is painted in place and then pulled away.
 *
 * On a full page load the first screen doesn't wait for this component:
 * `revealArrivalScript` (lib/motion.ts) starts it from inline HTML, before
 * hydration, and this picks up everything below it. That script sets
 * attributes on this div before React hydrates it, hence
 * `suppressHydrationWarning` (it covers this element's own attributes only).
 */
export function RevealOnScroll({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observe(node);
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} suppressHydrationWarning>
      {children}
    </div>
  );
}

let observer: IntersectionObserver | null = null;
/** Visible while the overlay covers the page; revealed as it lifts. */
const waiting = new Set<Element>();

if (typeof window !== "undefined") {
  (window as unknown as Record<string, boolean>)[REVEAL_READY_FLAG] = true;
  window.addEventListener(PAGE_REVEAL_EVENT, () => {
    const batch = [...waiting].filter((el) => el.isConnected);
    waiting.clear();
    reveal(batch);
  });
}

function observe(node: Element) {
  observer ??= new IntersectionObserver(onIntersect, {
    // Trigger once the top edge is ~12% into the viewport. A ratio
    // threshold would make tall blocks (card grids) wait until a share of
    // their height was on screen, so they'd reveal late.
    rootMargin: `0px 0px -${Math.round((1 - REVEAL_LINE) * 100)}% 0px`,
    threshold: 0,
  });
  observer.observe(node);
  return () => {
    observer?.unobserve(node);
    waiting.delete(node);
  };
}

function onIntersect(entries: IntersectionObserverEntry[]) {
  const batch: Element[] = [];
  for (const entry of entries) {
    // Already played by the arrival script.
    if (entry.target.hasAttribute("data-revealed")) {
      observer?.unobserve(entry.target);
      continue;
    }
    // Already scrolled past (a restored scroll position or a hash link):
    // show it now rather than leave a hidden block above the reader.
    const above = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
    if (!entry.isIntersecting && !above) continue;
    observer?.unobserve(entry.target);
    if (above) entry.target.setAttribute("data-revealed", "");
    else batch.push(entry.target);
  }
  if (!batch.length) return;
  if (document.documentElement.hasAttribute(PAGE_COVERED_ATTR)) {
    batch.forEach((el) => waiting.add(el));
    return;
  }
  reveal(batch);
}

function reveal(batch: Element[]) {
  batch
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    .forEach((el, i) => {
      (el as HTMLElement).style.setProperty("--reveal-delay", `${Math.min(i, MAX_STAGGER_STEPS) * STAGGER_MS}ms`);
      el.setAttribute("data-revealed", "");
    });
}
