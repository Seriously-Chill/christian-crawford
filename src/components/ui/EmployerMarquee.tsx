"use client";

import { useState } from "react";
import { EmployerLogo, type Employer } from "@/components/ui/EmployerLogo";
import { CircleButton } from "@/components/ui/CircleButton";

/**
 * Production form of the reference's "Where to buy" strip: employer marks on
 * their own tiles, drifting slowly sideways. The track holds the list twice
 * (the copy is hidden from assistive tech) and loops by shifting half its
 * width.
 *
 * Auto-moving content needs a way to stop it (WCAG 2.2.2), so the strip has
 * its own pause button (the reference's round slider control) as well as
 * pausing on hover. Under reduced motion it
 * doesn't move at all: the copy is dropped and the tiles simply wrap.
 */
export function EmployerMarquee({ employers, label }: { employers: Employer[]; label: string }) {
  const [paused, setPaused] = useState(false);

  const tiles = (hidden: boolean) => (
    <ul
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
      <div className="overflow-hidden mask-x-from-90% mask-x-to-100% motion-reduce:mask-none">
        <div
          className={`flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none ${
            paused ? "[animation-play-state:paused]" : ""
          }`}
        >
          {tiles(false)}
          {tiles(true)}
        </div>
      </div>
      <div className="mt-space-2 flex justify-end motion-reduce:hidden">
        <CircleButton
          icon={paused ? "play" : "pause"}
          label="Pause logo scroll"
          pressed={paused}
          onClick={() => setPaused((value) => !value)}
        />
      </div>
    </div>
  );
}
