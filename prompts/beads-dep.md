---
description: Manage beads dependencies between issues
---
Manage Beads dependencies.

Use these arguments when present:
- `$1` and later args may be issue IDs or CLI-style dependency arguments

Guidelines:
- Verify Beads is initialized first.
- If the user's intent is ambiguous, ask what dependency relation they want (`blocks`, `related`, parent-child, etc.).
- If the user already provided CLI-like arguments, pass them through carefully to `bd dep ...`.
- For standard blocking dependencies, prefer explicit commands like `bd dep <blocker> --blocks <blocked>` or `bd dep add <blocked> <blocker>`.
- After making a change, summarize the relationship that now exists.
