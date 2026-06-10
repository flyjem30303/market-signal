import fs from "node:fs";
import { spawnSync } from "node:child_process";

const packetPath = "data/source-gates/twii-implementation-scope-packet.json";
const implementationReviewGatePath = "data/source-gates/twii-real-write-runner-implementation-review-gate.json";
const implementationReviewReportPath = "scripts/report-twii-real-write-runner-implementation-review-gate.mjs";
const problems = [];

const packet = readJson(packetPath);
const implementationReviewGate = readJson(implementationReviewGatePath);
const implementationReviewReport = runJsonReport(
  implementationReviewReportPath,
  "TWII real write-runner implementation review gate"
);

validatePacket();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_implementation_scope_packet_ready_no_execution" : "blocked",
  outcome: ok
    ? "implementation_scope_packet_ready_implementation_still_blocked"
    : "implementation_scope_packet_blocked",
  mode: "twii_implementation_scope_packet_no_execution",
  owner: "CEO/PM",
  packetPath,
  implementationReviewGatePath,
  implementationReviewReportPath,
  implementationReviewGateAccepted: packet.implementationReviewGateAccepted === true,
  implementationScopeDecision: packet.implementationScopeDecision ?? null,
  scopeMode: packet.scopeMode ?? null,
  attemptId: packet.attemptId ?? null,
  requiredConfirmationPhrase: packet.requiredConfirmationPhrase ?? null,
  executeSwitchName: packet.executeSwitchName ?? null,
  confirmationPhraseName: packet.confirmationPhraseName ?? null,
  target: {
    targetTable: packet.targetTable ?? null,
    targetLane: packet.targetLane ?? null,
    targetScope: packet.targetScope ?? null,
    maxRows: packet.maxRows ?? null
  },
  implementationControls: {
    supabaseClientImplementationAllowed: packet.supabaseClientImplementationAllowed === true,
    credentialPresenceCheckImplementationAllowed: packet.credentialPresenceCheckImplementationAllowed === true,
    boundedInsertImplementationAllowed: packet.boundedInsertImplementationAllowed === true
  },
  allowedFutureCodeScopes: packet.allowedFutureCodeScopes ?? [],
  forbiddenCurrentCodeScopes: packet.forbiddenCurrentCodeScopes ?? [],
  noExecutionState: {
    executeRequested: false,
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseWritesEnabled: false,
    dailyPricesMutated: false,
    candidateRowsAccepted: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  openScopeBlockers: packet.openScopeBlockers ?? [],
  currentRoute: "implementation_scope_packet_ready_but_implementation_blocked",
  nextIfCeoAcceptsPacket: packet.nextIfCeoAcceptsPacket ?? null,
  nextIfCeoRejectsPacket: packet.nextIfCeoRejectsPacket ?? null,
  upstream: {
    implementationReviewStatus: implementationReviewReport.status ?? null,
    implementationReviewOutcome: implementationReviewReport.outcome ?? null,
    implementationReviewGateKind: implementationReviewGate.gateKind ?? null
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePacket() {
  const expected = {
    packetKind: "twii_implementation_scope_packet",
    implementationReviewGatePath,
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    scopeMode: "implementation_scope_packet_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    implementationReviewGateAccepted: true,
    supabaseClientImplementationAllowed: false,
    credentialPresenceCheckImplementationAllowed: false,
    boundedInsertImplementationAllowed: false,
    implementationScopeDecision: "blocked_until_scope_packet_is_explicitly_authorized_after_all_controls_pass",
    executeRequested: false,
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    candidateRowsAccepted: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false,
    promotionAllowed: false,
    scoreSourceRealAllowed: false,
    nextIfCeoAcceptsPacket: "authorize_server_only_implementation_scaffold_without_execution",
    nextIfCeoRejectsPacket: "repair_implementation_scope_packet_or_previous_review_gate"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`packet.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(packet.packetId)) problems.push("packet.packetId is required");
  assertArray(
    packet.allowedFutureCodeScopes,
    [
      "server_only_module_boundary",
      "credential_presence_shape_only",
      "bounded_insert_missing_only_contract",
      "aggregate_readback_contract",
      "post_write_review_contract"
    ],
    "packet.allowedFutureCodeScopes"
  );
  assertArray(
    packet.forbiddenCurrentCodeScopes,
    [
      "supabase_client_import",
      "credential_value_read",
      "supabase_connection_attempt",
      "daily_prices_mutation",
      "raw_market_data_fetch",
      "row_payload_output",
      "stock_id_payload_output",
      "scoreSource_real_promotion"
    ],
    "packet.forbiddenCurrentCodeScopes"
  );
  if (!Array.isArray(packet.openScopeBlockers) || packet.openScopeBlockers.length < 10) {
    problems.push("packet.openScopeBlockers must list remaining blockers");
  }
  validateSafety(packet.safety ?? {});
}

function validateUpstream() {
  if (implementationReviewReport.status !== "twii_real_write_runner_implementation_review_gate_ready_no_execution") {
    problems.push("implementation review report status mismatch");
  }
  if (implementationReviewReport.outcome !== "real_write_runner_implementation_review_ready_implementation_still_blocked") {
    problems.push("implementation review report outcome mismatch");
  }
  if (implementationReviewGate.gateKind !== "twii_real_write_runner_implementation_review_gate") {
    problems.push("implementation review gate kind mismatch");
  }
  if (
    implementationReviewGate.nextIfCeoAcceptsGate !==
    "prepare_implementation_scope_packet_before_adding_supabase_client_or_bounded_insert_path"
  ) {
    problems.push("implementation review gate must route to implementation scope packet");
  }
  for (const key of [
    "attemptId",
    "targetTable",
    "targetLane",
    "targetScope",
    "maxRows",
    "requiredConfirmationPhrase",
    "executeSwitchName",
    "confirmationPhraseName"
  ]) {
    if (implementationReviewGate[key] !== packet[key]) problems.push(`packet.${key} must match implementation review gate`);
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("packet safety must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "credentialValuesRead",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety[key] !== false) problems.push(`packet.safety.${key} must be false`);
  }
}

function assertArray(actual, expected, label) {
  if (!Array.isArray(actual)) {
    problems.push(`${label} must be an array`);
    return;
  }
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    problems.push(`${label} mismatch`);
  }
}

function runJsonReport(scriptPath, label) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${label} report must exit 0`);
  return parseJson(run.stdout ?? "", `${label} stdout`);
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} must be JSON`);
    return {};
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function safeText(value) {
  return typeof value === "string" && /^[A-Za-z0-9_.:/ -]+$/.test(value);
}
