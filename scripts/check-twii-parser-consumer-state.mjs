import fs from "node:fs";
import { pathToFileURL } from "node:url";

const helperPath = "src/lib/twii-parser-consumer-state.ts";
const contractPath = "src/lib/twii-parser-contract.ts";
const roleReviewPath = "docs/reviews/TWII_PARSER_CONTRACT_CONSUMER_PLANNING_ROLE_REVIEW_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const helper = fs.readFileSync(helperPath, "utf8");
const contract = fs.readFileSync(contractPath, "utf8");
const roleReview = fs.readFileSync(roleReviewPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "import type { TwiiParserContractResult }",
  "export type TwiiParserConsumerReviewState",
  "\"parser_contract_ready_for_review\"",
  "\"parser_contract_blocked_by_field_mismatch\"",
  "\"parser_contract_blocked_by_duplicate_dates\"",
  "\"parser_contract_blocked_by_no_rows\"",
  "\"parser_contract_waiting_for_rights_decision\"",
  "\"parser_contract_waiting_for_staging_schema\"",
  "\"parser_contract_not_runtime_ready\"",
  "export type TwiiParserConsumerStateInput",
  "rightsApproved: boolean",
  "stagingSchemaApproved: boolean",
  "canAwardRowCoverageCredit: false",
  "canMapToDailyPrices: false",
  "canSetScoreSourceReal: false",
  "isRuntimeReady: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "export function getTwiiParserConsumerState",
  "function pickReviewState"
]) {
  if (!helper.includes(phrase)) {
    missing.push(`${helperPath}: ${phrase}`);
  }
}

for (const phrase of [
  "TwiiParserContractResult",
  "parseTwiiSyntheticRows",
  "fixturePolicy: \"synthetic_rows_only\""
]) {
  if (!contract.includes(phrase)) {
    missing.push(`${contractPath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_LOCAL_CONSUMER_STATE_HELPER_SYNTHETIC_ONLY",
  "helper must consume TwiiParserContractResult only",
  "helper must use synthetic parser results only in checker tests",
  "helper must not map output into daily_prices"
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
  if (pattern.test(helper)) {
    blocked.push(`${helperPath}: forbidden consumer-state pattern ${String(pattern)}`);
  }
}

const contractModule = await import(pathToFileURL(`${process.cwd()}/${contractPath}`).href);
const helperModule = await import(pathToFileURL(`${process.cwd()}/${helperPath}`).href);

const readyParserResult = contractModule.parseTwiiSyntheticRows([["115/01/02", "12,345.67"]]);
const ready = helperModule.getTwiiParserConsumerState({
  parserResult: readyParserResult,
  rightsApproved: true,
  stagingSchemaApproved: true
});
assertState(ready, "parser_contract_ready_for_review");

const rightsWaiting = helperModule.getTwiiParserConsumerState({
  parserResult: readyParserResult,
  rightsApproved: false,
  stagingSchemaApproved: true
});
assertState(rightsWaiting, "parser_contract_waiting_for_rights_decision");

const stagingWaiting = helperModule.getTwiiParserConsumerState({
  parserResult: readyParserResult,
  rightsApproved: true,
  stagingSchemaApproved: false
});
assertState(stagingWaiting, "parser_contract_waiting_for_staging_schema");

const fieldMismatch = helperModule.getTwiiParserConsumerState({
  parserResult: contractModule.parseTwiiSyntheticRows([["bad-date", "12,345.67"]]),
  rightsApproved: true,
  stagingSchemaApproved: true
});
assertState(fieldMismatch, "parser_contract_blocked_by_no_rows");

const duplicate = helperModule.getTwiiParserConsumerState({
  parserResult: contractModule.parseTwiiSyntheticRows([
    ["115/01/03", "12,345.67"],
    ["115/01/03", "12,346.67"]
  ]),
  rightsApproved: true,
  stagingSchemaApproved: true
});
assertState(duplicate, "parser_contract_blocked_by_duplicate_dates");

const empty = helperModule.getTwiiParserConsumerState({
  parserResult: contractModule.parseTwiiSyntheticRows([]),
  rightsApproved: true,
  stagingSchemaApproved: true
});
assertState(empty, "parser_contract_blocked_by_no_rows");

if (packageJson.scripts?.["check:twii-parser-consumer-state"] !== "node --experimental-strip-types scripts/check-twii-parser-consumer-state.mjs") {
  missing.push(`${packagePath}: check:twii-parser-consumer-state`);
}
if (!reviewGate.includes("scripts/check-twii-parser-consumer-state.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-parser-consumer-state.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function assertState(state, expected) {
  if (state.reviewState !== expected) {
    blocked.push(`expected ${expected}, got ${state.reviewState}`);
  }
  for (const flag of ["canAwardRowCoverageCredit", "canMapToDailyPrices", "canSetScoreSourceReal", "isRuntimeReady"]) {
    if (state[flag] !== false) blocked.push(`${flag} must remain false for ${expected}`);
  }
  if (state.publicDataSource !== "mock" || state.scoreSource !== "mock") {
    blocked.push(`source flags must remain mock for ${expected}`);
  }
}
