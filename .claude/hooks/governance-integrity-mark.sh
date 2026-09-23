#!/bin/bash

# Runs after governance-integrity-files.sh's PreToolUse ask already confirmed an Edit/Write
# to a governance-layer file. Touches the same flag file governance-integrity-bash-check.sh
# checks, so that hook's next run sees this change as already accounted for instead of
# re-flagging a state the user already approved through the Edit-tool ask gate. Without this,
# governance-integrity-bash-check.sh has no way to distinguish "changed via an approved Edit"
# from "changed via an unreviewed Bash command" — see docs/agent-decision-log.md
# "Governance Integrity Protection".

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0
[ -f "$FILE_PATH" ] || exit 0

MATCHED=false
case "$FILE_PATH" in
  */.claude/settings.json) MATCHED=true ;;
  */.claude/hooks/*.sh) MATCHED=true ;;
  */docs/agent-decision-log.md) MATCHED=true ;;
  */CLAUDE.md) MATCHED=true ;;
  */AGENTS.md) MATCHED=true ;;
  */.claude/rules/*.md) MATCHED=true ;;
esac
[ "$MATCHED" = true ] || exit 0

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
STATE_DIR="${TMPDIR:-/tmp}/claude-christian-crawford-hooks"
FLAG_DIR="$STATE_DIR/governance-flagged-$SESSION_ID"
mkdir -p "$FLAG_DIR"

rel_path="${FILE_PATH#"$CLAUDE_PROJECT_DIR"/}"
touch "$FLAG_DIR/$(echo "$rel_path" | tr '/' '_')"

exit 0
