Built from two real sources: the live site's full navigation and page copy (crawled at igel.ua/en/ — see `sitemap.md` and `content/`), and a complete saved copy of the homepage (`igel.html` + its `_files`) read directly off the user's Mac, which carries the site's actual compiled CSS, its Elementor color/typography kit, the real logo file, and 22 retailer logos. Every color, font, radius and spacing value in `tokens.json` is copied from that CSS, not estimated — see each token's `usage` note for exactly where it came from. The one gap: the saved copy is the homepage only, so a handful of values (nav-dropdown edge cases, other pages' unique sections) are inferred from the kit's sitewide defaults rather than confirmed page-by-page — flagged inline where that applies.

## Voice

Write in short, confident, benefit-first sentences that pair a mechanism with a payoff: "operates at 20º, saves energy, preserves the quality of fabrics"; "Less means – more efficiency, savings, and responsible consumption." Lead with care, not just performance — "purity created with respect for people and their time," "care and cleanliness are synonyms." Category pages open with a two-line tagline (e.g. "Cleaning power – without harming your hands. Shine of dishes – without unnecessary effort.") then move straight into named product features. Use "Christian Crawford" as a proper noun mid-sentence, set in `display`/`h2`. Values the copy keeps returning to: Quality, Innovations, Safety, Trust.

## Visual foundations

Every heading (`display` through `h5`), every button and nav label, and the sitewide default body text (`body`) are set in **Plus Jakarta Sans** (self-hosted variable font, `src/fonts/`). The source site used Poppins (its kit also defined Roboto and Roboto Slab as global font slots, but neither was applied on the captured page); production switched to Plus Jakarta Sans for a tighter, less generic face. The source's tight negative letter-spacing (−0.02em to −0.07em) was tuned for Poppins' wide letters and is kept in `tokens.json` only as a record — Plus Jakarta Sans is already tightly spaced, so production uses −0.012em at display size, −0.01em for h1/h2, −0.005em for h3–h5, and 0 for body and labels (see `src/lib/type.ts`). Use those on any new heading, not the source values.

Buttons are always a `radius-pill` (100px) with `12px 24px` padding: default state is `surface` fill with `primary` label/border; hover swaps to `primary` fill with `surface` label. Never invent a square or `radius-lg` button — the kit defines no such variant. Cards and tiles use `radius-lg` (24px, confirmed on every product-line card). Inputs and textareas use `radius-sm` (12px) with a translucent white border (`#FFFFFF33`) and transparent fill — which only reads correctly on a colored ground, so the real contact form sits inside a section painted with the header's blue gradient, not a plain white card as a generic form pattern would suggest; see `ContactForm`.

The header is the one place the brand's blue is used as a *background*, not an accent: `linear-gradient(90deg, #236FC4E6 0%, #58C4E6E6 100%)` (both stops at ~90% opacity) sits behind the nav. Nav items default to white at ~60% opacity (`on-header`) and go fully opaque on hover/active. The nav dropdown panel itself is solid `surface` with `radius-md` (15px), so dropdown items switch to `primary`-colored text there instead of white.

## Iconography

The real mark is a single-ink hedgehog-abstract silhouette — copied as-is into `Logos/logo-mark.svg`. It is drawn with `fill="white"` in the source file, which only makes sense on the blue header gradient or another dark/colored ground — never place it on plain `surface` without a colored backing shape behind it. `Logos/logo-pr.png` is the manufacturer's own PR GROUP mark, used on About and Contacts. `Retailers/` holds the 22 retailer logos shown in the "You can buy Christian Crawford here" strips on every product page — real files, not redrawn; if a retailer isn't in this set, don't approximate their mark, ask for the file.

## Motion

`motion.md` documents three real, sourced interactions: sitewide Lenis smooth scroll (default settings), the ripple hover on product-category cards (exact keyframes), and the blue-gradient page-transition preloader. Read it before adding any hover/scroll/transition behavior — don't default to a generic fade or a Material ripple where the source already has a specific one.

## Site

`sitemap.md` lists every route this build found under `/en/`. `content/` holds the verbatim copy for each one — read those before writing new copy in this voice, and quote them rather than paraphrasing when precision matters (product names, feature claims, retailer names).
