import fs from "node:fs";
import { spawnSync } from "node:child_process";

const decisionPacketPath = "data/source-gates/twii-pm-authorization-review-decision-packet.json";
const authorizationPacketPath = "data/source-gates/twii-future-one-time-authorization-packet.json";
const authorizationReportPath = "scripts/report-twii-future-one-time-authorization-packet.mjs";
const proofBundlePath = "data/source-gates/twii-pre-execution-proof-bundle.json";
const explicitExecutionPacketDraftPath = "data/source-gates/twii-explicit-execution-packet-draft.json";

const problems = [];
const decisionPacket = readJson(decisionPacketPath);
const authorizationPacket = readJson(authorizationPacketPath);
const authorizationReport = runJsonReport(authorizationReportPath, "future one-time authorization packet");
const proofBundle = readJson(proofBundlePath);
const explicitExecutionPacketDraft = readJson(explicitExecutionPacketDraftPath);

validateAuthorization();
validateDecisionPacket();
validateUpstreamReferences();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_pm_authorization_review_decision_packet_ready_no_execution" : "blocked",
  outcome: ok
    ? "authorization_review_accepted_for_future_gate_preparation_execution_still_blocked"
    : "authorization_review_decision_packet_blocked",
  mode: "twii_pm_authorization_review_decision_packet",
  owner: "PM/CEO",
  decisionPacketPath,
  reviewTarget: decisionPacket.reviewTarget ?? null,
  reviewDecision: decisionPacket.reviewDecision ?? null,
  decisionAlternatives: decisionPacket.decisionAlternatives ?? [],
  acceptedCriteria: decisionPacket.acceptedCriteria ?? [],
  rejectionCriteria: decisionPacket.rejectionCriteria ?? [],
  nextIfAccepted: decisionPacket.nextIfAccepted ?? null,
  nextIfRejected: decisionPacket.nextIfRejected ?? null,
  authorizationReadyForPmReview: decisionPacket.authorizationReadyForPmReview === true,
  reviewDecisionRecorded: decisionPacket.reviewDecisionRecorded === true,
  upstream: {
    authorizationReportStatus: authorizationReport.status ?? null,
    authorizationReportOutcome: authorizationReport.outcome ?? null,
    proofBundleStatus: proofBundle.bundleStatus ?? null,
    explicitExecutionPacketKind: explicitExecutionPacketDraft.executionPacketKind ?? null
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

function validateAuthorization() {
  if (authorizationReport.status !== "twii_future_one_time_authorization_packet_ready_no_execution") {
    problems.push("authorization report status must be ready no execution");
  }
  if (authorizationReport.outcome !== "authorization_packet_ready_execution_still_blocked") {
    problems.push("authorization report outcome must keep execution blocked");
  }
  if (authorizationReport.authorizationReadyForPmReview !== true) {
    problems.push("authorization must be ready for PM review");
  }
  if (authorizationPacket.executeDefault !== false) problems.push("authorization executeDefault must be false");
  if (authorizationPacket.credentialValueOutputAllowed !== false) {
    problems.push("authorization credential value output must be forbidden");
  }
  if (proofBundle.bundleStatus !== "ready_for_pm_review_no_execution") {
    problems.push("proof bundle must be ready for PM review no execution");
  }
}

function validateDecisionPacket() {
  const expected = {
    decisionPacketKind: "twii_pm_authorization_review_decision_packet",
    reviewTarget: authorizationPacketPath,
    preExecutionProofBundlePath: proofBundlePath,
    explicitExecutionPacketDraftPath,
    reviewDecision: "accepted_for_future_execution_gate_preparation_only",
    nextIfAccepted: "prepare_one_attempt_runner_execution_gate_no_execution",
    nextIfRejected: "repair_authorization_packet_or_proof_bundle",
    authorizationReadyForPmReview: true,
    reviewDecisionRecorded: true,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false,
    promotionAllowed: false,
    rowCoverageScoringAllowed: false,
    scoreSourceRealAllowed: false
  };

  for (const [key, value] of Object.entries(expected)) {
    if (decisionPacket[key] !== value) problems.push(`decisionPacket.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(decisionPacket.decisionId)) problems.push("decisionPacket.decisionId is required");
  if (!Array.isArray(decisionPacket.decisionAlternatives)) problems.push("decisionAlternatives must be an array");
  for (const alternative of ["accepted_for_future_execution_gate_preparation_only", "rejected_needs_repair"]) {
    if (!decisionPacket.decisionAlternatives?.includes(alternative)) {
      problems.push(`decisionAlternatives must include ${alternative}`);
    }
  }
  if (!Array.isArray(decisionPacket.acceptedCriteria) || decisionPacket.acceptedCriteria.length < 5) {
    problems.push("acceptedCriteria must list acceptance checks");
  }
  if (!Array.isArray(decisionPacket.rejectionCriteria) || decisionPacket.rejectionCriteria.length < 5) {
    problems.push("rejectionCriteria must list rejection checks");
  }
  validateSafety(decisionPacket.safety ?? {});
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
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("decision packet safety must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`decision packet safety.${key} must be false`);
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
