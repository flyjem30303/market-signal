import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const assemblerPath = "scripts/assemble-phase-1-current-scope-candidate-from-local-artifacts.mjs";
const validatorPath = "scripts/validate-phase-1-current-scope-sanitized-row-payload-candidate-artifact.mjs";
const inputReviewPath = "scripts/run-phase-1-current-scope-write-runner-input-review.mjs";
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-assembly-"));
const problems = [];

try {
  const twiiInputPath = path.join(tempDir, "twii-old-scope-input.json");
  const listedStockInputPath = path.join(tempDir, "listed-stock-staging-input.json");
  const outputPath = path.join(tempDir, "assembled-current-scope.json");

  fs.writeFileSync(twiiInputPath, JSON.stringify(makeTwiiInput(), null, 2));
  fs.writeFileSync(listedStockInputPath, JSON.stringify(makeListedStockInput(), null, 2));

  const assembled = runJson(assemblerPath, [
    "--twii-input", twiiInputPath,
    "--listed-stock-input", listedStockInputPath,
    "--output", outputPath,
    "--source-rights-status", "accepted",
    "--field-contract-status", "accepted"
  ]);
  const validator = runJson(validatorPath, ["--candidate-artifact", outputPath]);
  const inputReview = runJson(inputReviewPath, ["--candidate-artifact", outputPath]);

  expect(assembled.status, "phase_1_current_scope_local_candidate_assembly_ready", "assembled.status");
  expect(assembled.outputWritten, true, "assembled.outputWritten");
  expect(assembled.twiiRowCount, 1, "assembled.twiiRowCount");
  expect(assembled.listedStockRowCount, 1, "assembled.listedStockRowCount");
  expect(assembled.assembledRowCount, 2, "assembled.assembledRowCount");
  expect(fs.existsSync(outputPath), true, "output file exists");

  expect(validator.accepted, true, "validator.accepted");
  expect(validator.twiiRowCount, 1, "validator.twiiRowCount");
  expect(validator.listedStockSymbolCount, 1, "validator.listedStockSymbolCount");
  expect(validator.etfSymbolCount, 0, "validator.etfSymbolCount");

  expect(inputReview.status, "ok", "inputReview.status");
  expect(inputReview.candidateArtifactAcceptedNow, true, "inputReview.candidateArtifactAcceptedNow");
  expect(inputReview.runnerExecutableNow, false, "inputReview.runnerExecutableNow");

  validateNoRowLeak("assembler stdout", assembled.__stdout);
  validateNoRowLeak("input review stdout", inputReview.__stdout);

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_local_candidate_assembly_check_ready"
      : "phase_1_current_scope_local_candidate_assembly_check_blocked",
    assemblyPassed: assembled.outputWritten === true,
    validatorAcceptedAssembledOutput: validator.accepted === true,
    inputReviewAcceptedAssembledOutput: inputReview.status === "ok",
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

function makeTwiiInput() {
  return {
    scope: "twii_and_etf_phase_1_missing_row_closure_only",
    sourceRightsStatus: "accepted",
    fieldContractStatus: "accepted",
    rows: [
      makeExistingRow("TWII", "2026-06-15", 22000),
      makeExistingRow("0050", "2026-06-15", 200)
    ]
  };
}

function makeListedStockInput() {
  return {
    sourceId: "synthetic-listed-stock-staging-input",
    candidateRun: {
      finished_at: "2026-06-17T00:00:00.000Z"
    },
    candidatePrices: [
      {
        source_id: "synthetic-listed-stock-staging-input",
        symbol: "2330",
        trade_date: "2026-06-15",
        open_price: 990,
        high_price: 1010,
        low_price: 980,
        close_price: 1000,
        volume: 1000,
        source_fetched_at: "2026-06-17T00:00:00.000Z",
        source_row_hash: "2330-2026-06-15-hash"
      },
      {
        source_id: "synthetic-listed-stock-staging-input",
        symbol: "0050",
        trade_date: "2026-06-15",
        close_price: 200,
        source_fetched_at: "2026-06-17T00:00:00.000Z",
        source_row_hash: "0050-2026-06-15-hash"
      }
    ]
  };
}

function makeExistingRow(symbol, tradeDate, close) {
  return {
    symbol,
    trade_date: tradeDate,
    close,
    source_name: "synthetic-existing-row-input",
    source_updated_at: "2026-06-17T00:00:00.000Z",
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
  for (const token of ["source_row_hash", "synthetic-existing-row-input", "synthetic-listed-stock-staging-input", "\"rows\""]) {
    if (String(stdout ?? "").includes(token)) problems.push(`${label} leaked ${token}`);
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}
