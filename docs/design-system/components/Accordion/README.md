# Accordion

Not in the original DS export — added after reviewing the About-us page's own custom CSS (`.vertical-acc__item .elementor-icon-box-description`), which real source uses for a "production process"/"values" progressive-disclosure list. Real, sourced pattern:

- Collapsed: `height:0; overflow:hidden; margin:0`.
- Opening transitions `height` and `margin` together over `1s cubic-bezier(0.4, 0, 0.2, 1)` — Material's "standard" easing curve, distinct from the ripple's `ease-out` and the entrance system's implicit `ease`. This is the slowest, most deliberate motion on the site; don't reuse this timing for anything faster-paced (hovers, nav, page transitions).
- No icon/chevron rotation or other decoration was captured in the source beyond the height/margin expand — kept minimal here too.

Production form: `src/components/ui/Accordion.tsx` — a single `AccordionItem` (title + expandable body), height measured via `scrollHeight` and set inline rather than animating to `height:auto` (which CSS can't transition natively). Each item manages its own open state independently — the source didn't confirm single-open-at-a-time behavior, so this doesn't invent that constraint.
