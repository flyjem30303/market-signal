import { spawnSync } from "node:child_process";
import { betaPlatformValuesEnv, loadBetaPlatformValues } from "./lib/beta-platform-values.mjs";

const betaValues = loadBetaPlatformValues();
const childEnv = betaPlatformValuesEnv();

const validator = run(["cmd.exe", "/c", "npm", "run", "validate:beta-platform-two-values"], "two-value-validator");
const validatorJson = parseJsonFromStdout(validator.stdout);
const validatorStatus = validatorJson?.status ?? "validator_output_unreadable";

const runtimeBoundary = {
  publicDataSource: "mock",
  scoreSource: "mock"
};

if (validator.exitCode !== 0 || validatorStatus !== "accepted_two_value_shape_only") {
  const status =
    validatorStatus === "rejected_unsafe_values"
      ? "rejected_unsafe_values"
      : validatorStatus === "blocked_waiting_values"
        ? "blocked_waiting_values"
        : "repo_proof_blocked";

  printResult({
    status,
    ok: false,
    packetCandidateAllowed: false,
    nextRoute:
      status === "blocked_waiting_values"
        ? "keep_waiting_for_safe_two_values"
        : "repair_two_value_validation_before_packet_window",
    runtimeBoundary,
    values: {
      hostingProjectNameProvided: betaValues.BETA_HOSTING_PROJECT_NAME.length > 0,
      temporaryBetaUrlProvided: betaValues.BETA_TEMPORARY_URL.length > 0,
      loadedFromEnvLocal: betaValues.loadedFromEnvLocal
    },
    validator: summarizeCommand(validator, validatorJson),
    repoProof: null,
    notes: [
      "Dry run stopped before repo proof because platform values are missing, unsafe, or unreadable.",
      "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
    ]
  });

  process.exit(status === "rejected_unsafe_values" ? 1 : 0);
}

const repoProof = run(["cmd.exe", "/c", "npm", "run", "run:beta-executable-packet-repo-proof"], "repo-proof");
const repoProofJson = parseJsonFromStdout(repoProof.stdout);
const repoProofOk = repoProof.exitCode === 0 && repoProofJson?.status === "ok";
const worktreeClean = repoProofJson?.worktreeState === "clean";
const pmSnapshotReady =
  repoProofJson?.worktreeState === "needs_pm_review_before_packet_creation" &&
  repoProofJson?.pmSnapshot?.status === "classified_beta_readiness_worktree_safeguard_ready" &&
  repoProofJson?.pmSnapshot?.unresolvedCount === 0;
const ready = repoProofOk && (worktreeClean || pmSnapshotReady);

printResult({
  status: ready ? "packet_window_candidate_ready_shape_only" : "repo_proof_blocked",
  ok: ready,
  packetCandidateAllowed: ready,
  nextRoute: ready
    ? "create_separate_executable_packet_window_candidate"
    : "repair_repo_proof_or_worktree_before_packet_window",
  runtimeBoundary,
  values: {
    hostingProjectNameProvided: true,
    temporaryBetaUrlProvided: true
  },
  validator: summarizeCommand(validator, validatorJson),
  repoProof: summarizeCommand(repoProof, repoProofJson),
  pmSnapshot: repoProofJson?.pmSnapshot ?? null,
  notes: [
    "This is a local dry run for packet-window readiness only.",
    "It does not store platform values in repo documents.",
    "A classified no-Git PM snapshot can satisfy the worktree safeguard when Git backup is intentionally deferred.",
    "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
  ]
});

if (!ready) {
  process.exitCode = 1;
}

function run(command, name) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: childEnv,
    timeout: 180000,
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
    guardedStatus: parsed?.guardedStatus ?? null,
    outcome: parsed?.outcome ?? null,
    packetCandidateAllowed: parsed?.packetCandidateAllowed ?? false,
    pmSnapshotStatus: parsed?.pmSnapshot?.status ?? null,
    pmSnapshotUnresolvedCount: parsed?.pmSnapshot?.unresolvedCount ?? null,
    worktreeState: parsed?.worktreeState ?? null,
    timedOut: command.timedOut
  };
}

function printResult(result) {
  console.log(JSON.stringify(result, null, 2));
}
