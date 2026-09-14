---
description: Initialize beads in the current project
---
Initialize Beads in this project using the `bd` CLI.

Guidelines:
- First check whether `bd` exists and whether Beads is already initialized here.
- If `bd` is missing, explain how to install Beads and stop.
- If Beads is already initialized, do not reinitialize. Instead show the current location and a quick status summary.
- If the user supplied a prefix, use `$1` as the issue prefix.
- Prefer a straightforward init command:
  - no prefix: `bd init`
  - with prefix: `bd init --prefix "$1"`
- After init, run `bd where` and `bd status`.

In your response, include:
1. whether init succeeded
2. the beads database location
3. the prefix in use
4. the best next commands (`/beads:ready`, `/beads:create`, `/beads:workflow`)
