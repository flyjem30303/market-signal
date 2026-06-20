import fs from "node:fs";

const evidencePath = "data/evidence-intake/phase-1-daily-scores-backfill-dry-run-2026-06-19.json";
const problems = [];
const text = readText(evidencePath);
const evidence = parseJson(text, evidencePath);

expect(evidence.packetMode, "phase_1_daily_scores_backfill_dry_run_evidence", "packetMode");
expect(evidence.status, "dry_run_ok", "status");
expect(evidence.decision, "DAILY_SCORES_CAN_BE_PREPARED_FROM_SUPABASE_DAILY_PRICES_BUT_NOT_WRITTEN_YET", "decision");
expect(evidence.modelVersion, "phase1-price-derived-v1", "modelVersion");
expect(evidence.dryRun, true, "dryRun");
expect(evidence.authorizationAccepted, false, "authorizationAccepted");
expect(evidence.requiredAuthorizationId, "PHASE1-DAILY-SCORES-BACKFILL-2026-06-19-A", "requiredAuthorizationId");
expect(evidence.priceRowsRead, 2952, "priceRowsRead");
expect(evidence.scoreRowsPrepared, 2951, "scoreRowsPrepared");
expect(evidence.scoreRowsWritten, 0, "scoreRowsWritten");
expect(evidence.skippedRows, 1, "skippedRows");
expect(evidence.writeAttempted, false, "writeAttempted");
expect(evidence.sqlExecuted, false, "sqlExecuted");
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
        ? "phase_1_daily_scores_backfill_dry_run_evidence_ready"
        : "phase_1_daily_scores_backfill_dry_run_evidence_blocked",
      scoreRowsPrepared: ok ? evidence.scoreRowsPrepared : null,
      scoreRowsWritten: ok ? evidence.scoreRowsWritten : null,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: ok ? "phase_1_daily_scores_bounded_write_authorization_or_keep_mock" : "repair_daily_scores_dry_run_evidence",
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
