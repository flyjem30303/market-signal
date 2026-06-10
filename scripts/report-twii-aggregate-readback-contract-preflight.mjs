import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const sourceContractGatePath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const sourceContractReportPath = "scripts/report-twii-bounded-insert-missing-only-contract-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceContractGate = readJson(sourceContractGatePath);
const sourceContractReport = runJsonReport(sourceContractReportPath, "TWII bounded insert missing-only contract preflight");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_aggregate_readback_contract_preflight_ready_no_execution" : "blocked",
  outcome: ok
    ? "aggregate_readback_contract_ready_runtime_still_blocked"
    : "aggregate_readback_contract_preflight_blocked",
  mode: "twii_aggregate_readback_contract_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceContractGatePath,
  sourceContractReportPath,
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
  readbackContractState: {
    sourceContractGateAccepted: gate.sourceContractGateAccepted === true,
    aggregateReadbackContractPrepared: gate.aggregateReadbackContractPrepared === true,
    readbackFieldsAggregateOnly: gate.readbackFieldsAggregateOnly === true,
    readbackCountBoundsPrepared: gate.readbackCountBoundsPrepared === true,
    readbackScopeLockPrepared: gate.readbackScopeLockPrepared === true,
    readbackNoRowPayloadPrepared: gate.readbackNoRowPayloadPrepared === true,
    postRunReviewContractPrepared: gate.postRunReviewContractPrepared === true,
    rollbackReadinessContractPrepared: gate.rollbackReadinessContractPrepared === true,
    readbackExecutionAllowedNow: false
  },
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  readbackContract: gate.readbackContract ?? null,
  allowedAggregateReadbackFields: gate.allowedAggregateReadbackFields ?? [],
  disallowedReadbackFields: gate.disallowedReadbackFields ?? [],
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
  currentRoute: "aggregate_readback_contract_ready_but_runtime_blocked",
  nextIfContractAccepted: gate.nextIfContractAccepted ?? null,
  nextIfContractRejected: gate.nextIfContractRejected ?? null,
  upstream: {
    sourceContractStatus: sourceContractReport.status ?? null,
    sourceContractOutcome: sourceContractReport.outcome ?? null,
    sourceContractGateKind: sourceContractGate.gateKind ?? null
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
    gateKind: "twii_aggregate_readback_contract_preflight",
    sourceContractGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    contractMode: "aggregate_readback_contract_no_execution",
    sourceContractGateAccepted: true,
    aggregateReadbackContractPrepared: true,
    readbackFieldsAggregateOnly: true,
    readbackCountBoundsPrepared: true,
    readbackScopeLockPrepared: true,
    readbackNoRowPayloadPrepared: true,
    postRunReviewContractPrepared: true,
    rollbackReadinessContractPrepared: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    readbackExecutionAllowedNow: false,
    contractDecision: "aggregate_readback_contract_ready_but_runtime_execution_still_blocked",
    nextIfContractAccepted: "prepare_post_run_review_contract_preflight_without_connecting_supabase",
    nextIfContractRejected: "repair_aggregate_readback_contract_or_bounded_insert_contract"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  validateReadbackContract(gate.readbackContract ?? {});
  validateAggregateFields(gate.allowedAggregateReadbackFields ?? []);
  validateDisallowedFields(gate.disallowedReadbackFields ?? []);
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceContractReport.status !== "twii_bounded_insert_missing_only_contract_preflight_ready_no_execution") {
    problems.push("source contract report status mismatch");
  }
  if (sourceContractReport.outcome !== "bounded_insert_missing_only_contract_ready_runtime_still_blocked") {
    problems.push("source contract report outcome mismatch");
  }
  if (sourceContractGate.gateKind !== "twii_bounded_insert_missing_only_contract_preflight") {
    problems.push("source contract gate kind mismatch");
  }
  if (
    sourceContractGate.nextIfContractAccepted !==
    "prepare_aggregate_readback_contract_preflight_without_connecting_supabase"
  ) {
    problems.push("source contract must route to aggregate readback contract preflight");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceContractGate[key] !== gate[key]) problems.push(`gate.${key} must match source contract gate`);
  }
}

function validateReadbackContract(contract) {
  const expected = {
    operationKind: "future_aggregate_readback_only",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    allowRowBodies: false,
    allowTradeDateLists: false,
    allowSourceValues: false,
    allowStockIdPayload: false,
    allowSecrets: false,
    requiresScopeLock: true,
    requiresCountBounds: true,
    requiresPostRunReview: true,
    requiresRollbackReadiness: true
  };
  for (const [key, value] of Object.entries(expected)) {
    if (contract[key] !== value) problems.push(`readbackContract.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAggregateFields(fields) {
  const expected = [
    "attemptId",
    "targetScope",
    "targetTable",
    "targetLane",
    "maxRows",
    "candidateRows",
    "insertedRows",
    "duplicateRows",
    "rejectedRows",
    "readbackRows",
    "alreadyExistingRows",
    "rollbackReady",
    "readbackStatus",
    "sanitizedErrorCategory"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) {
    problems.push("allowedAggregateReadbackFields mismatch");
  }
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
    "credentialValue"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) {
    problems.push("disallowedReadbackFields mismatch");
  }
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
  if (run.status !== 0) {
    problems.push(`${label} report exited ${run.status}`);
  }
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
