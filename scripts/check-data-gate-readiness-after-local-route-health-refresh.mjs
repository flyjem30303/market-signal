import fs from "node:fs";

const docPath = "docs/DATA_GATE_READINESS_AFTER_LOCAL_ROUTE_HEALTH_REFRESH.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const runtimeRefreshPath = "docs/RUNTIME_LOCAL_ROUTE_HEALTH_REFRESH_BEFORE_EXECUTABLE_PACKET.md";
const bridgePath = "docs/MVP_REMAINING_COVERAGE_EXECUTION_BRIDGE.md";
const rollupPath = "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md";
const twiiIntakePath = "docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md";
const twiiFieldPath = "docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md";
const twiiOutcomePath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md";
const etfOutcomePath = "docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];

const doc = read(docPath);

const requiredDocPhrases = [
  "Status: `data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked`",
  "move_from_runtime_local_route_health_refresh_to_data_gate_readiness",
  "data_gate_readiness_after_local_route_health_refresh",
  "twii_first_data_gate_ready_execution_blocked_external_rights_pending",
  "Runtime route-health refresh is `runtime_local_route_health_refresh_ready_mock_boundary_preserved`",
  "Level 1 MVP coverage remains `182/360`",
  "TW equity first closed loop remains accepted at `180/180`",
  "Remaining gap remains `178` rows",
  "TWII remains `0/60`, missing `60` rows",
  "ETF remains `2/120`, missing `118` rows",
  "Public runtime remains `publicDataSource=mock`",
  "Score source remains `scoreSource=mock`",
  "TWII as the first readiness lane",
  "can move MVP from `182/360` to `242/360`",
  "ETF is kept as fallback",
  "twii_source_rights_and_field_contract_acceptance_or_blocked_record",
  "twii_sanitized_candidate_artifact_gate",
  "etf_source_rights_fallback_decision_support",
  "publicDataSource=supabase",
  "scoreSource=real"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) {
    problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

const requiredCrossFilePhrases = [
  [runtimeRefreshPath, "runtime_local_route_health_refresh_ready_mock_boundary_preserved"],
  [runtimeRefreshPath, "data_gate_readiness_after_local_route_health_refresh"],
  [bridgePath, "Status: `mvp_remaining_coverage_execution_bridge_ready_source_rights_split`"],
  [bridgePath, "PM should prioritize the `TWII` lane first"],
  [rollupPath, "data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked"],
  [rollupPath, "TW equity sub-scope"],
  [twiiIntakePath, "TWII sub-scope: `0/60`, missing `60`"],
  [twiiFieldPath, "daily_prices Mapping"],
  [twiiFieldPath, "TWII mapping to `daily_prices` remains a field-contract question"],
  [twiiFieldPath, "Mapping to an internal stock id or market asset id remains unresolved"],
  [twiiOutcomePath, "twii_source_rights_outcome_gate_blocked_external_rights_pending"],
  [etfOutcomePath, "etf_source_rights_outcome_decision_gate_blocked_external_rights_pending"],
  [statusPath, "Latest data gate readiness after local route health refresh slice"],
  [statusPath, "data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked"],
  [boardPath, "`docs/DATA_GATE_READINESS_AFTER_LOCAL_ROUTE_HEALTH_REFRESH.md` is `accepted` as PM mainline data gate readiness after local route health refresh"],
  [packagePath, "\"check:data-gate-readiness-after-local-route-health-refresh\""],
  [reviewGatePath, "scripts/check-data-gate-readiness-after-local-route-health-refresh.mjs"],
  [reviewGatePath, "data-gate-readiness-after-local-route-health-refresh"]
];

for (const [path, phrase] of requiredCrossFilePhrases) {
  if (!read(path).includes(phrase)) {
    problems.push(`${path} missing phrase: ${phrase}`);
  }
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
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /candidate artifact generation is approved/u,
  /TWII probe execution is approved/u,
  /ETF fetch is approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) {
    problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      docPath,
      guardedStatus: "data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked"
    },
    null,
    2
  )
);

function read(path) {
  return fs.readFileSync(path, "utf8");
}
