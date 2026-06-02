import fs from "node:fs";

const adapterPath = "src/lib/twii-parser-consumer-adapter.ts";
const statePath = "src/lib/twii-parser-consumer-state.ts";
const contractPath = "src/lib/twii-parser-contract.ts";
const roleReviewPath = "docs/reviews/TWII_PARSER_CONSUMER_ADAPTER_PLANNING_ROLE_REVIEW_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const adapter = fs.readFileSync(adapterPath, "utf8");
const state = fs.readFileSync(statePath, "utf8");
const contract = fs.readFileSync(contractPath, "utf8");
const roleReview = fs.readFileSync(roleReviewPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "import type { TwiiParserContractResult }",
  "getTwiiParserConsumerState",
  "export type TwiiParserConsumerAdapterInput",
  "export type TwiiParserConsumerAdapterBlockingReason",
  "\"rights_decision_required\"",
  "\"staging_schema_decision_required\"",
  "\"runtime_activation_not_authorized\"",
  "export type TwiiParserConsumerAdapterOutput",
  "canAwardRowCoverageCredit: false",
  "canMapToDailyPrices: false",
  "canSetScoreSourceReal: false",
  "isRuntimeReady: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "parsedRowCount: number",
  "export function getTwiiParserConsumerAdapterOutput",
  "function pickBlockingReason",
  "parsedRowCount: input.parserResult.rows.length",
  "if (reviewState === \"parser_contract_ready_for_review\") return \"none\"",
  "if (reviewState === \"parser_contract_blocked_by_field_mismatch\") return \"field_mismatch\"",
  "if (reviewState === \"parser_contract_blocked_by_duplicate_dates\") return \"duplicate_trade_dates\"",
  "if (reviewState === \"parser_contract_blocked_by_no_rows\") return \"no_rows\"",
  "if (reviewState === \"parser_contract_waiting_for_rights_decision\") return \"rights_decision_required\"",
  "if (reviewState === \"parser_contract_waiting_for_staging_schema\") return \"staging_schema_decision_required\"",
  "return \"runtime_activation_not_authorized\""
]) {
  if (!adapter.includes(phrase)) {
    missing.push(`${adapterPath}: ${phrase}`);
  }
}

for (const phrase of [
  "export function getTwiiParserConsumerState",
  "export type TwiiParserConsumerReviewState"
]) {
  if (!state.includes(phrase)) {
    missing.push(`${statePath}: ${phrase}`);
  }
}

for (const phrase of [
  "export type TwiiParserContractResult",
  "parseTwiiSyntheticRows",
  "fixturePolicy: \"synthetic_rows_only\""
]) {
  if (!contract.includes(phrase)) {
    missing.push(`${contractPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_LOCAL_CONSUMER_ADAPTER_DRAFT_SYNTHETIC_ONLY",
  "adapter may be implemented as a pure function with no side effects",
  "adapter must not output rows for storage or daily_prices mapping",
  "adapter output should keep rowCoverageCredit, runtimeReady, scoreSourceReal, and publicDataSourceSupabase false"
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
  if (pattern.test(adapter)) {
    blocked.push(`${adapterPath}: forbidden adapter pattern ${String(pattern)}`);
  }
}

if (/\brows\s*:/.test(adapter) || /normalizedDate/.test(adapter) || /normalizedIndexValue/.test(adapter)) {
  blocked.push(`${adapterPath}: adapter must not expose parsed rows or normalized row fields`);
}

if (packageJson.scripts?.["check:twii-parser-consumer-adapter"] !== "node --experimental-strip-types scripts/check-twii-parser-consumer-adapter.mjs") {
  missing.push(`${packagePath}: check:twii-parser-consumer-adapter`);
}
if (!reviewGate.includes("scripts/check-twii-parser-consumer-adapter.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-parser-consumer-adapter.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
