import fs from "node:fs";

const planPath = "docs/reviews/TWII_ADAPTER_LOCAL_INTEGRATION_PLANNING_2026-06-02.md";
const implementationReviewPath = "docs/reviews/TWII_PARSER_CONSUMER_ADAPTER_IMPLEMENTATION_REVIEW_2026-06-02.md";
const adapterPath = "src/lib/twii-parser-consumer-adapter.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const plan = fs.readFileSync(planPath, "utf8");
const implementationReview = fs.readFileSync(implementationReviewPath, "utf8");
const adapter = fs.readFileSync(adapterPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_adapter_local_integration_planning_recorded`",
  "adapter_module: src/lib/twii-parser-consumer-adapter.ts",
  "adapter_helper: getTwiiParserConsumerAdapterOutput",
  "integration_type: local_disclosure_and_internal_review_only",
  "fixture_policy: synthetic_rows_only",
  "publicDataSource: mock",
  "scoreSource: mock",
  "runtime_activation_authorized: false",
  "ALLOWED-001 internal review documents may reference adapter reviewState and blockingReason labels",
  "ALLOWED-003 local UI state may display mock-only readiness blockers if no real data claim is made",
  "ALLOWED-004 local checks may assert that row coverage and daily_prices mapping remain false",
  "DISALLOWED-001 no runtime activation from adapter output",
  "DISALLOWED-002 no Supabase read or write from adapter output",
  "DISALLOWED-003 no SQL command from adapter output",
  "DISALLOWED-004 no staging row creation from adapter output",
  "DISALLOWED-005 no daily_prices mapping from adapter output",
  "DISALLOWED-006 no row coverage credit from adapter output",
  "DISALLOWED-007 no scoreSource real from adapter output",
  "DISALLOWED-008 no publicDataSource supabase from adapter output",
  "DISALLOWED-009 no remote TWII probe rerun from adapter output",
  "CRITERIA-001 adapter implementation review accepted",
  "CRITERIA-004 local disclosure consumer must show not activated or blocked state",
  "CRITERIA-005 local disclosure consumer must not claim TWII coverage",
  "CRITERIA-006 local disclosure consumer must not expose parsed rows",
  "CEO-FINDING-001 integration planning should move next toward a small mock-only disclosure consumer, not another broad governance packet",
  "ENGINEERING-FINDING-001 next implementation may create a pure local disclosure helper or component contract",
  "LEGAL-FINDING-001 disclosure must not imply source rights, real TWII activation, or market-data redistribution",
  "READY_FOR_TWII_LOCAL_DISCLOSURE_CONSUMER_DRAFT_MOCK_ONLY"
]) {
  if (!plan.includes(phrase)) {
    missing.push(`${planPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_ADAPTER_LOCAL_INTEGRATION_PLANNING_ONLY",
  "adapter draft is accepted as a local readiness component, not runtime activation",
  "adapter output cannot be mapped into canonical prices without separate approval"
]) {
  if (!implementationReview.includes(phrase)) {
    missing.push(`${implementationReviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "export function getTwiiParserConsumerAdapterOutput",
  "canAwardRowCoverageCredit: false",
  "canMapToDailyPrices: false",
  "canSetScoreSourceReal: false",
  "isRuntimeReady: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!adapter.includes(phrase)) {
    missing.push(`${adapterPath}: ${phrase}`);
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
    blocked.push(`${planPath}: forbidden integration-planning pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["check:twii-adapter-local-integration-planning"] !== "node scripts/check-twii-adapter-local-integration-planning.mjs") {
  missing.push(`${packagePath}: check:twii-adapter-local-integration-planning`);
}
if (!reviewGate.includes("scripts/check-twii-adapter-local-integration-planning.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-adapter-local-integration-planning.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
