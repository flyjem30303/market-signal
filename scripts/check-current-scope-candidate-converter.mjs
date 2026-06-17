import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const converterPath = "scripts/convert-tw-equity-staging-candidate-to-current-scope-artifact.mjs";
const validatorPath = "scripts/validate-phase-1-current-scope-sanitized-row-payload-candidate-artifact.mjs";
const inputReviewPath = "scripts/run-phase-1-current-scope-write-runner-input-review.mjs";
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-converter-"));
const problems = [];

try {
  const inputPath = path.join(tempDir, "staging-shaped-input.json");
  const outputPath = path.join(tempDir, "current-scope-output.json");
  const blockedOutputPath = path.join(tempDir, "blocked-output.json");

  fs.writeFileSync(inputPath, JSON.stringify(makeStagingInput(), null, 2));

  const accepted = runJson(converterPath, [
    "--input", inputPath,
    "--output", outputPath,
    "--source-rights-status", "accepted",
    "--field-contract-status", "accepted"
  ]);
  const missingStatus = runJson(converterPath, [
    "--input", inputPath,
    "--output", blockedOutputPath
  ]);
  const validator = runJson(validatorPath, ["--candidate-artifact", outputPath]);
  const inputReview = runJson(inputReviewPath, ["--candidate-artifact", outputPath]);

  expect(accepted.status, "phase_1_current_scope_candidate_conversion_ready", "accepted.status");
  expect(accepted.outputWritten, true, "accepted.outputWritten");
  expect(accepted.normalizedRowCount, 2, "accepted.normalizedRowCount");
  expect(accepted.rejectedRowCount, 1, "accepted.rejectedRowCount");
  expect(accepted.safety?.marketDataFetched, false, "accepted.safety.marketDataFetched");
  expect(fs.existsSync(outputPath), true, "output file exists");

  expect(missingStatus.status, "phase_1_current_scope_candidate_conversion_blocked", "missingStatus.status");
  expect(missingStatus.outputWritten, false, "missingStatus.outputWritten");
  expect(fs.existsSync(blockedOutputPath), false, "blocked output file absent");

  expect(validator.accepted, true, "validator.accepted");
  expect(validator.rowCount, 2, "validator.rowCount");
  expect(validator.etfSymbolCount, 0, "validator.etfSymbolCount");

  expect(inputReview.status, "ok", "inputReview.status");
  expect(inputReview.guardedStatus, "phase_1_current_scope_write_runner_input_review_ready", "inputReview.guardedStatus");
  expect(inputReview.candidateArtifactAcceptedNow, true, "inputReview.candidateArtifactAcceptedNow");
  expect(inputReview.runnerExecutableNow, false, "inputReview.runnerExecutableNow");

  validateNoRowLeak("converter stdout", accepted.__stdout);
  validateNoRowLeak("input review stdout", inputReview.__stdout);

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "current_scope_candidate_converter_ready"
      : "current_scope_candidate_converter_blocked",
    acceptedConversionPassed: accepted.outputWritten === true,
    blockedWithoutAcceptedStatuses: missingStatus.outputWritten === false,
    validatorAcceptedConvertedOutput: validator.accepted === true,
    inputReviewAcceptedConvertedOutput: inputReview.status === "ok",
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

function makeStagingInput() {
  return {
    sourceId: "synthetic-staging-shaped-input",
    candidateRun: {
      finished_at: "2026-06-17T00:00:00.000Z"
    },
    candidatePrices: [
      makePrice("TWII", "2026-06-15", 22000),
      makePrice("2330", "2026-06-15", 1000),
      makePrice("0050", "2026-06-15", 200)
    ]
  };
}

function makePrice(symbol, tradeDate, close) {
  return {
    source_id: "synthetic-staging-shaped-input",
    symbol,
    trade_date: tradeDate,
    open_price: close - 10,
    high_price: close + 10,
    low_price: close - 20,
    close_price: close,
    volume: 1000,
    source_fetched_at: "2026-06-17T00:00:00.000Z",
    source_row_hash: `${symbol}-${tradeDate}-hash`
  };
}

function runJson(scriptPath, args) {
  const run = spawnSync(process.execPath, [scriptPath, ...args], {
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
    problems.push(`${scriptPath} output unreadable: ${error.message}`);
  }
  return { ...output, __stdout: run.stdout, __exitCode: run.status ?? 1 };
}

function validateNoRowLeak(label, stdout) {
  for (const token of ["source_row_hash", "synthetic-staging-shaped-input", "\"rows\""]) {
    if (String(stdout ?? "").includes(token)) problems.push(`${label} leaked ${token}`);
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}
