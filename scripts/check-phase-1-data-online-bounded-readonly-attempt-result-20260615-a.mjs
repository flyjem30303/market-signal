import fs from "node:fs";

const resultPath = "data/evidence-intake/phase-1-bounded-readonly-attempt-result-20260615-a.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const raw = readText(resultPath);
const result = parseJson(raw, resultPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);

expect(result.status, "bounded_readonly_attempt_result_accepted_aggregate_only", "result status");
expect(result.packetMode, "bounded_readonly_attempt_result", "packetMode");
expect(result.attemptId, "phase1-data-online-readonly-20260615-a", "attemptId");
expect(result.scope, "aggregate_readonly_daily_prices_level1_coverage", "scope");
expect(result.remoteAttempted, true, "remoteAttempted");
expect(
  result.postRunReviewStatus,
  "phase_1_data_online_bounded_readonly_post_run_review_accepted_aggregate_probe",
  "postRunReviewStatus"
);
expect(result.postRunReviewOutcome, "accepted_aggregate_readonly_probe_no_write", "postRunReviewOutcome");
expect(result.aggregateProbe?.dailyPrices?.table, "daily_prices", "dailyPrices table");
expect(result.aggregateProbe?.dailyPrices?.queryStatus, "ok", "dailyPrices queryStatus");
if (typeof result.aggregateProbe?.dailyPrices?.rowCount !== "number" || result.aggregateProbe.dailyPrices.rowCount < 1) {
  problems.push("dailyPrices rowCount must be a positive aggregate number");
}
expect(result.outputPolicy?.aggregateOnly, true, "aggregateOnly");
for (const key of [
  "rowPayloadIncluded",
  "rawPayloadIncluded",
  "endpointResponseBodyIncluded",
  "stockIdPayloadIncluded",
  "secretsIncluded",
  "supabaseUrlIncluded",
  "confirmationPhraseIncluded"
]) {
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
  "rawPayloadsPrinted",
  "rowPayloadsPrinted",
  "secretsPrinted",
  "publicPromotionAllowed",
  "scoreSourceRealAllowed",
  "investmentAdviceClaimAllowed"
]) {
  expect(result.safety?.[key], false, `safety.${key}`);
}

for (const pattern of [
  /sb_secret_/u,
  /service_role/iu,
  /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
  /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
  /https:\/\/[a-z0-9.-]+supabase/iu,
  /confirmationPresent/u,
  /requiredConfirmation/u,
  /CEO_APPROVED/u,
  /"rowBody"\s*:/u,
  /"rawPayload"\s*:/u,
  /"endpointResponseBody"\s*:/u,
  /"stockIdPayload"\s*:/u,
  /publicDataSource"\s*:\s*"supabase"/u,
  /scoreSource"\s*:\s*"real"/u
]) {
  if (pattern.test(raw)) problems.push(`${resultPath} contains forbidden pattern ${pattern}`);
}

if (
  packageJson.scripts?.["check:phase-1-data-online-bounded-readonly-attempt-result-20260615-a"] !==
  "node scripts/check-phase-1-data-online-bounded-readonly-attempt-result-20260615-a.mjs"
) {
  problems.push("package.json missing check:phase-1-data-online-bounded-readonly-attempt-result-20260615-a");
}
if (!reviewGate.includes("scripts/check-phase-1-data-online-bounded-readonly-attempt-result-20260615-a.mjs")) {
  problems.push("review gate missing bounded readonly attempt result checker command");
}
if (!reviewGate.includes('"phase-1-data-online-bounded-readonly-attempt-result-20260615-a"')) {
  problems.push("focused review gate missing bounded readonly attempt result checker name");
}

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_data_online_bounded_readonly_attempt_result_20260615_a_ready"
        : "phase_1_data_online_bounded_readonly_attempt_result_20260615_a_blocked",
      remoteAttempted: result.remoteAttempted === true,
      rowCount: result.aggregateProbe?.dailyPrices?.rowCount ?? null,
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
