import fs from "node:fs";

const resultPath = "data/evidence-intake/phase-1-row-coverage-readonly-result-20260615-a.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const raw = readText(resultPath);
const result = parseJson(raw, resultPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);

expect(result.status, "row_coverage_readonly_remote_validation_blocked_incomplete", "status");
expect(result.packetMode, "row_coverage_readonly_result", "packetMode");
expect(result.targetRelation, "daily_prices", "targetRelation");
expect(result.remoteAttempted, true, "remoteAttempted");
expect(result.coverageStatus, "blocked", "coverageStatus");
expect(result.reason, "aggregate_count_incomplete", "reason");
expect(result.expectedTotalRows, 360, "expectedTotalRows");
expect(result.observedTotalRows, 182, "observedTotalRows");
expect(result.missingRows, 178, "missingRows");

const expected = new Map([
  ["TWII", { observedRows: 0, missingRows: 60 }],
  ["0050", { observedRows: 1, missingRows: 59 }],
  ["006208", { observedRows: 1, missingRows: 59 }],
  ["2330", { observedRows: 60, missingRows: 0 }],
  ["2382", { observedRows: 60, missingRows: 0 }],
  ["2308", { observedRows: 60, missingRows: 0 }]
]);

for (const item of result.symbolsChecked ?? []) {
  const expectedItem = expected.get(item.symbol);
  if (!expectedItem) {
    problems.push(`unexpected symbol ${JSON.stringify(item.symbol)}`);
    continue;
  }
  expect(item.observedRows, expectedItem.observedRows, `${item.symbol}.observedRows`);
  expect(item.missingRows, expectedItem.missingRows, `${item.symbol}.missingRows`);
  expected.delete(item.symbol);
}
for (const symbol of expected.keys()) problems.push(`missing symbol ${symbol}`);

for (const key of ["rowPayloadIncluded", "rawPayloadIncluded", "stockIdPayloadIncluded", "secretsIncluded", "supabaseUrlIncluded"]) {
  expect(result.outputPolicy?.[key], false, `outputPolicy.${key}`);
}
expect(result.safety?.publicDataSource, "mock", "publicDataSource");
expect(result.safety?.scoreSource, "mock", "scoreSource");
for (const key of [
  "sqlExecuted",
  "supabaseWriteAttempted",
  "marketDataFetched",
  "marketDataIngested",
  "dailyPricesMutated",
  "stagingRowsCreated",
  "rowPayloadsPrinted",
  "secretsPrinted",
  "canAwardRowCoveragePoints",
  "canClaimCoverage",
  "canSetScoreSourceReal"
]) {
  expect(result.safety?.[key], false, `safety.${key}`);
}

for (const pattern of [
  /sb_secret_/u,
  /service_role/iu,
  /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
  /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
  /https:\/\/[a-z0-9.-]+supabase/iu,
  /"stock_id"\s*:/u,
  /"rowBody"\s*:/u,
  /"rawPayload"\s*:/u,
  /publicDataSource"\s*:\s*"supabase"/u,
  /scoreSource"\s*:\s*"real"/u
]) {
  if (pattern.test(raw)) problems.push(`${resultPath} contains forbidden pattern ${pattern}`);
}

if (
  packageJson.scripts?.["check:phase-1-row-coverage-readonly-result-20260615-a"] !==
  "node scripts/check-phase-1-row-coverage-readonly-result-20260615-a.mjs"
) {
  problems.push("package.json missing check:phase-1-row-coverage-readonly-result-20260615-a");
}
if (!reviewGate.includes("scripts/check-phase-1-row-coverage-readonly-result-20260615-a.mjs")) {
  problems.push("review gate missing row coverage readonly result checker command");
}
if (!reviewGate.includes('"phase-1-row-coverage-readonly-result-20260615-a"')) {
  problems.push("focused review gate missing row coverage readonly result checker name");
}

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_row_coverage_readonly_result_20260615_a_ready"
        : "phase_1_row_coverage_readonly_result_20260615_a_blocked",
      observedTotalRows: result.observedTotalRows ?? null,
      missingRows: result.missingRows ?? null,
      nextRecommendedSlice: result.nextRecommendedSlice ?? null,
      publicDataSource: result.safety?.publicDataSource ?? null,
      scoreSource: result.safety?.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);
if (!ok) process.exit(1);

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
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
