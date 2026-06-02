import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_PARSER_CONTRACT_CONSUMER_PLANNING_2026-06-02.md";
const implementationReviewPath = "docs/reviews/TWII_LOCAL_PARSER_CONTRACT_IMPLEMENTATION_REVIEW_2026-06-02.md";
const modulePath = "src/lib/twii-parser-contract.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const implementationReview = fs.readFileSync(implementationReviewPath, "utf8");
const moduleSource = fs.readFileSync(modulePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_parser_contract_consumer_planning_recorded`",
  "TWII_LOCAL_PARSER_CONTRACT_IMPLEMENTATION_REVIEW_2026-06-02.md",
  "source_module: src/lib/twii-parser-contract.ts",
  "consumer_type: future_staging_first_review_consumer",
  "planning_only: true",
  "target_symbol: TWII",
  "source_candidate: official-exchange-index",
  "fixture_policy: synthetic_rows_only",
  "publicDataSource: mock",
  "scoreSource: mock",
  "CONSUMER-001 accept TwiiParserContractResult only after parser contract checks pass",
  "CONSUMER-002 read normalizedDate and normalizedIndexValue as review-stage fields only",
  "CONSUMER-003 surface duplicateTradeDateCount and fieldParseFailureCount as blocking review signals",
  "CONSUMER-004 keep failureClass visible to staging review",
  "CONSUMER-005 preserve assetMapping as TWII_internal_market_asset_pending",
  "CONSUMER-006 refuse to award row coverage credit",
  "CONSUMER-007 refuse to set scoreSource=real",
  "CONSUMER-008 refuse to map rows into daily_prices",
  "CONSUMER-009 require separate rights decision before ingestion",
  "CONSUMER-010 require separate staging schema decision before storage",
  "STATE-001 parser_contract_ready_for_review",
  "STATE-002 parser_contract_blocked_by_field_mismatch",
  "STATE-003 parser_contract_blocked_by_duplicate_dates",
  "STATE-004 parser_contract_blocked_by_no_rows",
  "STATE-005 parser_contract_waiting_for_rights_decision",
  "STATE-006 parser_contract_waiting_for_staging_schema",
  "STATE-007 parser_contract_not_runtime_ready",
  "This consumer planning does not run SQL",
  "This consumer planning does not connect to Supabase",
  "This consumer planning does not write Supabase",
  "This consumer planning does not create staging rows",
  "This consumer planning does not modify `daily_prices`",
  "This consumer planning does not fetch or ingest raw market data",
  "This consumer planning does not probe an external endpoint",
  "This consumer planning does not print secrets",
  "This consumer planning does not print row payloads",
  "This consumer planning does not print stock_id payloads",
  "This consumer planning does not commit raw market data",
  "This consumer planning does not approve source rights",
  "This consumer planning does not approve parser ingestion",
  "This consumer planning does not approve ingestion",
  "This consumer planning does not award row coverage points",
  "This consumer planning does not promote `publicDataSource=supabase`",
  "This consumer planning does not set `scoreSource=real`",
  "READY_FOR_TWII_PARSER_CONTRACT_CONSUMER_ROLE_REVIEW_LOCAL_ONLY"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_PARSER_CONTRACT_CONSUMER_PLANNING_LOCAL_ONLY",
  "Do not implement ingestion",
  "do not map parser output into `daily_prices`"
]) {
  if (!implementationReview.includes(phrase)) {
    missing.push(`${implementationReviewPath}: ${phrase}`);
  }
}

for (const phrase of ["TwiiParserContractResult", "normalizedDate", "normalizedIndexValue", "duplicateTradeDateCount", "fieldParseFailureCount"]) {
  if (!moduleSource.includes(phrase)) {
    missing.push(`${modulePath}: ${phrase}`);
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

if (packageJson.scripts?.["check:twii-parser-contract-consumer-planning"] !== "node scripts/check-twii-parser-contract-consumer-planning.mjs") {
  missing.push(`${packagePath}: check:twii-parser-contract-consumer-planning`);
}
if (!reviewGate.includes("scripts/check-twii-parser-contract-consumer-planning.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-parser-contract-consumer-planning.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
