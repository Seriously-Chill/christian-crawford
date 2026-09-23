#!/bin/bash

# Marks when this session started and prunes stale per-session state. The governance
# hooks (governance-integrity-files.sh, governance-integrity-bash-check.sh,
# governance-integrity-mark.sh) key their flag directories off this same SESSION_ID and
# rely on this marker to tell "changed this session" apart from "was already dirty
# before this session began." See docs/agent-decision-log.md "Governance Integrity
# Protection".

INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
[ -z "$SESSION_ID" ] && exit 0

STATE_DIR="${TMPDIR:-/tmp}/claude-christian-crawford-hooks"
mkdir -p "$STATE_DIR"

find "$STATE_DIR" -maxdepth 1 -name 'session-start-*' -mtime +1 -delete 2>/dev/null
find "$STATE_DIR" -maxdepth 1 -type d -name 'governance-flagged-*' -mtime +1 -exec rm -rf {} + 2>/dev/null

touch "$STATE_DIR/session-start-$SESSION_ID"

exit 0
