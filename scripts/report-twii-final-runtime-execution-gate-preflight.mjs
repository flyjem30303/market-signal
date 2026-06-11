import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-final-runtime-execution-gate-preflight.json";
const sourceExecutionReviewGatePath = "data/source-gates/twii-bounded-one-attempt-execution-review-preflight.json";
const sourceExecutionReviewReportPath = "scripts/report-twii-bounded-one-attempt-execution-review-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceExecutionReviewGate = readJson(sourceExecutionReviewGatePath);
const sourceExecutionReviewReport = runJsonReport(sourceExecutionReviewReportPath, "TWII bounded execution review preflight");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_final_runtime_execution_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "final_runtime_execution_gate_ready_execution_still_blocked" : "final_runtime_execution_gate_preflight_blocked",
  mode: "twii_final_runtime_execution_gate_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceExecutionReviewGatePath,
  sourceExecutionReviewReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  runtimeGateDecision: gate.runtimeGateDecision ?? null,
  runtimeGateMode: gate.runtimeGateMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  runtimeExecutionGateState: {
    runtimeExecutionGatePrepared: gate.runtimeExecutionGatePrepared === true,
    executionReviewReferenced: gate.executionReviewReferenced === true,
    serverOnlyBoundaryReferenced: gate.serverOnlyBoundaryReferenced === true,
    failClosedDefaultPrepared: gate.failClosedDefaultPrepared === true,
    postRunReviewRequirementReferenced: gate.postRunReviewRequirementReferenced === true,
    aggregateReadbackRequirementReferenced: gate.aggregateReadbackRequirementReferenced === true,
    rollbackRequirementReferenced: gate.rollbackRequirementReferenced === true,
    executeSwitchRequirementReferenced: gate.executeSwitchRequirementReferenced === true,
    confirmationPhraseRequirementReferenced: gate.confirmationPhraseRequirementReferenced === true,
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
  runtimeDecisionVocabulary: gate.runtimeDecisionVocabulary ?? [],
  requiredRuntimeArtifacts: gate.requiredRuntimeArtifacts ?? [],
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
  runtimeExecutionGatePacket: gate.runtimeExecutionGatePacket ?? null,
  allowedRuntimeGateFields: gate.allowedRuntimeGateFields ?? [],
  disallowedRuntimeGateFields: gate.disallowedRuntimeGateFields ?? [],
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  currentRoute: "final_runtime_gate_ready_but_runtime_execution_blocked",
  nextIfRuntimeGateAccepted: gate.nextIfRuntimeGateAccepted ?? null,
  nextIfRuntimeGateRejected: gate.nextIfRuntimeGateRejected ?? null,
  nextIfRuntimeGateExpired: gate.nextIfRuntimeGateExpired ?? null,
  upstream: {
    sourceExecutionReviewStatus: sourceExecutionReviewReport.status ?? null,
    sourceExecutionReviewOutcome: sourceExecutionReviewReport.outcome ?? null,
    sourceExecutionReviewGateKind: sourceExecutionReviewGate.gateKind ?? null
  },
  safety: safetyState(),
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_final_runtime_execution_gate_preflight",
    sourceExecutionReviewGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    runtimeGateMode: "final_runtime_execution_gate_preflight_fail_closed_no_execution",
    runtimeExecutionGatePrepared: true,
    executionReviewReferenced: true,
    serverOnlyBoundaryReferenced: true,
    failClosedDefaultPrepared: true,
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
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false,
    runtimeGateDecision: "final_runtime_execution_gate_ready_but_fail_closed_no_execution",
    nextIfRuntimeGateAccepted: "operator_may_authorize_exact_bounded_runtime_attempt_in_separate_explicit_step",
    nextIfRuntimeGateRejected: "repair_execution_review_or_runtime_gate",
    nextIfRuntimeGateExpired: "refresh_execution_review_authorization_intake_and_final_packet",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (JSON.stringify(gate.runtimeDecisionVocabulary) !== JSON.stringify(runtimeVocabulary())) {
    problems.push("runtimeDecisionVocabulary mismatch");
  }
  if (JSON.stringify(gate.requiredRuntimeArtifacts) !== JSON.stringify(runtimeArtifacts())) {
    problems.push("requiredRuntimeArtifacts mismatch");
  }
  validateRuntimeGatePacket(gate.runtimeExecutionGatePacket ?? {});
  validateAllowedFields(gate.allowedRuntimeGateFields ?? []);
  validateDisallowedFields(gate.disallowedRuntimeGateFields ?? []);
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceExecutionReviewReport.status !== "twii_bounded_one_attempt_execution_review_preflight_ready_no_execution") {
    problems.push("source execution review report status mismatch");
  }
  if (sourceExecutionReviewReport.outcome !== "bounded_one_attempt_execution_review_ready_execution_still_blocked") {
    problems.push("source execution review report outcome mismatch");
  }
  if (sourceExecutionReviewGate.gateKind !== "twii_bounded_one_attempt_execution_review_preflight") {
    problems.push("source execution review gate kind mismatch");
  }
  if (sourceExecutionReviewGate.nextIfReviewAccepted !== "prepare_final_runtime_execution_gate_without_connecting_supabase") {
    problems.push("source execution review gate must route to final runtime gate");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceExecutionReviewGate[key] !== gate[key]) problems.push(`gate.${key} must match source execution review gate`);
  }
}

function validateRuntimeGatePacket(packet) {
  const expected = {
    operationKind: "future_final_runtime_execution_gate_fail_closed_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresBoundedExecutionReviewPreflight: true,
    requiresExplicitOperatorDecision: true,
    requiresServerOnlyBoundary: true,
    requiresFailClosedDefault: true,
    requiresExecuteSwitchRequirement: true,
    requiresConfirmationPhraseRequirement: true,
    requiresPostRunReview: true,
    requiresAggregateReadback: true,
    requiresRollbackReadiness: true,
    allowsRunnerExecution: false,
    allowsSupabaseConnection: false,
    allowsAuthorizationValueRead: false,
    allowsEnvValueOutput: false,
    allowsRowBodies: false,
    allowsTradeDateLists: false,
    allowsSourceValues: false,
    allowsStockIdPayload: false,
    allowsSecrets: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`runtimeExecutionGatePacket.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAllowedFields(fields) {
  const expected = [
    "attemptId",
    "targetScope",
    "targetTable",
    "targetLane",
    "maxRows",
    "sourceExecutionReviewGatePath",
    "candidateArtifactPath",
    "requiredExecuteSwitchName",
    "requiredConfirmationPhraseName",
    "requiredConfirmationPhraseReference",
    "runtimeDecisionVocabulary",
    "requiredRuntimeArtifacts",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "publicDataSource",
    "scoreSource"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("allowedRuntimeGateFields mismatch");
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
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("disallowedRuntimeGateFields mismatch");
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

function runtimeVocabulary() {
  return ["ready_for_final_operator_review", "rejected", "repair_required", "expired_or_not_current"];
}

function runtimeArtifacts() {
  return ["server_only_boundary", "fail_closed_default", "post_run_review", "aggregate_readback", "rollback_readiness", "promotion_lock"];
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
