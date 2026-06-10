import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-one-attempt-runner-execution-gate.json";
const pmDecisionPacketPath = "data/source-gates/twii-pm-authorization-review-decision-packet.json";
const pmDecisionReportPath = "scripts/report-twii-pm-authorization-review-decision-packet.mjs";
const authorizationPacketPath = "data/source-gates/twii-future-one-time-authorization-packet.json";
const proofBundlePath = "data/source-gates/twii-pre-execution-proof-bundle.json";
const explicitExecutionPacketDraftPath = "data/source-gates/twii-explicit-execution-packet-draft.json";

const problems = [];
const gate = readJson(gatePath);
const pmDecisionPacket = readJson(pmDecisionPacketPath);
const pmDecisionReport = runJsonReport(pmDecisionReportPath, "PM authorization review decision packet");
const authorizationPacket = readJson(authorizationPacketPath);
const proofBundle = readJson(proofBundlePath);
const explicitExecutionPacketDraft = readJson(explicitExecutionPacketDraftPath);

validatePmDecision();
validateGate();
validateUpstreamReferences();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_one_attempt_runner_execution_gate_ready_no_execution" : "blocked",
  outcome: ok ? "runner_gate_ready_fail_closed_execution_still_blocked" : "runner_gate_blocked",
  mode: "twii_one_attempt_runner_execution_gate_no_execution",
  owner: "PM/CEO",
  gatePath,
  gateReadyForPmReview: gate.gateReadyForPmReview === true,
  runnerMode: gate.runnerMode ?? null,
  runnerExecutableNow: false,
  currentRoute: "twii_one_attempt_runner_gate_ready_fail_closed_no_execution",
  nextIfPmAcceptsGate: gate.nextIfPmAcceptsGate ?? null,
  nextIfPmRejectsGate: gate.nextIfPmRejectsGate ?? null,
  blockedExecutionReasons: gate.blockedExecutionReasons ?? [],
  upstream: {
    pmDecisionStatus: pmDecisionReport.status ?? null,
    pmDecisionOutcome: pmDecisionReport.outcome ?? null,
    pmReviewDecision: pmDecisionPacket.reviewDecision ?? null,
    authorizationPacketKind: authorizationPacket.authorizationPacketKind ?? null,
    proofBundleStatus: proofBundle.bundleStatus ?? null,
    explicitExecutionPacketKind: explicitExecutionPacketDraft.executionPacketKind ?? null
  },
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  controls: {
    executeSwitchRequired: gate.executeSwitchRequired === true,
    executeDefault: gate.executeDefault === true,
    confirmationPhraseRequired: gate.confirmationPhraseRequired === true,
    serverOnlyCredentialHandling: gate.serverOnlyCredentialHandling === true,
    credentialValueOutputAllowed: gate.credentialValueOutputAllowed === true,
    rollbackDryRunRequired: gate.rollbackDryRunRequired === true,
    aggregateReadbackRequired: gate.aggregateReadbackRequired === true,
    postWriteReviewRequired: gate.postWriteReviewRequired === true
  },
  executionAllowedNow: false,
  writeGateExecutableNow: false,
  implementationAllowedNow: false,
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

function validatePmDecision() {
  if (pmDecisionReport.status !== "twii_pm_authorization_review_decision_packet_ready_no_execution") {
    problems.push("PM decision report status must be ready no execution");
  }
  if (pmDecisionReport.outcome !== "authorization_review_accepted_for_future_gate_preparation_execution_still_blocked") {
    problems.push("PM decision report outcome must keep execution blocked");
  }
  if (pmDecisionPacket.reviewDecision !== "accepted_for_future_execution_gate_preparation_only") {
    problems.push("PM decision must accept future gate preparation only");
  }
  if (pmDecisionPacket.nextIfAccepted !== "prepare_one_attempt_runner_execution_gate_no_execution") {
    problems.push("PM decision nextIfAccepted must point to runner gate");
  }
}

function validateGate() {
  const expected = {
    gateKind: "twii_one_attempt_runner_execution_gate_no_execution",
    pmDecisionPacketPath,
    futureOneTimeAuthorizationPacketPath: authorizationPacketPath,
    preExecutionProofBundlePath: proofBundlePath,
    explicitExecutionPacketDraftPath,
    attemptScope: "future_one_bounded_twii_write_attempt_fail_closed_gate_only",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    runnerMode: "fail_closed_no_execution",
    executeSwitchRequired: true,
    executeDefault: false,
    confirmationPhraseRequired: true,
    serverOnlyCredentialHandling: true,
    credentialValueOutputAllowed: false,
    rollbackDryRunRequired: true,
    aggregateReadbackRequired: true,
    postWriteReviewRequired: true,
    pmDecisionRequired: "accepted_for_future_execution_gate_preparation_only",
    gateReadyForPmReview: true,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false,
    promotionAllowed: false,
    rowCoverageScoringAllowed: false,
    scoreSourceRealAllowed: false,
    nextIfPmAcceptsGate: "prepare_fail_closed_runner_stub_or_explicit_execution_attempt_packet",
    nextIfPmRejectsGate: "repair_runner_gate_authorization_or_proof_chain"
  };

  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (!safeText(gate.attemptId)) problems.push("gate.attemptId is required");
  if (!Array.isArray(gate.blockedExecutionReasons) || gate.blockedExecutionReasons.length < 5) {
    problems.push("gate.blockedExecutionReasons must list blocking reasons");
  }
  validateSafety(gate.safety ?? {});
}

function validateUpstreamReferences() {
  if (authorizationPacket.authorizationPacketKind !== "twii_future_one_time_authorization_packet") {
    problems.push("authorization packet kind mismatch");
  }
  if (proofBundle.bundleKind !== "twii_pre_execution_proof_bundle") {
    problems.push("proof bundle kind mismatch");
  }
  if (explicitExecutionPacketDraft.executionPacketKind !== "twii_explicit_execution_packet_draft") {
    problems.push("explicit execution packet draft kind mismatch");
  }
  for (const [name, upstream] of [
    ["authorizationPacket", authorizationPacket],
    ["proofBundle", proofBundle],
    ["explicitExecutionPacketDraft", explicitExecutionPacketDraft]
  ]) {
    for (const key of ["targetTable", "targetLane", "targetScope", "maxRows"]) {
      if (upstream[key] !== gate[key]) problems.push(`${name}.${key} must match runner gate`);
    }
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("gate safety must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseWritesEnabled",
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
    if (safety[key] !== false) problems.push(`gate safety.${key} must be false`);
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
  try {
    return JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${label} report stdout must be JSON`);
    return {};
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push(`cannot read JSON: ${filePath}`);
    return {};
  }
}

function safeText(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 260;
}
