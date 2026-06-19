import fs from "node:fs";

const evidencePath = "data/evidence-intake/phase-1-daily-scores-backfill-post-run-review-2026-06-19.json";
const problems = [];
const text = readText(evidencePath);
const evidence = parseJson(text, evidencePath);

expect(evidence.packetMode, "phase_1_daily_scores_backfill_post_run_review", "packetMode");
expect(evidence.status, "ok", "status");
expect(
  evidence.decision,
  "DAILY_SCORES_BACKFILL_WRITTEN_AND_READBACK_MATCHED_KEEP_RUNTIME_PROMOTION_SEPARATE",
  "decision"
);
expect(evidence.authorizationId, "PHASE1-DAILY-SCORES-BACKFILL-2026-06-19-A", "authorizationId");
expect(evidence.modelVersion, "phase1-price-derived-v1", "modelVersion");
expect(evidence.targetTable, "daily_scores", "targetTable");
expect(evidence.operationKind, "upsert_price_derived_scores_from_existing_daily_prices", "operationKind");
expect(evidence.dryRun, false, "dryRun");
expect(evidence.authorizationAccepted, true, "authorizationAccepted");
expect(evidence.priceRowsRead, 2952, "priceRowsRead");
expect(evidence.scoreRowsPrepared, 2951, "scoreRowsPrepared");
expect(evidence.scoreRowsWritten, 2951, "scoreRowsWritten");
expect(evidence.readbackCount, 2951, "readbackCount");
expect(evidence.readbackError, null, "readbackError");
expect(evidence.skippedRows, 1, "skippedRows");
expect(evidence.writeAttempted, true, "writeAttempted");
expect(evidence.writeSucceeded, true, "writeSucceeded");
expect(evidence.sqlExecuted, false, "sqlExecuted");
expect(evidence.dailyPricesMutated, false, "dailyPricesMutated");
expect(evidence.marketDataFetched, false, "marketDataFetched");
expect(evidence.marketDataIngested, false, "marketDataIngested");
expect(evidence.rawPayloadOutput, false, "rawPayloadOutput");
expect(evidence.rowPayloadOutput, false, "rowPayloadOutput");
expect(evidence.stockIdPayloadOutput, false, "stockIdPayloadOutput");
expect(evidence.secretsOutput, false, "secretsOutput");
expect(evidence.publicDataSource, "mock", "publicDataSource");
expect(evidence.scoreSource, "mock", "scoreSource");
expect(evidence.sourcePromotion, false, "sourcePromotion");
expect(evidence.scorePromotion, false, "scorePromotion");

if (!Array.isArray(evidence.problems) || evidence.problems.length !== 0) {
  problems.push("problems must be an empty array");
}

for (const pattern of [
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
  /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
  /https:\/\/[a-z0-9.-]+supabase/iu,
  /"stock_id"\s*:/u,
  /"stockIds"\s*:/u,
  /"rawPayload"\s*:/u,
  /"rowPayload"\s*:/u,
  /"rowBody"\s*:/u,
  /"publicDataSource"\s*:\s*"supabase"/u,
  /"scoreSource"\s*:\s*"real"/u,
  /guaranteed return/iu,
  /buy now/iu
]) {
  if (pattern.test(text)) problems.push(`${evidencePath} contains forbidden pattern ${pattern}`);
}

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_daily_scores_backfill_post_run_review_accepted"
        : "phase_1_daily_scores_backfill_post_run_review_blocked",
      scoreRowsWritten: ok ? evidence.scoreRowsWritten : null,
      readbackCount: ok ? evidence.readbackCount : null,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: ok
        ? "phase_1_runtime_promotion_quality_freshness_source_rollback_copy_review_then_public_source_gate"
        : "repair_daily_scores_backfill_post_run_review",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "{}";
  }
}

function parseJson(value, label) {
  try {
    return JSON.parse(value);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}
