"use client";

import { LogoMark } from "@/components/ui/LogoMark";
import { useEffect, useRef } from "react";

/**
 * Morph cycles played on load: 2 × 2.4s = 4.8s. WCAG 2.2.2 (Pause, Stop,
 * Hide) lets motion that starts on its own run without a pause control only
 * if it stops within 5 seconds.
 */
const LOAD_CYCLES = 2;

/**
 * The header's mark, with its two shapes gently changing shape like liquid
 * glass. It plays briefly on load, then keeps going only while the
 * surrounding link is hovered or focused, which the visitor chose to do.
 * On leave it finishes the current cycle so it settles back on the true
 * shape rather than snapping. Never starts for prefers-reduced-motion
 * (WCAG 2.3.3), and stops if that preference turns on mid-run.
 *
 * Cost: two ~40-segment paths re-rasterized at 36px. There's no layout
 * work and no filter, and it's idle outside those windows.
 */
export function FluidLogoMark({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const anims = [...svg.querySelectorAll("animate")];
    if (!anims.length || typeof anims[0].beginElement !== "function") return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const host = svg.closest("a") ?? svg;
    const cycleMs = anims[0].getSimpleDuration() * 1000;

    let timer: number | undefined;
    let cyclesLeft = 0;
    let engaged = false;

    const stop = () => {
      window.clearTimeout(timer);
      timer = undefined;
      anims.forEach((a) => a.endElement());
    };
    // Wake at each cycle boundary, when the shapes are back at rest. Timed
    // off the SVG's own clock, not setInterval, which would drift out of
    // phase over a long hover and stop mid-morph.
    const scheduleCycleEnd = () => {
      const elapsed = (svg.getCurrentTime() - anims[0].getStartTime()) * 1000;
      const remaining = cycleMs - (elapsed % cycleMs);
      timer = window.setTimeout(onCycleEnd, remaining < 50 ? remaining + cycleMs : remaining);
    };
    const onCycleEnd = () => {
      cyclesLeft -= 1;
      if (!engaged && cyclesLeft <= 0) stop();
      else scheduleCycleEnd();
    };
    const play = (cycles: number) => {
      if (motion.matches) return;
      cyclesLeft = Math.max(cyclesLeft, cycles);
      if (timer !== undefined) return;
      anims.forEach((a) => a.beginElement());
      scheduleCycleEnd();
    };

    const engage = () => {
      engaged = true;
      play(1);
    };
    const release = () => {
      engaged = host.matches(":hover") || host.matches(":focus-visible");
    };
    const onMotionChange = () => {
      if (motion.matches) stop();
    };

    play(LOAD_CYCLES);
    host.addEventListener("pointerenter", engage);
    host.addEventListener("pointerleave", release);
    host.addEventListener("focusin", engage);
    host.addEventListener("focusout", release);
    motion.addEventListener("change", onMotionChange);
    return () => {
      stop();
      host.removeEventListener("pointerenter", engage);
      host.removeEventListener("pointerleave", release);
      host.removeEventListener("focusin", engage);
      host.removeEventListener("focusout", release);
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <LogoMark ref={ref} fluid className={className} />;
}
