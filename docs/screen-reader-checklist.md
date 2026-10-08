# Screen reader checklist

The Playwright suite checks the structure a screen reader depends on:
accessible names, states, landmarks, headings, the route announcer's live
region, and focus. What it can't check is what a screen reader actually says
and in what order. That takes a person with a screen reader running. Work
through this list before a release that changes layout, navigation, or any
interactive control.

Test at least:

- **VoiceOver + Safari** on macOS (Cmd+F5) and on iOS
- **NVDA + Firefox or Chrome** on Windows

For each item, the expected result is what you should hear, not the exact
wording. Screen readers phrase things differently.

## Every page

- [ ] **Page load.** The page title is read, for example "About — Christian Crawford".
- [ ] **Skip link.** The first Tab reads "Skip to main content, link". Activating it moves the reading position to the page's h1.
- [ ] **Landmarks** (VO rotor or NVDA's D key): one banner, a navigation named "Main", one main, a navigation named "Footer", and one content info. None of them is unnamed or repeated.
- [ ] **Headings** (VO rotor or NVDA's H key): exactly one level-1 heading, which makes sense on its own, and no gaps in the heading levels.
- [ ] **Decorative art** (curves, illustrations, the hero’s miniature brand sites) is silent. Nothing reads as "image" or "group" with no name.

## Navigation

- [ ] **Header nav.** The current page's link is read as "current page".
- [ ] **Changing page with a header link.** The new page's title (or its h1) is announced once, and the reading position stays on the link you used.
- [ ] **Changing page with an in-page link** (Work → HealthWarehouse). The new page is announced, and the next swipe or arrow starts at the top of the new page's content, not in the middle.
- [ ] **Page transition** (with Reduce Motion off). You hear no stray announcement from the overlay: no repeated "Christian Crawford" and no silence where the page should be.
- [ ] **Mobile menu** (phone width, or iOS). The toggle reads "Open menu, button, collapsed", then "Close menu, button, expanded" when open. With it open, the five links are reachable and the page behind them isn't. Closing it returns you to the toggle.

## Controls

- [ ] **Color picker.** The toggle names what it does. The hue slider reads its value as "Hue N°" and updates as you adjust it. The panel’s explanation and its “How it’s tested” link are read first. The Spruce, Aqua, Gray, White and Black buttons read as toggle buttons with their pressed state. The name of the chosen color is announced politely, without interrupting.
- [ ] **External links** (LinkedIn, GitHub source) say they open in a new tab.
- [ ] **Résumé link** makes clear it's a PDF download.
- [ ] **Email links** read the address, not only "Email".

## Zoom and text settings (with the screen reader off)

- [ ] **Browser zoom at 200% and 400%.** No horizontal scrolling, and the mobile menu scrolls to its last link.
- [ ] **iOS Larger Text or macOS text size** set high. No text is clipped or overlapping.
