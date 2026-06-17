import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const validatorPath = "scripts/validate-phase-1-current-scope-sanitized-row-payload-candidate-artifact.mjs";
const problems = [];
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-validator-"));

try {
  const acceptedPath = path.join(tempDir, "accepted-current-scope-candidate.json");
  const etfPath = path.join(tempDir, "rejected-etf-candidate.json");
  const stalePath = path.join(tempDir, "rejected-stale-scope-candidate.json");

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
  fs.writeFileSync(stalePath, JSON.stringify({
    ...makeArtifact({ rows: [makeRow("TWII", "2026-06-15", 22000), makeRow("2330", "2026-06-15", 1000)] }),
    scope: "twii_and_etf_phase_1_missing_row_closure_only"
  }, null, 2));

  const accepted = runValidator(acceptedPath);
  const etf = runValidator(etfPath);
  const stale = runValidator(stalePath);

  expect(accepted.status, "phase_1_current_scope_sanitized_row_payload_candidate_artifact_validated_aggregate_only", "accepted.status");
  expect(accepted.accepted, true, "accepted.accepted");
  expect(accepted.rowCount, 2, "accepted.rowCount");
  expect(accepted.etfSymbolCount, 0, "accepted.etfSymbolCount");
  expect(accepted.listedStockSymbolCount, 1, "accepted.listedStockSymbolCount");
  expect(accepted.twiiRowCount, 1, "accepted.twiiRowCount");
  expect(accepted.safety?.rowPayloadOutput, false, "accepted.safety.rowPayloadOutput");

  expect(etf.accepted, false, "etf.accepted");
  expectIncludes(etf.problems, "unexpected_symbol", "etf.problems");
  expectIncludes(etf.problems, "deferred_etf_symbol_present", "etf.problems");

  expect(stale.accepted, false, "stale.accepted");
  expectIncludes(stale.problems, "scope_mismatch", "stale.problems");

  validateNoRowLeak("accepted stdout", accepted.__stdout);
  validateNoRowLeak("etf stdout", etf.__stdout);
  validateNoRowLeak("stale stdout", stale.__stdout);

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_sanitized_row_payload_candidate_artifact_validator_ready"
      : "phase_1_current_scope_sanitized_row_payload_candidate_artifact_validator_blocked",
    acceptedFixturePassed: accepted.accepted === true,
    etfFixtureRejected: etf.accepted === false,
    staleScopeFixtureRejected: stale.accepted === false,
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
    artifactId: "phase-1-current-scope-validator-fixture",
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
    source_name: "synthetic-current-scope-validator-fixture",
    source_updated_at: "2026-06-17T00:00:00.000Z",
    source_row_hash: `${symbol}-${tradeDate}-hash`
  };
}

function runValidator(candidatePath) {
  const run = spawnSync(process.execPath, [validatorPath, "--candidate-artifact", candidatePath], {
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
    problems.push(`${candidatePath} validator output unreadable: ${error.message}`);
  }
  return { ...output, __stdout: run.stdout };
}

function validateNoRowLeak(label, stdout) {
  for (const token of ["source_row_hash", "synthetic-current-scope-validator-fixture", "\"rows\""]) {
    if (String(stdout ?? "").includes(token)) problems.push(`${label} leaked ${token}`);
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectIncludes(actual, expected, label) {
  if (!Array.isArray(actual) || !actual.includes(expected)) problems.push(`${label} missing ${expected}`);
}
