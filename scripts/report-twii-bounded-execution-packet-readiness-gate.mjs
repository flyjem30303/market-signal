import fs from "node:fs";

const paths = {
  reportOnlyChain: "data/source-gates/twii-report-only-dry-run-chain-gate.json",
  serverOnlyIntegration: "data/source-gates/twii-server-only-pre-execution-integration-gate.json",
  operatorAuthorization: "data/source-gates/twii-bounded-operator-authorization-packet-gate.json",
  aggregateReadback: "data/source-gates/twii-aggregate-readback-contract-preflight.json",
  rollbackReadiness: "data/source-gates/twii-rollback-readiness-contract-preflight.json"
};

const reportOnlyChain = readJson(paths.reportOnlyChain);
const serverOnlyIntegration = readJson(paths.serverOnlyIntegration);
const operatorAuthorization = readJson(paths.operatorAuthorization);
const aggregateReadback = readJson(paths.aggregateReadback);
const rollbackReadiness = readJson(paths.rollbackReadiness);

const requiredBeforeExecution = [
  "explicit_operator_decision_required",
  "execute_switch_required",
  "confirmation_phrase_required",
  "server_only_credential_presence_required",
  "rollback_dry_run_required",
  "aggregate_readback_required",
  "post_run_review_required",
  "candidate_duplicate_rejection_required",
  "public_copy_truthfulness_required"
];

const status =
  reportOnlyChain?.status === "twii_report_only_dry_run_chain_gate_completed_no_write_aggregate_only" &&
  serverOnlyIntegration?.gateKind === "twii_server_only_pre_execution_integration_gate" &&
  operatorAuthorization?.gateKind === "twii_bounded_operator_authorization_packet_gate" &&
  aggregateReadback?.contractDecision === "aggregate_readback_contract_ready_but_runtime_execution_still_blocked" &&
  rollbackReadiness?.contractDecision === "rollback_readiness_contract_ready_but_runtime_execution_still_blocked"
    ? "twii_bounded_execution_packet_readiness_gate_ready_no_execution"
    : "twii_bounded_execution_packet_readiness_gate_blocked";

const safety = {
  publicDataSource: "mock",
  scoreSource: "mock",
  executionAllowedNow: false,
  writeGateExecutableNow: false,
  sqlAllowed: false,
  supabaseAllowed: false,
  dailyPricesMutationAllowed: false,
  marketDataFetchAllowed: false,
  sourceDerivedCandidateGenerationAllowed: false,
  rowCoverageAwardAllowed: false,
  runtimePromotionAllowed: false
};

const report = {
  status,
  decision: "accept_twii_bounded_execution_packet_readiness_for_operator_packet_preparation_only",
  acceptedScope: "bounded_execution_packet_readiness_only",
  targetLane: "TWII",
  targetScope: "twii_index_daily_prices_missing_rows",
  targetTable: "daily_prices",
  maxRows: 60,
  reportOnlyChainStatus: reportOnlyChain?.status ?? "missing",
  serverOnlyIntegrationStatus:
    serverOnlyIntegration?.gateKind === "twii_server_only_pre_execution_integration_gate"
      ? "twii_server_only_pre_execution_integration_gate_ready_no_execution"
      : "missing",
  operatorAuthorizationStatus:
    operatorAuthorization?.gateKind === "twii_bounded_operator_authorization_packet_gate"
      ? "twii_bounded_operator_authorization_packet_gate_ready_no_execution"
      : "missing",
  aggregateReadbackDecision: aggregateReadback?.contractDecision ?? "missing",
  rollbackReadinessDecision: rollbackReadiness?.contractDecision ?? "missing",
  nextPMRoute: "twii_explicit_operator_packet_preparation_gate",
  requiredBeforeExecution,
  upstreamPaths: paths,
  ...safety,
  safety,
  decisionMeaning:
    status === "twii_bounded_execution_packet_readiness_gate_ready_no_execution"
      ? "readiness_only_for_explicit_operator_packet_preparation_execution_still_blocked"
      : "blocked_until_required_upstream_gates_are_ready",
  blockedUntil: requiredBeforeExecution
};

console.log(JSON.stringify(report, null, 2));

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}
