import fs from "node:fs";

const policyPath = "docs/TW_EQUITY_DAILY_PRICES_EXISTING_TARGET_OVERLAP_POLICY.md";
const postRunReviewPath =
  "docs/reviews/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_POST_RUN_REVIEW_2026-06-07.md";
const runnerPath = "scripts/run-tw-equity-staging-to-daily-prices-remote-preflight-once.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";

const problems = [];

const policy = read(policyPath);
const postRunReview = read(postRunReviewPath);
const runner = read(runnerPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const packageJson = JSON.parse(read(packagePath));
const status = read(statusPath);

for (const phrase of [
  "Status: `tw_equity_daily_prices_existing_target_overlap_policy_ready_not_executed`",
  "`existing_daily_prices_target_count`: observed `3`, expected `0`, status `mismatch`",
  "Do not repeat the same zero-overlap remote preflight",
  "Existing production overlap is not an automatic approval for merge",
  "Existing production overlap is not an automatic reason to delete rows",
  "A future merge runner must be idempotent",
  "Create a bounded readonly overlap-classification runner and post-run review template",
  "Staging-to-`daily_prices` merge authorized: `false`",
  "`publicDataSource`: `mock`",
  "`scoreSource`: `mock`"
]) {
  if (!policy.includes(phrase)) problems.push(`${policyPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `blocked`",
  "`existing_daily_prices_target_count`: countStatus=`mismatch`, observed=`3`, expected=`0`",
  "Preflight status: `remote_preflight_blocked_existing_daily_prices_target_rows`",
  "`existing_daily_prices_target_count_mismatch`",
  "`daily_prices` mutation status: `false`",
  "Public runtime state: `mock`",
  "Score runtime state: `mock`"
]) {
  if (!postRunReview.includes(phrase)) problems.push(`${postRunReviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "if (executionResult.remoteAttempted)",
  "writePostRunReview(output)",
  "preflightStatus: executionResult.status",
  "mockExistingDailyPricesTargetCount",
  "## Problems"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

if (
  packageJson.scripts?.["check:tw-equity-daily-prices-existing-target-overlap-policy"] !==
  "node scripts/check-tw-equity-daily-prices-existing-target-overlap-policy.mjs"
) {
  problems.push(`${packagePath} missing check:tw-equity-daily-prices-existing-target-overlap-policy`);
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-daily-prices-existing-target-overlap-policy.mjs")) {
    problems.push(`${pathName} missing overlap policy checker command`);
  }
  if (!text.includes("tw-equity-daily-prices-existing-target-overlap-policy")) {
    problems.push(`${pathName} missing overlap policy checker name`);
  }
}

if (!reviewGate.includes('"tw-equity-daily-prices-existing-target-overlap-policy"')) {
  problems.push("review gate core set missing tw-equity-daily-prices-existing-target-overlap-policy");
}

if (!status.includes("Latest TW equity daily_prices existing target overlap policy slice")) {
  problems.push(`${statusPath} missing overlap policy status line`);
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
