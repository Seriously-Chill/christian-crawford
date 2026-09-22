"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Small IntersectionObserver-driven reveal used for progressive disclosure
 * across the narrative sections (spec section 5/17: "content appearing at
 * intentional moments" rather than everything stacked and visible at once).
 *
 * Not part of the original Design System (iGel's site didn't scroll-reveal
 * content) — this is new, built only from the DS's own timing/easing values
 * so it still feels of a piece with the rest of the motion system rather
 * than inventing an unrelated effect.
 *
 * Content defaults to VISIBLE. Hiding-then-revealing is something this
 * component opts into client-side, and only for an element it has confirmed
 * is (a) actually below the fold and (b) not under prefers-reduced-motion —
 * so a no-JS visit, a reduced-motion visit, and an already-in-view element
 * on load are all just... visible. Nothing is ever gated behind motion.
 */
export function RevealOnScroll({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
  }, []);

  return (
    <div
      ref={ref}
      // Deliberately transform-only, no opacity. Text under an
      // IntersectionObserver-gated opacity fade reads as low-contrast to a
      // static accessibility scan (and to a user if the observer ever fails
      // to fire) even though it's invisible off-screen either way. A
      // vertical offset achieves the same "arriving as you scroll" feel
      // without ever putting real content in a reduced-contrast state.
      className={`transition-transform duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        hidden ? "translate-y-6" : "translate-y-0"
      } ${className}`}
      style={{ transitionDelay: !hidden ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
