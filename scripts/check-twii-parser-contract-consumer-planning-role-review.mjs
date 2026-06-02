import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_PARSER_CONTRACT_CONSUMER_PLANNING_ROLE_REVIEW_2026-06-02.md";
const planPath = "docs/reviews/TWII_PARSER_CONTRACT_CONSUMER_PLANNING_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const plan = fs.readFileSync(planPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_parser_contract_consumer_planning_role_review_recorded`",
  "TWII_PARSER_CONTRACT_CONSUMER_PLANNING_2026-06-02.md",
  "review_type: role_review_only",
  "consumer_type: future_staging_first_review_consumer",
  "implementation_authorized: local_consumer_state_helper_only_after_review",
  "runtime_ingestion_authorized: false",
  "fixture_policy: synthetic_rows_only",
  "publicDataSource: mock",
  "scoreSource: mock",
  "LEGAL-FINDING-001 consumer planning does not approve source rights",
  "LEGAL-FINDING-002 consumer state helper may use synthetic parser results only",
  "DATA-FINDING-001 consumer states are acceptable as review-stage labels only",
  "DATA-FINDING-003 duplicateTradeDateCount and fieldParseFailureCount must stay blocking signals",
  "DATA-FINDING-005 parser_contract_waiting_for_staging_schema must block daily_prices mapping",
  "ENGINEERING-FINDING-001 next implementation may create a local consumer-state helper",
  "ENGINEERING-FINDING-002 helper must consume TwiiParserContractResult only",
  "ENGINEERING-FINDING-003 helper must use synthetic parser results only in checker tests",
  "ENGINEERING-FINDING-004 helper must not import Supabase clients",
  "ENGINEERING-FINDING-005 helper must not fetch or rerun probes",
  "ENGINEERING-FINDING-006 helper must not write files at runtime",
  "ENGINEERING-FINDING-007 helper must not map output into daily_prices",
  "QA-FINDING-001 checker must cover ready, field mismatch, duplicate dates, no rows, rights waiting, and staging waiting states",
  "QA-FINDING-002 checker must block fetch, Supabase, SQL, process.env, file-write, and daily_prices patterns",
  "QA-FINDING-003 review gate must not execute the TWII probe runner",
  "QA-FINDING-004 helper output must remain local review state, not runtime readiness",
  "CEO-SYNTHESIS-001 consumer planning is accepted for local-only helper implementation",
  "CEO-SYNTHESIS-002 next safe slice is a local consumer-state helper using synthetic parser results only",
  "CEO-SYNTHESIS-003 source rights, ingestion, Supabase, daily_prices, row coverage, and public claims remain blocked",
  "CEO-SYNTHESIS-004 do not rerun the TWII probe without a new one-attempt execution decision gate",
  "CEO-SYNTHESIS-005 keep publicDataSource mock and scoreSource mock",
  "This role review does not run SQL",
  "This role review does not connect to Supabase",
  "This role review does not write Supabase",
  "This role review does not create staging rows",
  "This role review does not modify `daily_prices`",
  "This role review does not fetch or ingest raw market data",
  "This role review does not probe an external endpoint",
  "This role review does not print secrets",
  "This role review does not print row payloads",
  "This role review does not print stock_id payloads",
  "This role review does not commit raw market data",
  "This role review does not approve source rights",
  "This role review does not approve parser ingestion",
  "This role review does not approve ingestion",
  "This role review does not award row coverage points",
  "This role review does not promote `publicDataSource=supabase`",
  "This role review does not set `scoreSource=real`",
  "READY_FOR_TWII_LOCAL_CONSUMER_STATE_HELPER_SYNTHETIC_ONLY"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_PARSER_CONTRACT_CONSUMER_ROLE_REVIEW_LOCAL_ONLY",
  "consumer_type: future_staging_first_review_consumer",
  "CONSUMER-008 refuse to map rows into daily_prices"
]) {
  if (!plan.includes(phrase)) {
    missing.push(`${planPath}: ${phrase}`);
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

if (
  packageJson.scripts?.["check:twii-parser-contract-consumer-planning-role-review"] !==
  "node scripts/check-twii-parser-contract-consumer-planning-role-review.mjs"
) {
  missing.push(`${packagePath}: check:twii-parser-contract-consumer-planning-role-review`);
}
if (!reviewGate.includes("scripts/check-twii-parser-contract-consumer-planning-role-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-parser-contract-consumer-planning-role-review.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
