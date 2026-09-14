---
description: Update a beads issue
---
Update a Beads issue.

Use these arguments when present:
- `$1` = issue ID
- `${@:2}` = requested update details or CLI-style flags

Guidelines:
- If the issue ID is missing, ask for it.
- Verify Beads is initialized first.
- If the user is asking to start work or the remaining args are `claim`/`--claim`, prefer `bd update "$1" --claim`.
- If the second argument is a status like `open`, `in_progress`, `blocked`, or `closed`, prefer `bd update "$1" --status "$2"`.
- If the remaining args already look like valid CLI flags, pass them through carefully.
- If the intended update is ambiguous, ask one concise follow-up question.
- Never use `bd edit`; use `bd update` flags, stdin, or files.
- After updating, show a refreshed summary, usually with `bd show "$1"`.
