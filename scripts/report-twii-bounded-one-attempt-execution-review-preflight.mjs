import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-bounded-one-attempt-execution-review-preflight.json";
const sourceAuthorizationIntakeGatePath = "data/source-gates/twii-one-attempt-authorization-intake-preflight.json";
const sourceAuthorizationIntakeReportPath = "scripts/report-twii-one-attempt-authorization-intake-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceAuthorizationIntakeGate = readJson(sourceAuthorizationIntakeGatePath);
const sourceAuthorizationIntakeReport = runJsonReport(
  sourceAuthorizationIntakeReportPath,
  "TWII one-attempt authorization intake preflight"
);
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_bounded_one_attempt_execution_review_preflight_ready_no_execution" : "blocked",
  outcome: ok
    ? "bounded_one_attempt_execution_review_ready_execution_still_blocked"
    : "bounded_one_attempt_execution_review_preflight_blocked",
  mode: "twii_bounded_one_attempt_execution_review_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceAuthorizationIntakeGatePath,
  sourceAuthorizationIntakeReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  reviewDecision: gate.reviewDecision ?? null,
  reviewMode: gate.reviewMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  executionReviewState: {
    authorizationIntakeReferenced: gate.authorizationIntakeReferenced === true,
    executionReviewPrepared: gate.executionReviewPrepared === true,
    boundedAttemptScopePrepared: gate.boundedAttemptScopePrepared === true,
    postRunReviewRequirementReferenced: gate.postRunReviewRequirementReferenced === true,
    aggregateReadbackRequirementReferenced: gate.aggregateReadbackRequirementReferenced === true,
    rollbackRequirementReferenced: gate.rollbackRequirementReferenced === true,
    executeSwitchRequirementReferenced: gate.executeSwitchRequirementReferenced === true,
    confirmationPhraseRequirementReferenced: gate.confirmationPhraseRequirementReferenced === true,
    authorizationAcceptedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  requirementNames: {
    requiredExecuteSwitchName: gate.requiredExecuteSwitchName ?? null,
    requiredConfirmationPhraseName: gate.requiredConfirmationPhraseName ?? null,
    requiredConfirmationPhraseReference: gate.requiredConfirmationPhraseReference ?? null,
    valuesOutput: false
  },
  reviewDecisionVocabulary: gate.reviewDecisionVocabulary ?? [],
  requiredPostRunArtifacts: gate.requiredPostRunArtifacts ?? [],
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
  executionReviewPacket: gate.executionReviewPacket ?? null,
  allowedExecutionReviewFields: gate.allowedExecutionReviewFields ?? [],
  disallowedExecutionReviewFields: gate.disallowedExecutionReviewFields ?? [],
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  currentRoute: "bounded_execution_review_ready_but_runtime_execution_blocked",
  nextIfReviewAccepted: gate.nextIfReviewAccepted ?? null,
  nextIfReviewRejected: gate.nextIfReviewRejected ?? null,
  nextIfReviewExpired: gate.nextIfReviewExpired ?? null,
  upstream: {
    sourceAuthorizationIntakeStatus: sourceAuthorizationIntakeReport.status ?? null,
    sourceAuthorizationIntakeOutcome: sourceAuthorizationIntakeReport.outcome ?? null,
    sourceAuthorizationIntakeGateKind: sourceAuthorizationIntakeGate.gateKind ?? null
  },
  safety: safetyState(),
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_bounded_one_attempt_execution_review_preflight",
    sourceAuthorizationIntakeGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    reviewMode: "bounded_one_attempt_execution_review_preflight_no_execution",
    authorizationIntakeReferenced: true,
    executionReviewPrepared: true,
    boundedAttemptScopePrepared: true,
    postRunReviewRequirementReferenced: true,
    aggregateReadbackRequirementReferenced: true,
    rollbackRequirementReferenced: true,
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
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false,
    reviewDecision: "bounded_execution_review_ready_but_operator_execution_still_blocked",
    nextIfReviewAccepted: "prepare_final_runtime_execution_gate_without_connecting_supabase",
    nextIfReviewRejected: "repair_authorization_intake_or_execution_review",
    nextIfReviewExpired: "refresh_authorization_intake_and_final_packet_before_any_execution",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (JSON.stringify(gate.reviewDecisionVocabulary) !== JSON.stringify(reviewVocabulary())) {
    problems.push("reviewDecisionVocabulary mismatch");
  }
  if (JSON.stringify(gate.requiredPostRunArtifacts) !== JSON.stringify(postRunArtifacts())) {
    problems.push("requiredPostRunArtifacts mismatch");
  }
  validateExecutionReviewPacket(gate.executionReviewPacket ?? {});
  validateAllowedFields(gate.allowedExecutionReviewFields ?? []);
  validateDisallowedFields(gate.disallowedExecutionReviewFields ?? []);
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceAuthorizationIntakeReport.status !== "twii_one_attempt_authorization_intake_preflight_ready_no_execution") {
    problems.push("source authorization intake report status mismatch");
  }
  if (sourceAuthorizationIntakeReport.outcome !== "one_attempt_authorization_intake_ready_execution_still_blocked") {
    problems.push("source authorization intake report outcome mismatch");
  }
  if (sourceAuthorizationIntakeGate.gateKind !== "twii_one_attempt_authorization_intake_preflight") {
    problems.push("source authorization intake gate kind mismatch");
  }
  if (
    sourceAuthorizationIntakeGate.nextIfAuthorizationAccepted !==
    "prepare_bounded_one_attempt_execution_review_without_connecting_supabase"
  ) {
    problems.push("source authorization intake gate must route to bounded execution review");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceAuthorizationIntakeGate[key] !== gate[key]) {
      problems.push(`gate.${key} must match source authorization intake gate`);
    }
  }
}

function validateExecutionReviewPacket(packet) {
  const expected = {
    operationKind: "future_bounded_one_attempt_execution_review_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresAuthorizationIntakePreflight: true,
    requiresExplicitOperatorDecision: true,
    requiresExecuteSwitchRequirement: true,
    requiresConfirmationPhraseRequirement: true,
    requiresPostRunReview: true,
    requiresAggregateReadback: true,
    requiresRollbackReadiness: true,
    allowsRunnerExecution: false,
    allowsAuthorizationValueRead: false,
    allowsEnvValueOutput: false,
    allowsRowBodies: false,
    allowsTradeDateLists: false,
    allowsSourceValues: false,
    allowsStockIdPayload: false,
    allowsSecrets: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`executionReviewPacket.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAllowedFields(fields) {
  const expected = [
    "attemptId",
    "targetScope",
    "targetTable",
    "targetLane",
    "maxRows",
    "sourceAuthorizationIntakeGatePath",
    "candidateArtifactPath",
    "requiredExecuteSwitchName",
    "requiredConfirmationPhraseName",
    "requiredConfirmationPhraseReference",
    "reviewDecisionVocabulary",
    "requiredPostRunArtifacts",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "publicDataSource",
    "scoreSource"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("allowedExecutionReviewFields mismatch");
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
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("disallowedExecutionReviewFields mismatch");
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
  for (const key of Object.keys(safetyState()).filter((key) => !["publicDataSource", "scoreSource", "candidateArtifactReferenceOnly"].includes(key))) {
    if (safety[key] !== false) problems.push(`safety.${key} must be false`);
  }
}

function noExecutionState() {
  return {
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
  };
}

function safetyState() {
  return {
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
  };
}

function reviewVocabulary() {
  return ["ready_for_operator_review", "rejected", "repair_required", "expired_or_not_current"];
}

function postRunArtifacts() {
  return ["aggregate_mutation_summary", "aggregate_readback_summary", "rollback_readiness_summary", "promotion_lock_summary"];
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
