---
description: Create a new beads issue
---
Create a new Beads issue.

Use these arguments when present:
- `$1` = title
- `$2` = type (`bug`, `feature`, `task`, `epic`, `chore`, `decision`)
- `$3` = priority (`0`-`4`, where `0` is highest)
- `${@:4}` = extra context you can fold into the description if appropriate

Guidelines:
- If the title is missing, ask a concise follow-up question before running anything.
- Default missing type to `task` and missing priority to `2`.
- Verify Beads is initialized first.
- Prefer `bd create` with explicit flags.
- If extra context is provided, include it in the description or notes.
- After creation, show the new issue ID, the key fields, and a sensible next step.
- Do not create dependency links automatically unless the user asked for them.
