import fs from "node:fs";
import { pathToFileURL } from "node:url";

const modulePath = "src/lib/twii-parser-contract.ts";
const roleReviewPath = "docs/reviews/TWII_PARSER_DESIGN_PREPARATION_ROLE_REVIEW_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const source = fs.readFileSync(modulePath, "utf8");
const roleReview = fs.readFileSync(roleReviewPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "export type TwiiParserFailureClass",
  "\"none\"",
  "\"no_rows\"",
  "\"field_mismatch\"",
  "\"duplicate_dates\"",
  "\"calendar_gap_unresolved\"",
  "\"rights_unapproved\"",
  "\"parser_design_blocked\"",
  "export type TwiiSyntheticSourceRow",
  "export type TwiiParserContractRow",
  "export type TwiiParserContractResult",
  "TWII_PARSER_CONTRACT_BOUNDARY",
  "fixturePolicy: \"synthetic_rows_only\"",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "sourceCandidate: \"official-exchange-index\"",
  "targetSymbol: \"TWII\"",
  "export function parseTwiiSyntheticRows",
  "export function parseRocDate",
  "export function parseNumericCell",
  "pickFailureClass"
]) {
  if (!source.includes(phrase)) {
    missing.push(`${modulePath}: ${phrase}`);
  }
}

for (const phrase of [
  "READY_FOR_TWII_LOCAL_PARSER_CONTRACT_MODULE_SYNTHETIC_ONLY",
  "synthetic rows only",
  "ENGINEERING-FINDING-003 next implementation must not add a fetcher",
  "ENGINEERING-FINDING-005 next implementation must not map into daily_prices",
  "ENGINEERING-FINDING-006 next implementation must not connect to Supabase"
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
  if (pattern.test(source)) {
    blocked.push(`${modulePath}: forbidden parser-contract pattern ${String(pattern)}`);
  }
}

const contract = await import(pathToFileURL(`${process.cwd()}/${modulePath}`).href);

const validResult = contract.parseTwiiSyntheticRows([
  ["115/01/02", "12,345.67", "12", "345", "67"],
  ["115/01/05", "12,456.78", "13", "456", "78"]
]);
if (validResult.failureClass !== "none") blocked.push(`valid synthetic rows failureClass ${validResult.failureClass}`);
if (validResult.rows.length !== 2) blocked.push(`valid synthetic row count ${validResult.rows.length}`);
if (validResult.rows[0]?.normalizedDate !== "2026-01-02") blocked.push("ROC date normalization failed");
if (validResult.rows[0]?.normalizedIndexValue !== 12345.67) blocked.push("numeric normalization failed");

const badResult = contract.parseTwiiSyntheticRows([
  ["bad-date", "12,345.67"],
  ["115/01/06", "--"]
]);
if (badResult.failureClass !== "no_rows") blocked.push(`bad synthetic rows failureClass ${badResult.failureClass}`);
if (badResult.fieldParseFailureCount !== 2) blocked.push(`bad synthetic fieldParseFailureCount ${badResult.fieldParseFailureCount}`);

const duplicateResult = contract.parseTwiiSyntheticRows([
  ["115/01/07", "12,345.67"],
  ["115/01/07", "12,346.67"]
]);
if (duplicateResult.failureClass !== "duplicate_dates") {
  blocked.push(`duplicate synthetic rows failureClass ${duplicateResult.failureClass}`);
}
if (duplicateResult.duplicateTradeDateCount !== 1) {
  blocked.push(`duplicateTradeDateCount ${duplicateResult.duplicateTradeDateCount}`);
}

const emptyResult = contract.parseTwiiSyntheticRows([]);
if (emptyResult.failureClass !== "no_rows") blocked.push(`empty synthetic rows failureClass ${emptyResult.failureClass}`);

if (packageJson.scripts?.["check:twii-local-parser-contract"] !== "node --experimental-strip-types scripts/check-twii-local-parser-contract.mjs") {
  missing.push(`${packagePath}: check:twii-local-parser-contract`);
}
if (!reviewGate.includes("scripts/check-twii-local-parser-contract.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-local-parser-contract.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
