import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_DRY_RUN_PREFLIGHT.md";
const reportPath = "scripts/report-tw-equity-staging-to-daily-prices-dry-run-preflight.mjs";
const mergeDesignDocPath = "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_MERGE_DESIGN_PACKET.md";
const mergeDesignCheckPath = "scripts/check-tw-equity-staging-to-daily-prices-merge-design-packet.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const mergeDesignDoc = read(mergeDesignDocPath);
const mergeDesignCheck = read(mergeDesignCheckPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Staging To Daily Prices Dry Run Preflight",
  "tw_equity_staging_to_daily_prices_dry_run_preflight_ready_no_remote_attempt",
  "local fail-closed dry-run preflight skeleton",
  "not a production merge, not a Supabase readonly attempt, and not SQL execution",
  "Accepted staging scope: `AUTH-003` only",
  "Expected staging price rows: `180`",
  "Current production merge denominator for this packet: `180`",
  "Keep `connectionAttempted=false`",
  "Keep `sqlExecuted=false`",
  "Keep `dailyPricesMutated=false`",
  "Never import or instantiate a Supabase client",
  "`staging_run_count`",
  "`staging_price_count`",
  "`stock_mapping_count`",
  "`existing_daily_prices_target_count`",
  "Production readback remains a later post-merge gate",
  "This preflight does not authorize:",
  "`daily_prices` mutation",
  "row coverage points",
  "`scoreSource=real`",
  "Create the bounded remote preflight authorization packet"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed",
  "tw_equity_staging_to_daily_prices_dry_run_preflight",
  "tw_equity_staging_to_daily_prices_dry_run_preflight_ready_no_remote_attempt",
  "stagingScope: \"AUTH-003_only\"",
  "denominatorForThisPacket: 180",
  "symbols: [\"2330\", \"2382\", \"2308\"]",
  "expectedProductionRowsAfterFutureMerge: 180",
  "remoteAttemptedNow: false",
  "mergeStatusAfterThisRun: \"blocked_not_executed\"",
  "productionReadbackExecutedNow: false",
  "connectionAttempted: false",
  "dailyPricesMutated: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "supabaseClientCreated: false",
  "supabaseWriteAttempted: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed",
  "Create a local fail-closed merge runner skeleton"
]) {
  if (!mergeDesignDoc.includes(phrase)) problems.push(`${mergeDesignDocPath} missing prerequisite phrase: ${phrase}`);
}

if (!mergeDesignCheck.includes("tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed")) {
  problems.push(`${mergeDesignCheckPath} missing prerequisite checker status`);
}

for (const phrase of [
  "Latest TW equity staging-to-daily_prices dry-run preflight slice",
  "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_DRY_RUN_PREFLIGHT.md",
  "scripts/report-tw-equity-staging-to-daily-prices-dry-run-preflight.mjs",
  "scripts/check-tw-equity-staging-to-daily-prices-dry-run-preflight.mjs",
  "tw_equity_staging_to_daily_prices_dry_run_preflight_ready_no_remote_attempt",
  "turns the accepted `AUTH-003` staging merge design into a local fail-closed dry-run preflight contract",
  "defines sanitized aggregate counts for staging run count, price count, stock mapping, duplicate keys, and existing `daily_prices` target rows",
  "No Supabase connection, SQL, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-staging-to-daily-prices-dry-run-preflight"] !==
  "node scripts/report-tw-equity-staging-to-daily-prices-dry-run-preflight.mjs"
) {
  problems.push("package.json missing report:tw-equity-staging-to-daily-prices-dry-run-preflight");
}

if (
  pkg.scripts?.["check:tw-equity-staging-to-daily-prices-dry-run-preflight"] !==
  "node scripts/check-tw-equity-staging-to-daily-prices-dry-run-preflight.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-to-daily-prices-dry-run-preflight");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-to-daily-prices-dry-run-preflight.mjs")) {
    problems.push(`${pathName} missing TW equity staging-to-daily_prices dry-run preflight checker`);
  }
  if (!text.includes("tw-equity-staging-to-daily-prices-dry-run-preflight")) {
    problems.push(`${pathName} missing tw-equity-staging-to-daily-prices-dry-run-preflight name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-to-daily-prices-dry-run-preflight"')) {
  problems.push("review gate core set missing tw-equity-staging-to-daily-prices-dry-run-preflight");
}

if (/@supabase\/supabase-js|createClient|\.from\(|\.insert\(|\.upsert\(|\.update\(|\.delete\(|rpc\(/u.test(reportSource)) {
  problems.push(`${reportPath} must not create a Supabase client or contain query/mutation calls`);
}

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (reportRun.status !== 0) {
  problems.push(`${reportPath} must exit 0`);
} else {
  const report = parseJson(reportRun.stdout);
  if (report.status !== "tw_equity_staging_to_daily_prices_dry_run_preflight_ready_no_remote_attempt") {
    problems.push("dry-run preflight report status mismatch");
  }
  if (report.coverageUniverse?.denominatorForThisPacket !== 180) problems.push("coverage denominator must be 180");
  if (report.boundedRemotePreflightPlan?.remoteAttemptedNow !== false) problems.push("remoteAttemptedNow must be false");
  if (report.failClosedDecision?.mergeStatusAfterThisRun !== "blocked_not_executed") {
    problems.push("merge must remain blocked after local dry-run preflight");
  }
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push("dry-run preflight report must keep mock sources");
  }
  for (const key of [
    "connectionAttempted",
    "dailyPricesMutated",
    "marketDataFetched",
    "marketDataIngested",
    "publicPromotionAllowed",
    "rowCoveragePointsAwarded",
    "scoreSourceRealAllowed",
    "secretsPrinted",
    "sqlExecuted",
    "stockIdsPrinted",
    "supabaseClientCreated",
    "supabaseWriteAttempted"
  ]) {
    if (report.safety?.[key] !== false) problems.push(`safety.${key} must be false`);
  }
  const countNames = new Set(report.boundedRemotePreflightPlan?.counts?.map((count) => count.name));
  for (const name of [
    "staging_run_count",
    "staging_price_count",
    "distinct_symbol_count",
    "stock_mapping_count",
    "unmapped_symbol_count",
    "duplicate_staging_key_count",
    "duplicate_production_key_count",
    "existing_daily_prices_target_count"
  ]) {
    if (!countNames.has(name)) problems.push(`boundedRemotePreflightPlan.counts missing ${name}`);
  }
}

for (const [pathName, text] of [
  [docPath, doc],
  [reportPath, reportSource]
]) {
  if (/sb_secret_|sb_publishable_/u.test(text)) {
    problems.push(`${pathName} must not contain literal Supabase key material`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push("report output is not valid JSON");
    return {};
  }
}
