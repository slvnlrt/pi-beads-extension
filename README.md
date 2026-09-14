# pi-beads-extension

Beads integration for [pi](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent):

- auto-injects `bd prime` workflow context into pi turns
- preserves Beads workflow context during pi compaction
- adds Claude-style `/beads:*` slash command aliases
- ships prompt templates for common Beads workflows
- packaged as a publishable npm pi package

## What this package does

This package is inspired by the Beads Claude Code plugin, but adapted for pi's extension + prompt-template model.

### Included

- `src/index.ts` pi extension
- `prompts/*.md` prompt templates
- `/beads:*` alias commands, including:
  - `/beads:init`
  - `/beads:ready`
  - `/beads:create`
  - `/beads:show`
  - `/beads:update`
  - `/beads:close`
  - `/beads:list`
  - `/beads:blocked`
  - `/beads:stats`
  - `/beads:dep`
  - `/beads:search`
  - `/beads:prime`
  - `/beads:version`
  - `/beads:workflow`

### Runtime behavior

When `bd` is installed:

- the extension checks whether Beads is initialized in the current repo
- pi gets a small Beads workflow reminder in the system prompt
- if the repo is initialized, the extension injects `bd prime` output into the turn prompt
- during pi compaction, the extension adds Beads-aware summary instructions so `bd prime` context survives compaction more explicitly
- the footer status shows whether Beads is enabled or still needs init

## Install locally in pi

### From a local checkout

```bash
pi install .
```

Or for project-local install:

```bash
pi install -l .
```

### From npm

```bash
pi install npm:pi-beads-extension
```

## Use

After installation, restart pi or run `/reload`.

Examples:

```text
/beads:init
/beads:create "Set up auth flow" feature 1
/beads:ready
/beads:show bd-abc123
/beads:update bd-abc123 --claim
/beads:close bd-abc123 Finished implementation and tests
/beads:stats
```

You can also use the underlying prompt-template names directly:

```text
/beads-init
/beads-ready
/beads-create "Fix flaky tests" task 2
```

## Requirements

- `bd` installed and on `PATH`
- a repo or workspace where you want to use Beads

Install Beads with one of the standard methods from the Beads project, for example:

```bash
brew install beads
# or
npm install -g @beads/bd
```

## Publish to npm

Preview the tarball:

```bash
npm pack --dry-run
```

Publish:

```bash
npm publish
```

If you want a scoped package, rename the `name` field in `package.json` first.

## Development

Install dev dependencies:

```bash
npm install
```

Type-check:

```bash
npm run typecheck
```

## Package layout

```text
.
├── package.json
├── prompts/
│   ├── beads-init.md
│   ├── beads-ready.md
│   ├── ...
│   └── beads-workflow.md
└── src/
    └── index.ts
```

## Notes

- This package intentionally prefers the `bd` CLI over a large custom tool schema.
- That keeps prompt overhead low while still giving pi a Beads-aware workflow.
- If you want deeper integration later, this package is a good base for adding custom Beads tools.
