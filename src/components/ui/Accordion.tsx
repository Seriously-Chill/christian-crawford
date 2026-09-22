"use client";

import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { textH4 } from "@/lib/type";

/**
 * Real, sourced pattern from the About-us page's own custom CSS
 * (`.vertical-acc__item .elementor-icon-box-description`) — see
 * docs/design-system/components/Accordion/README.md and motion.md.
 * Collapsed: height 0, overflow hidden, margin 0. Opening transitions
 * height (measured via scrollHeight, since CSS can't transition to
 * `height: auto`) over the real 1s cubic-bezier(0.4, 0, 0.2, 1) — the
 * slowest, most deliberate motion on the site, reserved for this kind of
 * progressive disclosure. Each item manages its own open state
 * independently; the source didn't confirm single-open-at-a-time
 * behavior, so this doesn't invent that constraint.
 */
export function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // CSS can't transition to `height: auto`, so the open height is measured
  // and set explicitly. useLayoutEffect (not useEffect) because this reads
  // real layout (scrollHeight) and writes it back as state before paint —
  // exactly the case it exists for, not the "avoid an effect" anti-pattern.
  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    setHeight(open ? node.scrollHeight : 0);
  }, [open, children]);

  return (
    <div className="border-b border-ink/10 py-space-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-space-3 text-left"
      >
        <span className={`text-ink ${textH4}`}>{title}</span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-h4 text-primary transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <div
        id={id}
        ref={contentRef}
        style={{ height }}
        className="overflow-hidden transition-[height,margin] duration-(--duration-accordion) ease-(--ease-accordion) motion-reduce:transition-none"
      >
        <p className="max-w-xl pt-space-2 text-body text-ink/72">{children}</p>
      </div>
    </div>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="border-t border-ink/10">{children}</div>;
}
