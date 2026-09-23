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
 */
export const textDisplay =
  "text-[30px] sm:text-[40px] md:text-[50px] lg:text-[60px] xl:text-[70px] 2xl:text-[80px] leading-none tracking-[-0.07em] font-normal";

export const textH2 =
  "text-[24px] sm:text-[28px] md:text-[36px] lg:text-[42px] xl:text-[48px] 2xl:text-[56px] leading-none tracking-[-0.04em] font-normal";

export const textH3 =
  "text-[20px] sm:text-[22px] md:text-[25px] lg:text-[28px] xl:text-[30px] 2xl:text-[32px] leading-[1.5] tracking-[-0.02em] font-medium";

export const textH4 =
  "text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] leading-[1.5] tracking-[-0.02em] font-medium";

export const textH5 =
  "text-[14px] sm:text-[17px] lg:text-[19px] 2xl:text-[20px] leading-[1.5] tracking-[-0.02em] font-medium";
