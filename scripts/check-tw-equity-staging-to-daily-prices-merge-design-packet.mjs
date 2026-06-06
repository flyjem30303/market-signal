import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_MERGE_DESIGN_PACKET.md";
const reportPath = "scripts/report-tw-equity-staging-to-daily-prices-merge-design-packet.mjs";
const initialMigrationPath = "supabase/migrations/0001_initial_schema.sql";
const stagingMigrationPath = "supabase/migrations/0003_twse_stock_day_staging.sql";
const postWriteReviewPath = "docs/reviews/TW_EQUITY_POST_WRITE_STAGING_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md";
const promotionGatePath = "docs/TW_EQUITY_POST_WRITE_PROMOTION_READINESS_GATE.md";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const initialMigration = read(initialMigrationPath);
const stagingMigration = read(stagingMigrationPath);
const postWriteReview = read(postWriteReviewPath);
const promotionGate = read(promotionGatePath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Staging To Daily Prices Merge Design Packet",
  "tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed",
  "This packet does not authorize execution",
  "tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion",
  "tw_equity_post_write_staging_verification_counts_match_no_public_promotion",
  "tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked",
  "Staging price rows: `180`",
  "Symbol set: `2330`, `2382`, `2308`",
  "Expected production rows from this staging run: `180`",
  "Production key: `daily_prices(stock_id, trade_date)`",
  "Staging key: `staging_twse_stock_day_prices(run_id, exchange_code, symbol, trade_date)`",
  "`staging_twse_stock_day_prices.symbol` | `stocks.symbol`",
  "`stocks.id` | `daily_prices.stock_id`",
  "`trade_value` | `turnover`",
  "Default policy: `insert_only_no_overwrite`",
  "Stock mapping count equals `3`",
  "Unmapped symbol count equals `0`",
  "Duplicate production key count inside staging scope equals `0`",
  "The runner must not print `stock_id` values or row payloads",
  "Expected readback rows: `180`",
  "This packet does not authorize:",
  "`daily_prices` mutation",
  "SQL execution",
  "Supabase insert/update/upsert/delete",
  "row coverage points",
  "`scoreSource=real`",
  "Create a local fail-closed merge runner skeleton"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "create table if not exists public.daily_prices",
  "stock_id uuid not null references public.stocks(id)",
  "trade_date date not null",
  "open numeric",
  "high numeric",
  "low numeric",
  "close numeric",
  "volume numeric",
  "turnover numeric",
  "primary key (stock_id, trade_date)"
]) {
  if (!initialMigration.includes(phrase)) problems.push(`${initialMigrationPath} missing: ${phrase}`);
}

for (const phrase of [
  "create table if not exists public.staging_twse_stock_day_prices",
  "primary key (run_id, exchange_code, symbol, trade_date)",
  "open_price numeric not null",
  "high_price numeric not null",
  "low_price numeric not null",
  "close_price numeric not null",
  "volume numeric not null",
  "trade_value numeric not null"
]) {
  if (!stagingMigration.includes(phrase)) problems.push(`${stagingMigrationPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_post_write_staging_verification_counts_match_no_public_promotion",
  "`staging_twse_stock_day_runs`: countStatus=`ok`, count=`1`",
  "`staging_twse_stock_day_prices`: countStatus=`ok`, count=`180`"
]) {
  if (!postWriteReview.includes(phrase)) problems.push(`${postWriteReviewPath} missing: ${phrase}`);
}

if (!promotionGate.includes("tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked")) {
  problems.push(`${promotionGatePath} missing accepted promotion readiness status`);
}

for (const phrase of [
  "tw_equity_staging_to_daily_prices_merge_design_packet",
  "tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed",
  "expectedProductionRowsFromThisRun: 180",
  "symbols: [\"2330\", \"2382\", \"2308\"]",
  "defaultPolicy: \"insert_only_no_overwrite\"",
  "stockMappingCountMustEqual: 3",
  "unmappedSymbolCountMustEqual: 0",
  "duplicateProductionKeyCountMustEqual: 0",
  "existingDailyPricesRowsMustBeCountedBeforeMutation: true",
  "stock_id: \"resolved_from_stocks_id_not_printed\"",
  "trade_value: \"daily_prices.turnover\"",
  "dailyPricesMutated: false",
  "supabaseWriteAttempted: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity staging-to-daily_prices merge design packet slice",
  "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_MERGE_DESIGN_PACKET.md",
  "scripts/report-tw-equity-staging-to-daily-prices-merge-design-packet.mjs",
  "scripts/check-tw-equity-staging-to-daily-prices-merge-design-packet.mjs",
  "tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed",
  "defines the fail-closed production merge contract from accepted `AUTH-003` staging rows into `daily_prices`",
  "production key is `daily_prices(stock_id, trade_date)` and default conflict policy is `insert_only_no_overwrite`",
  "No SQL, Supabase write, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-staging-to-daily-prices-merge-design-packet"] !==
  "node scripts/report-tw-equity-staging-to-daily-prices-merge-design-packet.mjs"
) {
  problems.push("package.json missing report:tw-equity-staging-to-daily-prices-merge-design-packet");
}

if (
  pkg.scripts?.["check:tw-equity-staging-to-daily-prices-merge-design-packet"] !==
  "node scripts/check-tw-equity-staging-to-daily-prices-merge-design-packet.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-to-daily-prices-merge-design-packet");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-to-daily-prices-merge-design-packet.mjs")) {
    problems.push(`${pathName} missing TW equity staging-to-daily_prices merge design checker`);
  }
  if (!text.includes("tw-equity-staging-to-daily-prices-merge-design-packet")) {
    problems.push(`${pathName} missing tw-equity-staging-to-daily-prices-merge-design-packet name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-to-daily-prices-merge-design-packet"')) {
  problems.push("review gate core set missing tw-equity-staging-to-daily-prices-merge-design-packet");
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
  if (report.status !== "tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed") {
    problems.push("merge design report status mismatch");
  }
  if (report.coverageUniverse?.expectedProductionRowsFromThisRun !== 180) problems.push("expected production rows must be 180");
  if (report.conflictPolicy?.defaultPolicy !== "insert_only_no_overwrite") problems.push("default conflict policy mismatch");
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push("merge design report must keep mock sources");
  }
  for (const key of [
    "dailyPricesMutated",
    "marketDataFetched",
    "marketDataIngested",
    "publicPromotionAllowed",
    "rowCoveragePointsAwarded",
    "scoreSourceRealAllowed",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseWriteAttempted"
  ]) {
    if (report.safety?.[key] !== false) problems.push(`safety.${key} must be false`);
  }
}

for (const [pathName, text] of [
  [docPath, doc],
  [reportPath, reportSource]
]) {
  if (/sb_secret_/u.test(text) || /sb_publishable_/u.test(text)) {
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
