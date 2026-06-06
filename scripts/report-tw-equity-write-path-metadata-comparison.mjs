import fs from "node:fs";

const migrationPath = "supabase/migrations/0003_twse_stock_day_staging.sql";
const candidatePath = "data/candidates/tw-equity-staging-candidate.json";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const metadataReviewPath = "docs/reviews/TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_POST_RUN_REVIEW_2026-06-06.md";

const migration = readText(migrationPath);
const runner = readText(runnerPath);
const metadataReview = readText(metadataReviewPath);
const candidate = readJson(candidatePath);

const migrationColumns = {
  staging_twse_stock_day_prices: extractColumns(migration, "staging_twse_stock_day_prices"),
  staging_twse_stock_day_runs: extractColumns(migration, "staging_twse_stock_day_runs")
};
const candidateColumns = {
  staging_twse_stock_day_prices: Object.keys(candidate?.candidatePrices?.[0] ?? {}).sort(),
  staging_twse_stock_day_runs: Object.keys(candidate?.candidateRun ?? {}).sort()
};
const missingFromCandidate = {
  staging_twse_stock_day_prices: difference(requiredInsertColumns("staging_twse_stock_day_prices"), candidateColumns.staging_twse_stock_day_prices),
  staging_twse_stock_day_runs: difference(requiredInsertColumns("staging_twse_stock_day_runs"), candidateColumns.staging_twse_stock_day_runs)
};
const extraCandidateColumns = {
  staging_twse_stock_day_prices: difference(candidateColumns.staging_twse_stock_day_prices, migrationColumns.staging_twse_stock_day_prices),
  staging_twse_stock_day_runs: difference(candidateColumns.staging_twse_stock_day_runs, migrationColumns.staging_twse_stock_day_runs)
};
const runnerEvidence = {
  insertsPricesTable: runner.includes(['from("staging_twse_stock_day_prices")', "insert(candidateInput.candidatePrices)"].join(".")),
  insertsRunsTable: runner.includes(['from("staging_twse_stock_day_runs")', "insert([candidateInput.candidateRun])"].join(".")),
  rollbackCountsPricesByRunId: runner.includes('countRowsByRunId(supabase, "staging_twse_stock_day_prices", runId)'),
  rollbackCountsRunsByRunId: runner.includes('countRowsByRunId(supabase, "staging_twse_stock_day_runs", runId)')
};
const latestMetadataEvidence = {
  metadataDiagnosticReviewExists: fs.existsSync(metadataReviewPath),
  pricesReachableOk: metadataReview.includes("`staging_twse_stock_day_prices`: reachable=`ok`"),
  runsReachableOk: metadataReview.includes("`staging_twse_stock_day_runs`: reachable=`ok`"),
  status: extractStatus(metadataReview)
};

const problems = [];
for (const [table, extras] of Object.entries(extraCandidateColumns)) {
  if (extras.length > 0) problems.push(`${table}_candidate_columns_not_in_local_migration`);
}
for (const [table, missing] of Object.entries(missingFromCandidate)) {
  if (missing.length > 0) problems.push(`${table}_candidate_missing_required_insert_columns`);
}
for (const [key, value] of Object.entries(runnerEvidence)) {
  if (value !== true) problems.push(`runner_${key}_missing`);
}
if (!latestMetadataEvidence.runsReachableOk || !latestMetadataEvidence.pricesReachableOk) {
  problems.push("latest_metadata_diagnostic_not_reachable_ok");
}

const localInsertContractClean = problems.length === 0;
const status = localInsertContractClean
  ? "tw_equity_write_path_metadata_comparison_local_insert_contract_clean_remote_write_path_unresolved"
  : "tw_equity_write_path_metadata_comparison_local_insert_contract_blocked";

const nextDecision = localInsertContractClean
  ? "prepare_bounded_postgrest_write_path_schema_exposure_probe_or_dashboard_api_schema_comparison_before_third_write_attempt"
  : "repair_local_candidate_or_runner_contract_before_any_remote_write_path_probe";

console.log(
  JSON.stringify(
    {
      status,
      mode: "tw_equity_write_path_metadata_comparison",
      candidatePath,
      migrationPath,
      metadataReviewPath,
      runnerPath,
      localInsertContractClean,
      nextDecision,
      problems,
      latestMetadataEvidence,
      runnerEvidence,
      migrationColumns,
      candidateColumns,
      missingFromCandidate,
      extraCandidateColumns,
      safety: {
        connectionAttempted: false,
        dailyPricesMutated: false,
        marketDataFetched: false,
        marketDataIngested: false,
        migrationExecuted: false,
        publicDataSource: "mock",
        rawPayloadsPrinted: false,
        rowPayloadsPrinted: false,
        scoreSource: "mock",
        secretsPrinted: false,
        sqlExecuted: false,
        stagingRowsCreated: false,
        supabaseWriteAttempted: false
      }
    },
    null,
    2
  )
);

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function extractStatus(text) {
  return text.match(/Status: `([^`]+)`/u)?.[1] ?? "missing";
}

function extractColumns(sql, tableName) {
  const marker = `create table if not exists public.${tableName} (`;
  const start = sql.indexOf(marker);
  if (start < 0) return [];

  const bodyStart = start + marker.length;
  const bodyEnd = sql.indexOf("\n);", bodyStart);
  if (bodyEnd < 0) return [];

  return sql
    .slice(bodyStart, bodyEnd)
    .split(/\r?\n/u)
    .map((line) => line.trim().replace(/,$/u, ""))
    .filter(Boolean)
    .map((line) => line.split(/\s+/u)[0])
    .filter((name) => /^[a-z_][a-z0-9_]*$/u.test(name))
    .filter((name) => !["check", "primary", "or"].includes(name))
    .sort();
}

function requiredInsertColumns(tableName) {
  if (tableName === "staging_twse_stock_day_runs") {
    return [
      "attribution_text",
      "created_by",
      "decision",
      "duplicate_trade_dates",
      "failed_month_count",
      "finished_at",
      "http_status_summary",
      "license_url",
      "missing_required_field_count",
      "non_numeric_price_count",
      "non_numeric_volume_amount_count",
      "parser_flag_count",
      "rate_limit_policy",
      "requested_month_count",
      "requested_symbol_count",
      "review_status",
      "run_id",
      "run_type",
      "source_id",
      "source_note_count",
      "source_url_template",
      "started_at",
      "successful_month_count",
      "total_candidate_row_count",
      "zero_row_months"
    ].sort();
  }

  return [
    "close_price",
    "exchange_code",
    "high_price",
    "low_price",
    "open_price",
    "price_change",
    "quality_flags",
    "run_id",
    "source_fetched_at",
    "source_id",
    "source_row_hash",
    "symbol",
    "trade_date",
    "trade_value",
    "transaction_count",
    "volume"
  ].sort();
}

function difference(left, right) {
  const rightSet = new Set(right);
  return left.filter((item) => !rightSet.has(item)).sort();
}
