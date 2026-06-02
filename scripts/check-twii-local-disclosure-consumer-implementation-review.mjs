import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_LOCAL_DISCLOSURE_CONSUMER_IMPLEMENTATION_REVIEW_2026-06-02.md";
const consumerPath = "src/lib/twii-local-disclosure-consumer.ts";
const checkerPath = "scripts/check-twii-local-disclosure-consumer.mjs";
const planningPath = "docs/reviews/TWII_ADAPTER_LOCAL_INTEGRATION_PLANNING_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const review = fs.readFileSync(reviewPath, "utf8");
const consumer = fs.readFileSync(consumerPath, "utf8");
const checker = fs.readFileSync(checkerPath, "utf8");
const planning = fs.readFileSync(planningPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_local_disclosure_consumer_implementation_review_recorded`",
  "module: src/lib/twii-local-disclosure-consumer.ts",
  "checker: scripts/check-twii-local-disclosure-consumer.mjs",
  "implementation_type: local_mock_only_disclosure_consumer",
  "input_contract: TwiiParserConsumerAdapterOutput",
  "fixture_policy: synthetic_rows_only",
  "publicDataSource: mock",
  "scoreSource: mock",
  "runtime_activation_authorized: false",
  "IMPLEMENTED-001 consumer exports TwiiLocalDisclosureStatus",
  "IMPLEMENTED-004 consumer exports getTwiiLocalDisclosureConsumerOutput",
  "IMPLEMENTED-010 consumer keeps canClaimTwiiCoverage false",
  "IMPLEMENTED-011 consumer keeps canShowRealScore false",
  "IMPLEMENTED-012 consumer keeps canUseSupabaseRuntime false",
  "IMPLEMENTED-015 consumer emits safeSummary text that states real data activation remains off or mock-only",
  "BOUNDARY-001 no fetcher added",
  "BOUNDARY-005 no Supabase client added",
  "BOUNDARY-006 no SQL added",
  "BOUNDARY-008 no daily_prices mapping added",
  "BOUNDARY-009 no parsed rows or parsed counts exposed from disclosure output",
  "BOUNDARY-014 no real TWII coverage claim enabled",
  "QA-RESULT-001 npm run check:twii-local-disclosure-consumer passes",
  "QA-RESULT-004 full review gate passes",
  "CEO-FINDING-001 disclosure consumer is accepted as a safe UI/briefing input layer, not runtime activation",
  "DATA-FINDING-001 disclosure state cannot grant row coverage or data completeness claims",
  "LEGAL-FINDING-001 disclosure text does not approve source rights or imply real market-data activation",
  "READY_FOR_TWII_MOCK_DISCLOSURE_UI_PLACEMENT_PLANNING"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "export type TwiiLocalDisclosureStatus",
  "export type TwiiLocalDisclosureConsumerOutput",
  "export function getTwiiLocalDisclosureConsumerOutput",
  "canClaimTwiiCoverage: false",
  "canShowRealScore: false",
  "canUseSupabaseRuntime: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "real data activation remains off",
  "remains mock-only"
]) {
  if (!consumer.includes(phrase)) {
    missing.push(`${consumerPath}: ${phrase}`);
  }
}

for (const phrase of [
  "forbidden local-disclosure pattern",
  "disclosure consumer must not expose parsed counts, rows, or normalized fields",
  "scripts/check-twii-local-disclosure-consumer.mjs"
]) {
  if (!checker.includes(phrase) && !reviewGate.includes(phrase)) {
    missing.push(`${checkerPath}/${reviewGatePath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_LOCAL_DISCLOSURE_CONSUMER_DRAFT_MOCK_ONLY",
  "local disclosure consumer must keep publicDataSource mock",
  "local disclosure consumer must not claim TWII coverage"
]) {
  if (!planning.includes(phrase)) {
    missing.push(`${planningPath}: ${phrase}`);
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
  /daily_prices/,
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
  if (pattern.test(consumer)) {
    blocked.push(`${consumerPath}: forbidden disclosure-review pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["check:twii-local-disclosure-consumer-implementation-review"] !== "node scripts/check-twii-local-disclosure-consumer-implementation-review.mjs") {
  missing.push(`${packagePath}: check:twii-local-disclosure-consumer-implementation-review`);
}
if (!reviewGate.includes("scripts/check-twii-local-disclosure-consumer-implementation-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-local-disclosure-consumer-implementation-review.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
