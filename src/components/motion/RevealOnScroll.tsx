"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PAGE_COVERED_ATTR, PAGE_REVEAL_EVENT } from "@/components/motion/PageTransition";
import { MAX_STAGGER_STEPS, REVEAL_LINE, REVEAL_READY_FLAG, STAGGER_MS } from "@/lib/motion";

/**
 * Progressive disclosure for the narrative sections (spec section 5/17:
 * "content appearing at intentional moments"). Every section on every page
 * goes through this one component, so the whole site enters the same way:
 * a fade plus a short rise, one duration, one curve (the `--*-entrance`
 * tokens and `.reveal` rule in globals.css).
 *
 * Staggering is automatic. All reveals share one IntersectionObserver, and
 * whatever it reports visible in the same callback is revealed as one
 * batch, in document order, `STAGGER_MS` apart. So the order holds on its
 * own: a page's intro, then the content under it, and a card grid that
 * scrolls in reveals its cards in sequence. An element that scrolls in on
 * its own starts immediately. Callers don't pass delays; an earlier
 * version took a fixed `delayMs` per element, so the fifth career entry
 * waited 400ms whenever it scrolled in, even with nothing before it.
 *
 * Content in view when the page arrives plays on arrival too, not only on
 * scroll. That's the hero, and on /about the first few career entries,
 * which used to sit still while the intro above them moved. Arrivals
 * behind the page-transition overlay wait for it to lift
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
