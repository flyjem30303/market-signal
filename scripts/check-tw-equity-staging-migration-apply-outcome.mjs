import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_STAGING_MIGRATION_APPLY_OUTCOME_2026-06-07.md";
const ledgerPath = "data/source-gates/tw-equity-staging-migration-apply-outcomes.json";
const reportPath = "scripts/report-tw-equity-staging-migration-apply-outcome.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const ledger = JSON.parse(read(ledgerPath));
const reportSource = read(reportPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Staging Migration Apply Outcome - 2026-06-07",
  "tw_equity_staging_migration_apply_outcome_accepted_tables_visible",
  "supabase/migrations/0003_twse_stock_day_staging.sql",
  "NOTIFY pgrst, 'reload schema';",
  "public.staging_twse_stock_day_runs",
  "public.staging_twse_stock_day_prices",
  "PM did not execute SQL in this slice",
  "bounded_post_migration_readonly_verification_only",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`scoreSource=real` remains blocked"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const latest = ledger.outcomes?.at(-1);
if (!latest) {
  problems.push(`${ledgerPath} missing latest outcome`);
} else {
  if (latest.id !== "tw-equity-staging-migration-apply-0003") problems.push(`${ledgerPath} unexpected id`);
  if (latest.outcome !== "accepted") problems.push(`${ledgerPath} latest outcome must be accepted`);
  if (latest.recordedBy !== "Chairman") problems.push(`${ledgerPath} recordedBy must be Chairman`);
  if (!latest.decisionNote?.includes("PM did not execute SQL")) problems.push(`${ledgerPath} must record PM no-SQL boundary`);
  if (latest.allowedNextStepWhenAccepted !== "bounded_post_migration_readonly_verification_only") {
    problems.push(`${ledgerPath} must unlock readonly verification only`);
  }
}

for (const phrase of [
  "Latest TW equity staging migration apply outcome slice",
  "docs/TW_EQUITY_STAGING_MIGRATION_APPLY_OUTCOME_2026-06-07.md",
  "data/source-gates/tw-equity-staging-migration-apply-outcomes.json",
  "scripts/report-tw-equity-staging-migration-apply-outcome.mjs",
  "scripts/check-tw-equity-staging-migration-apply-outcome.mjs",
  "tw_equity_staging_migration_apply_outcome_accepted_tables_visible",
  "both staging tables appeared in the Supabase Dashboard public table list",
  "PM did not execute SQL in this slice",
  "bounded post-migration read-only verification only"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-staging-migration-apply-outcome"] !==
  "node scripts/report-tw-equity-staging-migration-apply-outcome.mjs"
) {
  problems.push("package.json missing report:tw-equity-staging-migration-apply-outcome");
}

if (
  pkg.scripts?.["check:tw-equity-staging-migration-apply-outcome"] !==
  "node scripts/check-tw-equity-staging-migration-apply-outcome.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-migration-apply-outcome");
}

if (!pkg.scripts?.["check:json"]?.includes(ledgerPath)) {
  problems.push("package.json check:json missing staging migration apply outcome ledger");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-migration-apply-outcome.mjs")) {
    problems.push(`${pathName} missing TW equity staging migration apply outcome checker`);
  }
  if (!text.includes("tw-equity-staging-migration-apply-outcome")) {
    problems.push(`${pathName} missing tw-equity-staging-migration-apply-outcome name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-migration-apply-outcome"')) {
  problems.push("review gate core set missing tw-equity-staging-migration-apply-outcome");
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
    if (report.status !== "tw_equity_staging_migration_apply_outcome_accepted_tables_visible") {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.nextRoute !== "bounded_post_migration_readonly_verification_only") {
      problems.push(`${reportPath} must unlock readonly verification only`);
    }
    if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
      problems.push(`${reportPath} must keep mock public/score source`);
    }
    for (const key of [
      "sqlExecutedByPmInThisSlice",
      "migrationExecutedByPmInThisSlice",
      "supabaseWriteAuthorized",
      "supabaseWriteAttemptedByPm",
      "stagingRowsAuthorized",
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
