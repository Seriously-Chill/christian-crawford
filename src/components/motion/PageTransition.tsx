"use client";

import { LogoMark } from "@/components/ui/LogoMark";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Pause between the new route rendering and the reveal starting, so the
 * scroll reset and layout settling happen fully covered. The source holds
 * longer (~500ms) because it's waiting on a full page load; a client-side
 * route is ready almost immediately.
 */
const HOLD_MS = 100;
/** Give up waiting on a route that never renders and uncover the page. */
const ROUTE_TIMEOUT_MS = 8000;
/** Fallback in case `animationend` never fires (e.g. a backgrounded tab). */
const ANIMATION_SLACK_MS = 150;

/** Set on <html> while the overlay covers the page; see RevealOnScroll. */
export const PAGE_COVERED_ATTR = "data-page-covered";
/** Fired on window as the overlay starts lifting; see RevealOnScroll. */
export const PAGE_REVEAL_EVENT = "cc:page-reveal";

/**
 * cover  — fading in over the current page
 * wait   — fully covered, `router.push` sent, new route not rendered yet
 * hold   — fully covered, new route rendered, settling for HOLD_MS
 * reveal — fading out over the new page
 */
type Phase = "idle" | "cover" | "wait" | "hold" | "reveal";

/** A duration token from globals.css, in ms. */
function durationMs(token: "--duration-page-cover" | "--duration-page-reveal", fallback: number) {
  // The CSS pipeline may rewrite `300ms` as `.3s`, so honor either unit.
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const value = parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  return raw.endsWith("ms") ? value : value * 1000;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Same-origin, same-tab, plain left click to a different page: the only
 * clicks the transition takes over. Everything else (new-tab clicks,
 * downloads, external/mailto links, same-page `#`/query links) keeps the
 * browser's or Link's own behavior.
 */
function transitionTarget(e: MouseEvent): string | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const anchor = (e.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return null;
  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return null;
  // Pathname changes only: the overlay lifts when the pathname re-renders.
  if (url.pathname === location.pathname) return null;
  return url.pathname + url.search + url.hash;
}

/**
 * The real, sourced page-transition preloader (motion.md): the header
 * gradient at a steeper, near-vertical angle and full opacity
 * (`linear-gradient(174deg, primary 0%, secondary 100%)`, confirmed via
 * `.elementor-kit-6 e-page-transition`), holding a static 70px logo mark
 * that only fades, never spins.
 *
 * Both halves of the source's transition, measured live on igel.ua: the
 * overlay fades IN over the current page, holds while the next page
 * settles, then fades OUT to reveal it — same shape, shorter timings than
 * the source's ~2s (see the duration tokens in globals.css). An earlier
 * version only had the second half — it waited for the pathname to change,
 * by which point the new page had already replaced the old one, so every
 * navigation opened with a hard cut to a solid overlay.
 *
 * To fade in before navigating, plain internal link clicks are caught in
 * the capture phase and `preventDefault`ed — next/link skips any click
 * that's already default-prevented — then routed with `router.push` once
 * the page is covered. Navigations that can't be delayed (back/forward)
 * still get the hold + reveal. Reduced-motion visitors get none of it: no
 * overlay and no added delay, links navigate immediately.
 *
 * While covered, `<html data-page-covered>` is set, and the new page's
 * load-time entrance (RevealOnScroll `playOnLoad`) waits for
 * `PAGE_REVEAL_EVENT`, so it plays where it can be seen instead of
 * underneath the overlay.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const renderedPath = useRef(pathname);
  const pendingHref = useRef<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");

  // The covered flag is written here, synchronously, not in an effect: on
  // back/forward the new page's own effects can run before this
  // component's next render, and they need to see it already.
  function go(next: Phase) {
    phaseRef.current = next;
    const root = document.documentElement;
    if (next === "idle" || next === "reveal") root.removeAttribute(PAGE_COVERED_ATTR);
    else root.setAttribute(PAGE_COVERED_ATTR, "");
    setPhase(next);
  }

  // Fully covered: navigate, unless the route already rendered meanwhile.
  function finishCover() {
    if (phaseRef.current !== "cover") return;
    const href = pendingHref.current;
    pendingHref.current = null;
    if (!href || new URL(href, location.href).pathname === renderedPath.current) {
      go("hold");
      return;
    }
    go("wait");
    router.push(href);
  }

  // Cover: take over qualifying link clicks.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const href = transitionTarget(e);
      if (!href || prefersReducedMotion()) return;
      e.preventDefault();
      pendingHref.current = href;
      // A second click mid-transition just retargets the pending navigation.
      if (phaseRef.current === "idle" || phaseRef.current === "reveal") go("cover");
    }
    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick, true);
  }, []);

  // The route rendered. Layout effect, so a back/forward navigation mounts
  // its overlay before the new page's first paint.
  useLayoutEffect(() => {
    if (renderedPath.current === pathname) return;
    renderedPath.current = pathname;
    // Mid fade-in: `finishCover` will see the route already changed.
    if (phaseRef.current === "cover") return;
    if (phaseRef.current === "idle" && prefersReducedMotion()) return;
    go("hold");
  }, [pathname]);

  // Tell entrances waiting behind the overlay to play.
  useLayoutEffect(() => {
    if (phase === "reveal") window.dispatchEvent(new Event(PAGE_REVEAL_EVENT));
  }, [phase]);

  // Timed phase exits. Animated phases normally end on `animationend`;
  // these timers are the fallback.
  useEffect(() => {
    const exits: Partial<Record<Phase, [number, () => void]>> = {
      cover: [durationMs("--duration-page-cover", 300) + ANIMATION_SLACK_MS, finishCover],
      wait: [ROUTE_TIMEOUT_MS, () => go("reveal")],
      hold: [HOLD_MS, () => go("reveal")],
      reveal: [durationMs("--duration-page-reveal", 400) + ANIMATION_SLACK_MS, () => go("idle")],
    };
    const exit = exits[phase];
    if (!exit) return;
    const id = window.setTimeout(exit[1], exit[0]);
    return () => window.clearTimeout(id);
    // `finishCover`/`go` only touch refs and state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "idle") return null;

  return (
    <div
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.target !== e.currentTarget) return;
        if (phaseRef.current === "cover") finishCover();
        else if (phaseRef.current === "reveal") go("idle");
      }}
      className={`pointer-events-none fixed inset-0 z-10000 flex items-center justify-center bg-page-transition-gradient motion-reduce:hidden ${
        phase === "cover" ? "animate-page-transition-in" : phase === "reveal" ? "animate-page-transition-out" : ""
      }`}
    >
      <LogoMark className="h-auto w-[70px] text-on-header" />
    </div>
  );
}
