import fs from "node:fs";

const packetPath = "docs/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_SKIP_EXISTING_MERGE_AUTHORIZATION_PACKET.md";
const overlapRunnerDocPath = "docs/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_RUNNER.md";
const overlapReviewPath = "docs/reviews/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_POST_RUN_REVIEW_2026-06-07.md";
const mergeDesignPath = "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_MERGE_DESIGN_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const problems = [];

const packet = read(packetPath);
const overlapRunnerDoc = read(overlapRunnerDocPath);
const overlapReview = read(overlapReviewPath);
const mergeDesign = read(mergeDesignPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "Status: `tw_equity_daily_prices_insert_missing_skip_existing_merge_authorization_ready_not_executed`",
  "candidate rows: `180`",
  "existing overlap rows: `3`",
  "exact value match rows: `3`",
  "conflicting overlap rows: `0`",
  "missing insert candidate rows: `177`",
  "classification: `idempotent_safe_partial_overlap_skip_existing_insert_missing`",
  "Policy id: `insert_missing_skip_existing_no_overwrite`",
  "Insert only candidate rows whose production key does not yet exist",
  "Skip existing production keys when the existing production row exactly matches the accepted candidate values",
  "Block if any existing production key differs from the accepted candidate values",
  "Never update, overwrite, upsert, or delete production rows in this policy",
  "expected inserted rows: `177`",
  "expected skipped existing rows: `3`",
  "expected final target rows for the accepted 3-symbol x 60-session scope: `180`",
  "expected conflicting rows after merge: `0`",
  "expected row coverage numerator increase for this packet: `177`",
  "row coverage points remain blocked until a separate row coverage scoring gate accepts production readback",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "real Supabase write execution remains separate"
]) {
  if (!packet.includes(phrase)) problems.push(`${packetPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `overlap_classification_passed_idempotent_safe_partial_overlap`",
  "Classification: `idempotent_safe_partial_overlap_skip_existing_insert_missing`",
  "`existing_overlap_count`: observed=`3`, expected=`3`",
  "`exact_value_match_count`: observed=`3`, expected=`3`",
  "`conflicting_overlap_count`: observed=`0`, expected=`0`",
  "`missing_insert_candidate_count`: observed=`177`, expected=`177`",
  "Production merge authorized: `false`"
]) {
  if (!overlapReview.includes(phrase)) problems.push(`${overlapReviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `tw_equity_daily_prices_overlap_classification_executed_idempotent_safe_partial_overlap`",
  "Missing insert candidate rows: `177`",
  "The overlap is idempotent-safe for merge preparation only"
]) {
  if (!overlapRunnerDoc.includes(phrase)) problems.push(`${overlapRunnerDocPath} missing: ${phrase}`);
}

for (const phrase of [
  "Production key: `daily_prices(stock_id, trade_date)`",
  "Expected readback rows: `180`",
  "The runner must not print `stock_id` values or row payloads"
]) {
  if (!mergeDesign.includes(phrase)) problems.push(`${mergeDesignPath} missing: ${phrase}`);
}

if (
  packageJson.scripts?.["check:tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization"] !==
  "node scripts/check-tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization.mjs"
) {
  problems.push(`${packagePath} missing check:tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization`);
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization.mjs")) {
    problems.push(`${pathName} missing insert-missing merge authorization checker command`);
  }
  if (!text.includes("tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization")) {
    problems.push(`${pathName} missing insert-missing merge authorization checker name`);
  }
}

if (!reviewGate.includes('"tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization"')) {
  problems.push("review gate core set missing tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization");
}

for (const phrase of [
  "Latest TW equity daily_prices insert-missing skip-existing merge authorization slice",
  "docs/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_SKIP_EXISTING_MERGE_AUTHORIZATION_PACKET.md",
  "scripts/check-tw-equity-daily-prices-insert-missing-skip-existing-merge-authorization.mjs",
  "tw_equity_daily_prices_insert_missing_skip_existing_merge_authorization_ready_not_executed",
  "`177` missing rows",
  "`3` exact-match existing rows"
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
