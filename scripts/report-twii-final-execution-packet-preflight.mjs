import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-final-execution-packet-preflight.json";
const sourceRollbackGatePath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const sourceRollbackReportPath = "scripts/report-twii-rollback-readiness-contract-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceRollbackGate = readJson(sourceRollbackGatePath);
const sourceRollbackReport = runJsonReport(sourceRollbackReportPath, "TWII rollback readiness contract preflight");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_final_execution_packet_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "final_execution_packet_ready_runtime_still_blocked" : "final_execution_packet_preflight_blocked",
  mode: "twii_final_execution_packet_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceRollbackGatePath,
  sourceRollbackReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  packetDecision: gate.packetDecision ?? null,
  packetMode: gate.packetMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  finalExecutionPacketState: {
    sourceRollbackGateAccepted: gate.sourceRollbackGateAccepted === true,
    finalExecutionPacketPrepared: gate.finalExecutionPacketPrepared === true,
    allPreExecutionContractsReferenced: gate.allPreExecutionContractsReferenced === true,
    executeSwitchRequirementPrepared: gate.executeSwitchRequirementPrepared === true,
    confirmationPhraseRequirementPrepared: gate.confirmationPhraseRequirementPrepared === true,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false
  },
  requirementNames: {
    requiredExecuteSwitchName: gate.requiredExecuteSwitchName ?? null,
    requiredConfirmationPhraseName: gate.requiredConfirmationPhraseName ?? null,
    requiredConfirmationPhraseReference: gate.requiredConfirmationPhraseReference ?? null,
    valuesOutput: false
  },
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  preExecutionContractPaths: gate.preExecutionContractPaths ?? [],
  finalExecutionPacket: gate.finalExecutionPacket ?? null,
  allowedFinalPacketFields: gate.allowedFinalPacketFields ?? [],
  disallowedFinalPacketFields: gate.disallowedFinalPacketFields ?? [],
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: {
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    candidateRowsAccepted: false,
    rowCoverageScoringAllowed: false,
    envValueOutput: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  currentRoute: "final_execution_packet_ready_but_runtime_blocked",
  nextIfPacketAccepted: gate.nextIfPacketAccepted ?? null,
  nextIfPacketRejected: gate.nextIfPacketRejected ?? null,
  upstream: {
    sourceRollbackStatus: sourceRollbackReport.status ?? null,
    sourceRollbackOutcome: sourceRollbackReport.outcome ?? null,
    sourceRollbackGateKind: sourceRollbackGate.gateKind ?? null
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    envValueOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_final_execution_packet_preflight",
    sourceRollbackGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    packetMode: "final_execution_packet_preflight_no_execution",
    sourceRollbackGateAccepted: true,
    finalExecutionPacketPrepared: true,
    allPreExecutionContractsReferenced: true,
    executeSwitchRequirementPrepared: true,
    confirmationPhraseRequirementPrepared: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false,
    packetDecision: "final_execution_packet_preflight_ready_but_runtime_execution_still_blocked",
    nextIfPacketAccepted: "operator_reviews_final_execution_packet_then_supplies_explicit_execute_switch_and_confirmation",
    nextIfPacketRejected: "repair_final_execution_packet_or_pre_execution_contract_chain",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  validateContractPaths(gate.preExecutionContractPaths ?? []);
  validateFinalExecutionPacket(gate.finalExecutionPacket ?? {});
  validateAllowedFields(gate.allowedFinalPacketFields ?? []);
  validateDisallowedFields(gate.disallowedFinalPacketFields ?? []);
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceRollbackReport.status !== "twii_rollback_readiness_contract_preflight_ready_no_execution") {
    problems.push("source rollback report status mismatch");
  }
  if (sourceRollbackReport.outcome !== "rollback_readiness_contract_ready_runtime_still_blocked") {
    problems.push("source rollback report outcome mismatch");
  }
  if (sourceRollbackGate.gateKind !== "twii_rollback_readiness_contract_preflight") {
    problems.push("source rollback gate kind mismatch");
  }
  if (
    sourceRollbackGate.nextIfContractAccepted !==
    "prepare_final_execution_packet_preflight_without_connecting_supabase"
  ) {
    problems.push("source rollback gate must route to final execution packet preflight");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceRollbackGate[key] !== gate[key]) problems.push(`gate.${key} must match source rollback gate`);
  }
}

function validateContractPaths(paths) {
  const expected = [
    "data/source-gates/twii-credential-presence-shape-checker.json",
    "data/source-gates/twii-execute-switch-confirmation-preflight.json",
    "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json",
    "data/source-gates/twii-aggregate-readback-contract-preflight.json",
    "data/source-gates/twii-post-run-review-contract-preflight.json",
    "data/source-gates/twii-rollback-readiness-contract-preflight.json"
  ];
  if (JSON.stringify(paths) !== JSON.stringify(expected)) problems.push("preExecutionContractPaths mismatch");
}

function validateFinalExecutionPacket(packet) {
  const expected = {
    operationKind: "future_final_execution_packet_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresCredentialPresenceGate: true,
    requiresExecuteSwitchConfirmationGate: true,
    requiresBoundedInsertContract: true,
    requiresAggregateReadbackContract: true,
    requiresPostRunReviewContract: true,
    requiresRollbackReadinessContract: true,
    requiresExplicitOperatorReview: true,
    allowEnvValueOutput: false,
    allowRowBodies: false,
    allowTradeDateLists: false,
    allowSourceValues: false,
    allowStockIdPayload: false,
    allowSecrets: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`finalExecutionPacket.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAllowedFields(fields) {
  const expected = [
    "attemptId",
    "targetScope",
    "targetTable",
    "targetLane",
    "maxRows",
    "candidateArtifactPath",
    "requiredExecuteSwitchName",
    "requiredConfirmationPhraseName",
    "requiredConfirmationPhraseReference",
    "preExecutionContractPaths",
    "finalExecutionAllowedNow",
    "implementationAllowedNow",
    "publicDataSource",
    "scoreSource"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("allowedFinalPacketFields mismatch");
}

function validateDisallowedFields(fields) {
  const expected = [
    "executeSwitchValue",
    "confirmationPhraseValue",
    "credentialValue",
    "secretValue",
    "rowBody",
    "tradeDateList",
    "marketValue",
    "sourcePayload",
    "rawPayload",
    "stockIdPayload",
    "personalizedAdvice",
    "buySellHoldSignal"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("disallowedFinalPacketFields mismatch");
}

function validatePromotionLocks(locks) {
  if (locks.promotionAllowed !== false) problems.push("promotionLocks.promotionAllowed must be false");
  if (locks.rowCoverageScoringAllowed !== false) problems.push("promotionLocks.rowCoverageScoringAllowed must be false");
  if (locks.publicDataSource !== "mock") problems.push("promotionLocks.publicDataSource must be mock");
  if (locks.scoreSource !== "mock") problems.push("promotionLocks.scoreSource must be mock");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("safety must stay publicDataSource=mock and scoreSource=mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "candidateArtifactRowsRead",
    "sourcePayloadRead",
    "rowPayloadRead",
    "rawPayloadRead",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "envValueOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety[key] !== false) problems.push(`safety.${key} must be false`);
  }
  if (safety.candidateArtifactReferenceOnly !== true) {
    problems.push("safety.candidateArtifactReferenceOnly must be true");
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
  if (run.status !== 0) problems.push(`${label} report exited ${run.status}`);
  return parseJson(run.stdout ?? "", `${label} stdout`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function safeText(value) {
  return typeof value === "string" && value.trim().length > 0;
}
