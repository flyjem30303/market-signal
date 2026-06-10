import fs from "node:fs";
import { spawnSync } from "node:child_process";
import {
  describeTwiiServerOnlyImplementationScaffold,
  prepareAggregateReadbackContract,
  prepareBoundedInsertMissingOnlyContract,
  prepareCredentialPresenceShape,
  preparePostWriteReviewContract
} from "./lib/twii-server-only-implementation-scaffold.mjs";

const scaffoldPath = "data/source-gates/twii-server-only-implementation-scaffold.json";
const sourceScopePacketPath = "data/source-gates/twii-implementation-scope-packet.json";
const sourceScopePacketReportPath = "scripts/report-twii-implementation-scope-packet.mjs";
const problems = [];

const scaffold = readJson(scaffoldPath);
const sourceScopePacket = readJson(sourceScopePacketPath);
const sourceScopePacketReport = runJsonReport(sourceScopePacketReportPath, "TWII implementation scope packet");
const moduleSummary = describeTwiiServerOnlyImplementationScaffold();
const credentialPresenceShape = prepareCredentialPresenceShape();
const boundedInsertContract = prepareBoundedInsertMissingOnlyContract();
const aggregateReadbackContract = prepareAggregateReadbackContract();
const postWriteReviewContract = preparePostWriteReviewContract();

validateScaffold();
validateModuleSummary();
validatePreparedContracts();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_server_only_implementation_scaffold_ready_no_execution" : "blocked",
  outcome: ok
    ? "server_only_implementation_scaffold_ready_runtime_still_blocked"
    : "server_only_implementation_scaffold_blocked",
  mode: "twii_server_only_implementation_scaffold_no_execution",
  owner: "CEO/PM",
  scaffoldPath,
  sourceScopePacketPath,
  sourceScopePacketReportPath,
  modulePath: scaffold.modulePath ?? null,
  sourceScopePacketAccepted: scaffold.sourceScopePacketAccepted === true,
  scaffoldDecision: scaffold.scaffoldDecision ?? null,
  scaffoldMode: scaffold.scaffoldMode ?? null,
  attemptId: scaffold.attemptId ?? null,
  requiredConfirmationPhrase: scaffold.requiredConfirmationPhrase ?? null,
  executeSwitchName: scaffold.executeSwitchName ?? null,
  confirmationPhraseName: scaffold.confirmationPhraseName ?? null,
  target: {
    targetTable: scaffold.targetTable ?? null,
    targetLane: scaffold.targetLane ?? null,
    targetScope: scaffold.targetScope ?? null,
    maxRows: scaffold.maxRows ?? null
  },
  preparedContracts: {
    serverOnlyModuleBoundaryPrepared: scaffold.serverOnlyModuleBoundaryPrepared === true,
    credentialPresenceShapePrepared: scaffold.credentialPresenceShapePrepared === true,
    boundedInsertMissingOnlyContractPrepared: scaffold.boundedInsertMissingOnlyContractPrepared === true,
    aggregateReadbackContractPrepared: scaffold.aggregateReadbackContractPrepared === true,
    postWriteReviewContractPrepared: scaffold.postWriteReviewContractPrepared === true
  },
  allowedPreparedContracts: scaffold.allowedPreparedContracts ?? [],
  blockedRuntimeActions: scaffold.blockedRuntimeActions ?? [],
  contractShapes: {
    credentialPresenceShape,
    boundedInsertContract,
    aggregateReadbackContract,
    postWriteReviewContract
  },
  noExecutionState: moduleSummary.noExecutionState,
  openScaffoldBlockers: scaffold.openScaffoldBlockers ?? [],
  currentRoute: "server_only_implementation_scaffold_ready_but_runtime_blocked",
  nextIfCeoAcceptsScaffold: scaffold.nextIfCeoAcceptsScaffold ?? null,
  nextIfCeoRejectsScaffold: scaffold.nextIfCeoRejectsScaffold ?? null,
  upstream: {
    scopePacketStatus: sourceScopePacketReport.status ?? null,
    scopePacketOutcome: sourceScopePacketReport.outcome ?? null,
    scopePacketKind: sourceScopePacket.packetKind ?? null
  },
  safety: moduleSummary.safety,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateScaffold() {
  const expected = {
    scaffoldKind: "twii_server_only_implementation_scaffold",
    sourceScopePacketPath,
    modulePath: "scripts/lib/twii-server-only-implementation-scaffold.mjs",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    scaffoldMode: "server_only_implementation_scaffold_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    sourceScopePacketAccepted: true,
    serverOnlyModuleBoundaryPrepared: true,
    credentialPresenceShapePrepared: true,
    boundedInsertMissingOnlyContractPrepared: true,
    aggregateReadbackContractPrepared: true,
    postWriteReviewContractPrepared: true,
    scaffoldDecision: "prepared_server_only_contracts_but_runtime_implementation_still_blocked",
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
    credentialValuesRead: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false,
    promotionAllowed: false,
    scoreSourceRealAllowed: false,
    nextIfCeoAcceptsScaffold: "authorize_credential_presence_shape_checker_without_reading_secret_values",
    nextIfCeoRejectsScaffold: "repair_server_only_implementation_scaffold_or_scope_packet"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (scaffold[key] !== value) problems.push(`scaffold.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(scaffold.scaffoldId)) problems.push("scaffold.scaffoldId is required");
  assertArray(scaffold.allowedPreparedContracts, expectedContracts(), "scaffold.allowedPreparedContracts");
  assertArray(scaffold.blockedRuntimeActions, expectedBlockedRuntimeActions(), "scaffold.blockedRuntimeActions");
  if (!Array.isArray(scaffold.openScaffoldBlockers) || scaffold.openScaffoldBlockers.length < 10) {
    problems.push("scaffold.openScaffoldBlockers must list remaining blockers");
  }
  validateSafety(scaffold.safety ?? {});
}

function validateModuleSummary() {
  if (moduleSummary.status !== "twii_server_only_implementation_scaffold_ready_no_execution") {
    problems.push("moduleSummary.status mismatch");
  }
  if (moduleSummary.outcome !== "server_only_implementation_scaffold_ready_runtime_still_blocked") {
    problems.push("moduleSummary.outcome mismatch");
  }
  assertArray(moduleSummary.contractNames, expectedContracts(), "moduleSummary.contractNames");
  assertArray(moduleSummary.blockedActions, expectedBlockedRuntimeActions(), "moduleSummary.blockedActions");
  validateNoExecutionState(moduleSummary.noExecutionState ?? {});
  validateSafety(moduleSummary.safety ?? {});
}

function validatePreparedContracts() {
  if (credentialPresenceShape.contract !== "credential_presence_shape_only") {
    problems.push("credential presence shape contract mismatch");
  }
  if (credentialPresenceShape.valueReadAllowed !== false) {
    problems.push("credential presence shape must not allow value reads");
  }
  if (boundedInsertContract.executableNow !== false || boundedInsertContract.mutationAllowedNow !== false) {
    problems.push("bounded insert contract must remain non-executable");
  }
  if (aggregateReadbackContract.outputMode !== "aggregate_counts_only") {
    problems.push("aggregate readback contract must stay aggregate-only");
  }
  if (postWriteReviewContract.executableNow !== false) {
    problems.push("post-write review contract must remain non-executable");
  }
}

function validateUpstream() {
  if (sourceScopePacketReport.status !== "twii_implementation_scope_packet_ready_no_execution") {
    problems.push("source scope packet report status mismatch");
  }
  if (sourceScopePacketReport.outcome !== "implementation_scope_packet_ready_implementation_still_blocked") {
    problems.push("source scope packet report outcome mismatch");
  }
  if (sourceScopePacket.packetKind !== "twii_implementation_scope_packet") {
    problems.push("source scope packet kind mismatch");
  }
  if (sourceScopePacket.nextIfCeoAcceptsPacket !== "authorize_server_only_implementation_scaffold_without_execution") {
    problems.push("source scope packet must route to server-only scaffold");
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
    if (sourceScopePacket[key] !== scaffold[key]) problems.push(`scaffold.${key} must match source scope packet`);
  }
}

function validateNoExecutionState(state) {
  for (const key of [
    "executeRequested",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseWritesEnabled",
    "credentialValuesRead",
    "dailyPricesMutated",
    "candidateRowsAccepted",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow"
  ]) {
    if (state[key] !== false) problems.push(`noExecutionState.${key} must be false`);
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("scaffold safety must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`scaffold.safety.${key} must be false`);
  }
}

function expectedContracts() {
  return [
    "server_only_module_boundary",
    "credential_presence_shape_only",
    "bounded_insert_missing_only_contract",
    "aggregate_readback_contract",
    "post_write_review_contract"
  ];
}

function expectedBlockedRuntimeActions() {
  return [
    "supabase_client_import",
    "credential_value_read",
    "supabase_connection_attempt",
    "daily_prices_mutation",
    "raw_market_data_fetch",
    "row_payload_output",
    "stock_id_payload_output",
    "scoreSource_real_promotion"
  ];
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
