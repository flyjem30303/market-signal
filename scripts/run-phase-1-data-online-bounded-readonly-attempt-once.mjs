import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const REQUIRED_CONFIRMATION = "CEO_APPROVED_PHASE1_DATA_ONLINE_READONLY_ONCE";
const DEFAULT_OUT_DIR = "tmp";
const problems = [];
const args = parseArgs(process.argv.slice(2));

const attemptId = args["attempt-id"];
const scope = args.scope;
const aggregateOnly = args["aggregate-only"] === "true";
const confirmation = args.confirm;
const executeRequested = args.execute === "true";
const outDir = args["out-dir"] ?? DEFAULT_OUT_DIR;

const packet = runJson("scripts/check-phase-1-data-online-bounded-readonly-attempt-packet-no-execution.mjs");

if (packet.status !== "ok") problems.push("attempt_packet_not_ready");
if (attemptId !== "phase1-data-online-readonly-20260615-a") problems.push("attempt_id_mismatch");
if (scope !== "aggregate-readonly-daily-prices-level1-coverage") problems.push("scope_mismatch");
if (!aggregateOnly) problems.push("aggregate_only_flag_required");
if (!isSafeOutDir(outDir)) problems.push("out_dir_must_be_tmp");

const confirmationPresent = confirmation === REQUIRED_CONFIRMATION;
const safeAttemptId = safeFileStamp(attemptId ?? "missing");
const summaryPath = normalizePath(path.join(outDir, `phase-1-data-online-readonly-stub-${safeAttemptId}.json`));

const status =
  problems.length > 0
    ? "phase_1_data_online_bounded_readonly_stub_blocked_invalid_input"
    : !confirmationPresent
      ? "phase_1_data_online_bounded_readonly_stub_blocked_confirmation_required"
      : executeRequested
        ? "phase_1_data_online_bounded_readonly_stub_blocked_execute_not_enabled"
        : "phase_1_data_online_bounded_readonly_stub_dry_run_boundary_ready";

const outcome =
  problems.length > 0
    ? "blocked_invalid_input_no_remote_attempt"
    : !confirmationPresent
      ? "blocked_fail_closed_no_remote_attempt"
      : executeRequested
        ? "blocked_execute_requested_no_remote_attempt"
        : "dry_run_boundary_ready_no_remote_attempt";

const summary = {
  status,
  outcome,
  attemptId: attemptId ?? null,
  scope: scope ?? null,
  aggregateOnly,
  summaryPath,
  confirmationPresent,
  requiredConfirmation: REQUIRED_CONFIRMATION,
  executionAuthorizedNow: false,
  readonlyAttemptExecutableNow: false,
  executeRequested,
  remoteAttempted: false,
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
    rawPayloadsPrinted: false,
    rowPayloadsPrinted: false,
    secretsPrinted: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  stopLine:
    "No SQL, Supabase connection, Supabase read/write, market-data fetch, daily_prices mutation, staging rows, raw payload output, source promotion, or scoreSource=real occurred.",
  problems
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
if (problems.length > 0) process.exit(1);

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

function runJson(filePath) {
  const run = spawnSync(process.execPath, [filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    return JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${filePath}_stdout_not_json`);
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
