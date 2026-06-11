import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-one-attempt-authorization-intake-preflight.json";
const sourceFinalPacketGatePath = "data/source-gates/twii-final-execution-packet-preflight.json";
const sourceFinalPacketReportPath = "scripts/report-twii-final-execution-packet-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceFinalPacketGate = readJson(sourceFinalPacketGatePath);
const sourceFinalPacketReport = runJsonReport(sourceFinalPacketReportPath, "TWII final execution packet preflight");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_one_attempt_authorization_intake_preflight_ready_no_execution" : "blocked",
  outcome: ok
    ? "one_attempt_authorization_intake_ready_execution_still_blocked"
    : "one_attempt_authorization_intake_preflight_blocked",
  mode: "twii_one_attempt_authorization_intake_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceFinalPacketGatePath,
  sourceFinalPacketReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  intakeDecision: gate.intakeDecision ?? null,
  intakeMode: gate.intakeMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  authorizationIntakeState: {
    finalPacketReferenced: gate.finalPacketReferenced === true,
    authorizationIntakePrepared: gate.authorizationIntakePrepared === true,
    operatorDecisionVocabularyPrepared: gate.operatorDecisionVocabularyPrepared === true,
    executeSwitchRequirementReferenced: gate.executeSwitchRequirementReferenced === true,
    confirmationPhraseRequirementReferenced: gate.confirmationPhraseRequirementReferenced === true,
    authorizationAcceptedNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false
  },
  requirementNames: {
    requiredExecuteSwitchName: gate.requiredExecuteSwitchName ?? null,
    requiredConfirmationPhraseName: gate.requiredConfirmationPhraseName ?? null,
    requiredConfirmationPhraseReference: gate.requiredConfirmationPhraseReference ?? null,
    valuesOutput: false
  },
  operatorDecisionVocabulary: gate.operatorDecisionVocabulary ?? [],
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  authorizationValuesState: {
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    envValueOutput: false
  },
  authorizationIntakePacket: gate.authorizationIntakePacket ?? null,
  allowedAuthorizationIntakeFields: gate.allowedAuthorizationIntakeFields ?? [],
  disallowedAuthorizationIntakeFields: gate.disallowedAuthorizationIntakeFields ?? [],
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
  currentRoute: "authorization_intake_ready_but_runtime_execution_blocked",
  nextIfAuthorizationAccepted: gate.nextIfAuthorizationAccepted ?? null,
  nextIfAuthorizationRejected: gate.nextIfAuthorizationRejected ?? null,
  nextIfAuthorizationExpired: gate.nextIfAuthorizationExpired ?? null,
  upstream: {
    sourceFinalPacketStatus: sourceFinalPacketReport.status ?? null,
    sourceFinalPacketOutcome: sourceFinalPacketReport.outcome ?? null,
    sourceFinalPacketGateKind: sourceFinalPacketGate.gateKind ?? null
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
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
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
    gateKind: "twii_one_attempt_authorization_intake_preflight",
    sourceFinalPacketGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    intakeMode: "one_attempt_authorization_intake_preflight_no_execution",
    finalPacketReferenced: true,
    authorizationIntakePrepared: true,
    operatorDecisionVocabularyPrepared: true,
    executeSwitchRequirementReferenced: true,
    confirmationPhraseRequirementReferenced: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    authorizationAcceptedNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false,
    intakeDecision: "authorization_intake_ready_but_no_operator_decision_accepted",
    nextIfAuthorizationAccepted: "prepare_bounded_one_attempt_execution_review_without_connecting_supabase",
    nextIfAuthorizationRejected: "repair_final_execution_packet_or_authorization_intake",
    nextIfAuthorizationExpired: "refresh_final_execution_packet_preflight_before_any_execution",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  validateDecisionVocabulary(gate.operatorDecisionVocabulary ?? []);
  validateAuthorizationIntakePacket(gate.authorizationIntakePacket ?? {});
  validateAllowedFields(gate.allowedAuthorizationIntakeFields ?? []);
  validateDisallowedFields(gate.disallowedAuthorizationIntakeFields ?? []);
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceFinalPacketReport.status !== "twii_final_execution_packet_preflight_ready_no_execution") {
    problems.push("source final packet report status mismatch");
  }
  if (sourceFinalPacketReport.outcome !== "final_execution_packet_ready_runtime_still_blocked") {
    problems.push("source final packet report outcome mismatch");
  }
  if (sourceFinalPacketGate.gateKind !== "twii_final_execution_packet_preflight") {
    problems.push("source final packet gate kind mismatch");
  }
  if (
    sourceFinalPacketGate.nextIfPacketAccepted !==
    "operator_reviews_final_execution_packet_then_supplies_explicit_execute_switch_and_confirmation"
  ) {
    problems.push("source final packet gate must route to authorization intake");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceFinalPacketGate[key] !== gate[key]) problems.push(`gate.${key} must match source final packet gate`);
  }
}

function validateDecisionVocabulary(vocabulary) {
  const expected = ["accepted", "rejected", "repair_required", "expired_or_not_current"];
  if (JSON.stringify(vocabulary) !== JSON.stringify(expected)) problems.push("operatorDecisionVocabulary mismatch");
}

function validateAuthorizationIntakePacket(packet) {
  const expected = {
    operationKind: "future_one_attempt_authorization_intake_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresFinalExecutionPacketPreflight: true,
    requiresExplicitOperatorDecision: true,
    requiresExecuteSwitchRequirement: true,
    requiresConfirmationPhraseRequirement: true,
    allowsAuthorizationValueRead: false,
    allowsEnvValueOutput: false,
    allowsRowBodies: false,
    allowsTradeDateLists: false,
    allowsSourceValues: false,
    allowsStockIdPayload: false,
    allowsSecrets: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`authorizationIntakePacket.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAllowedFields(fields) {
  const expected = [
    "attemptId",
    "targetScope",
    "targetTable",
    "targetLane",
    "maxRows",
    "sourceFinalPacketGatePath",
    "candidateArtifactPath",
    "requiredExecuteSwitchName",
    "requiredConfirmationPhraseName",
    "requiredConfirmationPhraseReference",
    "operatorDecisionVocabulary",
    "authorizationAcceptedNow",
    "finalExecutionAllowedNow",
    "implementationAllowedNow",
    "publicDataSource",
    "scoreSource"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("allowedAuthorizationIntakeFields mismatch");
}

function validateDisallowedFields(fields) {
  const expected = [
    "executeSwitchValue",
    "confirmationPhraseValue",
    "credentialValue",
    "secretValue",
    "authorizationValue",
    "rowBody",
    "tradeDateList",
    "marketValue",
    "sourcePayload",
    "rawPayload",
    "stockIdPayload",
    "personalizedAdvice",
    "buySellHoldSignal"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("disallowedAuthorizationIntakeFields mismatch");
}

function validatePromotionLocks(locks) {
  if (locks.promotionAllowed !== false) problems.push("promotionLocks.promotionAllowed must be false");
  if (locks.rowCoverageScoringAllowed !== false) problems.push("promotionLocks.rowCoverageScoringAllowed must be false");
  if (locks.publicDataSource !== "mock") problems.push("promotionLocks.publicDataSource must be mock");
  if (locks.scoreSource !== "mock") problems.push("promotionLocks.scoreSource must be mock");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  if (safety.candidateArtifactReferenceOnly !== true) problems.push("safety.candidateArtifactReferenceOnly must be true");
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
    "authorizationValuesRead",
    "executeSwitchValueRead",
    "confirmationPhraseValueRead",
    "credentialValuesRead",
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
}

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (error) {
    problems.push(`cannot read JSON ${path}: ${error.message}`);
    return {};
  }
}

function runJsonReport(path, label) {
  const result = spawnSync(process.execPath, [path], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (result.status !== 0) {
    problems.push(`${label} exited ${result.status}`);
    return {};
  }
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    problems.push(`${label} did not emit JSON: ${error.message}`);
    return {};
  }
}

function safeText(value) {
  return typeof value === "string" && value.length > 0;
}
