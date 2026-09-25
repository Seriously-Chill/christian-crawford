/**
 * Responsive type-scale class strings, built from the Design System's own
 * real per-breakpoint steps (tokens.json `usage` notes — e.g. display:
 * "80/70/60/50/40/30px from desktop down to mobile"). The flat text-display
 * / text-h2 / etc. Tailwind utilities in globals.css hold the base
 * (desktop) values for non-headline uses; these hold the full responsive
 * stack for actual headings. body/label are excluded — the source
 * documents both as fixed, "does not scale by breakpoint."
 *
 * Tailwind is mobile-first (unprefixed = smallest), so each real step list
 * (given desktop→mobile) is reversed here: base is the smallest real value,
 * 2xl is the largest. h5 only has 4 real data points, not 6 — the two
 * skipped breakpoints simply inherit the previous tier rather than getting
 * an invented value.
 *
 * Tracking and leading are our own, not the source's: its display −0.07em /
 * h2 −0.04em tracking and 1.0 leading were tuned for a different face and
 * packed the letters until they nearly touched, with descenders running
 * into the next line. Plus Jakarta Sans is already tightly spaced, so it
 * wants even less: ≈ −0.012em at display size, −0.01em for h1/h2, and
 * near-zero (−0.005em) for h3–h5; ~1.05–1.1 leading at the top, ~1.25–1.35
 * for smaller headings rather than body text's 1.5. Every heading balances
 * its line breaks (`text-balance`) so no line is left with a lone word.
 */
export const textDisplay =
  "text-[30px] sm:text-[40px] md:text-[50px] lg:text-[60px] xl:text-[70px] 2xl:text-[80px] leading-[1.05] tracking-[-0.012em] font-normal text-balance";

/**
 * Inner-page titles (PageIntro, Contact): a step between display and h2, so
 * a page's h1 reads above its own section headings instead of matching them.
 */
export const textH1 =
  "text-[28px] sm:text-[32px] md:text-[38px] lg:text-[44px] xl:text-[52px] 2xl:text-[60px] leading-[1.08] tracking-[-0.01em] font-normal text-balance";

export const textH2 =
  "text-[24px] sm:text-[28px] md:text-[36px] lg:text-[42px] xl:text-[48px] 2xl:text-[56px] leading-[1.1] tracking-[-0.01em] font-normal text-balance";

export const textH3 =
  "text-[20px] sm:text-[22px] md:text-[25px] lg:text-[28px] xl:text-[30px] 2xl:text-[32px] leading-[1.25] tracking-[-0.005em] font-medium text-balance";

export const textH4 =
  "text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] leading-[1.25] tracking-[-0.005em] font-medium text-balance";

export const textH5 =
  "text-[14px] sm:text-[17px] lg:text-[19px] 2xl:text-[20px] leading-[1.35] tracking-[-0.005em] font-medium text-balance";
