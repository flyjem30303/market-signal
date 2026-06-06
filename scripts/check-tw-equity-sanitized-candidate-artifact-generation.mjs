import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const generatorPath = "scripts/generate-tw-equity-sanitized-candidate-artifact.mjs";
const checkerPath = "scripts/check-tw-equity-sanitized-candidate-artifact-generation.mjs";
const artifactPath = "data/candidates/tw-equity-staging-candidate.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const generatorSource = read(generatorPath);
const artifact = JSON.parse(read(artifactPath));
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "tw_equity_sanitized_candidate_artifact_generated",
  "data/candidates/tw-equity-staging-candidate.json",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
  "twse-stock-day",
  "https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date={YYYYMMDD}&stockNo={symbol}",
  "sourcePayloadIncluded: false",
  "sourceUrlPayloadIncluded: false",
  "secretsIncluded: false",
  "rawSourcePayloadStored: false",
  "sourcePayloadPrinted: false",
  "rowPayloadsPrinted: false",
  "supabaseWrites: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!generatorSource.includes(phrase)) problems.push(`${generatorPath} missing: ${phrase}`);
}

if (artifact.authorizationId !== "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001") problems.push("artifact authorization mismatch");
if (artifact.targetRelation !== "staging_twse_stock_day_runs,staging_twse_stock_day_prices") problems.push("artifact target mismatch");
if (artifact.sourceId !== "twse-stock-day") problems.push("artifact sourceId mismatch");
if (!sameArray(artifact.symbols, ["2330", "2382", "2308"])) problems.push("artifact symbols mismatch");
if (artifact.maxRows !== 180) problems.push("artifact maxRows mismatch");
if (artifact.sourcePayloadIncluded !== false) problems.push("artifact sourcePayloadIncluded must be false");
if (artifact.sourceUrlPayloadIncluded !== false) problems.push("artifact sourceUrlPayloadIncluded must be false");
if (artifact.secretsIncluded !== false) problems.push("artifact secretsIncluded must be false");
if (!isObject(artifact.candidateRun)) problems.push("artifact candidateRun missing");
if (!Array.isArray(artifact.candidatePrices)) problems.push("artifact candidatePrices missing");
if (artifact.candidatePrices?.length !== 180) problems.push("artifact must contain 180 candidate price rows");
if (artifact.candidateRun?.total_candidate_row_count !== 180) problems.push("candidateRun total row count must be 180");
if (artifact.candidateRun?.decision !== "ready_for_review") problems.push("candidateRun decision must be ready_for_review");
if (artifact.candidateRun?.review_status !== "pending_review") problems.push("candidateRun review_status must be pending_review");

for (const forbiddenKey of [
  "rawSourcePayload",
  "sourcePayload",
  "sourceRows",
  "rawRows",
  "sourceUrlPayload",
  "html",
  "csv",
  "secret",
  "secrets"
]) {
  if (Object.hasOwn(artifact, forbiddenKey)) problems.push(`artifact contains forbidden top-level key ${forbiddenKey}`);
}

const rowKeys = new Set();
for (const [index, row] of (artifact.candidatePrices ?? []).entries()) {
  if (row.run_id !== artifact.candidateRun?.run_id) problems.push(`row ${index} run_id mismatch`);
  if (row.source_id !== "twse-stock-day") problems.push(`row ${index} source_id mismatch`);
  if (row.exchange_code !== "TWSE") problems.push(`row ${index} exchange_code mismatch`);
  if (!["2330", "2382", "2308"].includes(row.symbol)) problems.push(`row ${index} unauthorized symbol`);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(row.trade_date ?? "")) problems.push(`row ${index} invalid trade_date`);
  for (const key of ["open_price", "high_price", "low_price", "close_price", "volume", "trade_value", "transaction_count"]) {
    if (!nonNegativeNumber(row[key])) problems.push(`row ${index} ${key} must be non-negative number`);
  }
  if (!Array.isArray(row.quality_flags)) problems.push(`row ${index} quality_flags must be array`);
  if (!/^[a-f0-9]{64}$/u.test(row.source_row_hash ?? "")) problems.push(`row ${index} source_row_hash invalid`);
  const rowKey = `${row.run_id}|${row.exchange_code}|${row.symbol}|${row.trade_date}`;
  if (rowKeys.has(rowKey)) problems.push(`duplicate row key ${rowKey}`);
  rowKeys.add(rowKey);
}

const review = runJson("scripts/report-pm-tw-equity-candidate-intake-review.mjs");
if (review.status !== "pm_tw_equity_candidate_intake_review_ready_for_ceo_bounded_staging_write_decision") {
  problems.push("PM intake review must be ready for CEO bounded staging write decision");
}
if (review.readyForCeoBoundedWriteDecision !== true) problems.push("PM review readiness must be true");
if (review.safety?.realSupabaseWrites !== false) problems.push("PM review must not write Supabase");
if (review.safety?.publicDataSource !== "mock" || review.safety?.scoreSource !== "mock") {
  problems.push("PM review safety must keep mock publicDataSource and scoreSource");
}

for (const pattern of [
  /\.insert\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /await import\("@supabase\/supabase-js"\)/u,
  /sb_secret_/u,
  /sb_publishable_/u
]) {
  if (pattern.test(generatorSource)) problems.push(`${generatorPath} contains forbidden token: ${pattern}`);
}

for (const phrase of [
  "Latest TW equity sanitized candidate artifact generation slice",
  "scripts/generate-tw-equity-sanitized-candidate-artifact.mjs",
  "data/candidates/tw-equity-staging-candidate.json",
  "tw_equity_sanitized_candidate_artifact_generated",
  "PM intake review is ready for CEO bounded staging write decision",
  "180 normalized candidate price rows",
  "No raw source payload, Supabase connection, SQL, write, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["generate:tw-equity-sanitized-candidate-artifact"] !== `node ${generatorPath}`) {
  problems.push("package.json missing generate:tw-equity-sanitized-candidate-artifact");
}
if (pkg.scripts?.["check:tw-equity-sanitized-candidate-artifact-generation"] !== `node ${checkerPath}`) {
  problems.push("package.json missing check:tw-equity-sanitized-candidate-artifact-generation");
}
for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes(checkerPath)) problems.push(`${pathName} missing candidate generation checker`);
  if (!text.includes("tw-equity-sanitized-candidate-artifact-generation")) {
    problems.push(`${pathName} missing tw-equity-sanitized-candidate-artifact-generation name`);
  }
}
if (!reviewGate.includes('"tw-equity-sanitized-candidate-artifact-generation"')) {
  problems.push("review gate core set missing tw-equity-sanitized-candidate-artifact-generation");
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}

function runJson(filePath) {
  const result = spawnSync(process.execPath, [filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });
  try {
    return JSON.parse(result.stdout);
  } catch {
    problems.push(`${filePath} did not return valid JSON`);
    return {};
  }
}

function sameArray(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

function nonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
