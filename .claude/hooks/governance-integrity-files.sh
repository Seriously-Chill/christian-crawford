#!/bin/bash

# Protects the governance/enforcement layer itself from being silently weakened by the
# agent it constrains — a structurally different risk than a bug in application code.
# Ported from voltron's hewa-client-web governance-integrity-files.sh (see the
# feature/whitelabel-brand-wiring branch), scoped down to this repo's actual operating
# contract. See docs/agent-decision-log.md "Governance Integrity Protection".

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0

MATCHED=false
case "$FILE_PATH" in
  */.claude/settings.json) MATCHED=true; WHAT="hook wiring / permissions" ;;
  */.claude/hooks/*.sh) MATCHED=true; WHAT="an enforcement hook script" ;;
  */docs/agent-decision-log.md) MATCHED=true; WHAT="the record of why the governance setup exists" ;;
  */CLAUDE.md) MATCHED=true; WHAT="the root of the agent operating contract" ;;
  */AGENTS.md) MATCHED=true; WHAT="the agent operating contract CLAUDE.md points to" ;;
  */.claude/rules/*.md) MATCHED=true; WHAT="a scoped rule file backing the governance layer" ;;
esac

if [ "$MATCHED" = true ]; then
  jq -n --arg reason "This file is $WHAT — part of the governance layer itself, not application code. Confirm this edit is legitimate maintenance, not a silent weakening of enforcement, before proceeding." '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "ask",
      permissionDecisionReason: $reason
    }
  }'
fi

exit 0
