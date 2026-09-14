---
description: List beads issues with optional filters
---
List Beads issues.

Guidelines:
- Verify Beads is initialized first.
- Treat `$@` as optional CLI-style filter arguments for `bd list`.
- Prefer `bd list --json` when it gives cleaner structured output.
- If the user supplied compatible flags, preserve them.
- Present the results as a concise table or bullet list with the most relevant fields.
- If there are many results, summarize patterns and mention the most important items first.
