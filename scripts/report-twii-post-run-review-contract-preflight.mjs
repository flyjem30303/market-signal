import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const sourceReadbackGatePath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const sourceReadbackReportPath = "scripts/report-twii-aggregate-readback-contract-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceReadbackGate = readJson(sourceReadbackGatePath);
const sourceReadbackReport = runJsonReport(sourceReadbackReportPath, "TWII aggregate readback contract preflight");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_post_run_review_contract_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "post_run_review_contract_ready_runtime_still_blocked" : "post_run_review_contract_preflight_blocked",
  mode: "twii_post_run_review_contract_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceReadbackGatePath,
  sourceReadbackReportPath,
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
  postRunReviewContractState: {
    sourceReadbackGateAccepted: gate.sourceReadbackGateAccepted === true,
    postRunReviewContractPrepared: gate.postRunReviewContractPrepared === true,
    reviewOutcomeVocabularyPrepared: gate.reviewOutcomeVocabularyPrepared === true,
    mutationSummaryAggregateOnly: gate.mutationSummaryAggregateOnly === true,
    readbackSummaryAggregateOnly: gate.readbackSummaryAggregateOnly === true,
    rollbackReadinessSummaryPrepared: gate.rollbackReadinessSummaryPrepared === true,
    promotionLocksPrepared: gate.promotionLocksPrepared === true,
    postRunReviewExecutionAllowedNow: false
  },
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  allowedReviewOutcomes: gate.allowedReviewOutcomes ?? [],
  postRunReviewContract: gate.postRunReviewContract ?? null,
  allowedPostRunReviewFields: gate.allowedPostRunReviewFields ?? [],
  disallowedPostRunReviewFields: gate.disallowedPostRunReviewFields ?? [],
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
  currentRoute: "post_run_review_contract_ready_but_runtime_blocked",
  nextIfContractAccepted: gate.nextIfContractAccepted ?? null,
  nextIfContractRejected: gate.nextIfContractRejected ?? null,
  upstream: {
    sourceReadbackStatus: sourceReadbackReport.status ?? null,
    sourceReadbackOutcome: sourceReadbackReport.outcome ?? null,
    sourceReadbackGateKind: sourceReadbackGate.gateKind ?? null
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
    gateKind: "twii_post_run_review_contract_preflight",
    sourceReadbackGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    contractMode: "post_run_review_contract_no_execution",
    sourceReadbackGateAccepted: true,
    postRunReviewContractPrepared: true,
    reviewOutcomeVocabularyPrepared: true,
    mutationSummaryAggregateOnly: true,
    readbackSummaryAggregateOnly: true,
    rollbackReadinessSummaryPrepared: true,
    promotionLocksPrepared: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    postRunReviewExecutionAllowedNow: false,
    contractDecision: "post_run_review_contract_ready_but_runtime_execution_still_blocked",
    nextIfContractAccepted: "prepare_rollback_readiness_contract_preflight_without_connecting_supabase",
    nextIfContractRejected: "repair_post_run_review_or_aggregate_readback_contract"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  validateReviewOutcomes(gate.allowedReviewOutcomes ?? []);
  validatePostRunReviewContract(gate.postRunReviewContract ?? {});
  validateAllowedFields(gate.allowedPostRunReviewFields ?? []);
  validateDisallowedFields(gate.disallowedPostRunReviewFields ?? []);
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceReadbackReport.status !== "twii_aggregate_readback_contract_preflight_ready_no_execution") {
    problems.push("source readback report status mismatch");
  }
  if (sourceReadbackReport.outcome !== "aggregate_readback_contract_ready_runtime_still_blocked") {
    problems.push("source readback report outcome mismatch");
  }
  if (sourceReadbackGate.gateKind !== "twii_aggregate_readback_contract_preflight") {
    problems.push("source readback gate kind mismatch");
  }
  if (
    sourceReadbackGate.nextIfContractAccepted !==
    "prepare_post_run_review_contract_preflight_without_connecting_supabase"
  ) {
    problems.push("source readback gate must route to post-run review contract preflight");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceReadbackGate[key] !== gate[key]) problems.push(`gate.${key} must match source readback gate`);
  }
}

function validateReviewOutcomes(outcomes) {
  const expected = ["accepted", "rejected", "blocked", "failed_closed", "not_executed"];
  if (JSON.stringify(outcomes) !== JSON.stringify(expected)) problems.push("allowedReviewOutcomes mismatch");
}

function validatePostRunReviewContract(contract) {
  const expected = {
    operationKind: "future_post_run_review_aggregate_only",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresReviewOutcome: true,
    requiresMutationSummary: true,
    requiresReadbackSummary: true,
    requiresRollbackReadinessSummary: true,
    requiresPromotionLocks: true,
    allowRowBodies: false,
    allowTradeDateLists: false,
    allowSourceValues: false,
    allowStockIdPayload: false,
    allowSecrets: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (contract[key] !== value) problems.push(`postRunReviewContract.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAllowedFields(fields) {
  const expected = [
    "attemptId",
    "reviewOutcome",
    "targetScope",
    "targetTable",
    "targetLane",
    "maxRows",
    "candidateRows",
    "attemptedRows",
    "insertedRows",
    "duplicateRows",
    "rejectedRows",
    "readbackRows",
    "alreadyExistingRows",
    "rollbackReady",
    "readbackStatus",
    "sanitizedErrorCategory",
    "promotionAllowed",
    "rowCoverageScoringAllowed",
    "publicDataSource",
    "scoreSource"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("allowedPostRunReviewFields mismatch");
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
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("disallowedPostRunReviewFields mismatch");
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
