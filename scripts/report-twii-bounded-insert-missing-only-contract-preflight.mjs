import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const sourcePreflightGatePath = "data/source-gates/twii-execute-switch-confirmation-preflight.json";
const sourcePreflightReportPath = "scripts/report-twii-execute-switch-confirmation-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourcePreflightGate = readJson(sourcePreflightGatePath);
const sourcePreflightReport = runJsonReport(sourcePreflightReportPath, "TWII execute switch confirmation preflight");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_bounded_insert_missing_only_contract_preflight_ready_no_execution" : "blocked",
  outcome: ok
    ? "bounded_insert_missing_only_contract_ready_runtime_still_blocked"
    : "bounded_insert_missing_only_contract_preflight_blocked",
  mode: "twii_bounded_insert_missing_only_contract_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourcePreflightGatePath,
  sourcePreflightReportPath,
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
  contractState: {
    sourcePreflightGateAccepted: gate.sourcePreflightGateAccepted === true,
    insertContractPrepared: gate.insertContractPrepared === true,
    missingOnlySemanticsPrepared: gate.missingOnlySemanticsPrepared === true,
    duplicateProtectionPrepared: gate.duplicateProtectionPrepared === true,
    maxRowsContract: gate.maxRowsContract ?? null,
    readbackContractPrepared: gate.readbackContractPrepared === true,
    postRunReviewContractPrepared: gate.postRunReviewContractPrepared === true,
    rollbackReadinessContractPrepared: gate.rollbackReadinessContractPrepared === true
  },
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  insertContract: gate.insertContract ?? null,
  expectedAggregateFields: gate.expectedAggregateFields ?? [],
  noExecutionState: {
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
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  currentRoute: "bounded_insert_missing_only_contract_ready_but_runtime_blocked",
  nextIfContractAccepted: gate.nextIfContractAccepted ?? null,
  nextIfContractRejected: gate.nextIfContractRejected ?? null,
  upstream: {
    sourcePreflightStatus: sourcePreflightReport.status ?? null,
    sourcePreflightOutcome: sourcePreflightReport.outcome ?? null,
    sourcePreflightGateKind: sourcePreflightGate.gateKind ?? null
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
    gateKind: "twii_bounded_insert_missing_only_contract_preflight",
    sourcePreflightGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    contractMode: "bounded_insert_missing_only_contract_no_execution",
    sourcePreflightGateAccepted: true,
    insertContractPrepared: true,
    missingOnlySemanticsPrepared: true,
    duplicateProtectionPrepared: true,
    maxRowsContract: 60,
    readbackContractPrepared: true,
    postRunReviewContractPrepared: true,
    rollbackReadinessContractPrepared: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    contractDecision: "bounded_insert_missing_only_contract_ready_but_runtime_execution_still_blocked",
    nextIfContractAccepted: "prepare_aggregate_readback_contract_preflight_without_connecting_supabase",
    nextIfContractRejected: "repair_bounded_insert_contract_or_candidate_reference"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  validateInsertContract(gate.insertContract ?? {});
  validateAggregateFields(gate.expectedAggregateFields ?? []);
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourcePreflightReport.status !== "twii_execute_switch_confirmation_preflight_ready_no_execution") {
    problems.push("source preflight report status mismatch");
  }
  if (sourcePreflightReport.outcome !== "execute_switch_confirmation_preflight_ready_runtime_still_blocked") {
    problems.push("source preflight report outcome mismatch");
  }
  if (sourcePreflightGate.gateKind !== "twii_execute_switch_confirmation_preflight") {
    problems.push("source preflight gate kind mismatch");
  }
  if (
    sourcePreflightGate.nextIfSwitchAndPhrasePass !==
    "prepare_bounded_insert_missing_only_contract_preflight_without_connecting_supabase"
  ) {
    problems.push("source preflight must route to bounded insert missing-only contract preflight");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourcePreflightGate[key] !== gate[key]) problems.push(`gate.${key} must match source preflight gate`);
  }
}

function validateInsertContract(contract) {
  const expected = {
    operationKind: "future_insert_missing_only",
    maxRows: 60,
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    allowUpdateExistingRows: false,
    allowDeleteRows: false,
    allowUpsertRows: false,
    allowStagingRows: false,
    requiresDuplicateRejection: true,
    requiresAggregateReadback: true,
    requiresPostRunReview: true,
    requiresRollbackReadiness: true
  };
  for (const [key, value] of Object.entries(expected)) {
    if (contract[key] !== value) problems.push(`insertContract.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAggregateFields(fields) {
  const expected = [
    "attemptId",
    "targetScope",
    "maxRows",
    "candidateRows",
    "insertedRows",
    "duplicateRows",
    "rejectedRows",
    "readbackRows",
    "rollbackReady"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) {
    problems.push("expectedAggregateFields mismatch");
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
