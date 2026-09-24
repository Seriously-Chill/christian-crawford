"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PAGE_COVERED_ATTR, PAGE_REVEAL_EVENT } from "@/components/motion/PageTransition";

/**
 * Small IntersectionObserver-driven reveal used for progressive disclosure
 * across the narrative sections (spec section 5/17: "content appearing at
 * intentional moments" rather than everything stacked and visible at once).
 *
 * Timing corrected against motion.md's real, sourced sitewide entrance
 * system (Elementor's `animated`/`animated-slow` + fadeIn/fadeInUp,
 * confirmed on Home/Innovations/News): `durationMs` now defaults to the
 * real 1250ms ("animated"), with `playOnLoad` sections passing 2000ms
 * ("animated-slow", reserved for hero-tier content) — an earlier pass
 * used an invented 700ms with no stagger. The real system also pairs
 * every element with an explicit ~100ms-per-element delay; callers should
 * pass `delayMs` in 100ms steps to match.
 *
 * Still deliberately transform-only, no opacity — that part isn't a
 * fidelity gap, it's a real accessibility tradeoff kept on purpose: text
 * under an IntersectionObserver-gated opacity fade reads as low-contrast
 * to a static accessibility scan (and to a user if the observer ever
 * fails to fire) even though it's invisible off-screen either way. A
 * vertical offset achieves the same "arriving" feel without ever putting
 * real content in a reduced-contrast state.
 *
 * Content defaults to VISIBLE. Hiding-then-revealing is something this
 * component opts into client-side, and only once it has confirmed motion
 * is safe — so a no-JS visit and a reduced-motion visit are both just...
 * visible. Nothing is ever gated behind motion.
 *
 * `playOnLoad` entrances that mount behind the page-transition overlay
 * wait for it to start lifting (PageTransition's `PAGE_REVEAL_EVENT`)
 * rather than playing out unseen underneath it.
 */
export function RevealOnScroll({
  children,
  className = "",
  delayMs = 0,
  durationMs = 1250,
  playOnLoad = false,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
  playOnLoad?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Above-the-fold content (the real source's hero fadeIn/fadeInUp plays
  // on load, not on scroll) starts hidden immediately, keyed only on the
  // `playOnLoad` prop — never on `typeof window`, which would make the
  // server (no window) and the client's first hydration pass (has
  // window) compute different initial values for the same prop and break
  // hydration. Whether a *reduced-motion* visitor ever actually sees that
  // hidden state is corrected below, entirely inside an effect — effects
  // only run post-hydration, so they can read browser-only state safely
  // without this class of mismatch.
  const [hidden, setHidden] = useState(playOnLoad);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (playOnLoad) {
      if (reduced) {
        const id = requestAnimationFrame(() => setHidden(false));
        return () => cancelAnimationFrame(id);
      }
      let raf1 = 0;
      const play = () => {
        raf1 = requestAnimationFrame(() => {
          requestAnimationFrame(() => setHidden(false));
        });
      };
      if (!document.documentElement.hasAttribute(PAGE_COVERED_ATTR)) {
        play();
        return () => cancelAnimationFrame(raf1);
      }
      window.addEventListener(PAGE_REVEAL_EVENT, play, { once: true });
      return () => {
        window.removeEventListener(PAGE_REVEAL_EVENT, play);
        cancelAnimationFrame(raf1);
      };
    }

    if (reduced) return;

    const rect = node.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight * 0.9;
    if (alreadyVisible) return;

    setHidden(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [playOnLoad]);

  return (
    <div
      ref={ref}
      className={`transition-transform ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        hidden ? "translate-y-6" : "translate-y-0"
      } ${className}`}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionDelay: !hidden ? `${delayMs}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
