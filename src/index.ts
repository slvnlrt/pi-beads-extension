import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";

type AliasCommand = {
	name: string;
	template: string;
	description: string;
};

type BeadsState = {
	available: boolean;
	initialized: boolean;
	version?: string;
	location?: string;
	checkedAt: number;
};

const STATE_TTL_MS = 10_000;

const ALIAS_COMMANDS: AliasCommand[] = [
	{ name: "init", template: "beads-init", description: "Initialize beads in the current project" },
	{ name: "ready", template: "beads-ready", description: "Show ready beads work with no blockers" },
	{ name: "create", template: "beads-create", description: "Create a new beads issue" },
	{ name: "show", template: "beads-show", description: "Show details for a beads issue" },
	{ name: "update", template: "beads-update", description: "Update a beads issue" },
	{ name: "close", template: "beads-close", description: "Close a beads issue" },
	{ name: "list", template: "beads-list", description: "List beads issues with optional filters" },
	{ name: "blocked", template: "beads-blocked", description: "Show blocked beads work" },
	{ name: "stats", template: "beads-stats", description: "Show beads project statistics" },
	{ name: "dep", template: "beads-dep", description: "Manage beads dependencies" },
	{ name: "search", template: "beads-search", description: "Search beads issues" },
	{ name: "prime", template: "beads-prime", description: "Show bd prime workflow context" },
	{ name: "version", template: "beads-version", description: "Check bd and extension versions" },
	{ name: "workflow", template: "beads-workflow", description: "Show the beads workflow guide" },
];

function createInitialState(): BeadsState {
	return {
		available: false,
		initialized: false,
		checkedAt: 0,
	};
}

export default function beadsPiExtension(pi: ExtensionAPI) {
	let state = createInitialState();
	let promptContext: { available: boolean; initialized: boolean; prime?: string } | undefined;

	async function runBd(args: string[], cwd: string, timeoutSeconds = 15) {
		try {
			const result = await pi.exec("bd", args, { cwd, timeout: timeoutSeconds * 1000 });
			return {
				ok: result.code === 0 && !result.killed,
				stdout: result.stdout.trim(),
				stderr: result.stderr.trim(),
			};
		} catch (error) {
			return {
				ok: false,
				stdout: "",
				stderr: error instanceof Error ? error.message : String(error),
			};
		}
	}

	async function refreshState(cwd: string, force = false): Promise<BeadsState> {
		if (!force && Date.now() - state.checkedAt < STATE_TTL_MS) {
			return state;
		}

		const versionResult = await runBd(["version"], cwd, 10);
		if (!versionResult.ok) {
			state = createInitialState();
			state.checkedAt = Date.now();
			return state;
		}

		const whereResult = await runBd(["where"], cwd, 10);
		state.available = true;
		state.version = versionResult.stdout || undefined;
		state.initialized = whereResult.ok;
		state.location = whereResult.ok ? whereResult.stdout || undefined : undefined;
		state.checkedAt = Date.now();

		return state;
	}

	async function getPrime(cwd: string): Promise<string | undefined> {
		promptContext ??= { available: state.available, initialized: state.initialized };
		if (promptContext.prime !== undefined) {
			return promptContext.prime;
		}
		if (!promptContext.available || !promptContext.initialized) {
			return undefined;
		}

		const primeResult = await runBd(["prime"], cwd, 15);
		if (primeResult.ok) {
			promptContext.prime = primeResult.stdout;
		}
		return promptContext.prime;
	}

	function syncStatus(ctx: { ui: { setStatus: (id: string, text: string | undefined) => void } }) {
		if (!state.available) {
			ctx.ui.setStatus("beads", undefined);
			return;
		}

		ctx.ui.setStatus("beads", state.initialized ? "beads: enabled" : "beads: init needed");
	}

	async function refreshPromptContext(ctx: ExtensionContext) {
		await refreshState(ctx.cwd, true);
		promptContext = { available: state.available, initialized: state.initialized };
		await getPrime(ctx.cwd);
		syncStatus(ctx);
	}

	for (const command of ALIAS_COMMANDS) {
		pi.registerCommand(`beads:${command.name}`, {
			description: command.description,
			handler: async (args) => {
				const suffix = args.trim();
				const promptCommand = `/${command.template}${suffix ? ` ${suffix}` : ""}`;
				pi.sendUserMessage(promptCommand);
			},
		});
	}

	pi.registerCommand("beads", {
		description: "Show the beads workflow guide",
		handler: async () => {
			pi.sendUserMessage("/beads-workflow");
		},
	});

	pi.on("session_start", async (_event, ctx) => {
		await refreshPromptContext(ctx);

		if (!state.available) {
			ctx.ui.notify("Beads CLI (bd) not found on PATH. Install bd to enable /beads:* workflows.", "warning");
			return;
		}

		if (!state.initialized) {
			ctx.ui.notify("Beads is available but not initialized in this project. Run /beads:init to enable tracking.", "info");
		}
	});

	pi.on("session_compact", async (_event, ctx) => {
		await refreshPromptContext(ctx);
	});

	// Pi emits session_start for these transitions; OMP emits separate post-change events.
	const sessionApi = pi as ExtensionAPI & {
		on(
			event: "session_switch" | "session_branch" | "session_tree",
			handler: (event: unknown, ctx: ExtensionContext) => Promise<void>,
		): void;
	};
	for (const event of ["session_switch", "session_branch", "session_tree"] as const) {
		sessionApi.on(event, async (_event, ctx) => {
			await refreshPromptContext(ctx);
		});
	}

	pi.on("agent_end", async (_event, ctx) => {
		await refreshState(ctx.cwd, true);
		syncStatus(ctx);
	});

	pi.on("before_agent_start", async (event, ctx) => {
		await refreshState(ctx.cwd);
		syncStatus(ctx);

		promptContext ??= { available: state.available, initialized: state.initialized };
		if (!promptContext.available) {
			return;
		}

		const baseInstructions = `
## Beads Task Tracking

- Prefer the Beads CLI (\`bd\`) over ad-hoc markdown TODO lists when the user wants persistent task tracking.
- For read operations, prefer \`bd ready --json\`, \`bd list --json\`, \`bd show <id>\`, \`bd blocked --json\`, and \`bd status --json\`.
- For write operations, prefer \`bd create\`, \`bd update --claim\`, \`bd update\`, \`bd dep\`, and \`bd close\`.
- Do not use \`bd edit\`; it opens an interactive editor. Use \`bd update\` flags or stdin/file arguments instead.
- The user can also invoke slash command aliases such as \`/beads:ready\`, \`/beads:create\`, and \`/beads:workflow\`.
`;

		if (!promptContext.initialized) {
			return {
				systemPrompt:
					event.systemPrompt +
					baseInstructions +
					"\nBeads is installed but not initialized in this project. If the user wants Beads here, suggest `/beads:init`.\n",
			};
		}

		const prime = await getPrime(ctx.cwd);
		const primeSection = prime
			? `\n### Current Beads Workflow Context\n\n${prime}\n`
			: "\n### Current Beads Workflow Context\n\nBeads is initialized, but `bd prime` returned no extra context.\n";

		return {
			systemPrompt: event.systemPrompt + baseInstructions + primeSection,
		};
	});
}
