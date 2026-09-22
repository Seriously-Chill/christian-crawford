# ProductCategoryCard

Used six times on Home and again on the Product index — one card per product line, always in the same order (washing gels, floor cleaning, conditioners & rinses, toilet bowl cleaners, cleaning products, dishwashing gels). `radius-lg` (24px) is confirmed on all six cards, not a rounded guess.

**Correction:** an earlier pass of this doc said the card surface was `surface-raised` (`#F8F8FA`) — checked directly against the Product index page's own CSS (element `4827d4a`) and that's wrong. The real rule is `background-color:#FFFFFF1A; border:1px solid #FFFFFF1A` — a barely-there 10%-opacity white glass tint, not a filled gray box — with `padding:24px` desktop / `16px` mobile (also not previously documented). Like `ContactForm`'s translucent inputs, this only reads on a colored or dark ground; on a plain white/`surface` page it's invisible and needs an ink-tinted equivalent instead of a literal copy.

Category name in `h5`, one-sentence benefit description in `body`/`ink`, "More details" as a plain text `Button`-style link in `primary`. Keep the description to one sentence — the source never runs longer.

Hover triggers the real `ripple` effect (see `motion.md`): a soft pulse centered on the card, `scale(1→3)` / `opacity(0.6→0)` over `0.8s ease-out`, hover-capable pointers only. This card is the one place on the site that effect is used — don't add it to other cards or buttons.
