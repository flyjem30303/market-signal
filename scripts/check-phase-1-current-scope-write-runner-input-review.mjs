import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-write-runner-input-review.mjs";
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-input-review-"));
const problems = [];

try {
  const acceptedPath = path.join(tempDir, "accepted-current-scope-candidate.json");
  const etfPath = path.join(tempDir, "rejected-etf-current-scope-candidate.json");

  fs.writeFileSync(acceptedPath, JSON.stringify(makeArtifact({
    rows: [
      makeRow("TWII", "2026-06-15", 22000),
      makeRow("2330", "2026-06-15", 1000)
    ]
  }), null, 2));
  fs.writeFileSync(etfPath, JSON.stringify(makeArtifact({
    rows: [
      makeRow("TWII", "2026-06-15", 22000),
      makeRow("0050", "2026-06-15", 200)
    ]
  }), null, 2));

  const accepted = runReview(["--candidate-artifact", acceptedPath]);
  const rejected = runReview(["--candidate-artifact", etfPath]);
  const missing = runReview([]);

  expect(accepted.status, "ok", "accepted.status");
  expect(accepted.guardedStatus, "phase_1_current_scope_write_runner_input_review_ready", "accepted.guardedStatus");
  expect(accepted.candidateArtifactAcceptedNow, true, "accepted.candidateArtifactAcceptedNow");
  expect(accepted.dryRunReviewAllowedNow, true, "accepted.dryRunReviewAllowedNow");
  expect(accepted.runnerExecutableNow, false, "accepted.runnerExecutableNow");
  expect(accepted.boundedWriteExecutableNow, false, "accepted.boundedWriteExecutableNow");
  expect(accepted.candidateReview?.rowCount, 2, "accepted.candidateReview.rowCount");
  expect(accepted.candidateReview?.etfSymbolCount, 0, "accepted.candidateReview.etfSymbolCount");
  expect(accepted.publicDataSource, "mock", "accepted.publicDataSource");
  expect(accepted.scoreSource, "mock", "accepted.scoreSource");

  expect(rejected.status, "blocked", "rejected.status");
  expect(rejected.candidateArtifactAcceptedNow, false, "rejected.candidateArtifactAcceptedNow");
  expectIncludes(rejected.problems, "deferred_etf_symbol_present", "rejected.problems");

  expect(missing.status, "blocked", "missing.status");
  expect(missing.guardedStatus, "phase_1_current_scope_write_runner_input_review_blocked_missing_candidate", "missing.guardedStatus");
  expect(missing.candidateArtifactPathProvided, false, "missing.candidateArtifactPathProvided");

  validateNoRowLeak("accepted stdout", accepted.__stdout);
  validateNoRowLeak("rejected stdout", rejected.__stdout);
  validateNoRowLeak("missing stdout", missing.__stdout);

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_write_runner_input_review_check_ready"
      : "phase_1_current_scope_write_runner_input_review_check_blocked",
    acceptedFixturePassed: accepted.status === "ok",
    etfFixtureRejected: rejected.status === "blocked",
    missingCandidateRejected: missing.status === "blocked",
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

function makeArtifact({ rows }) {
  return {
    artifactId: "phase-1-current-scope-input-review-fixture",
    createdAt: "2026-06-17T00:00:00.000Z",
    scope: "twii_plus_listed_stock_daily_close",
    phase1Universe: "twii_plus_listed_stock_daily_close",
    sourceRightsStatus: "accepted",
    fieldContractStatus: "accepted",
    sanitizedRowPayloadIncluded: true,
    rawPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false,
    expectedRows: rows.length,
    rows
  };
}

function makeRow(symbol, tradeDate, close) {
  return {
    symbol,
    trade_date: tradeDate,
    close,
    source_name: "synthetic-current-scope-input-review-fixture",
    source_updated_at: "2026-06-17T00:00:00.000Z",
    source_row_hash: `${symbol}-${tradeDate}-hash`
  };
}

function runReview(args) {
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
    problems.push(`review output unreadable: ${error.message}`);
  }
  return { ...output, __stdout: run.stdout };
}

function validateNoRowLeak(label, stdout) {
  for (const token of ["source_row_hash", "synthetic-current-scope-input-review-fixture", "\"rows\""]) {
    if (String(stdout ?? "").includes(token)) problems.push(`${label} leaked ${token}`);
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectIncludes(actual, expected, label) {
  if (!Array.isArray(actual) || !actual.includes(expected)) problems.push(`${label} missing ${expected}`);
}
