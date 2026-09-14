---
description: Search beads issues by text or filters
---
Search Beads issues.

Guidelines:
- Verify Beads is initialized first.
- Use `$@` as the search query and optional CLI-style filters.
- Prefer `bd search ... --json` when it helps with structured output.
- Summarize the best matches first and explain why they are relevant.
- If there are no matches, say so and suggest a broader search or `/beads:list`.
