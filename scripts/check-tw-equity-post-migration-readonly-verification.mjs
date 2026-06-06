import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-tw-equity-post-migration-readonly-verification-once.mjs";
const reviewPath = "docs/reviews/TW_EQUITY_POST_MIGRATION_READONLY_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md";
const outcomePath = "data/source-gates/tw-equity-staging-migration-apply-outcomes.json";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const reportSource = read(reportPath);
const review = read(reviewPath);
const outcome = JSON.parse(read(outcomePath));
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "CONFIRMATION_VALUE",
  "CEO_APPROVED_TW_EQUITY_POST_MIGRATION_READONLY_VERIFICATION_ONCE",
  "TW_EQUITY_POST_MIGRATION_READONLY_VERIFICATION_CONFIRMATION",
  "tw-equity-staging-migration-apply-0003",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "readonlyHeadCount",
  "head: true",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "sqlExecutedByPm: false",
  "migrationExecutedByPm: false",
  "supabaseWriteAttempted: false",
  "stagingRowsCreated: false",
  "serviceRoleKeyPrinted: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const forbiddenPattern of [
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /\.rpc\(/u,
  /\bfetch\s*\(/u,
  /insert into/u,
  /delete from/u,
  /update public\./u,
  /sb_secret_/u,
  /sb_publishable_/u
]) {
  if (forbiddenPattern.test(reportSource)) problems.push(`${reportPath} contains forbidden token: ${forbiddenPattern}`);
}

const latestOutcome = outcome.outcomes?.find((item) => item.id === "tw-equity-staging-migration-apply-0003");
if (latestOutcome?.outcome !== "accepted") problems.push(`${outcomePath} must contain accepted migration apply outcome`);

for (const phrase of [
  "TW Equity Post-Migration Readonly Verification Post-Run Review",
  "tw_equity_post_migration_readonly_verification_tables_reachable_no_write",
  "Exactly one bounded post-migration readonly verification was attempted",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "head: true",
  "no SQL execution by PM",
  "no migration execution by PM",
  "no insert/update/upsert/delete operation",
  "no staging rows created",
  "no `daily_prices` mutation",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!review.includes(phrase)) problems.push(`${reviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity post-migration readonly verification slice",
  "docs/reviews/TW_EQUITY_POST_MIGRATION_READONLY_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md",
  "scripts/report-tw-equity-post-migration-readonly-verification-once.mjs",
  "scripts/check-tw-equity-post-migration-readonly-verification.mjs",
  "tw_equity_post_migration_readonly_verification_tables_reachable_no_write",
  "both staging tables are reachable through bounded readonly verification",
  "no row payloads were read or printed",
  "next route is a separate bounded staging write decision or OpenAPI exposure confirmation"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-post-migration-readonly-verification"] !==
  "node scripts/report-tw-equity-post-migration-readonly-verification-once.mjs"
) {
  problems.push("package.json missing report:tw-equity-post-migration-readonly-verification");
}

if (
  pkg.scripts?.["check:tw-equity-post-migration-readonly-verification"] !==
  "node scripts/check-tw-equity-post-migration-readonly-verification.mjs"
) {
  problems.push("package.json missing check:tw-equity-post-migration-readonly-verification");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-post-migration-readonly-verification.mjs")) {
    problems.push(`${pathName} missing TW equity post-migration readonly verification checker`);
  }
  if (!text.includes("tw-equity-post-migration-readonly-verification")) {
    problems.push(`${pathName} missing tw-equity-post-migration-readonly-verification name`);
  }
}

if (!reviewGate.includes('"tw-equity-post-migration-readonly-verification"')) {
  problems.push("review gate core set missing tw-equity-post-migration-readonly-verification");
}

const defaultReport = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (defaultReport.status !== 0) {
  problems.push(`${reportPath} must exit 0 without confirmation`);
} else {
  const report = parseJson(defaultReport.stdout);
  if (report.status !== "tw_equity_post_migration_readonly_verification_not_run_confirmation_required") {
    problems.push(`${reportPath} must default to confirmation-required not-run status`);
  }
  if (report.connectionAttempted !== false) problems.push(`${reportPath} default run must not connect`);
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push(`${reportPath} default safety must remain mock`);
  }
}

for (const forbidden of [/NEXT_PUBLIC_SUPABASE_URL=/u, /SUPABASE_SERVICE_ROLE_KEY=/u, /sb_secret_/u, /sb_publishable_/u]) {
  if (review.match(forbidden)) problems.push(`${reviewPath} contains forbidden token: ${forbidden}`);
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
