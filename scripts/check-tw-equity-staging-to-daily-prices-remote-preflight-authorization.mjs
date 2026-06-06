import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const authorizationPath = "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_AUTHORIZATION_PACKET.md";
const templatePath = "docs/reviews/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_POST_RUN_REVIEW_TEMPLATE.md";
const reportPath = "scripts/report-tw-equity-staging-to-daily-prices-remote-preflight-authorization.mjs";
const dryRunPath = "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_DRY_RUN_PREFLIGHT.md";
const dryRunCheckPath = "scripts/check-tw-equity-staging-to-daily-prices-dry-run-preflight.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const authorization = read(authorizationPath);
const template = read(templatePath);
const reportSource = read(reportPath);
const dryRun = read(dryRunPath);
const dryRunCheck = read(dryRunCheckPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Staging To Daily Prices Remote Preflight Authorization Packet",
  "tw_equity_staging_to_daily_prices_remote_preflight_authorization_ready_not_executed",
  "CEO may authorize exactly one future bounded Supabase readonly preflight",
  "does not execute the preflight",
  "Authorization id: `TW-EQUITY-DAILY-PRICES-PREFLIGHT-2026-06-07-AUTH-001`",
  "Attempt limit: `1`",
  "Required command status: `not_implemented_in_this_slice`",
  "Execution status: `not_executed`",
  "scripts/run-tw-equity-staging-to-daily-prices-remote-preflight-once.mjs",
  "`staging_run_count`",
  "`existing_daily_prices_target_count`",
  "remote_preflight_passed_merge_still_requires_separate_authorization",
  "remote_preflight_blocked_existing_daily_prices_target_rows",
  "docs/reviews/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_POST_RUN_REVIEW_<DATE>.md",
  "publicDataSource=mock",
  "scoreSource=mock",
  "This packet does not authorize:",
  "`daily_prices` mutation",
  "row coverage points",
  "`scoreSource=real`",
  "Implement the fail-closed remote preflight runner"
]) {
  if (!authorization.includes(phrase)) problems.push(`${authorizationPath} missing: ${phrase}`);
}

for (const phrase of [
  "TW Equity Staging To Daily Prices Remote Preflight Post-Run Review Template",
  "tw_equity_staging_to_daily_prices_remote_preflight_post_run_review_template_ready_not_executed",
  "blank template only",
  "Authorization id: `not_run`",
  "Exact command: `not_run`",
  "Execution count: `0`",
  "Review status: `template_only_not_executed`",
  "Attempt type: `bounded_supabase_readonly_preflight`",
  "Accepted staging scope: `AUTH-003`",
  "Expected staging price rows: `180`",
  "`staging_run_count`: `not_run`",
  "`existing_daily_prices_target_count`: `not_run`",
  "Connection status: `not_run`",
  "SQL execution status: `not_run`",
  "Supabase write status: `not_run`",
  "`daily_prices` mutation status: `not_run`",
  "Public runtime state: `mock`",
  "Score runtime state: `mock`",
  "Row coverage points awarded: `false`",
  "Production merge authorized: `false`",
  "Required Checks For A Filled Review"
]) {
  if (!template.includes(phrase)) problems.push(`${templatePath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_staging_to_daily_prices_dry_run_preflight_ready_no_remote_attempt",
  "Create the bounded remote preflight authorization packet"
]) {
  if (!dryRun.includes(phrase)) problems.push(`${dryRunPath} missing prerequisite phrase: ${phrase}`);
}

if (!dryRunCheck.includes("tw_equity_staging_to_daily_prices_dry_run_preflight_ready_no_remote_attempt")) {
  problems.push(`${dryRunCheckPath} missing dry-run preflight status`);
}

for (const phrase of [
  "tw_equity_staging_to_daily_prices_remote_preflight_authorization",
  "tw_equity_staging_to_daily_prices_remote_preflight_authorization_ready_not_executed",
  "TW-EQUITY-DAILY-PRICES-PREFLIGHT-2026-06-07-AUTH-001",
  "attemptLimit: 1",
  "requiredCommandStatus: \"not_implemented_in_this_slice\"",
  "runnerImplementedNow: false",
  "separateRunnerImplementationGateRequired: true",
  "targetProductionRelation: \"daily_prices\"",
  "targetStagingScope: \"AUTH-003\"",
  "postRunReviewTemplate: \"tw_equity_staging_to_daily_prices_remote_preflight_post_run_review_template_ready_not_executed\"",
  "connectionAttempted: false",
  "dailyPricesMutated: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "supabaseWriteAttempted: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity staging-to-daily_prices remote preflight authorization slice",
  "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_AUTHORIZATION_PACKET.md",
  "docs/reviews/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_POST_RUN_REVIEW_TEMPLATE.md",
  "scripts/report-tw-equity-staging-to-daily-prices-remote-preflight-authorization.mjs",
  "scripts/check-tw-equity-staging-to-daily-prices-remote-preflight-authorization.mjs",
  "tw_equity_staging_to_daily_prices_remote_preflight_authorization_ready_not_executed",
  "names exactly one future bounded Supabase readonly preflight authorization",
  "keeps the future runner not implemented in this slice and requires immediate post-run review",
  "No Supabase connection, SQL, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-staging-to-daily-prices-remote-preflight-authorization"] !==
  "node scripts/report-tw-equity-staging-to-daily-prices-remote-preflight-authorization.mjs"
) {
  problems.push("package.json missing report:tw-equity-staging-to-daily-prices-remote-preflight-authorization");
}

if (
  pkg.scripts?.["check:tw-equity-staging-to-daily-prices-remote-preflight-authorization"] !==
  "node scripts/check-tw-equity-staging-to-daily-prices-remote-preflight-authorization.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-to-daily-prices-remote-preflight-authorization");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-to-daily-prices-remote-preflight-authorization.mjs")) {
    problems.push(`${pathName} missing TW equity staging-to-daily_prices remote preflight authorization checker`);
  }
  if (!text.includes("tw-equity-staging-to-daily-prices-remote-preflight-authorization")) {
    problems.push(`${pathName} missing tw-equity-staging-to-daily-prices-remote-preflight-authorization name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-to-daily-prices-remote-preflight-authorization"')) {
  problems.push("review gate core set missing tw-equity-staging-to-daily-prices-remote-preflight-authorization");
}

for (const [pathName, text] of [
  [authorizationPath, authorization],
  [templatePath, template],
  [reportPath, reportSource]
]) {
  if (/sb_secret_|sb_publishable_|SUPABASE_SERVICE_ROLE_KEY=/u.test(text)) {
    problems.push(`${pathName} must not contain literal Supabase key material`);
  }
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
  if (report.status !== "tw_equity_staging_to_daily_prices_remote_preflight_authorization_ready_not_executed") {
    problems.push("remote preflight authorization report status mismatch");
  }
  if (report.authorizationCandidate?.attemptLimit !== 1) problems.push("attempt limit must be 1");
  if (report.authorizationCandidate?.executionStatus !== "not_executed") problems.push("execution status must be not_executed");
  if (report.futureCommandContract?.runnerImplementedNow !== false) problems.push("runnerImplementedNow must be false");
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push("remote preflight authorization must keep mock sources");
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
    "supabaseWriteAttempted"
  ]) {
    if (report.safety?.[key] !== false) problems.push(`safety.${key} must be false`);
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
