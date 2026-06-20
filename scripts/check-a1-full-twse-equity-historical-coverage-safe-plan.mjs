import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const files = {
  plan: "docs/A1_FULL_TWSE_EQUITY_HISTORICAL_COVERAGE_SAFE_IMPLEMENTATION_PLAN.md",
  initialSchema: "supabase/migrations/0001_initial_schema.sql",
  stagingSchema: "supabase/migrations/0003_twse_stock_day_staging.sql",
  packageJson: "package.json",
  localRunnerReport: "scripts/report-tw-equity-local-report-only-dry-run.mjs",
  localRunnerCheck: "scripts/check-tw-equity-local-report-only-runner.mjs"
};

const text = Object.fromEntries(Object.entries(files).map(([key, filePath]) => [key, read(filePath)]));

validateContains("plan", text.plan, [
  "A1 Full TWSE Equity Historical Coverage Safe Implementation Plan",
  "`a1_full_twse_equity_historical_coverage_safe_plan_ready_dry_run_only`",
  "TWSE listed common-stock equities only",
  "`daily_prices`",
  "`staging_twse_stock_day_runs` plus `staging_twse_stock_day_prices`",
  "report-only dry-run inventory",
  "https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date={YYYYMMDD}&stockNo={symbol}",
  "not a one-call all-symbol full-history endpoint",
  "Default mode must be dry-run/report-only",
  "market endpoint fetch",
  "Supabase connection",
  "Supabase write",
  "staging-row creation",
  "`daily_prices` mutation",
  "publicDataSource=supabase",
  "scoreSource=real",
  "Phase A: Full-Universe Inventory Dry Run",
  "Phase E: Missing-Only `daily_prices` Merge",
  "cmd.exe /c npm run check:a1-full-twse-equity-historical-coverage-safe-plan",
  "Do not run write commands for this packet",
  "Phase A is now locally executable",
  "Phase B bounded source-depth pilot has one sanitized result recorded",
  "Next recommended slice is now executable as a plan-only dry run",
  "cmd.exe /c npm run report:a1-rate-limited-candidate-generation-plan",
  "cmd.exe /c npm run check:a1-rate-limited-candidate-generation-plan"
]);

validateContains("initialSchema", text.initialSchema, [
  "create table if not exists public.stocks",
  "create table if not exists public.daily_prices",
  "primary key (stock_id, trade_date)",
  "unique (country, exchange, symbol)"
]);

validateContains("stagingSchema", text.stagingSchema, [
  "create table if not exists public.staging_twse_stock_day_runs",
  "create table if not exists public.staging_twse_stock_day_prices",
  "primary key (run_id, exchange_code, symbol, trade_date)"
]);

validateContains("localRunnerReport", text.localRunnerReport, [
  "symbols: [\"2330\", \"2382\", \"2308\"]",
  "expectedRows: 180",
  "supabaseConnectionAttempted: false",
  "marketFetchAttempted: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]);

validateContains("localRunnerCheck", text.localRunnerCheck, [
  "report:tw-equity-local-report-only-dry-run",
  "blocked_until_source_approval",
  "marketFetchAttempted: false",
  "supabaseConnectionAttempted: false"
]);

let packageData = {};
try {
  packageData = JSON.parse(text.packageJson);
} catch (error) {
  problems.push(`package.json invalid JSON: ${error.message}`);
}

if (
  packageData?.scripts?.["check:a1-full-twse-equity-historical-coverage-safe-plan"] !==
  "node scripts/check-a1-full-twse-equity-historical-coverage-safe-plan.mjs"
) {
  problems.push("package.json missing check:a1-full-twse-equity-historical-coverage-safe-plan script");
}

for (const [section, sectionText] of [["plan", text.plan]]) {
  if (forbiddenBoundaryOpened(sectionText)) {
    problems.push(`${section} contains forbidden boundary-opening pattern`);
  }
}

const reportResult = spawnSync(process.execPath, [files.localRunnerReport], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (reportResult.status !== 0) {
  problems.push(`${files.localRunnerReport} failed: ${(reportResult.stderr || reportResult.stdout).trim()}`);
} else {
  try {
    const report = JSON.parse(reportResult.stdout);
    if (report.status !== "blocked_until_source_approval") problems.push("local runner report status drifted");
    if (report.marketFetchAttempted !== false) problems.push("local runner report opened market fetch");
    if (report.supabaseConnectionAttempted !== false) problems.push("local runner report opened Supabase connection");
    if (report.supabaseWrites !== false) problems.push("local runner report opened Supabase writes");
    if (report.publicDataSource !== "mock") problems.push("local runner report public data source drifted");
    if (report.scoreSource !== "mock") problems.push("local runner report score source drifted");
  } catch (error) {
    problems.push(`${files.localRunnerReport} did not print valid JSON: ${error.message}`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "a1_full_twse_equity_historical_coverage_safe_plan",
      recommendedCoverage: {
        universe: "TWSE listed common-stock equities only",
        targetRelation: "daily_prices",
        firstExecutablePhase: "full_universe_inventory_dry_run",
        currentExecutablePosture: "dry_run_only_no_fetch_no_write"
      },
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock",
        marketFetchAttempted: false,
        sqlExecuted: false,
        supabaseConnectionAttempted: false,
        supabaseWrite: false,
        stagingRowsCreated: false,
        dailyPricesMutation: false,
        secretsPrinted: false,
        rowPayloadsPrinted: false,
        stockIdsPrinted: false
      },
      requiredAuthorizationBeforeExecution: [
        "full_universe_scope_approval",
        "twse_stock_day_source_rights",
        "rate_limit_policy",
        "remote_schema_and_staging_confirmation",
        "candidate_artifact_path_approval",
        "staging_write_authorization",
        "daily_prices_insert_missing_merge_authorization",
        "rollback_and_readback_approval",
        "public_source_and_real_score_promotion_approval"
      ]
    },
    null,
    2
  )
);

function validateContains(section, value, phrases) {
  for (const phrase of phrases) {
    if (!value.includes(phrase)) problems.push(`${section} missing: ${phrase}`);
  }
}

function forbiddenBoundaryOpened(value) {
  const forbidden = [
    /\bcreateClient\s*\(/u,
    /@supabase\/supabase-js/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\bfetch\s*\(/u,
    /SUPABASE_SERVICE_ROLE_KEY/u,
    /sb_secret_/u,
    /sb_publishable_/u,
    /rawPayloadIncluded\s*[:=]\s*true/u,
    /rowPayloadIncluded\s*[:=]\s*true/u,
    /stockIdPayloadIncluded\s*[:=]\s*true/u
  ];

  return forbidden.some((pattern) => pattern.test(value));
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
