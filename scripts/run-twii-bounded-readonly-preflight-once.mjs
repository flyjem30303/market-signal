import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const CONFIRMATION = "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE";
const DEFAULT_OUT_DIR = "tmp";
const EXPECTED_CANDIDATE_PATH = "data/candidates/twii-sanitized-candidate.json";

const args = parseArgs(process.argv.slice(2));
const problems = [];

const attemptId = args["attempt-id"];
const candidateArtifactPath = normalizePath(args["candidate-artifact-path"] ?? "");
const mode = args.mode;
const confirmation = args.confirm;
const outDir = args["out-dir"] ?? DEFAULT_OUT_DIR;

if (!attemptId || !/^[a-z0-9][a-z0-9_-]{2,80}$/iu.test(attemptId)) {
  problems.push("attempt_id_missing_or_unsafe");
}
if (candidateArtifactPath !== EXPECTED_CANDIDATE_PATH) {
  problems.push("candidate_artifact_path_mismatch");
}
if (mode !== "aggregate-only-readonly") {
  problems.push("mode_must_be_aggregate_only_readonly");
}
if (!isSafeOutDir(outDir)) {
  problems.push("out_dir_must_be_local_tmp");
}

const design = runJson(["scripts/report-twii-bounded-readonly-preflight-candidate-design.mjs"]);
if (design.status !== "twii_bounded_readonly_preflight_candidate_design_ready") {
  problems.push("upstream_design_not_ready");
}

let handoff = {};
if (candidateArtifactPath === EXPECTED_CANDIDATE_PATH) {
  handoff = runJson([
    "scripts/report-twii-sanitized-candidate-artifact-chain-handoff.mjs",
    "--candidate-artifact-path",
    candidateArtifactPath
  ]);
  if (handoff.status !== "twii_sanitized_candidate_artifact_chain_handoff_ready_for_named_packet") {
    problems.push("candidate_artifact_handoff_not_ready");
  }
}

const confirmationPresent = confirmation === CONFIRMATION;
const safeAttemptId = safeFileStamp(attemptId ?? "missing");
const summaryPath = path.join(outDir, `twii-bounded-readonly-preflight-stub-${safeAttemptId}.json`);
const blockedByConfirmation = !confirmationPresent;

const status =
  problems.length > 0
    ? "blocked_invalid_stub_input"
    : blockedByConfirmation
      ? "twii_bounded_readonly_preflight_stub_blocked_confirmation_required"
      : "twii_bounded_readonly_preflight_stub_ready_remote_execution_not_implemented";

const outcome =
  problems.length > 0
    ? "blocked"
    : blockedByConfirmation
      ? "blocked_fail_closed_no_remote_attempt"
      : "ready_for_separate_remote_implementation_not_executed";

const summary = {
  status,
  outcome,
  attemptId: attemptId ?? null,
  candidateArtifactPath: candidateArtifactPath || null,
  mode: mode ?? null,
  summaryPath,
  upstreamDesignStatus: design.status ?? null,
  candidateArtifactStatus: handoff.status ?? null,
  confirmationPresent,
  requiredConfirmation: CONFIRMATION,
  remoteExecutionImplemented: false,
  failClosed: true,
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    candidateRowsAccepted: false,
    rowCoverageScoringAllowed: false,
    rawPayloadsPrinted: false,
    rowPayloadsPrinted: false,
    stockIdPayloadsPrinted: false,
    secretsPrinted: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  stopLine:
    "No SQL, Supabase connection, Supabase read/write, market-data fetch, daily_prices mutation, staging rows, candidate row acceptance, row coverage scoring, source promotion, or scoreSource=real occurred.",
  problems
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));

process.exitCode = problems.length === 0 ? 0 : 1;

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const current = rawArgs[index];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = rawArgs[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = "true";
    }
  }
  return parsed;
}

function runJson(commandArgs) {
  const run = spawnSync(process.execPath, commandArgs, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    return JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${commandArgs[0]}_stdout_not_json`);
    return {};
  }
}

function normalizePath(value) {
  return String(value).replace(/\\/g, "/");
}

function isSafeOutDir(value) {
  const normalized = normalizePath(value);
  return normalized === "tmp" || normalized.startsWith("tmp/");
}

function safeFileStamp(value) {
  return String(value).replace(/[^a-z0-9_-]/giu, "_").slice(0, 80);
}
