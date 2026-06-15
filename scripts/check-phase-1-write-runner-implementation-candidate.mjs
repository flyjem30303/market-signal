import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-write-runner-implementation-candidate.mjs";
const docPath = "docs/PHASE_1_WRITE_RUNNER_IMPLEMENTATION_CANDIDATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const runnerSource = readText(runnerPath);
const doc = readText(docPath);
const packageJson = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const run = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const fixturePath = writeFixture();
const fixtureRun = spawnSync(process.execPath, [runnerPath, "--candidate-artifact", fixturePath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
if (run.status !== 0) problems.push("runner candidate must exit 0 while blocked");
if (fixtureRun.status !== 0) problems.push("runner candidate must exit 0 with valid fixture");
const output = parseJson(run.stdout, "runner stdout");
const fixtureOutput = parseJson(fixtureRun.stdout, "runner fixture stdout");

validateOutput();
validateFixtureOutput();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_write_runner_implementation_candidate_blocked_no_execution_ready"
        : "phase_1_write_runner_implementation_candidate_check_blocked",
      runnerStatus: output.runnerStatus ?? null,
      blockedReasons: output.blockedReasons ?? [],
      fixtureRunnerStatus: fixtureOutput.runnerStatus ?? null,
      fixtureNextRoute: fixtureOutput.nextRoute ?? null,
      nextRoute: output.nextRoute ?? null,
      publicDataSource: output.publicDataSource ?? null,
      scoreSource: output.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateOutput() {
  expect(output.status, "blocked", "output.status");
  expect(output.runnerStatus, "phase_1_write_runner_implementation_candidate_blocked_no_execution", "runnerStatus");
  expect(output.outcome, "runner_candidate_fail_closed_before_row_payload_or_write", "outcome");
  expect(output.runnerMode, "implementation_candidate_fail_closed_no_execution", "runnerMode");
  expect(output.boundedAttemptScope, "twii_and_etf_phase_1_missing_row_closure_only", "boundedAttemptScope");
  expect(output.targetTable, "daily_prices", "targetTable");
  expect(output.expected?.fullLevel1MissingRows, 178, "fullLevel1MissingRows");
  expect(output.expected?.twiiMissingRows, 60, "twiiMissingRows");
  expect(output.expected?.etfMissingRows, 118, "etfMissingRows");
  expect(output.rowPayloadStatus?.twiiRowPayloadIncluded, false, "twiiRowPayloadIncluded");
  expect(output.rowPayloadStatus?.etfRowPayloadIncluded, false, "etfRowPayloadIncluded");
  expect(output.rowPayloadStatus?.twiiRawPayloadIncluded, false, "twiiRawPayloadIncluded");
  expect(output.rowPayloadStatus?.etfRawPayloadIncluded, false, "etfRawPayloadIncluded");
  expectIncludes(output.blockedReasons, "candidate_row_payloads_missing", "blockedReasons");
  expect(output.nextRoute, "provide_sanitized_row_payload_candidate_artifacts_or_keep_data_online_no_go", "nextRoute");
  for (const key of [
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "credentialValueRead",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted"
  ]) {
    expect(output[key], false, key);
  }
  expect(output.publicDataSource, "mock", "publicDataSource");
  expect(output.scoreSource, "mock", "scoreSource");
}

function validateFixtureOutput() {
  expect(fixtureOutput.status, "ready_for_separate_write_execution_review", "fixture output.status");
  expect(
    fixtureOutput.runnerStatus,
    "phase_1_write_runner_implementation_candidate_ready_for_separate_review",
    "fixture runnerStatus"
  );
  expect(fixtureOutput.outcome, "candidate_artifacts_include_required_rows_but_execution_still_separate", "fixture outcome");
  expect(fixtureOutput.nextRoute, "separate_operator_write_execution_review_required", "fixture nextRoute");
  expect(fixtureOutput.rowPayloadStatus?.rowPayloadCandidatePathProvided, true, "fixture rowPayloadCandidatePathProvided");
  expect(fixtureOutput.rowPayloadStatus?.rowPayloadCandidateAccepted, true, "fixture rowPayloadCandidateAccepted");
  expect(fixtureOutput.rowPayloadStatus?.rowPayloadCandidateRowCount, 178, "fixture rowPayloadCandidateRowCount");
  expect(fixtureOutput.rowPayloadStatus?.rowPayloadCandidateSymbolCounts?.TWII, 60, "fixture TWII symbol count");
  expect(fixtureOutput.rowPayloadStatus?.rowPayloadCandidateSymbolCounts?.["0050"], 59, "fixture 0050 symbol count");
  expect(fixtureOutput.rowPayloadStatus?.rowPayloadCandidateSymbolCounts?.["006208"], 59, "fixture 006208 symbol count");
  expect(
    fixtureOutput.rowPayloadStatus?.rowPayloadCandidateInvalidTradeDateCount,
    0,
    "fixture rowPayloadCandidateInvalidTradeDateCount"
  );
  for (const symbol of ["0050", "006208", "TWII"]) {
    expectIncludes(fixtureOutput.rowPayloadStatus?.rowPayloadCandidateSymbolsCovered, symbol, "fixture symbolsCovered");
  }
  for (const key of [
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "credentialValueRead",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted"
  ]) {
    expect(fixtureOutput[key], false, `fixture ${key}`);
  }
  expect(fixtureOutput.publicDataSource, "mock", "fixture publicDataSource");
  expect(fixtureOutput.scoreSource, "mock", "fixture scoreSource");
  for (const leakedToken of ["source_row_hash", "synthetic_fixture", "\"rows\""]) {
    if ((fixtureRun.stdout ?? "").includes(leakedToken)) problems.push(`runner fixture stdout leaked ${leakedToken}`);
  }
}

function validateDoc() {
  for (const token of [
    "phase_1_write_runner_implementation_candidate_blocked_no_execution",
    "implementation_candidate_fail_closed_no_execution",
    "candidate_row_payloads_missing",
    "provide_sanitized_row_payload_candidate_artifacts_or_keep_data_online_no_go",
    "--candidate-artifact <LOCAL_JSON_PATH>",
    "PHASE_1_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH=<LOCAL_JSON_PATH>",
    "twiiCandidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
    "etfCandidateArtifactPath=data/candidates/phase-1-etf-sanitized-candidate.json",
    "twiiRowPayloadIncluded=false",
    "etfRowPayloadIncluded=false",
    "rowPayloadCandidatePathProvided=false",
    "rowPayloadCandidateAccepted=false",
    "cmd.exe /c npm run validate:phase-1-sanitized-row-payload-candidate-artifact -- --candidate-artifact <LOCAL_JSON_PATH>",
    "cmd.exe /c npm run run:phase-1-write-runner-implementation-candidate -- --candidate-artifact <LOCAL_JSON_PATH>",
    "rowPayloadCandidateRowCount=178",
    "rowPayloadCandidateSymbolsCovered=[0050,006208,TWII]",
    "rowPayloadCandidateSymbolCounts={TWII:60,0050:59,006208:59}",
    "rowPayloadCandidateInvalidTradeDateCount=0",
    "sourceRightsStatus=accepted",
    "fieldContractStatus=accepted",
    "nextRoute=separate_operator_write_execution_review_required",
    "No SQL",
    "No Supabase write",
    "No candidate row acceptance",
    "No `daily_prices` mutation",
    "No row payload output",
    "No public real-data claim",
    "No investment advice"
  ]) {
    if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["run:phase-1-write-runner-implementation-candidate"] !==
    "node scripts/run-phase-1-write-runner-implementation-candidate.mjs"
  ) {
    problems.push("package.json missing run:phase-1-write-runner-implementation-candidate");
  }
  if (
    packageJson.scripts?.["check:phase-1-write-runner-implementation-candidate"] !==
    "node scripts/check-phase-1-write-runner-implementation-candidate.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-runner-implementation-candidate");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-runner-implementation-candidate.mjs")) {
    problems.push("review gate missing implementation candidate checker");
  }
  if (!reviewGate.includes('"phase-1-write-runner-implementation-candidate"')) {
    problems.push("focused review gate missing implementation candidate checker");
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [runnerPath, runnerSource],
    [docPath, doc],
    ["runner output", run.stdout ?? ""],
    ["runner fixture output", fixtureRun.stdout ?? ""]
  ]) {
    for (const pattern of [
      /@supabase\/supabase-js/u,
      /createClient\s*\(/u,
      /\.from\s*\(/u,
      /\.insert\s*\(/u,
      /\.update\s*\(/u,
      /\.delete\s*\(/u,
      /\.upsert\s*\(/u,
      /\.rpc\s*\(/u,
      /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
      /publicDataSource"\s*:\s*"supabase"/u,
      /scoreSource"\s*:\s*"real"/u,
      /executionAllowedNow"\s*:\s*true/u,
      /writeGateExecutableNow"\s*:\s*true/u,
      /dailyPricesMutated"\s*:\s*true/u,
      /supabaseWriteAttempted"\s*:\s*true/u
    ]) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectIncludes(actual, expected, label) {
  if (!Array.isArray(actual) || !actual.includes(expected)) problems.push(`${label} missing ${expected}`);
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "{}";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}

function writeFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "phase-1-write-runner-fixture-"));
  const rows = [];
  for (const [symbol, count] of [
    ["TWII", 60],
    ["0050", 59],
    ["006208", 59]
  ]) {
    for (let index = 1; index <= count; index += 1) {
      const date = new Date(Date.UTC(2026, 0, index));
      rows.push({
        symbol,
        trade_date: date.toISOString().slice(0, 10),
        close: 100 + index,
        source_name: "synthetic_fixture",
        source_updated_at: "2026-06-15T00:00:00.000Z",
        source_row_hash: `${symbol}-${index}`
      });
    }
  }
  const fixturePath = path.join(dir, "candidate.json");
  fs.writeFileSync(
    fixturePath,
    JSON.stringify(
      {
        artifactId: "phase-1-write-runner-synthetic-fixture",
        createdAt: "2026-06-15T00:00:00.000Z",
        scope: "twii_and_etf_phase_1_missing_row_closure_only",
        sourceRightsStatus: "accepted",
        fieldContractStatus: "accepted",
        sanitizedRowPayloadIncluded: true,
        rawPayloadIncluded: false,
        stockIdPayloadIncluded: false,
        secretsIncluded: false,
        expectedRows: 178,
        rows
      },
      null,
      2
    )
  );
  return fixturePath;
}
