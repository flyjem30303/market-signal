import fs from "node:fs";

const problems = [];

const docPath = "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const stagingWritePath = "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md";
const stagingReadbackPath = "docs/reviews/TW_EQUITY_POST_WRITE_STAGING_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md";
const promotionGatePath = "docs/TW_EQUITY_POST_WRITE_PROMOTION_READINESS_GATE.md";
const mergePostRunPath = "docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_2026-06-07.md";
const postMergeReadbackPath = "docs/reviews/TW_EQUITY_POST_MERGE_ROW_COVERAGE_READBACK_POST_RUN_REVIEW_2026-06-07.md";
const rowCoverageGatePath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";

const doc = read(docPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const stagingWrite = read(stagingWritePath);
const stagingReadback = read(stagingReadbackPath);
const promotionGate = read(promotionGatePath);
const mergePostRun = read(mergePostRunPath);
const postMergeReadback = read(postMergeReadbackPath);
const rowCoverageGate = read(rowCoverageGatePath);

const requiredDocPhrases = [
  "Status: `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`",
  "CEO decision: `accept_tw_equity_first_closed_loop_and_continue_blocked_runtime_promotion`",
  "`2330`, `2382`, `2308`",
  "tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion",
  "tw_equity_post_write_staging_verification_counts_match_no_public_promotion",
  "tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked",
  "insert_missing_merge_passed_readback_complete",
  "tw_equity_post_merge_row_coverage_readback_executed_overall_blocked_tw_equity_complete",
  "tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked",
  "accepted_first_closed_loop_complete",
  "expected rows: `180`",
  "staging write rows: `180`",
  "staging readback rows: `180`",
  "inserted daily_prices rows: `177`",
  "skipped existing daily_prices rows: `3`",
  "final daily_prices rows for sub-scope: `180`",
  "post-merge sub-scope observed rows: `180`",
  "expected rows: `360`",
  "observed rows: `182`",
  "missing rows: `178`",
  "blocked_incomplete",
  "`TWII`: `0/60`",
  "`0050`: `1/60`",
  "`006208`: `1/60`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "public real-data claim: `blocked`",
  "real score claim: `blocked`",
  "twii_etf_blocked_universe_candidate_and_rights_path",
  "partial_coverage_public_beta_copy_alignment",
  "runtime_promotion_policy_from_first_closed_loop",
  "The next route is `runtime_promotion_policy_from_first_closed_loop_or_blocked_universe_candidate_path`"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const requiredHardStops = [
  "SQL execution",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "raw market-data ingest",
  "raw market-data storage",
  "raw market-data commit",
  "raw payload output",
  "row payload output",
  "stock id payload output",
  "secret output",
  "additional row coverage points",
  "full MVP coverage claim",
  "public source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`",
  "investment advice claim",
  "public launch completion claim"
];

for (const phrase of requiredHardStops) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

const evidenceChecks = [
  [stagingWritePath, stagingWrite, "tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion"],
  [stagingWritePath, stagingWrite, "\"writtenPriceRows\": 180"],
  [stagingReadbackPath, stagingReadback, "tw_equity_post_write_staging_verification_counts_match_no_public_promotion"],
  [stagingReadbackPath, stagingReadback, "count=`180`"],
  [promotionGatePath, promotionGate, "tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked"],
  [promotionGatePath, promotionGate, "Verified staging price rows: `180`"],
  [mergePostRunPath, mergePostRun, "Status: `insert_missing_merge_passed_readback_complete`"],
  [mergePostRunPath, mergePostRun, "`inserted_rows`: observed=`177`"],
  [mergePostRunPath, mergePostRun, "`skipped_existing_rows`: observed=`3`"],
  [mergePostRunPath, mergePostRun, "`final_target_rows_after_write`: observed=`180`"],
  [postMergeReadbackPath, postMergeReadback, "observed total rows: `182`"],
  [postMergeReadbackPath, postMergeReadback, "overall_row_coverage_blocked_tw_equity_subscope_complete"],
  [rowCoverageGatePath, rowCoverageGate, "Status: `tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked`"],
  [rowCoverageGatePath, rowCoverageGate, "sub-scope status: `accepted_complete`"],
  [rowCoverageGatePath, rowCoverageGate, "full-scope status: `blocked_incomplete`"]
];

for (const [pathName, text, phrase] of evidenceChecks) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing evidence phrase: ${phrase}`);
}

for (const phrase of [
  "Latest data realification first closed loop rollup slice",
  "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md",
  "data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked",
  "accept_tw_equity_first_closed_loop_and_continue_blocked_runtime_promotion",
  "TW equity sub-scope `2330`, `2382`, and `2308` is accepted as first closed loop complete at `180/180`",
  "Full MVP coverage remains blocked at `182/360` with `178` missing rows",
  "runtime_promotion_policy_from_first_closed_loop_or_blocked_universe_candidate_path"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:data-realification-first-closed-loop-rollup"] !==
  "node scripts/check-data-realification-first-closed-loop-rollup.mjs"
) {
  problems.push(`${packagePath} missing check:data-realification-first-closed-loop-rollup`);
}

for (const phrase of [
  "scripts/check-data-realification-first-closed-loop-rollup.mjs",
  "expectStatus: \"ok\"",
  "name: \"data-realification-first-closed-loop-rollup\"",
  "\"data-realification-first-closed-loop-rollup\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

if (doc.includes("publicDataSource=supabase is approved") || doc.includes("scoreSource=real is approved")) {
  problems.push(`${docPath} must not approve publicDataSource=supabase or scoreSource=real`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked",
      acceptedSubscope: "2330/2382/2308 180/180",
      fullMvpCoverage: "182/360 blocked",
      nextRoute: "runtime_promotion_policy_from_first_closed_loop_or_blocked_universe_candidate_path"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}
