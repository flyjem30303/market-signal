import fs from "node:fs";

const roleReviewPath = "docs/reviews/TWII_PARSER_CONSUMER_ADAPTER_PLANNING_ROLE_REVIEW_2026-06-02.md";
const planPath = "docs/reviews/TWII_PARSER_CONSUMER_ADAPTER_PLANNING_2026-06-02.md";
const statePath = "src/lib/twii-parser-consumer-state.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const roleReview = fs.readFileSync(roleReviewPath, "utf8");
const plan = fs.readFileSync(planPath, "utf8");
const state = fs.readFileSync(statePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_parser_consumer_adapter_planning_role_review_recorded`",
  "source_document: TWII_PARSER_CONSUMER_ADAPTER_PLANNING_2026-06-02.md",
  "adapter_type: future_local_pure_adapter",
  "implementation_authorized: local_adapter_draft_only_after_review",
  "runtime_activation_authorized: false",
  "fixture_policy: synthetic_rows_only",
  "publicDataSource: mock",
  "scoreSource: mock",
  "CEO-FINDING-001 adapter planning is accepted as the right bridge toward runtime without crossing data activation boundaries",
  "CEO-FINDING-003 do not spend more cycles on broad governance maps until the local adapter draft is implemented and checked",
  "PM-FINDING-003 next deliverable should be a small deterministic adapter plus checker, not another large decision packet",
  "ENGINEERING-FINDING-001 adapter may be implemented as a pure function with no side effects",
  "ENGINEERING-FINDING-003 adapter must not import Supabase, use HTTP, read credential environment variables, or write files",
  "ENGINEERING-FINDING-005 adapter output should keep rowCoverageCredit, runtimeReady, scoreSourceReal, and publicDataSourceSupabase false",
  "DATA-FINDING-003 row coverage credit must wait for accepted post-run evidence",
  "LEGAL-FINDING-002 adapter implementation must use synthetic tests only",
  "QA-FINDING-002 checker must block fetch, Supabase, SQL, credentials, file writes, staging writes, daily_prices, and scoreSource real",
  "READY_FOR_TWII_LOCAL_CONSUMER_ADAPTER_DRAFT_SYNTHETIC_ONLY"
]) {
  if (!roleReview.includes(phrase)) {
    missing.push(`${roleReviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_PARSER_CONSUMER_ADAPTER_ROLE_REVIEW_LOCAL_ONLY",
  "ADAPTER-SHAPE-005 adapter must not fetch, parse remote payloads, or read credentials",
  "APPROVAL-007 separate storage decision accepted before any staging write",
  "BLOCKED-RUNTIME-005 no remote TWII probe rerun"
]) {
  if (!plan.includes(phrase)) {
    missing.push(`${planPath}: ${phrase}`);
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
  if (pattern.test(roleReview)) {
    blocked.push(`${roleReviewPath}: forbidden adapter-role-review pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["check:twii-parser-consumer-adapter-planning-role-review"] !== "node scripts/check-twii-parser-consumer-adapter-planning-role-review.mjs") {
  missing.push(`${packagePath}: check:twii-parser-consumer-adapter-planning-role-review`);
}
if (!reviewGate.includes("scripts/check-twii-parser-consumer-adapter-planning-role-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-parser-consumer-adapter-planning-role-review.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
