# christiancrawford.dev

Source for [christiancrawford.dev](https://christiancrawford.dev), the portfolio of Christian Crawford, a senior engineer who came to frontend architecture from design.

The site is small, but it's built the way I'd build for a team: a documented design system, Server Components by default, accessibility enforced by tests, and Claude Code working inside rules it can't quietly change.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Playwright + axe-core · Lighthouse CI

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
```

## Tests

```bash
npm run test:a11y        # Playwright suite in Chromium and WebKit
npm run test:lighthouse  # production build + Lighthouse CI budgets
```

The Playwright suite builds and serves the site on port 4310. It covers:

- **Accessibility**: axe-core on every route, plus WCAG 2.2 AA contrast on every route at each of the 29 settings the header's color picker can produce (`tests/a11y-colors.spec.ts`)
- **Keyboard**: navigation, menus and the color picker (`tests/keyboard.spec.ts`)
- **Reflow and text spacing**: content at 320px and under WCAG text-spacing overrides (`tests/reflow.spec.ts`)
- **Navigation**: page titles, and that client-side page changes are announced and keep focus in the right place (`tests/navigation.spec.ts`)

Screen-reader passes are manual; the checklist is in [`docs/screen-reader-checklist.md`](docs/screen-reader-checklist.md).

## Where to look

| Path | What's there |
|---|---|
| [`docs/IMPLEMENTATION_MAP.md`](docs/IMPLEMENTATION_MAP.md) | What each route is built from and where the code lives |
| [`docs/design-system/`](docs/design-system/) | Tokens, motion and component guidelines |
| [`docs/agent-decision-log.md`](docs/agent-decision-log.md) | Why the Claude Code governance hooks exist and what was left out |
| [`.claude/`](.claude/) | Hook wiring (`settings.json`) and the hook scripts |

## AI governance

I build this site with Claude Code. The hooks in `.claude/hooks/` treat changes to the agent's own rules (`CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, the hook scripts and the decision log) differently from ordinary edits: Edit/Write tool calls ask for confirmation first, and changes made through shell commands are caught afterward and stopped for review. The [AI page](https://christiancrawford.dev/ai) walks through how it works and its trade-offs.

`AGENTS.md` is written and re-added by `next dev`; see the note inside it.
