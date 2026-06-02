import fs from "node:fs";

const planPath = "docs/reviews/TWII_PARSER_CONSUMER_ADAPTER_PLANNING_2026-06-02.md";
const stateReviewPath = "docs/reviews/TWII_PARSER_CONSUMER_STATE_IMPLEMENTATION_REVIEW_2026-06-02.md";
const contractPath = "src/lib/twii-parser-contract.ts";
const statePath = "src/lib/twii-parser-consumer-state.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const plan = fs.readFileSync(planPath, "utf8");
const stateReview = fs.readFileSync(stateReviewPath, "utf8");
const contract = fs.readFileSync(contractPath, "utf8");
const state = fs.readFileSync(statePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_parser_consumer_adapter_planning_recorded`",
  "parser_contract_module: src/lib/twii-parser-contract.ts",
  "consumer_state_module: src/lib/twii-parser-consumer-state.ts",
  "parser_result_type: TwiiParserContractResult",
  "consumer_state_helper: getTwiiParserConsumerState",
  "fixture_policy: synthetic_rows_only",
  "publicDataSource: mock",
  "scoreSource: mock",
  "ADAPTER-SHAPE-001 input must be an already-produced TwiiParserContractResult",
  "ADAPTER-SHAPE-005 adapter must not fetch, parse remote payloads, or read credentials",
  "ADAPTER-SHAPE-006 adapter must not write staging rows",
  "ADAPTER-SHAPE-007 adapter must not map normalized rows into daily_prices",
  "ADAPTER-SHAPE-008 adapter must not award row coverage credit",
  "ADAPTER-SHAPE-009 adapter must not set scoreSource real",
  "ADAPTER-SHAPE-010 adapter must not promote publicDataSource supabase",
  "APPROVAL-001 source-rights decision accepted",
  "APPROVAL-002 staging schema decision accepted",
  "APPROVAL-006 post-run review accepted before any row coverage credit",
  "APPROVAL-007 separate storage decision accepted before any staging write",
  "APPROVAL-008 separate daily_prices mapping decision accepted before canonical price mapping",
  "BLOCKED-RUNTIME-001 no SQL",
  "BLOCKED-RUNTIME-002 no Supabase write",
  "BLOCKED-RUNTIME-003 no staging row creation",
  "BLOCKED-RUNTIME-004 no daily_prices modification",
  "BLOCKED-RUNTIME-005 no remote TWII probe rerun",
  "CEO-FINDING-001 adapter planning should keep momentum toward runtime without crossing activation boundaries",
  "ENGINEERING-FINDING-001 future adapter should be a pure function over parser result plus approval flags",
  "DATA-FINDING-001 parser result reviewState is not enough to claim historical coverage",
  "LEGAL-FINDING-001 rights approval remains external to parser or adapter correctness",
  "READY_FOR_TWII_PARSER_CONSUMER_ADAPTER_ROLE_REVIEW_LOCAL_ONLY"
]) {
  if (!plan.includes(phrase)) {
    missing.push(`${planPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_PARSER_CONSUMER_ADAPTER_PLANNING_LOCAL_ONLY",
  "next safe work is local-only adapter planning"
]) {
  if (!stateReview.includes(phrase)) {
    missing.push(`${stateReviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "export type TwiiParserContractResult",
  "fixturePolicy: \"synthetic_rows_only\"",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!contract.includes(phrase)) {
    missing.push(`${contractPath}: ${phrase}`);
  }
}

for (const phrase of [
  "export function getTwiiParserConsumerState",
  "canAwardRowCoverageCredit: false",
  "canMapToDailyPrices: false",
  "canSetScoreSourceReal: false",
  "isRuntimeReady: false"
]) {
  if (!state.includes(phrase)) {
    missing.push(`${statePath}: ${phrase}`);
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
  if (pattern.test(plan)) {
    blocked.push(`${planPath}: forbidden adapter-planning pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["check:twii-parser-consumer-adapter-planning"] !== "node scripts/check-twii-parser-consumer-adapter-planning.mjs") {
  missing.push(`${packagePath}: check:twii-parser-consumer-adapter-planning`);
}
if (!reviewGate.includes("scripts/check-twii-parser-consumer-adapter-planning.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-parser-consumer-adapter-planning.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
