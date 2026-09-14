---
description: Find ready-to-work beads tasks with no blockers
---
Use the `bd` CLI to find work that is ready now.

Guidelines:
- Verify Beads is available and initialized in this repo.
- If it is not initialized, explain that briefly and suggest `/beads:init`.
- Prefer `bd ready --json` for structured output. Fall back to plain `bd ready` if needed.
- Present ready items clearly with ID, title, priority, type, and assignee/status when helpful.
- Recommend the best next task if there are multiple options.
- Do not claim, update, or close anything unless the user explicitly asked for a mutation.
