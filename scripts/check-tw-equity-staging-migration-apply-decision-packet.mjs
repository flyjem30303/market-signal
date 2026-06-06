import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_STAGING_MIGRATION_APPLY_DECISION_PACKET.md";
const reportPath = "scripts/report-tw-equity-staging-migration-apply-decision-packet.mjs";
const migrationPath = "supabase/migrations/0003_twse_stock_day_staging.sql";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const migration = read(migrationPath);
const runner = read(runnerPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Staging Migration Apply Decision Packet",
  "tw_equity_staging_migration_apply_decision_packet_ready_for_chairman_or_ceo_execution_approval",
  "READY_TO_AUTHORIZE_MANUAL_SUPABASE_SQL_EDITOR_EXECUTION_OF_0003_STAGING_MIGRATION",
  "remote_staging_tables_missing_or_not_applied",
  "supabase/migrations/0003_twse_stock_day_staging.sql",
  "public.staging_twse_stock_day_runs",
  "public.staging_twse_stock_day_prices",
  "create `public.staging_twse_stock_day_runs` if missing",
  "create `public.staging_twse_stock_day_prices` if missing",
  "enable row level security on both staging tables",
  "Run `NOTIFY pgrst, 'reload schema';` once after the migration succeeds",
  "no staging write attempt is authorized by this packet",
  "bounded post-migration read-only verification packet",
  "no SQL executed by PM in this packet",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [pathName, text, phrase] of [
  [migrationPath, migration, "create table if not exists public.staging_twse_stock_day_runs"],
  [migrationPath, migration, "create table if not exists public.staging_twse_stock_day_prices"],
  [migrationPath, migration, "alter table public.staging_twse_stock_day_runs enable row level security"],
  [migrationPath, migration, "alter table public.staging_twse_stock_day_prices enable row level security"],
  [migrationPath, migration, "create index if not exists staging_twse_stock_day_runs_created_at_idx"],
  [migrationPath, migration, "create index if not exists staging_twse_stock_day_prices_symbol_trade_date_idx"],
  [runnerPath, runner, ".from(\"staging_twse_stock_day_runs\").insert([candidateInput.candidateRun])"],
  [runnerPath, runner, ".from(\"staging_twse_stock_day_prices\").insert(candidateInput.candidatePrices)"]
]) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing: ${phrase}`);
}

for (const forbidden of [
  "insert into public.staging_twse_stock_day_runs",
  "insert into public.staging_twse_stock_day_prices",
  "insert into public.daily_prices",
  "update public.daily_prices",
  "delete from public.daily_prices"
]) {
  if (migration.toLowerCase().includes(forbidden)) {
    problems.push(`${migrationPath} contains forbidden migration data mutation phrase: ${forbidden}`);
  }
}

for (const phrase of [
  "Latest TW equity staging migration apply decision packet slice",
  "docs/TW_EQUITY_STAGING_MIGRATION_APPLY_DECISION_PACKET.md",
  "scripts/report-tw-equity-staging-migration-apply-decision-packet.mjs",
  "scripts/check-tw-equity-staging-migration-apply-decision-packet.mjs",
  "tw_equity_staging_migration_apply_decision_packet_ready_for_chairman_or_ceo_execution_approval",
  "manual Supabase SQL Editor execution of `supabase/migrations/0003_twse_stock_day_staging.sql`",
  "post-migration read-only verification remains separate",
  "No SQL or migration was executed by PM in this slice"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-staging-migration-apply-decision-packet"] !==
  "node scripts/report-tw-equity-staging-migration-apply-decision-packet.mjs"
) {
  problems.push("package.json missing report:tw-equity-staging-migration-apply-decision-packet");
}

if (
  pkg.scripts?.["check:tw-equity-staging-migration-apply-decision-packet"] !==
  "node scripts/check-tw-equity-staging-migration-apply-decision-packet.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-migration-apply-decision-packet");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-migration-apply-decision-packet.mjs")) {
    problems.push(`${pathName} missing TW equity staging migration apply decision checker`);
  }
  if (!text.includes("tw-equity-staging-migration-apply-decision-packet")) {
    problems.push(`${pathName} missing tw-equity-staging-migration-apply-decision-packet name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-migration-apply-decision-packet"')) {
  problems.push("review gate core set missing tw-equity-staging-migration-apply-decision-packet");
}

const reportRun = spawnSync(process.execPath, [reportPath], { encoding: "utf8" });
if (reportRun.status !== 0) {
  problems.push(`${reportPath} failed to run`);
} else {
  for (const pattern of [
    /NEXT_PUBLIC_SUPABASE_URL/,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
    /SUPABASE_SERVICE_ROLE_KEY/,
    /https:\/\/[a-z0-9-]+\.supabase\.co/i,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
    /\brawRows\b/,
    /\browPayload\b/i,
    /\bselect\s+\*\s+from\b/i,
    /\binsert\s+into\b/i,
    /\bupdate\s+[a-z_]+\s+set\b/i,
    /\bdelete\s+from\b/i
  ]) {
    if (pattern.test(reportRun.stdout)) problems.push(`${reportPath} emitted forbidden output pattern: ${String(pattern)}`);
  }

  try {
    const report = JSON.parse(reportRun.stdout);
    if (report.status !== "tw_equity_staging_migration_apply_decision_packet_ready_for_chairman_or_ceo_execution_approval") {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.migrationScope?.file !== migrationPath) {
      problems.push(`${reportPath} emitted unexpected migration file`);
    }
    if (report.blockedAfterExecutionUntilSeparateVerification?.stagingWriteAttemptAuthorized !== false) {
      problems.push(`${reportPath} must not authorize staging write after migration`);
    }
    if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
      problems.push(`${reportPath} must keep mock public/score source`);
    }
    for (const key of [
      "sqlExecutedByPmInThisPacket",
      "migrationExecutedByPmInThisPacket",
      "supabaseWriteAttemptedByPm",
      "stagingRowsCreated",
      "dailyPricesMutated",
      "marketDataFetched",
      "marketDataIngested",
      "rawPayloadsPrinted",
      "rowPayloadsPrinted",
      "secretsPrinted",
      "publicPromotionAllowed",
      "rowCoveragePointsAllowed",
      "scoreSourceRealAllowed"
    ]) {
      if (report.safety?.[key] !== false) problems.push(`${reportPath} safety.${key} must be false`);
    }
  } catch {
    problems.push(`${reportPath} did not emit JSON`);
  }
}

for (const [pathName, text] of [
  [docPath, doc],
  [reportPath, reportSource]
]) {
  for (const forbidden of [
    ".insert(",
    ".update(",
    ".delete(",
    ".upsert(",
    "await import(\"@supabase/supabase-js\")",
    "sb_secret_",
    "sb_publishable_"
  ]) {
    if (text.includes(forbidden)) problems.push(`${pathName} contains forbidden token: ${forbidden}`);
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
