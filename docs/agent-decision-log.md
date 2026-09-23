# Agent Decision Log

## Governance Integrity Protection

Ported from voltron's `hewa-client-web` client (`.claude/hooks/governance-integrity-*.sh`,
introduced on the `feature/whitelabel-brand-wiring` branch). That project found that an
agent operating under a set of hooks/rules can also edit the files that define those
hooks/rules — weakening its own constraints is a structurally different risk than a bug
in application code, and deserves its own gate rather than relying on the same review
that catches ordinary bugs.

The layer here is scoped down to what this repo actually has:

- `.claude/settings.json`, `.claude/hooks/*.sh`, `.claude/rules/*.md` — the enforcement
  wiring itself.
- `CLAUDE.md` / `AGENTS.md` — the operating contract.
- `docs/agent-decision-log.md` — this file, the record of why the setup exists.

Three hooks cover it:

- `governance-integrity-files.sh` (PreToolUse, Edit|Write) — asks for confirmation before
  any Edit/Write tool call touches one of the files above.
- `governance-integrity-bash-check.sh` (PostToolUse, Bash) — catches the same files being
  changed by a Bash command (`sed -i`, heredoc redirects, `cp`, etc.) instead of the
  Edit/Write tools, which the first hook can't see. Uses file mtimes rather than
  `git status --porcelain` because `.claude/` is globally gitignored on this machine and
  never shows up as dirty.
- `governance-integrity-mark.sh` (PostToolUse, Edit|Write) — marks a file as "already
  reviewed" right after an approved edit, so the Bash-check hook doesn't re-flag the same
  change a second time.

Not ported: the multi-brand config check, Apollo/auth approval gate, quality gate,
docs-drift check, and accessibility gate that also live in that hooks directory. Those
address `hewa-client-web`'s specific concerns (three white-labeled brand configs, a
GraphQL/auth surface, an accessibility audit pipeline) that don't exist in this repo.

**Adaptation**: `AGENTS.md` is excluded from `governance-integrity-bash-check.sh`'s
mtime watch. `node_modules/next/dist/server/lib/generate-agent-files.js` rewrites this
project's `AGENTS.md` on its own whenever `next dev` runs, independent of anything the
agent does — watching it there would flag the dev server itself as an unreviewed Bash
edit on every session. Direct edits via the Edit/Write tools are still caught by
`governance-integrity-files.sh`; only the Bash-bypass check needed the exclusion.

**Known first-run gap**: `governance-integrity-bash-check.sh` compares file mtimes
against a per-session baseline marker written by `session-baseline.sh` (a SessionStart
hook). The session that first creates `.claude/settings.json` starts before that hook is
wired in, so no baseline exists yet — every governance file looks "newly changed" and
gets flagged on the first Bash command after setup. This is expected: it's the same gate
that would catch a real bypass, just firing on its own bootstrap. From the next session
onward, the baseline exists from `SessionStart` and this doesn't recur.
