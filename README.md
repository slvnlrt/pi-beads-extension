# pi-beads-extension

This is a corrected distribution of
[`pi-beads-extension@0.1.0`](https://www.npmjs.com/package/pi-beads-extension/v/0.1.0),
published on npm by **jkbjhs** on April 12, 2026. The original MIT license is
preserved unchanged. This repository is maintained by **slvnlrt** and is not an
official Beads, Pi, or Oh My Pi project.

The first Git commit imports the original npm release. Version **0.1.1** makes
only these runtime changes:

- Convert the Beads command deadlines from seconds to the milliseconds expected
  by `pi.exec` (10 or 15 seconds, not 10 or 15 milliseconds).
- Pass the active working directory to `pi.exec`.
- Do not treat an interrupted command (`killed: true`) as successful.

The existing commands, prompts, caching and compaction behavior are otherwise
unchanged. This fork is distributed through **GitHub**, not the original npm name.

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

## Installation

### Oh My Pi

Install the tagged release at user scope (available across your repositories):

```bash
omp plugin install 'github:slvnlrt/pi-beads-extension#v0.1.1'
```

The package name remains `pi-beads-extension`, so this replaces an existing
installation under that name instead of registering a second copy.

### Pi

```bash
pi install 'git:github.com/slvnlrt/pi-beads-extension#v0.1.1'
```

Remove a previous `npm:pi-beads-extension` entry from Pi before adding the Git
source, so the same extension is not loaded twice.

### From a local checkout

```bash
omp plugin link .
# Or, in Pi:
pi install .
```

For reproducible installations, use a release tag or a full commit SHA rather
than tracking `main`.

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

## Releases

GitHub tags and releases are the distribution channel for this fork.
`npm install pi-beads-extension` still selects the original npm publication,
not this corrected version.

To inspect the package contents without publishing:

```bash
npm pack --dry-run
```

## Development

Install dev dependencies:

```bash
npm ci
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
