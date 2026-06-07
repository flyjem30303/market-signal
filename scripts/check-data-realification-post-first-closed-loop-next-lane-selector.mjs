import fs from "node:fs";

const problems = [];

const docPath = "docs/DATA_REALIFICATION_POST_FIRST_CLOSED_LOOP_NEXT_LANE_SELECTOR.md";
const firstClosedLoopPath = "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md";
const runtimePolicyPath = "docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md";
const twiiBlockedPath = "docs/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_ACCEPTANCE_OR_BLOCKED_RECORD.md";
const etfBlockedPath = "docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md";
const a1IntakePath = "docs/A1_TWII_ETF_SOURCE_RIGHTS_EVIDENCE_INTAKE_PACKET.md";
const betaPacketSelectorPath = "docs/BETA_DEPLOYMENT_PACKET_WINDOW_READINESS_SELECTOR.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `data_realification_post_first_closed_loop_next_lane_selector_ready`",
  "CEO decision: `route_after_tw_equity_first_closed_loop_without_reopening_completed_work`",
  "post_first_closed_loop_next_data_lane_selector",
  "twii_first_if_rights_change_otherwise_beta_runtime_mainline",
  "TW equity final coverage: `180/180`",
  "Full MVP coverage: `182/360`",
  "Missing rows: `178`",
  "Runtime remains `publicDataSource=mock`",
  "Score remains `scoreSource=mock`",
  "`TWII`",
  "`0/60`",
  "`0050`",
  "`006208`",
  "legal_and_redistribution_terms_unapproved",
  "blocked_external_rights_field_contract_and_asset_mapping_pending",
  "twii_sanitized_candidate_artifact_gate_after_rights_field_contract_and_asset_mapping_acceptance",
  "etf_sanitized_candidate_artifact_gate_after_source_rights_acceptance",
  "beta_deployment_executable_packet_after_platform_values",
  "accepted_for_candidate_gate",
  "blocked_external_evidence_pending",
  "fill_twii_or_etf_source_rights_evidence_before_candidate_gate",
  "twii_or_etf_sanitized_candidate_artifact_gate_after_acceptance"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, phrase] of [
  [firstClosedLoopPath, "data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked"],
  [firstClosedLoopPath, "TW equity sub-scope"],
  [firstClosedLoopPath, "expected rows: `360`"],
  [firstClosedLoopPath, "observed rows: `182`"],
  [runtimePolicyPath, "runtime_promotion_policy_from_first_closed_loop_ready_mock_boundary_preserved"],
  [runtimePolicyPath, "publicDataSource=mock"],
  [runtimePolicyPath, "scoreSource=mock"],
  [twiiBlockedPath, "twii_source_rights_field_contract_acceptance_or_blocked_record_blocked_external_evidence_pending"],
  [twiiBlockedPath, "blocked_external_rights_field_contract_and_asset_mapping_pending"],
  [etfBlockedPath, "etf_source_rights_outcome_decision_gate_blocked_external_rights_pending"],
  [etfBlockedPath, "legal_and_redistribution_terms_unapproved"],
  [a1IntakePath, "a1_twii_etf_source_rights_evidence_intake_packet_ready_local_only_not_filled"],
  [a1IntakePath, "PM route: `remaining_coverage_source_rights_intake_before_candidate_artifacts`"],
  [betaPacketSelectorPath, "beta_deployment_packet_window_readiness_selector_ready_platform_values_pending"],
  [statusPath, "Latest data realification post first closed loop next lane selector slice"],
  [statusPath, "data_realification_post_first_closed_loop_next_lane_selector_ready"],
  [statusPath, "twii_first_if_rights_change_otherwise_beta_runtime_mainline"],
  [boardPath, "`docs/DATA_REALIFICATION_POST_FIRST_CLOSED_LOOP_NEXT_LANE_SELECTOR.md` is `accepted` as PM/A1 post-first-closed-loop next data lane selector"],
  [boardPath, "data_realification_post_first_closed_loop_next_lane_selector_ready"]
]) {
  if (!read(filePath).includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:data-realification-post-first-closed-loop-next-lane-selector"] !==
  "node scripts/check-data-realification-post-first-closed-loop-next-lane-selector.mjs"
) {
  problems.push(`${packagePath} missing check:data-realification-post-first-closed-loop-next-lane-selector script`);
}

for (const phrase of [
  "scripts/check-data-realification-post-first-closed-loop-next-lane-selector.mjs",
  "expectStatus: \"ok\"",
  "name: \"data-realification-post-first-closed-loop-next-lane-selector\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "does not authorize:",
  "SQL execution",
  "Supabase connection",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "TWII probe execution",
  "ETF fetch or ingestion",
  "source-derived candidate generation",
  "parser implementation",
  "market-data fetch",
  "market-data ingest",
  "market-data storage",
  "market-data commit",
  "source body output",
  "row payload output",
  "stock id payload output",
  "secret output",
  "additional row coverage points",
  "full MVP coverage claim",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
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
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /publicDataSource=supabase is approved/iu,
  /scoreSource=real is approved/iu,
  /sb_secret_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "data_realification_post_first_closed_loop_next_lane_selector_ready",
      outcome: "twii_first_if_rights_change_otherwise_beta_runtime_mainline",
      nextPmRoute: "beta_deployment_executable_packet_after_platform_values_or_runtime_promotion_readiness_with_mock_boundary",
      nextA1Route: "fill_twii_or_etf_source_rights_evidence_before_candidate_gate"
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
