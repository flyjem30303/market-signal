import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const sourcePostRunReviewGatePath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const sourcePostRunReviewReportPath = "scripts/report-twii-post-run-review-contract-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourcePostRunReviewGate = readJson(sourcePostRunReviewGatePath);
const sourcePostRunReviewReport = runJsonReport(
  sourcePostRunReviewReportPath,
  "TWII post-run review contract preflight"
);
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_rollback_readiness_contract_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "rollback_readiness_contract_ready_runtime_still_blocked" : "rollback_readiness_contract_preflight_blocked",
  mode: "twii_rollback_readiness_contract_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourcePostRunReviewGatePath,
  sourcePostRunReviewReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  contractDecision: gate.contractDecision ?? null,
  contractMode: gate.contractMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  rollbackReadinessContractState: {
    sourcePostRunReviewGateAccepted: gate.sourcePostRunReviewGateAccepted === true,
    rollbackReadinessContractPrepared: gate.rollbackReadinessContractPrepared === true,
    rollbackScopeLockPrepared: gate.rollbackScopeLockPrepared === true,
    rollbackSummaryAggregateOnly: gate.rollbackSummaryAggregateOnly === true,
    rollbackStateVocabularyPrepared: gate.rollbackStateVocabularyPrepared === true,
    postRunReviewDependencyPrepared: gate.postRunReviewDependencyPrepared === true,
    promotionLocksPrepared: gate.promotionLocksPrepared === true,
    rollbackExecutionAllowedNow: false
  },
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  allowedRollbackStates: gate.allowedRollbackStates ?? [],
  rollbackReadinessContract: gate.rollbackReadinessContract ?? null,
  allowedRollbackReadinessFields: gate.allowedRollbackReadinessFields ?? [],
  disallowedRollbackReadinessFields: gate.disallowedRollbackReadinessFields ?? [],
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
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  currentRoute: "rollback_readiness_contract_ready_but_runtime_blocked",
  nextIfContractAccepted: gate.nextIfContractAccepted ?? null,
  nextIfContractRejected: gate.nextIfContractRejected ?? null,
  upstream: {
    sourcePostRunReviewStatus: sourcePostRunReviewReport.status ?? null,
    sourcePostRunReviewOutcome: sourcePostRunReviewReport.outcome ?? null,
    sourcePostRunReviewGateKind: sourcePostRunReviewGate.gateKind ?? null
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
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_rollback_readiness_contract_preflight",
    sourcePostRunReviewGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    contractMode: "rollback_readiness_contract_no_execution",
    sourcePostRunReviewGateAccepted: true,
    rollbackReadinessContractPrepared: true,
    rollbackScopeLockPrepared: true,
    rollbackSummaryAggregateOnly: true,
    rollbackStateVocabularyPrepared: true,
    postRunReviewDependencyPrepared: true,
    promotionLocksPrepared: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    rollbackExecutionAllowedNow: false,
    contractDecision: "rollback_readiness_contract_ready_but_runtime_execution_still_blocked",
    nextIfContractAccepted: "prepare_final_execution_packet_preflight_without_connecting_supabase",
    nextIfContractRejected: "repair_rollback_readiness_or_post_run_review_contract"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  validateRollbackStates(gate.allowedRollbackStates ?? []);
  validateRollbackContract(gate.rollbackReadinessContract ?? {});
  validateAllowedFields(gate.allowedRollbackReadinessFields ?? []);
  validateDisallowedFields(gate.disallowedRollbackReadinessFields ?? []);
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourcePostRunReviewReport.status !== "twii_post_run_review_contract_preflight_ready_no_execution") {
    problems.push("source post-run review report status mismatch");
  }
  if (sourcePostRunReviewReport.outcome !== "post_run_review_contract_ready_runtime_still_blocked") {
    problems.push("source post-run review report outcome mismatch");
  }
  if (sourcePostRunReviewGate.gateKind !== "twii_post_run_review_contract_preflight") {
    problems.push("source post-run review gate kind mismatch");
  }
  if (
    sourcePostRunReviewGate.nextIfContractAccepted !==
    "prepare_rollback_readiness_contract_preflight_without_connecting_supabase"
  ) {
    problems.push("source post-run review gate must route to rollback readiness contract preflight");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourcePostRunReviewGate[key] !== gate[key]) problems.push(`gate.${key} must match source post-run review gate`);
  }
}

function validateRollbackStates(states) {
  const expected = ["ready", "not_required", "blocked", "failed_closed", "not_executed"];
  if (JSON.stringify(states) !== JSON.stringify(expected)) problems.push("allowedRollbackStates mismatch");
}

function validateRollbackContract(contract) {
  const expected = {
    operationKind: "future_rollback_readiness_aggregate_only",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresPostRunReviewOutcome: true,
    requiresScopeLock: true,
    requiresRollbackState: true,
    requiresRollbackSummary: true,
    requiresPromotionLocks: true,
    allowRowBodies: false,
    allowTradeDateLists: false,
    allowSourceValues: false,
    allowStockIdPayload: false,
    allowSecrets: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (contract[key] !== value) problems.push(`rollbackReadinessContract.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAllowedFields(fields) {
  const expected = [
    "attemptId",
    "reviewOutcome",
    "rollbackState",
    "targetScope",
    "targetTable",
    "targetLane",
    "maxRows",
    "candidateRows",
    "attemptedRows",
    "insertedRows",
    "rollbackEligibleRows",
    "rollbackBlockedRows",
    "duplicateRows",
    "rejectedRows",
    "readbackRows",
    "sanitizedErrorCategory",
    "promotionAllowed",
    "rowCoverageScoringAllowed",
    "publicDataSource",
    "scoreSource"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("allowedRollbackReadinessFields mismatch");
}

function validateDisallowedFields(fields) {
  const expected = [
    "rowBody",
    "tradeDateList",
    "marketValue",
    "sourcePayload",
    "rawPayload",
    "stockIdPayload",
    "secretValue",
    "credentialValue",
    "personalizedAdvice",
    "buySellHoldSignal"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("disallowedRollbackReadinessFields mismatch");
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
