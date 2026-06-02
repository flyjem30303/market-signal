import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_LOCAL_PARSER_CONTRACT_IMPLEMENTATION_REVIEW_2026-06-02.md";
const modulePath = "src/lib/twii-parser-contract.ts";
const checkerPath = "scripts/check-twii-local-parser-contract.mjs";
const roleReviewPath = "docs/reviews/TWII_PARSER_DESIGN_PREPARATION_ROLE_REVIEW_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const moduleSource = fs.readFileSync(modulePath, "utf8");
const checker = fs.readFileSync(checkerPath, "utf8");
const roleReview = fs.readFileSync(roleReviewPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_local_parser_contract_implementation_review_recorded`",
  "TWII_PARSER_DESIGN_PREPARATION_ROLE_REVIEW_2026-06-02.md",
  "module: src/lib/twii-parser-contract.ts",
  "checker: scripts/check-twii-local-parser-contract.mjs",
  "implementation_type: local_parser_contract_only",
  "fixture_policy: synthetic_rows_only",
  "target_symbol: TWII",
  "source_candidate: official-exchange-index",
  "publicDataSource: mock",
  "scoreSource: mock",
  "IMPLEMENTED-001 module exports TwiiParserFailureClass",
  "IMPLEMENTED-005 module exports TWII_PARSER_CONTRACT_BOUNDARY",
  "IMPLEMENTED-006 module exports parseTwiiSyntheticRows",
  "IMPLEMENTED-007 module exports parseRocDate",
  "IMPLEMENTED-008 module exports parseNumericCell",
  "IMPLEMENTED-009 parser normalizes ROC dates to ISO dates",
  "IMPLEMENTED-010 parser removes comma separators from numeric cells",
  "IMPLEMENTED-011 parser counts invalid dates and invalid numerics as fieldParseFailureCount",
  "IMPLEMENTED-012 parser counts duplicate normalized dates",
  "IMPLEMENTED-018 checker blocks fetch, Supabase, SQL, daily_prices, process.env, and file-write patterns",
  "IMPLEMENTED-019 review gate includes the parser contract checker",
  "BOUNDARY-001 no fetcher added",
  "BOUNDARY-002 no remote probe rerun",
  "BOUNDARY-003 no raw market data fixture added",
  "BOUNDARY-004 no runtime file write added",
  "BOUNDARY-005 no Supabase client added",
  "BOUNDARY-006 no SQL added",
  "BOUNDARY-007 no daily_prices mapping added",
  "BOUNDARY-008 no row coverage credit awarded",
  "BOUNDARY-009 no source rights approved",
  "BOUNDARY-010 no scoreSource=real enabled",
  "QA-RESULT-001 npm run check:twii-local-parser-contract passes",
  "QA-RESULT-002 npm run check:twii-parser-design-preparation-role-review passes",
  "QA-RESULT-003 full review gate passes",
  "This implementation review does not run SQL",
  "This implementation review does not connect to Supabase",
  "This implementation review does not write Supabase",
  "This implementation review does not create staging rows",
  "This implementation review does not modify `daily_prices`",
  "This implementation review does not fetch or ingest raw market data",
  "This implementation review does not probe an external endpoint",
  "This implementation review does not print secrets",
  "This implementation review does not print row payloads",
  "This implementation review does not print stock_id payloads",
  "This implementation review does not commit raw market data",
  "This implementation review does not approve source rights",
  "This implementation review does not approve parser ingestion",
  "This implementation review does not approve ingestion",
  "This implementation review does not award row coverage points",
  "This implementation review does not promote `publicDataSource=supabase`",
  "This implementation review does not set `scoreSource=real`",
  "READY_FOR_TWII_PARSER_CONTRACT_CONSUMER_PLANNING_LOCAL_ONLY"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "TWII_PARSER_CONTRACT_BOUNDARY",
  "fixturePolicy: \"synthetic_rows_only\"",
  "parseTwiiSyntheticRows",
  "parseRocDate",
  "parseNumericCell"
]) {
  if (!moduleSource.includes(phrase)) {
    missing.push(`${modulePath}: ${phrase}`);
  }
}

for (const phrase of [
  "forbidden parser-contract pattern",
  "fetch\\s*\\(",
  "daily_prices",
  "process\\.env",
  "valid synthetic rows",
  "duplicate synthetic rows"
]) {
  if (!checker.includes(phrase)) {
    missing.push(`${checkerPath}: ${phrase}`);
  }
}

if (!roleReview.includes("READY_FOR_TWII_LOCAL_PARSER_CONTRACT_MODULE_SYNTHETIC_ONLY")) {
  missing.push(`${roleReviewPath}: READY_FOR_TWII_LOCAL_PARSER_CONTRACT_MODULE_SYNTHETIC_ONLY`);
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

if (
  packageJson.scripts?.["check:twii-local-parser-contract-implementation-review"] !==
  "node scripts/check-twii-local-parser-contract-implementation-review.mjs"
) {
  missing.push(`${packagePath}: check:twii-local-parser-contract-implementation-review`);
}
if (!reviewGate.includes("scripts/check-twii-local-parser-contract-implementation-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-local-parser-contract-implementation-review.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
