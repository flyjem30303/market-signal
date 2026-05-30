import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: `CP3 Supabase schema-shape one-attempt post-run review recorded`",
  "ACCEPT_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_WITHOUT_READINESS_PROMOTION",
  "does not authorize a second attempt",
  "does not run SQL",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "RUN-001 one authorized schema-shape read-only validator attempt was performed",
  "RUN-002 command target was scripts\\validate-supabase-schema-shape-readonly.mjs",
  "RUN-003 confirmation was present",
  "RUN-004 connection was ok",
  "RUN-005 mode was schema_shape_readonly_remote_validation",
  "RUN-006 status was ok",
  "RUN-007 rowLimit was 0",
  "RUN-008 filesWritten was false",
  "RUN-009 mutations was false",
  "RUN-010 sqlExecuted was false",
  "RUN-011 rpcCalled was false",
  "RUN-012 secretsPrinted was false",
  "RUN-013 rowPayloadsPrinted was false",
  "RUN-014 rawMarketDataPrinted was false",
  "RUN-015 scoreSourceRealChanged was false",
  "RUN-016 sourceDepthReadyChanged was false",
  "RUN-017 publicClaimsChanged was false",
  "OBJECT-001 daily_prices reachable ok",
  "OBJECT-002 daily_prices shapeStatus ok",
  "OBJECT-003 daily_prices missingExpectedFields none",
  "OBJECT-005 twse_stock_day_staging reachable ok",
  "OBJECT-006 twse_stock_day_staging shapeStatus needs-reconciliation",
  "OBJECT-009 market_assets reachable ok",
  "OBJECT-012 model_runs reachable ok",
  "OBJECT-015 data_freshness reachable ok",
  "INTERPRETATION-001 schema-shape reachability is now evidenced for the reviewed objects",
  "INTERPRETATION-003 twse_stock_day_staging still needs reconciliation with the local staging baseline",
  "INTERPRETATION-005 this evidence does not prove historical data depth",
  "INTERPRETATION-006 this evidence does not prove row quality",
  "INTERPRETATION-007 this evidence does not prove freshness",
  "INTERPRETATION-008 this evidence does not prove model credibility",
  "INTERPRETATION-009 this evidence does not approve public claims",
  "INTERPRETATION-010 this evidence does not approve scoreSource=real",
  "INTERPRETATION-011 this evidence does not clear CP3 not_ready",
  "CEO-FINDING-001 one-attempt schema-shape evidence is useful and successful",
  "CEO-FINDING-002 evidence is narrow and must not be over-promoted",
  "PM-FINDING-001 next slice should reconcile twse_stock_day_staging naming and contract status",
  "ENGINEERING-FINDING-001 validator guard flags stayed false for writes, SQL, RPC, file writes, row payloads, secrets, raw market data, and score-source changes",
  "QA-FINDING-001 output was sanitized and contained no row payloads",
  "QA-FINDING-002 second attempts remain blocked without a new decision",
  "SECURITY-FINDING-001 environment values were not printed",
  "LEGAL-FINDING-001 no public market-data claim is approved",
  "BLOCKED-001 no second remote attempt",
  "BLOCKED-002 no SQL execution",
  "BLOCKED-004 no Supabase writes",
  "BLOCKED-010 no raw market rows committed",
  "BLOCKED-012 no scoreSource=real",
  "BLOCKED-014 no CP3 readiness promotion",
  "CEO accepts the sanitized schema-shape read-only evidence as successful for a narrow database-shape checkpoint.",
  "it is not enough to declare runtime readiness",
  "NEXT-SLICE-001 reconcile twse_stock_day_staging remote name with local staging baseline",
  "NEXT-SLICE-002 create schema-shape evidence-to-action map",
  "NEXT-SLICE-004 keep no second remote attempt unless a new gate is recorded",
  "NEXT-SLICE-005 keep no SQL, no writes, no market data, no scoreSource=real",
  "scripts/check-cp3-supabase-schema-shape-one-attempt-post-run-review.mjs passes",
  "scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 remains not_ready",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "AUTHORIZE_SECOND_ATTEMPT",
  "RUN_VALIDATOR_AGAIN",
  "SQL execution is approved",
  "Supabase writes are approved",
  "row payloads are committed",
  "environment values are printed",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "CP3_READY_NOW",
  "runtime readiness is approved"
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
