import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_PARSER_DESIGN_PREPARATION_2026-06-02.md";
const postRunPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-02.md";
const stabilityPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_RUNNER_STABILITY_FIX_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const postRun = fs.readFileSync(postRunPath, "utf8");
const stability = fs.readFileSync(stabilityPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_parser_design_preparation_recorded`",
  "TWII_REPORT_ONLY_PROBE_RUNNER_STABILITY_FIX_2026-06-02.md",
  "TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-02.md",
  "target_symbol: TWII",
  "selected_candidate: official-exchange-index",
  "httpStatusGroup: 2xx",
  "parsedRowCount: 20",
  "dateRangeStart: 2026-05-04",
  "dateRangeEnd: 2026-05-29",
  "duplicateTradeDateCount: 0",
  "fieldParseFailureCount: 0",
  "parserFlagCount: 0",
  "publicDataSource: mock",
  "scoreSource: mock",
  "without executing another remote probe",
  "without storing market data",
  "must not implement ingestion",
  "source_row_contract: array_row",
  "field_001_source_date: roc_date_string",
  "field_002_index_value: numeric_string",
  "normalized_date: iso_date",
  "normalized_index_value: decimal",
  "timezone: Asia/Taipei_assumed_pending_final_rights_review",
  "asset_mapping: TWII_internal_market_asset_pending",
  "NORMALIZE-001 convert ROC date strings into ISO dates",
  "NORMALIZE-002 remove comma separators from numeric cells",
  "NORMALIZE-006 do not map to daily_prices until staging-first design is approved",
  "NORMALIZE-007 do not calculate score inputs from this evidence alone",
  "NORMALIZE-008 do not store raw source rows",
  "VALIDATE-001 parsed row count must be positive for source feasibility",
  "VALIDATE-002 duplicate normalized dates must be counted",
  "VALIDATE-003 invalid date cells must increment fieldParseFailureCount",
  "VALIDATE-004 invalid numeric cells must increment fieldParseFailureCount",
  "VALIDATE-007 market calendar gaps require a separate calendar source before claims",
  "FAILURE-001 no_rows",
  "FAILURE-002 field_mismatch",
  "FAILURE-006 rights_unapproved",
  "FAILURE-007 process_tail_error",
  "This preparation does not run SQL",
  "This preparation does not connect to Supabase",
  "This preparation does not write Supabase",
  "This preparation does not create staging rows",
  "This preparation does not modify `daily_prices`",
  "This preparation does not fetch or ingest raw market data",
  "This preparation does not probe an external endpoint",
  "This preparation does not print secrets",
  "This preparation does not print row payloads",
  "This preparation does not print stock_id payloads",
  "This preparation does not commit raw market data",
  "This preparation does not approve source rights",
  "This preparation does not approve a parser implementation",
  "This preparation does not approve ingestion",
  "This preparation does not award row coverage points",
  "This preparation does not promote `publicDataSource=supabase`",
  "This preparation does not set `scoreSource=real`",
  "READY_FOR_TWII_PARSER_DESIGN_ROLE_REVIEW_LOCAL_ONLY",
  "synthetic rows only, not raw market data"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_PARSER_DESIGN_PREPARATION_AFTER_RUNNER_STABILITY_FIX",
  "parsedRowCount: 20",
  "fieldParseFailureCount: 0"
]) {
  if (!postRun.includes(phrase)) {
    missing.push(`${postRunPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_PARSER_DESIGN_PREPARATION_LOCAL_ONLY",
  "remote_attempt_reused: false"
]) {
  if (!stability.includes(phrase)) {
    missing.push(`${stabilityPath}: ${phrase}`);
  }
}

for (const pattern of [
  /https?:\/\/[^\s)]+/i,
  /NEXT_PUBLIC_SUPABASE_URL/,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /https:\/\/[a-z0-9-]+\.supabase\.co/i,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
  /\bselect\s+\*\s+from\b/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+[a-z_]+\s+set\b/i,
  /\bdelete\s+from\b/i,
  /scoreSource:\s*real/i,
  /publicDataSource:\s*supabase/i
]) {
  if (pattern.test(review)) {
    blocked.push(`${reviewPath}: forbidden review pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["check:twii-parser-design-preparation"] !== "node scripts/check-twii-parser-design-preparation.mjs") {
  missing.push(`${packagePath}: check:twii-parser-design-preparation`);
}
if (!reviewGate.includes("scripts/check-twii-parser-design-preparation.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-parser-design-preparation.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
