import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md";
const backfillPath = "docs/BACKFILL_INGESTION_EXECUTION_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const backfill = read(backfillPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

const requiredDocPhrases = [
  "TW Equity Report-Only Dry-Run Packet",
  "tw_equity_report_only_dry_run_packet_ready_not_executable",
  "docs/BACKFILL_INGESTION_EXECUTION_PACKET.md",
  "`2330`",
  "`2382`",
  "`2308`",
  "expectedTradingSessions",
  "expectedRows",
  "180",
  "latestObservedRows",
  "3",
  "latestMissingRows",
  "177",
  "staging_first",
  "Production `daily_prices` blocked",
  "trade date",
  "open",
  "high",
  "low",
  "close",
  "volume",
  "high >= low",
  "no duplicate symbol+trade_date",
  "missing sessions are counted, not filled",
  "filesWritten false",
  "mutations false",
  "sqlExecuted false",
  "supabaseWrites false",
  "secretsPrinted false",
  "rawPayloadsPrinted false",
  "publicDataSource mock",
  "scoreSource mock",
  "docs/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_DESIGN_2026-05-29.md",
  "docs/CP3_TWSE_STOCK_DAY_DRY_RUN_REPORTER_DESIGN_2026-05-29.md",
  "docs/CP3_TWSE_STOCK_DAY_CONTROLLED_INGESTION_DESIGN_2026-05-29.md",
  "docs/CP3_TWSE_STOCK_DAY_STAGING_BOUNDARY_DESIGN_2026-05-29.md",
  "docs/CP3_TWSE_STOCK_DAY_STAGING_POST_MIGRATION_VALIDATION_ROLLBACK_PLAN_2026-05-29.md"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of ["TW equity (`2330`, `2382`, `2308`)"]) {
  if (!backfill.includes(phrase)) problems.push(`${backfillPath} missing: ${phrase}`);
}

const requiredStatusPhrases = [
  "Latest TW equity report-only dry-run packet slice",
  "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
  "tw_equity_report_only_dry_run_packet_ready_not_executable",
  "expected 180 lane rows",
  "observed 3 rows",
  "missing 177 rows"
];

for (const phrase of requiredStatusPhrases) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-report-only-dry-run-packet"] !==
  "node scripts/check-tw-equity-report-only-dry-run-packet.mjs"
) {
  problems.push("package.json missing check:tw-equity-report-only-dry-run-packet script");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-report-only-dry-run-packet.mjs")) {
    problems.push(`${path} missing tw equity report-only dry-run checker`);
  }
  if (!text.includes("tw-equity-report-only-dry-run-packet")) {
    problems.push(`${path} missing tw-equity-report-only-dry-run-packet name`);
  }
}

if (!reviewGate.includes('"tw-equity-report-only-dry-run-packet"')) {
  problems.push("review gate core set missing tw-equity-report-only-dry-run-packet");
}

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /market ingestion is approved/u,
  /TWSE fetch is approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u,
  /raw payload:/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
