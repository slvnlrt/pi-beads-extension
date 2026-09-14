---
description: Close a beads issue
---
Close a Beads issue.

Use these arguments when present:
- `$1` = issue ID
- `${@:2}` = close reason

Guidelines:
- If the issue ID is missing, ask for it.
- Verify Beads is initialized first.
- If no close reason is provided and the reason is not obvious from context, ask for one.
- Prefer `bd close "$1" --reason "..."`.
- After closing, show what was closed and mention any newly unblocked next step if useful.
- Do not close anything speculatively.
