import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_PARSER_CONSUMER_STATE_IMPLEMENTATION_REVIEW_2026-06-02.md";
const helperPath = "src/lib/twii-parser-consumer-state.ts";
const checkerPath = "scripts/check-twii-parser-consumer-state.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const review = fs.readFileSync(reviewPath, "utf8");
const helper = fs.readFileSync(helperPath, "utf8");
const checker = fs.readFileSync(checkerPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_parser_consumer_state_implementation_review_recorded`",
  "module: src/lib/twii-parser-consumer-state.ts",
  "implementation_type: local_review_state_helper_only",
  "input_contract: TwiiParserContractResult",
  "fixture_policy: synthetic_rows_only",
  "publicDataSource: mock",
  "scoreSource: mock",
  "IMPLEMENTED-001 helper exports TwiiParserConsumerReviewState",
  "IMPLEMENTED-004 helper exports getTwiiParserConsumerState",
  "IMPLEMENTED-011 helper keeps row coverage, daily_prices mapping, scoreSource real, and runtime readiness flags false",
  "BOUNDARY-001 no fetcher added",
  "BOUNDARY-005 no Supabase client added",
  "BOUNDARY-006 no SQL added",
  "BOUNDARY-008 no daily_prices mapping added",
  "BOUNDARY-011 no scoreSource=real enabled",
  "CEO-FINDING-001 helper is useful as a local readiness translator, not as runtime activation",
  "ENGINEERING-FINDING-001 helper is deterministic and side-effect-free",
  "DATA-FINDING-001 no row coverage credit can be granted from parser state alone",
  "LEGAL-FINDING-001 no source redistribution or source-rights approval is implied",
  "QA-FINDING-001 local checker and full review gate passed after implementation",
  "READY_FOR_TWII_PARSER_CONSUMER_ADAPTER_PLANNING_LOCAL_ONLY"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "export type TwiiParserConsumerReviewState",
  "export type TwiiParserConsumerStateInput",
  "export type TwiiParserConsumerState",
  "export function getTwiiParserConsumerState",
  "canAwardRowCoverageCredit: false",
  "canMapToDailyPrices: false",
  "canSetScoreSourceReal: false",
  "isRuntimeReady: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!helper.includes(phrase)) {
    missing.push(`${helperPath}: ${phrase}`);
  }
}

for (const phrase of [
  "parser_contract_ready_for_review",
  "parser_contract_waiting_for_rights_decision",
  "parser_contract_waiting_for_staging_schema",
  "parser_contract_blocked_by_duplicate_dates",
  "parser_contract_blocked_by_no_rows",
  "forbidden consumer-state pattern"
]) {
  if (!checker.includes(phrase)) {
    missing.push(`${checkerPath}: ${phrase}`);
  }
}

for (const pattern of [
  /fetch\s*\(/,
  /https?:\/\//i,
  /@supabase\/supabase-js/,
  /createClient/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /\.rpc\(/,
  /writeFileSync/,
  /appendFileSync/,
  /process\.env/,
  /NEXT_PUBLIC_SUPABASE_URL/,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /\bselect\s+\*\s+from\b/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+[a-z_]+\s+set\b/i,
  /\bdelete\s+from\b/i
]) {
  if (pattern.test(helper)) {
    blocked.push(`${helperPath}: forbidden implementation-review pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["check:twii-parser-consumer-state-implementation-review"] !== "node scripts/check-twii-parser-consumer-state-implementation-review.mjs") {
  missing.push(`${packagePath}: check:twii-parser-consumer-state-implementation-review`);
}
if (!reviewGate.includes("scripts/check-twii-parser-consumer-state-implementation-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-parser-consumer-state-implementation-review.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
