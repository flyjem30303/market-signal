import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-twii-server-only-execute-runner-candidate.mjs";
const validatorPath = "scripts/validate-phase-1-twii-sanitized-row-payload-candidate-artifact.mjs";
const packagePath = "package.json";
const problems = [];

const packageJson = JSON.parse(readText(packagePath));
const missingRun = runRunner([]);
const aggregateOnlyRun = runRunner(["--candidate-artifact", "data/candidates/twii-sanitized-candidate.json"]);
const badDatePath = writeFixture({ validDates: false });
const goodPath = writeFixture({ validDates: true });
const badDateRun = runRunner(["--candidate-artifact", badDatePath]);
const goodRun = runRunner(["--candidate-artifact", goodPath]);

validateRegistration();
validateDefaultRun();
validateAggregateOnlyRun();
validateBadDateRun();
validateGoodRun();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_twii_row_payload_runner_integration_ready_no_execution"
        : "phase_1_twii_row_payload_runner_integration_blocked",
      fixtureMode: "synthetic_only_no_committed_market_rows",
      defaultRunStatus: missingRun.output.status ?? null,
      aggregateOnlyStatus: aggregateOnlyRun.output.status ?? null,
      badDateStatus: badDateRun.output.status ?? null,
      goodRowPayloadAccepted: goodRun.output.rowPayloadCandidate?.accepted ?? false,
      executionAllowedNow: goodRun.output.executionAllowedNow ?? null,
      publicDataSource: "mock",
      scoreSource: "mock",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateRegistration() {
  expect(
    packageJson.scripts?.["validate:phase-1-twii-sanitized-row-payload-candidate-artifact"],
    `node ${validatorPath}`,
    "twii validator script registration"
  );
  expect(
    packageJson.scripts?.["check:phase-1-twii-row-payload-runner-integration"],
    "node scripts/check-phase-1-twii-row-payload-runner-integration.mjs",
    "twii runner integration checker registration"
  );
}

function validateDefaultRun() {
  expect(missingRun.status, 0, "default runner exit status");
  expect(missingRun.output.status, "ok", "default runner status");
  expect(missingRun.output.rowPayloadCandidate?.pathProvided, false, "default pathProvided");
  validateNoExecutionState(missingRun.output, "default");
}

function validateAggregateOnlyRun() {
  expect(aggregateOnlyRun.status, 1, "aggregate-only runner exit status");
  expect(aggregateOnlyRun.output.status, "blocked", "aggregate-only status");
  expect(aggregateOnlyRun.output.rowPayloadCandidate?.accepted, false, "aggregate-only accepted");
  expectIncludes(aggregateOnlyRun.output.problems, "row_payload_candidate_invalid", "aggregate-only problems");
  validateNoExecutionState(aggregateOnlyRun.output, "aggregate-only");
}

function validateBadDateRun() {
  expect(badDateRun.status, 1, "bad-date runner exit status");
  expect(badDateRun.output.status, "blocked", "bad-date status");
  expect(badDateRun.output.rowPayloadCandidate?.accepted, false, "bad-date accepted");
  expectIncludes(badDateRun.output.rowPayloadCandidate?.problems, "invalid_trade_date", "bad-date candidate problems");
  validateNoExecutionState(badDateRun.output, "bad-date");
}

function validateGoodRun() {
  expect(goodRun.status, 0, "good runner exit status");
  expect(goodRun.output.status, "ok", "good status");
  expect(goodRun.output.rowPayloadCandidate?.accepted, true, "good accepted");
  expect(goodRun.output.rowPayloadCandidate?.rowCount, 60, "good rowCount");
  expect(goodRun.output.rowPayloadCandidate?.expectedRows, 60, "good expectedRows");
  expectIncludes(goodRun.output.rowPayloadCandidate?.symbolsCovered, "TWII", "good symbolsCovered");
  expect(goodRun.output.rowPayloadCandidate?.invalidTradeDateCount, 0, "good invalidTradeDateCount");
  validateNoExecutionState(goodRun.output, "good");
}

function validateNoExecutionState(output, label) {
  for (const key of [
    "executeRequested",
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
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    expect(output[key], false, `${label}.${key}`);
  }
  expect(output.safety?.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(output.safety?.scoreSource, "mock", `${label}.scoreSource`);
}

function writeFixture({ validDates }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "twii-row-payload-runner-"));
  const rows = Array.from({ length: 60 }, (_, index) => {
    const date = new Date(Date.UTC(2099, 0, 1 + index));
    return {
      symbol: "TWII",
      trade_date: validDates
        ? date.toISOString().slice(0, 10)
        : `2099-01-${String(index + 1).padStart(2, "0")}`,
      close: 10000 + index,
      source_name: "synthetic-runner-fixture",
      source_updated_at: "2099-01-01T00:00:00.000Z",
      source_row_hash: `synthetic-hash-${String(index + 1).padStart(2, "0")}`
    };
  });
  const artifact = {
    artifactId: validDates ? "twii-synthetic-good-runner-fixture" : "twii-synthetic-bad-date-runner-fixture",
    createdAt: "2099-01-01T00:00:00.000Z",
    lane: "TWII",
    assetType: "index",
    symbol: "TWII",
    scope: "twii_index_daily_prices_missing_rows",
    sourceRightsStatus: "synthetic_fixture_only_not_real_source_rights",
    fieldContractStatus: "synthetic_fixture_only_not_real_field_contract",
    sanitizedRowPayloadIncluded: true,
    rawPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false,
    expectedRows: 60,
    rows
  };
  const filePath = path.join(dir, "candidate.json");
  fs.writeFileSync(filePath, JSON.stringify(artifact, null, 2));
  return filePath;
}

function runRunner(args) {
  const run = spawnSync(process.execPath, [runnerPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  return {
    status: run.status,
    output: parseJson(run.stdout, "runner stdout")
  };
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text, label) {
  try {
    return JSON.parse(text ?? "{}");
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) {
    problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
  }
}

function expectIncludes(actual, expected, label) {
  if (!Array.isArray(actual) || !actual.includes(expected)) {
    problems.push(`${label} missing ${expected}`);
  }
}
