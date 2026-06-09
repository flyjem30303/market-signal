import { spawnSync } from "node:child_process";

const problems = [];
const noWriteRun = runJson(["scripts/report-twii-bounded-data-acceptance-no-write-chain-run-20260609.mjs"]);

if (noWriteRun.status !== "twii_bounded_data_acceptance_no_write_chain_run_20260609_accepted") {
  problems.push("twii_no_write_chain_run_not_accepted");
}
if (noWriteRun.outcome !== "accepted_no_write_chain_with_post_run_review") {
  problems.push("twii_no_write_chain_outcome_not_accepted");
}
assertNoWriteSafety(noWriteRun);

const requiredFutureAuthorizationFields = [
  "authorizationId",
  "chairmanDecision=accepted",
  "ceoDecision=accepted",
  "pmOwner",
  "candidateArtifactPath",
  "sourceRightsDecisionReference",
  "fieldContractReference",
  "assetMappingReference",
  "targetTable=daily_prices",
  "targetLane=TWII",
  "targetScope=twii_index_daily_prices_missing_rows",
  "maxRows=60",
  "writeMode=bounded_insert_missing_only",
  "duplicatePolicy=reject_duplicates",
  "rollbackPlan",
  "postWriteReadbackPlan",
  "postWriteReviewCommand",
  "promotionAllowed=false",
  "rowCoverageScoringAllowed=false",
  "scoreSourceRealAllowed=false"
];

const rollbackStopLine = [
  "block_if_source_rights_unresolved",
  "block_if_field_contract_unresolved",
  "block_if_asset_mapping_unresolved",
  "block_if_candidate_artifact_not_reviewed",
  "block_if_target_scope_not_twii_index_missing_daily_rows",
  "block_if_max_rows_gt_60",
  "block_if_duplicate_rows_not_zero",
  "block_if_rollback_plan_missing",
  "block_if_post_write_readback_plan_missing",
  "block_if_secret_handling_plan_missing",
  "block_if_public_promotion_or_real_score_requested"
];

const postWriteReadbackPlan = [
  "attempted_row_count",
  "inserted_row_count",
  "rejected_row_count",
  "duplicate_row_count",
  "target_scope",
  "target_table",
  "post_write_max_trade_date",
  "source_rights_decision_reference",
  "field_contract_reference",
  "asset_mapping_reference"
];

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_supabase_write_gate_preauth_ready_for_chairman_authorization" : "blocked",
  outcome: ok ? "preauth_ready_for_separate_explicit_write_gate_packet" : "blocked",
  mode: "twii_supabase_write_gate_preauth",
  owner: "CEO/PM",
  upstream: {
    noWriteRunStatus: noWriteRun.status ?? null,
    noWriteRunOutcome: noWriteRun.outcome ?? null
  },
  requiredFutureAuthorizationFields,
  rollbackStopLine,
  postWriteReadbackPlan,
  nextAction: ok
    ? "Prepare a separate chairman/CEO/PM named write-gate packet only when leadership explicitly authorizes a real write attempt."
    : "Repair the accepted no-write chain record before preparing any write-gate packet.",
  currentBoundary: {
    writeGateExecutableNow: false,
    postWriteReadbackExecutableNow: false,
    rowCoverageScoringAllowedNow: false,
    publicPromotionAllowedNow: false,
    scoreSourceRealAllowedNow: false
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    sourcePayloadsPrinted: false,
    rowPayloadsPrinted: false,
    stockIdPayloadsPrinted: false,
    secretsPrinted: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function runJson(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    return JSON.parse(result.stdout ?? "{}");
  } catch {
    problems.push(`${args[0]} did not return JSON`);
    return {};
  }
}

function assertNoWriteSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("no_write_run_must_stay_mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "sourcePayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`noWriteRun.safety.${key}_must_be_false`);
  }
}

