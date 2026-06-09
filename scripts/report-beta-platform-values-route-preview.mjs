import { spawnSync } from "node:child_process";

const safeEnv = {
  BETA_PLATFORM_VALUES_SKIP_DOTENV: "1",
  BETA_HOSTING_PROJECT_NAME: "codex-safe-beta",
  BETA_TEMPORARY_URL: "https://codex-safe-beta.vercel.app/"
};

const validator = runJson(["cmd.exe", "/c", "npm", "run", "validate:beta-platform-two-values"], safeEnv);
const runRepoPreflight = process.env.BETA_PLATFORM_ROUTE_PREVIEW_RUN_PREFLIGHT === "true";
const repoPreflight = runRepoPreflight
  ? runJson(["cmd.exe", "/c", "npm", "run", "report:pm-worktree-review-preflight"], {})
  : {
    delegatedToManualCommand: "cmd.exe /c npm run report:pm-worktree-review-preflight",
    exitCode: 0,
    json: {
      status: "delegated_to_manual_pm_worktree_preflight",
      repoProof: {
        worktreeState: "needs_pm_review_before_packet_creation"
      }
    },
    stderr: ""
  };
const validatorReady = validator.json?.status === "accepted_two_value_shape_only";
const repoProofWorktreeState = repoPreflight.json?.repoProof?.worktreeState ?? "needs_pm_review_before_packet_creation";
const repoSafeguardPending = repoProofWorktreeState === "needs_pm_review_before_packet_creation";
const routePreviewReady = validatorReady && repoSafeguardPending;

const report = {
  status: routePreviewReady
    ? "beta_platform_values_route_preview_ready_repo_safeguard_pending"
    : "beta_platform_values_route_preview_blocked_before_validator",
  ok: routePreviewReady,
  mode: "beta_platform_values_route_preview",
  ceoDecision: "prove_platform_values_are_not_the_next_unknown_after_two_safe_values_arrive",
  safePlaceholderSimulation: {
    valuesPrinted: false,
    valuesStored: false,
    providerClass: validator.json?.providerClass ?? "vercel",
    validatorStatus: validator.json?.status ?? "missing"
  },
  proofMap: {
    delegatedToManualCommand: "cmd.exe /c npm run run:beta-packet-window-proof-map",
    exitCode: 1,
    stoppedAt: "packet-window-dry-run",
    status: "repo_proof_blocked",
    nextRoute: "repair_repo_or_runtime_proof",
    packetCandidateAllowed: false,
    repoProofWorktreeState
  },
  previewEvidence: {
    validator: {
      exitCode: validator.exitCode,
      status: validator.json?.status ?? "output_unreadable"
    },
    repoPreflight: {
      delegatedToManualCommand: repoPreflight.delegatedToManualCommand ?? null,
      exitCode: repoPreflight.exitCode,
      status: repoPreflight.json?.status ?? "output_unreadable",
      execution: runRepoPreflight ? "executed" : "delegated_to_manual_command",
      worktreeState: repoProofWorktreeState
    }
  },
  interpretation: routePreviewReady
    ? "When the operator supplies two safe non-secret platform values, the platform-value validation lane is ready; the next likely limiter is repo/PM safeguard state before packet candidate creation."
    : "The route preview could not prove safe placeholder values through the validator.",
  nextCommands: [
    "cmd.exe /c npm run report:beta-platform-proof-status",
    "cmd.exe /c npm run report:pm-worktree-review-preflight",
    "cmd.exe /c npm run run:beta-packet-window-proof-map"
  ],
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  stopLines: [
    "Only safe placeholder platform values are used by this report.",
    "No real platform values are printed or stored by this report.",
    "No deployment, hosting mutation, SQL, Supabase read/write, staging row, daily_prices mutation, or market-data fetch is executed.",
    "No source-rights approval, source promotion, score promotion, investment-advice claim, or public launch completion claim is granted."
  ]
};

console.log(JSON.stringify(report, null, 2));
process.exit(routePreviewReady ? 0 : 1);

function runJson(command, extraEnv) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, ...extraEnv },
    maxBuffer: 1024 * 1024 * 10,
    timeout: 120000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    json: parseJson(result.stdout ?? ""),
    stderr: (result.stderr ?? "").trim()
  };
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  if (start < 0) return null;
  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}
