#!/bin/bash

# Bash-effect counterpart to governance-integrity-files.sh — sed -i, heredoc redirects, cp,
# etc. against the governance files bypass the Edit/Write-only ask gate the same way they'd
# bypass any other PreToolUse hook scoped to Edit|Write. Checks the effect (did a
# governance-layer file change this session) rather than enumerating every shell idiom that
# could write to one. Uses file mtimes directly rather than `git status --porcelain`, since
# .claude/ is globally gitignored on this machine and never shows up as dirty. Hooks are
# enumerated via `find`, not a fixed list, so a new hook script added later is automatically
# covered.
#
# AGENTS.md is deliberately NOT watched here: node_modules/next/dist/server/lib/
# generate-agent-files.js rewrites it on its own schedule whenever `next dev` runs, so its
# mtime moves independently of anything Claude does. Watching it here would false-flag the
# dev server as an "unreviewed Bash edit" on every session. Direct edits to AGENTS.md via
# the Edit/Write tools are still caught by governance-integrity-files.sh's ask gate — this
# hook only covers the Bash-bypass path for the files that don't have an external writer.
#
# Flag files double as a mark of "already accounted for": governance-integrity-mark.sh (a
# PostToolUse/Edit|Write hook) touches the same flag file right after an Edit/Write change
# already approved via governance-integrity-files.sh's PreToolUse ask, so an mtime bump from
# an approved edit doesn't get flagged again here as if an unreviewed Bash write caused it.
# A real Bash-effected change still moves the file's mtime past its flag file's, so it's
# still caught. See docs/agent-decision-log.md "Governance Integrity Protection".

INPUT=$(cat)
[ -d "$CLAUDE_PROJECT_DIR/.claude" ] || exit 0

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
STATE_DIR="${TMPDIR:-/tmp}/claude-christian-crawford-hooks"
MARKER="$STATE_DIR/session-start-$SESSION_ID"
FLAG_DIR="$STATE_DIR/governance-flagged-$SESSION_ID"
mkdir -p "$FLAG_DIR"

CANDIDATES=()
[ -f "$CLAUDE_PROJECT_DIR/.claude/settings.json" ] && CANDIDATES+=("$CLAUDE_PROJECT_DIR/.claude/settings.json")
[ -f "$CLAUDE_PROJECT_DIR/docs/agent-decision-log.md" ] && CANDIDATES+=("$CLAUDE_PROJECT_DIR/docs/agent-decision-log.md")
[ -f "$CLAUDE_PROJECT_DIR/CLAUDE.md" ] && CANDIDATES+=("$CLAUDE_PROJECT_DIR/CLAUDE.md")
while IFS= read -r -d '' f; do
  CANDIDATES+=("$f")
done < <(find "$CLAUDE_PROJECT_DIR/.claude/hooks" -maxdepth 1 -name '*.sh' -print0 2>/dev/null)
while IFS= read -r -d '' f; do
  CANDIDATES+=("$f")
done < <(find "$CLAUDE_PROJECT_DIR/.claude/rules" -maxdepth 1 -name '*.md' -print0 2>/dev/null)

NEWLY_FLAGGED=()
for abs_path in "${CANDIDATES[@]}"; do
  rel_path="${abs_path#"$CLAUDE_PROJECT_DIR"/}"

  if [ -n "$SESSION_ID" ] && [ -f "$MARKER" ] && [ ! "$abs_path" -nt "$MARKER" ]; then
    continue
  fi

  flag_file="$FLAG_DIR/$(echo "$rel_path" | tr '/' '_')"
  if [ -f "$flag_file" ] && [ ! "$abs_path" -nt "$flag_file" ]; then
    continue
  fi
  touch "$flag_file"
  NEWLY_FLAGGED+=("$rel_path")
done

if [ ${#NEWLY_FLAGGED[@]} -gt 0 ]; then
  jq -n --arg reason "A Bash command modified ${NEWLY_FLAGGED[*]} — part of the governance layer itself. This wasn't caught by the Edit/Write-tool check. Confirm with the user this was legitimate maintenance before continuing." '{decision: "block", reason: $reason}'
fi

exit 0
