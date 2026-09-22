# Header

Renders on all 18 routes: wordmark, primary nav, language selector, mobile menu toggle. The bar's background is the real `linear-gradient(90deg, primary 0%, secondary 100%)` at ~90% opacity — not a solid or a white bar. Nav labels default to `on-header` (white at ~60% opacity); the active route and any hover/focus state go fully opaque white. Six items, exact order and label: Home, About us, Product, Innovations, News, Contacts.

The dropdown panel (when a nav item expands) is a *separate* surface: solid `surface` white, `radius-md` (15px), so its items switch to `primary`-colored text instead of white — don't carry the header's white-on-gradient treatment into the dropdown.

Below the header breakpoint the primary nav collapses behind a toggle button; opening it reveals the same six links stacked, full-width, over the same gradient. The logo mark (`Logos/logo-mark.svg`) is drawn white-on-transparent specifically to sit on this gradient — see the root README's Iconography note.
