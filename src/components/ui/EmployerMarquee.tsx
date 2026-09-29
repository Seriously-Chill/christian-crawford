"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { EmployerLogo, type Employer } from "@/components/ui/EmployerLogo";
import { CircleButton } from "@/components/ui/CircleButton";

/** Seconds for one full set of logos to drift past: slow enough to read as ambient. */
const DRIFT_SECONDS = 60;
/** How long the drift waits after someone drags, swipes, or steps before picking up again. */
const RESUME_AFTER_MS = 2000;
/** Duration of a back/forward step. */
const STEP_MS = 450;

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
 * animation frame loop instead of a CSS animation, so the drift picks up
 * from wherever someone left it.
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
    hovering: false,
    dragging: false,
    lastX: 0,
    resumeAt: 0,
    step: null as null | { from: number; to: number; start: number },
  });

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // One list's width, including its trailing gap: the distance after which
  // the track looks identical again.
  const wrap = useCallback((x: number) => {
    const period = listRef.current?.offsetWidth ?? 0;
    return period ? ((x % period) + period) % period : 0;
  }, []);

  // Direct input paints right away rather than on the next animation
  // frame, so the strip stays under the pointer even if frames lag.
  const paint = () => {
    if (trackRef.current) trackRef.current.style.translate = `${-motion.current.offset}px 0`;
  };

  const holdDrift = (extraMs = 0) => {
    motion.current.resumeAt = performance.now() + extraMs + RESUME_AFTER_MS;
  };

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    const s = motion.current;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      if (reducedMotion()) {
        track.style.translate = "";
      } else {
        if (s.step) {
          const t = Math.min((now - s.step.start) / STEP_MS, 1);
          const eased = 1 - (1 - t) ** 3;
          s.offset = wrap(s.step.from + (s.step.to - s.step.from) * eased);
          if (t === 1) s.step = null;
        } else if (!pausedRef.current && !s.hovering && !s.dragging && now >= s.resumeAt) {
          const period = listRef.current?.offsetWidth ?? 0;
          s.offset = wrap(s.offset + (period / (DRIFT_SECONDS * 1000)) * dt);
        }
        track.style.translate = `${-s.offset}px 0`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Sideways trackpad swipes move the strip; vertical ones are left to
    // scroll the page. Registered natively so it can preventDefault.
    const onWheel = (event: WheelEvent) => {
      if (reducedMotion() || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      s.step = null;
      s.offset = wrap(s.offset + event.deltaX);
      s.resumeAt = performance.now() + RESUME_AFTER_MS;
      track.style.translate = `${-s.offset}px 0`;
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener("wheel", onWheel);
    };
  }, [wrap]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion() || (event.pointerType === "mouse" && event.button !== 0)) return;
    const s = motion.current;
    s.dragging = true;
    s.step = null;
    s.lastX = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const s = motion.current;
    if (!s.dragging) return;
    s.offset = wrap(s.offset - (event.clientX - s.lastX));
    s.lastX = event.clientX;
    paint();
  };

  const endDrag = () => {
    if (!motion.current.dragging) return;
    motion.current.dragging = false;
    holdDrift();
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
    holdDrift(STEP_MS);
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
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") motion.current.hovering = true;
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") motion.current.hovering = false;
        }}
      >
        <div ref={trackRef} className="flex w-max motion-reduce:w-auto">
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
