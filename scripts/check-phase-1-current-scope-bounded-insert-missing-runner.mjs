import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-bounded-insert-missing-once.mjs";
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-runner-"));
const problems = [];

try {
  const candidatePath = path.join(tempDir, "accepted-current-scope-candidate.json");
  const postRunPath = path.join(tempDir, "post-run.md");
  fs.writeFileSync(candidatePath, JSON.stringify(makeCandidate(), null, 2));

  const ready = runRunner([
    "--authorization-id", "PHASE1-CURRENT-SCOPE-BOUNDED-WRITE-2026-06-17-A",
    "--acknowledge-bounded-write-once", "CEO_AUTHORIZED_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT_20260617_A",
    "--candidate-artifact", candidatePath,
    "--post-run-review", postRunPath
  ]);
  const blocked = runRunner([
    "--candidate-artifact", candidatePath,
    "--post-run-review", postRunPath
  ]);

  expect(ready.status, "phase_1_current_scope_bounded_insert_missing_ready_not_executed", "ready.status");
  expect(ready.commandAccepted, true, "ready.commandAccepted");
  expect(ready.executionRequested, false, "ready.executionRequested");
  expect(ready.candidateArtifactAccepted, true, "ready.candidateArtifactAccepted");
  expect(ready.candidateRowCount, 2, "ready.candidateRowCount");
  expect(ready.remoteAttempted, false, "ready.remoteAttempted");
  expect(ready.connectionAttempted, false, "ready.connectionAttempted");
  expect(ready.safety?.rowPayloadOutput, false, "ready.safety.rowPayloadOutput");
  expect(ready.safety?.stockIdPayloadOutput, false, "ready.safety.stockIdPayloadOutput");
  expect(ready.safety?.secretsOutput, false, "ready.safety.secretsOutput");
  expect(fs.existsSync(postRunPath), false, "post-run review is not written without execute");

  expect(blocked.status, "phase_1_current_scope_bounded_insert_missing_blocked", "blocked.status");
  expect(blocked.commandAccepted, false, "blocked.commandAccepted");
  expectIncludes(blocked.problems, "command_contract_mismatch", "blocked.problems");

  validateNoRowLeak("ready stdout", ready.__stdout);
  validateNoRowLeak("blocked stdout", blocked.__stdout);

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_bounded_insert_missing_runner_ready"
      : "phase_1_current_scope_bounded_insert_missing_runner_blocked",
    noExecuteReadyPassed: ready.status === "phase_1_current_scope_bounded_insert_missing_ready_not_executed",
    missingAuthorizationBlocked: blocked.commandAccepted === false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    problems
  }, null, 2));
  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

function makeCandidate() {
  return {
    artifactId: "phase-1-current-scope-runner-fixture",
    createdAt: "2026-06-17T00:00:00.000Z",
    scope: "twii_plus_listed_stock_daily_close",
    phase1Universe: "twii_plus_listed_stock_daily_close",
    sourceRightsStatus: "accepted",
    fieldContractStatus: "accepted",
    sanitizedRowPayloadIncluded: true,
    rawPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false,
    expectedRows: 2,
    rows: [
      makeRow("TWII", "2026-06-15", 22000),
      makeRow("2330", "2026-06-15", 1000)
    ]
  };
}

function makeRow(symbol, tradeDate, close) {
  return {
    symbol,
    trade_date: tradeDate,
    close,
    source_name: "synthetic-current-scope-runner-fixture",
    source_updated_at: "2026-06-17T00:00:00.000Z",
    source_row_hash: `${symbol}-${tradeDate}-hash`
  };
}

function runRunner(args) {
  const run = spawnSync(process.execPath, [runnerPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  let output = {};
  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`runner output unreadable: ${error.message}`);
  }
  return { ...output, __stdout: run.stdout, __exitCode: run.status ?? 1 };
}

function validateNoRowLeak(label, stdout) {
  for (const token of ["source_row_hash", "synthetic-current-scope-runner-fixture", "\"rows\""]) {
    if (String(stdout ?? "").includes(token)) problems.push(`${label} leaked ${token}`);
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectIncludes(actual, expected, label) {
  if (!Array.isArray(actual) || !actual.includes(expected)) problems.push(`${label} missing ${expected}`);
}
