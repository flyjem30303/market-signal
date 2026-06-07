import { spawnSync } from "node:child_process";

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
      hostingProjectNameProvided: Boolean(process.env.BETA_HOSTING_PROJECT_NAME),
      temporaryBetaUrlProvided: Boolean(process.env.BETA_TEMPORARY_URL)
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
const ready = repoProofOk && worktreeClean;

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
  notes: [
    "This is a local dry run for packet-window readiness only.",
    "It does not store platform values in repo documents.",
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
    env: process.env,
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
    worktreeState: parsed?.worktreeState ?? null,
    timedOut: command.timedOut
  };
}

function printResult(result) {
  console.log(JSON.stringify(result, null, 2));
}
