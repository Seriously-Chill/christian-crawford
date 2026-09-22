/**
 * Responsive type-scale class strings for headings (the steps are listed
 * in docs/design-system/tokens.json). The flat text-display / text-h2 /
 * etc. Tailwind utilities in globals.css hold the base (desktop) values
 * for non-headline uses; these hold the full responsive stack for actual
 * headings. body/label are excluded: both stay fixed at every breakpoint.
 *
 * Tailwind is mobile-first (unprefixed = smallest): base is the smallest
 * step, 2xl the largest. h5 has 4 steps, not 6 — the two skipped
 * breakpoints simply inherit the previous tier.
 *
 * Plus Jakarta Sans is already tightly spaced, so tracking stays light:
 * ≈ −0.012em at display size, −0.01em for h1/h2, and
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
