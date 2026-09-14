---
description: Show the beads workflow guide
---
Explain the recommended Beads workflow for this project.

Cover these points:
1. `bd ready` to find unblocked work
2. `bd update <id> --claim` to start work
3. `bd show <id>` to inspect details and dependencies
4. `bd create ...` and `bd dep ...` for newly discovered work
5. `bd close <id> --reason ...` to finish work
6. `bd status` / `bd stats` to get a project-level snapshot

Also mention:
- Prefer Beads over ad-hoc markdown TODOs for persistent task tracking
- Avoid `bd edit` in agent workflows because it opens an interactive editor
- Useful slash commands in this package include `/beads:ready`, `/beads:create`, `/beads:update`, `/beads:close`, and `/beads:stats`
