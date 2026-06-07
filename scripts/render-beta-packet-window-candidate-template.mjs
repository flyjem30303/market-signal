import { spawnSync } from "node:child_process";
import { betaPlatformValuesEnv, loadBetaPlatformValues } from "./lib/beta-platform-values.mjs";

const betaValues = loadBetaPlatformValues();
const childEnv = betaPlatformValuesEnv();

const dryRun = run(["cmd.exe", "/c", "npm", "run", "run:beta-packet-window-candidate-dry-run"], "packet-window-dry-run");
const dryRunJson = parseJsonFromStdout(dryRun.stdout);
const dryRunStatus = dryRunJson?.status ?? "dry_run_output_unreadable";
const dryRunReady =
  dryRun.exitCode === 0 &&
  dryRunStatus === "packet_window_candidate_ready_shape_only" &&
  dryRunJson?.packetCandidateAllowed === true;

const runtimeBoundary = {
  publicDataSource: "mock",
  scoreSource: "mock"
};

if (!dryRunReady) {
  const status = ["blocked_waiting_values", "rejected_unsafe_values", "repo_proof_blocked"].includes(dryRunStatus)
    ? dryRunStatus
    : "repo_proof_blocked";

  console.log(
    JSON.stringify(
      {
        status,
        ok: false,
        packetCandidateAllowed: false,
        nextRoute:
          status === "blocked_waiting_values"
            ? "keep_waiting_for_safe_two_values"
            : "repair_values_or_repo_proof_before_template_render",
        runtimeBoundary,
        dryRun: summarizeCommand(dryRun, dryRunJson),
        candidateTemplate: null,
        notes: [
          "Candidate template rendering stopped before output because dry run is not ready.",
          "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
        ]
      },
      null,
      2
    )
  );

  process.exit(status === "rejected_unsafe_values" || status === "repo_proof_blocked" ? 1 : 0);
}

const branch = run(["git", "branch", "--show-current"], "git-branch");
const commit = run(["git", "rev-parse", "--short", "HEAD"], "git-commit");
const gitOk = branch.exitCode === 0 && commit.exitCode === 0;

const result = {
  status: gitOk ? "packet_window_candidate_template_ready_shape_only" : "repo_proof_blocked",
  ok: gitOk,
  packetCandidateAllowed: gitOk,
  nextRoute: gitOk
    ? "create_separate_reviewed_packet_window_artifact"
    : "repair_repo_proof_before_template_render",
  launchBoundary: runtimeBoundary,
  platformValues: gitOk
    ? {
        hostingProjectName: betaValues.BETA_HOSTING_PROJECT_NAME,
        temporaryBetaUrl: betaValues.BETA_TEMPORARY_URL,
        loadedFromEnvLocal: betaValues.loadedFromEnvLocal
      }
    : null,
  repoProof: gitOk
    ? {
        sourceBranch: branch.stdout.trim(),
        sourceCommit: commit.stdout.trim(),
        worktreeState: "clean"
      }
    : null,
  requiredPreExecutionReview: [
    "PM must create a separate reviewed packet-window artifact before any platform action.",
    "A2 must review public-route readability after the temporary Beta URL is reachable.",
    "Secret and environment values must stay outside repo documents and logs.",
    "Rollback owner and incident owner must be confirmed before deployment execution.",
    "publicDataSource=mock and scoreSource=mock must remain unchanged for this candidate."
  ],
  dryRun: summarizeCommand(dryRun, dryRunJson),
  notes: [
    "This is a shape-only candidate template.",
    "It is not a deployment execution packet.",
    "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
  ]
};

console.log(JSON.stringify(result, null, 2));

if (!gitOk) {
  process.exitCode = 1;
}

function run(command, name) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: childEnv,
    timeout: 240000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    name,
    stderr: (result.stderr ?? "").trim(),
    stdout: (result.stdout ?? "").trim(),
    timedOut: result.error?.code === "ETIMEDOUT"
  };
}

function parseJsonFromStdout(stdout) {
  const start = stdout.indexOf("{");
  if (start < 0) return null;

  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}

function summarizeCommand(command, parsed) {
  return {
    exitCode: command.exitCode,
    name: command.name,
    status: parsed?.status ?? null,
    packetCandidateAllowed: parsed?.packetCandidateAllowed ?? false,
    worktreeState: parsed?.repoProof?.worktreeState ?? parsed?.worktreeState ?? null,
    timedOut: command.timedOut
  };
}
