import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-twii-fail-closed-runner-stub.mjs";
const gateReportPath = "scripts/report-twii-one-attempt-runner-execution-gate.mjs";
const problems = [];

const runnerSummary = runJson(runnerPath, "fail-closed runner stub");
const gateReport = runJson(gateReportPath, "one-attempt runner gate report");

validateRunnerSummary();
validateGateReport();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_fail_closed_runner_stub_post_run_review_ready_no_execution" : "blocked",
  outcome: ok ? "runner_stub_review_confirms_no_execution" : "runner_stub_review_blocked",
  mode: "twii_fail_closed_runner_stub_post_run_review",
  owner: "PM/CEO",
  runnerPath,
  gateReportPath,
  runnerStatus: runnerSummary.runnerStatus ?? null,
  blockedReason: runnerSummary.blockedReason ?? null,
  target: {
    targetTable: runnerSummary.targetTable ?? null,
    targetLane: runnerSummary.targetLane ?? null,
    targetScope: runnerSummary.targetScope ?? null,
    maxRows: runnerSummary.maxRows ?? null
  },
  runnerExecutableNow: false,
  executionAllowedNow: false,
  writeGateExecutableNow: false,
  implementationAllowedNow: false,
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateRunnerSummary() {
  if (runnerSummary.status !== "ok") problems.push("runner summary status must be ok");
  if (runnerSummary.runnerStatus !== "twii_fail_closed_runner_stub_blocked_no_execution") {
    problems.push("runnerStatus must be blocked no execution");
  }
  if (runnerSummary.runnerMode !== "fail_closed_no_execution") problems.push("runnerMode must be fail_closed_no_execution");
  if (runnerSummary.blockedReason !== "runner_stub_is_fail_closed_and_does_not_execute") {
    problems.push("blockedReason mismatch");
  }
  if (runnerSummary.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
  if (runnerSummary.targetLane !== "TWII") problems.push("targetLane must be TWII");
  if (runnerSummary.targetScope !== "twii_index_daily_prices_missing_rows") {
    problems.push("targetScope must be twii_index_daily_prices_missing_rows");
  }
  for (const key of [
    "executeRequested",
    "confirmationPhraseProvided",
    "credentialValuesRead",
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (runnerSummary[key] !== false) problems.push(`runnerSummary.${key} must be false`);
  }
}

function validateGateReport() {
  if (gateReport.status !== "twii_one_attempt_runner_execution_gate_ready_no_execution") {
    problems.push("gate report status must be ready no execution");
  }
  if (gateReport.runnerMode !== "fail_closed_no_execution") problems.push("gate report runnerMode must be fail closed");
  if (gateReport.runnerExecutableNow !== false) problems.push("gate report runnerExecutableNow must be false");
}

function runJson(scriptPath, label) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${label} must exit 0`);
  try {
    return JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${label} stdout must be JSON`);
    return {};
  }
}
