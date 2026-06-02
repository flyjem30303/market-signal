import fs from "node:fs";

const consumerPath = "src/lib/twii-local-disclosure-consumer.ts";
const adapterPath = "src/lib/twii-parser-consumer-adapter.ts";
const planningPath = "docs/reviews/TWII_ADAPTER_LOCAL_INTEGRATION_PLANNING_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const consumer = fs.readFileSync(consumerPath, "utf8");
const adapter = fs.readFileSync(adapterPath, "utf8");
const planning = fs.readFileSync(planningPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "import type { TwiiParserConsumerAdapterOutput }",
  "export type TwiiLocalDisclosureStatus",
  "\"mock_ready_for_review\"",
  "\"mock_waiting_for_rights\"",
  "\"mock_waiting_for_staging_schema\"",
  "\"mock_blocked_by_parser_contract\"",
  "\"mock_not_runtime_ready\"",
  "export type TwiiLocalDisclosureConsumerInput",
  "export type TwiiLocalDisclosureConsumerOutput",
  "canClaimTwiiCoverage: false",
  "canShowRealScore: false",
  "canUseSupabaseRuntime: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "export function getTwiiLocalDisclosureConsumerOutput",
  "function pickDisclosureStatus",
  "function pickSafeSummary",
  "real data activation remains off",
  "remains mock-only"
]) {
  if (!consumer.includes(phrase)) {
    missing.push(`${consumerPath}: ${phrase}`);
  }
}

for (const phrase of [
  "export type TwiiParserConsumerAdapterOutput",
  "blockingReason: TwiiParserConsumerAdapterBlockingReason",
  "canAwardRowCoverageCredit: false",
  "canMapToDailyPrices: false",
  "canSetScoreSourceReal: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!adapter.includes(phrase)) {
    missing.push(`${adapterPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_LOCAL_DISCLOSURE_CONSUMER_DRAFT_MOCK_ONLY",
  "local disclosure consumer must keep publicDataSource mock",
  "local disclosure consumer must keep scoreSource mock",
  "local disclosure consumer must not claim TWII coverage",
  "local disclosure consumer must not expose parsed rows"
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
    blocked.push(`${consumerPath}: forbidden local-disclosure pattern ${String(pattern)}`);
  }
}

if (/parsedRowCount/.test(consumer) || /\brows\b/.test(consumer) || /normalizedDate/.test(consumer) || /normalizedIndexValue/.test(consumer)) {
  blocked.push(`${consumerPath}: disclosure consumer must not expose parsed counts, rows, or normalized fields`);
}

if (packageJson.scripts?.["check:twii-local-disclosure-consumer"] !== "node --experimental-strip-types scripts/check-twii-local-disclosure-consumer.mjs") {
  missing.push(`${packagePath}: check:twii-local-disclosure-consumer`);
}
if (!reviewGate.includes("scripts/check-twii-local-disclosure-consumer.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-local-disclosure-consumer.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
