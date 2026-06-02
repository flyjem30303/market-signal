import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_PARSER_CONSUMER_ADAPTER_IMPLEMENTATION_REVIEW_2026-06-02.md";
const adapterPath = "src/lib/twii-parser-consumer-adapter.ts";
const checkerPath = "scripts/check-twii-parser-consumer-adapter.mjs";
const roleReviewPath = "docs/reviews/TWII_PARSER_CONSUMER_ADAPTER_PLANNING_ROLE_REVIEW_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const review = fs.readFileSync(reviewPath, "utf8");
const adapter = fs.readFileSync(adapterPath, "utf8");
const checker = fs.readFileSync(checkerPath, "utf8");
const roleReview = fs.readFileSync(roleReviewPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_parser_consumer_adapter_implementation_review_recorded`",
  "module: src/lib/twii-parser-consumer-adapter.ts",
  "checker: scripts/check-twii-parser-consumer-adapter.mjs",
  "implementation_type: local_pure_review_adapter_only",
  "input_contract: TwiiParserContractResult",
  "state_helper: getTwiiParserConsumerState",
  "fixture_policy: synthetic_rows_only",
  "publicDataSource: mock",
  "scoreSource: mock",
  "runtime_activation_authorized: false",
  "IMPLEMENTED-001 adapter exports TwiiParserConsumerAdapterInput",
  "IMPLEMENTED-004 adapter exports getTwiiParserConsumerAdapterOutput",
  "IMPLEMENTED-014 adapter reports parsedRowCount only and does not expose parsed rows",
  "IMPLEMENTED-015 adapter keeps row coverage, daily_prices mapping, scoreSource real, and runtime readiness flags false",
  "BOUNDARY-001 no fetcher added",
  "BOUNDARY-005 no Supabase client added",
  "BOUNDARY-006 no SQL added",
  "BOUNDARY-008 no daily_prices mapping added",
  "BOUNDARY-009 no parsed rows exposed from adapter output",
  "QA-RESULT-001 npm run check:twii-parser-consumer-adapter passes",
  "QA-RESULT-003 TypeScript noEmit passes",
  "CEO-FINDING-001 adapter draft is accepted as a local readiness component, not runtime activation",
  "ENGINEERING-FINDING-001 adapter is deterministic and side-effect-free",
  "DATA-FINDING-001 parsedRowCount is a review metric only and does not award coverage",
  "LEGAL-FINDING-001 no source-rights approval or market-data redistribution is implied",
  "READY_FOR_TWII_ADAPTER_LOCAL_INTEGRATION_PLANNING_ONLY"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "export type TwiiParserConsumerAdapterInput",
  "export type TwiiParserConsumerAdapterOutput",
  "export function getTwiiParserConsumerAdapterOutput",
  "parsedRowCount: input.parserResult.rows.length",
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

for (const phrase of [
  "forbidden adapter pattern",
  "adapter must not expose parsed rows or normalized row fields",
  "scripts/check-twii-parser-consumer-adapter.mjs"
]) {
  if (!checker.includes(phrase) && !reviewGate.includes(phrase)) {
    missing.push(`${checkerPath}/${reviewGatePath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_LOCAL_CONSUMER_ADAPTER_DRAFT_SYNTHETIC_ONLY",
  "adapter may be implemented as a pure function with no side effects"
]) {
  if (!roleReview.includes(phrase)) {
    missing.push(`${roleReviewPath}: ${phrase}`);
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
  if (pattern.test(adapter)) {
    blocked.push(`${adapterPath}: forbidden adapter-review pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["check:twii-parser-consumer-adapter-implementation-review"] !== "node scripts/check-twii-parser-consumer-adapter-implementation-review.mjs") {
  missing.push(`${packagePath}: check:twii-parser-consumer-adapter-implementation-review`);
}
if (!reviewGate.includes("scripts/check-twii-parser-consumer-adapter-implementation-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-parser-consumer-adapter-implementation-review.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
