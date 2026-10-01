"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { EmployerLogo, type Employer } from "@/components/ui/EmployerLogo";
import { CircleButton } from "@/components/ui/CircleButton";

/** Seconds for one full set of logos to drift past: slow enough to read as ambient. */
const DRIFT_SECONDS = 60;
/** Time constant for easing into and out of the drift (hover, pause, after a step): ~3× this to settle. */
const EASE_MS = 180;
/** Time constant for a flick's momentum to bleed back into the drift; iOS-like. */
const COAST_MS = 325;
/** Release speed is measured over this much of the end of a drag. */
const VELOCITY_WINDOW_MS = 100;
/** Fastest a flick can send the strip, in px/ms. */
const MAX_FLICK = 6;
/** How far a press moves sideways before it counts as a drag rather than a tap or a page scroll. */
const DRAG_SLOP_PX = 4;
/** Wheel events further apart than this start a new gesture. */
const WHEEL_GESTURE_GAP_MS = 120;
/** Duration of a back/forward step. */
const STEP_MS = 450;

/** Frame-rate independent approach of `from` toward `to` with time constant `tau`. */
const approach = (from: number, to: number, dt: number, tau: number) =>
  to + (from - to) * Math.exp(-dt / tau);

/**
 * The employer logo strip: employer marks on their own tiles, drifting
 * slowly sideways. The track holds the list twice (the copy is hidden from
 * assistive tech), and the position wraps at one list's width, so it loops
 * without a seam in either direction.
 *
 * People can move it themselves rather than wait on the drift: drag with a
 * mouse, swipe on touch (vertical swipes still scroll the page), swipe
 * sideways on a trackpad, or step one logo at a time with the back and
 * forward buttons. All of them move the same position, driven from one
 * animation frame loop instead of a CSS animation.
 *
 * Motion is a speed that eases toward a target, never a switch between
 * moving and stopped: hover and pause ease it to zero, a flick carries its
 * release speed and bleeds back into the drift, and trackpad swipes are
 * smoothed with the same lerp Lenis gives the page, so the strip moves like
 * everything around it.
 *
 * Auto-moving content needs a way to stop it (WCAG 2.2.2), so the strip has
 * its own pause button, and the drift also stops on hover and while someone
 * is dragging. Under reduced motion it doesn't move at all: the copy is
 * dropped, the tiles simply wrap, and the controls are hidden.
 */
export function EmployerMarquee({ employers, label }: { employers: Employer[]; label: string }) {
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const motion = useRef({
    offset: 0,
    /** Current speed in px/ms; positive moves the logos left. */
    velocity: 0,
    /** A flick's momentum is decaying, on the slower coast curve. */
    coasting: false,
    /** One list's width including its trailing gap: the loop period. */
    period: 0,
    hovering: false,
    press: null as null | { x: number; y: number },
    dragging: false,
    lastX: 0,
    travel: 0,
    samples: [] as { t: number; travel: number }[],
    /** Trackpad distance not yet applied, eased in frame by frame. */
    wheelPending: 0,
    wheelAxis: null as null | "x" | "y",
    wheelLast: 0,
    step: null as null | { from: number; to: number; start: number },
  });

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const wrap = (x: number) => {
    const period = motion.current.period;
    return period ? ((x % period) + period) % period : 0;
  };

  // Direct input paints right away rather than on the next animation
  // frame, so the strip stays under the pointer even if frames lag.
  const paint = () => {
    if (trackRef.current) trackRef.current.style.translate = `${-motion.current.offset}px 0`;
  };

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const list = listRef.current;
    if (!track || !viewport || !list) return;
    const s = motion.current;
    let last = 0;
    let raf = 0;

    // Measured on resize rather than every frame.
    const measure = () => {
      s.period = list.offsetWidth;
      s.offset = wrap(s.offset);
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(list);

    const frame = (now: number) => {
      const dt = last ? Math.min(now - last, 100) : 0;
      last = now;
      if (reducedMotion()) {
        track.style.translate = "";
        s.velocity = 0;
        s.wheelPending = 0;
      } else if (!s.dragging) {
        if (s.step) {
          const t = Math.min((now - s.step.start) / STEP_MS, 1);
          const eased = 1 - (1 - t) ** 3;
          s.offset = wrap(s.step.from + (s.step.to - s.step.from) * eased);
          if (t === 1) s.step = null;
        } else {
          const drift = s.period / (DRIFT_SECONDS * 1000);
          const target = pausedRef.current || s.hovering ? 0 : drift;
          s.velocity = approach(s.velocity, target, dt, s.coasting ? COAST_MS : EASE_MS);
          if (s.coasting && Math.abs(s.velocity - target) < drift * 0.05) s.coasting = false;
          // The ease only approaches its target; land on it once the gap is
          // imperceptible, so a pause really stops rather than creeping.
          if (Math.abs(s.velocity - target) < 1e-4) s.velocity = target;
          // Lenis's lerp (0.1 at 60fps), so a trackpad swipe here eases like the page does.
          const wheelStep = s.wheelPending - approach(s.wheelPending, 0, dt, 1000 / 6);
          s.wheelPending -= wheelStep;
          s.offset = wrap(s.offset + s.velocity * dt + wheelStep);
        }
        track.style.translate = `${-s.offset}px 0`;
      }
      raf = requestAnimationFrame(frame);
    };

    // Only run while the strip is on screen.
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    });
    intersectionObserver.observe(viewport);

    // Sideways trackpad swipes move the strip; vertical ones are left to
    // scroll the page. Each gesture is locked to the axis of its first event,
    // since a real swipe drifts off-axis. Registered natively so it can
    // preventDefault.
    const onWheel = (event: WheelEvent) => {
      if (reducedMotion()) return;
      if (event.timeStamp - s.wheelLast > WHEEL_GESTURE_GAP_MS) s.wheelAxis = null;
      s.wheelLast = event.timeStamp;
      if (!s.wheelAxis && (event.deltaX || event.deltaY)) {
        s.wheelAxis = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? "x" : "y";
      }
      if (s.wheelAxis !== "x") return;
      event.preventDefault();
      // Lenis's own flag for "handled by a nested scroller": without it Lenis
      // still scrolls the page by the swipe's small vertical component.
      (event as WheelEvent & { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
      s.step = null;
      s.wheelPending += event.deltaX;
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      viewport.removeEventListener("wheel", onWheel);
    };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion() || (event.pointerType === "mouse" && event.button !== 0)) return;
    const s = motion.current;
    s.press = { x: event.clientX, y: event.clientY };
    // Touching a strip that's still gliding catches it, as on iOS.
    if (s.coasting) {
      s.velocity = 0;
      s.coasting = false;
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const s = motion.current;
    if (!s.press) return;
    if (!s.dragging) {
      // A press only becomes a drag once it moves sideways, so a tap, or a
      // vertical swipe the browser turns into a page scroll, leaves the
      // drift alone.
      if (Math.abs(event.clientX - s.press.x) < DRAG_SLOP_PX) return;
      s.dragging = true;
      s.step = null;
      s.wheelPending = 0;
      // Measured from the press, so the strip stays under the finger
      // rather than trailing it by the slop.
      s.lastX = s.press.x;
      s.samples = [];
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const moved = -(event.clientX - s.lastX);
    s.lastX = event.clientX;
    s.offset = wrap(s.offset + moved);
    // Velocity is read from total travel, which never wraps, so a sample
    // pair can't straddle the loop's seam.
    s.travel += moved;
    s.samples.push({ t: event.timeStamp, travel: s.travel });
    while (s.samples.length > 2 && event.timeStamp - s.samples[0].t > VELOCITY_WINDOW_MS) s.samples.shift();
    paint();
  };

  const endPress = (event: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const s = motion.current;
    s.press = null;
    if (!s.dragging) return;
    s.dragging = false;
    const first = s.samples[0];
    const latest = s.samples.at(-1);
    // Cancelled, or held still before letting go: no flick, just ease back into the drift.
    const flick =
      !cancelled && first && latest && latest.t > first.t && event.timeStamp - latest.t <= VELOCITY_WINDOW_MS
        ? (latest.travel - first.travel) / (latest.t - first.t)
        : 0;
    s.velocity = Math.max(-MAX_FLICK, Math.min(MAX_FLICK, flick));
    s.coasting = flick !== 0;
  };

  // Steps land on a tile edge, so a step always shows one whole new logo.
  const step = (direction: 1 | -1) => {
    const s = motion.current;
    const tile = listRef.current?.firstElementChild as HTMLElement | null;
    if (!tile || !listRef.current) return;
    const gap = parseFloat(getComputedStyle(listRef.current).columnGap) || 0;
    const size = tile.offsetWidth + gap;
    const from = s.step ? s.step.to : s.offset;
    s.step = { from: s.offset, to: (Math.round(from / size) + direction) * size, start: performance.now() };
    // The step replaces any glide; the drift eases back in once it lands.
    s.velocity = 0;
    s.coasting = false;
    s.wheelPending = 0;
  };

  const tiles = (hidden: boolean) => (
    <ul
      ref={hidden ? undefined : listRef}
      aria-label={hidden ? undefined : label}
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 gap-space-2 pr-space-2 motion-reduce:flex-wrap motion-reduce:pr-0 ${
        hidden ? "motion-reduce:hidden" : ""
      }`}
    >
      {employers.map((employer) => (
        <li
          key={employer}
          className="flex h-20 w-44 shrink-0 items-center justify-center rounded-lg border border-ink/10 bg-surface-raised text-ink/70 [--logo-h:1.75rem]"
        >
          <EmployerLogo employer={employer} labelled={!hidden} />
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <div
        ref={viewportRef}
        className="touch-pan-y select-none overflow-hidden mask-x-from-90% mask-x-to-100% motion-safe:cursor-grab motion-safe:active:cursor-grabbing motion-reduce:mask-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endPress(event, false)}
        onPointerCancel={(event) => endPress(event, true)}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") motion.current.hovering = true;
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") motion.current.hovering = false;
        }}
      >
        <div ref={trackRef} className="flex w-max will-change-[translate] motion-reduce:w-auto motion-reduce:will-change-auto">
          {tiles(false)}
          {tiles(true)}
        </div>
      </div>
      <div className="mt-space-2 flex justify-end gap-space-1 motion-reduce:hidden">
        <CircleButton icon="left" label="Scroll logos back" onClick={() => step(-1)} />
        <CircleButton
          icon={paused ? "play" : "pause"}
          label="Pause logo scroll"
          pressed={paused}
          onClick={() => setPaused((value) => !value)}
        />
        <CircleButton icon="right" label="Scroll logos forward" onClick={() => step(1)} />
      </div>
    </div>
  );
}
