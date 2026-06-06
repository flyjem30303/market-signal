import fs from "node:fs";

const problems = [];

const reviewPath = "docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_2026-06-07.md";
const decisionPath = "docs/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_EXECUTION_DECISION.md";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const review = read(reviewPath);
const decision = read(decisionPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "Status: `insert_missing_merge_passed_readback_complete`.",
  "Exactly one bounded insert-missing/skip-existing merge attempt was classified or executed.",
  "`candidate_rows`: observed=`180`, expected=`180`, status=`ok`.",
  "`inserted_rows`: observed=`177`, expected=`177`, status=`ok`.",
  "`skipped_existing_rows`: observed=`3`, expected=`3`, status=`ok`.",
  "`final_target_rows_after_write`: observed=`180`, expected=`180`, status=`ok`.",
  "`conflicting_rows`: observed=`0`, expected=`0`, status=`ok`.",
  "Policy: `insert_missing_skip_existing_no_overwrite`.",
  "Inserted rows: `177`.",
  "Skipped existing rows: `3`.",
  "Final target rows after write: `180`.",
  "Row coverage points awarded: `false`.",
  "Public source promotion: `false`.",
  "Score source promotion: `false`.",
  "Supabase write attempted: `true`.",
  "daily_prices mutation status: `true`.",
  "SQL execution status: `false`.",
  "Market-data fetch status: `false`.",
  "Row payload output status: `false`.",
  "Secret output status: `false`.",
  "Stock id output status: `false`.",
  "Public runtime state: `mock`.",
  "Score runtime state: `mock`."
]) {
  if (!review.includes(phrase)) problems.push(`${reviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_daily_prices_insert_missing_merge_execution_decision_ready_for_one_attempt",
  "one bounded production `daily_prices` merge",
  "Row coverage points remain blocked"
]) {
  if (!decision.includes(phrase)) problems.push(`${decisionPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-daily-prices-insert-missing-merge-post-run-review-2026-06-07"] !==
  "node scripts/check-tw-equity-daily-prices-insert-missing-merge-post-run-review-2026-06-07.mjs"
) {
  problems.push(`${packagePath} missing check:tw-equity-daily-prices-insert-missing-merge-post-run-review-2026-06-07`);
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-daily-prices-insert-missing-merge-post-run-review-2026-06-07.mjs")) {
    problems.push(`${pathName} missing merge post-run review checker command`);
  }
  if (!text.includes("tw-equity-daily-prices-insert-missing-merge-post-run-review-2026-06-07")) {
    problems.push(`${pathName} missing merge post-run review checker name`);
  }
}

for (const phrase of [
  "Latest TW equity daily_prices insert-missing merge post-run review slice",
  "docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_2026-06-07.md",
  "scripts/check-tw-equity-daily-prices-insert-missing-merge-post-run-review-2026-06-07.mjs",
  "insert_missing_merge_passed_readback_complete",
  "inserted `177`, skipped `3`, final target rows `180`, and conflicts `0`",
  "row coverage points, public source promotion, and real score source promotion remain blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
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
