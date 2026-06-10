import fs from "node:fs";
import { spawnSync } from "node:child_process";

const authorizationPacketPath = "data/source-gates/twii-future-one-time-authorization-packet.json";
const proofBundlePath = "data/source-gates/twii-pre-execution-proof-bundle.json";
const proofBundleReportPath = "scripts/report-twii-pre-execution-proof-bundle.mjs";
const explicitExecutionPacketDraftPath = "data/source-gates/twii-explicit-execution-packet-draft.json";
const candidateGatePacketPath = "data/source-gates/twii-write-implementation-candidate-gate-packet.json";
const futureWriteGateReviewPacketPath = "data/source-gates/twii-future-write-gate-review-packet.json";

const problems = [];
const packet = readJson(authorizationPacketPath);
const proofBundle = readJson(proofBundlePath);
const proofBundleReport = runJsonReport(proofBundleReportPath, "pre-execution proof bundle");
const explicitExecutionPacketDraft = readJson(explicitExecutionPacketDraftPath);
const candidateGatePacket = readJson(candidateGatePacketPath);
const futureWriteGateReviewPacket = readJson(futureWriteGateReviewPacketPath);

validateProofBundle();
validatePacket();
validateUpstreamPackets();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_future_one_time_authorization_packet_ready_no_execution" : "blocked",
  outcome: ok ? "authorization_packet_ready_execution_still_blocked" : "authorization_packet_blocked",
  mode: "twii_future_one_time_authorization_packet",
  owner: "CEO/PM",
  authorizationPacketPath,
  proofBundlePath,
  proofBundleReportPath,
  authorizationReadyForPmReview: packet.authorizationReadyForPmReview === true,
  currentRoute: "twii_future_one_time_authorization_packet_ready_execution_blocked",
  recommendedNextAction: ok
    ? "pm_review_future_one_time_authorization_packet_before_any_execution_attempt"
    : "repair_future_one_time_authorization_packet",
  requiredBeforeExecution: packet.requiredBeforeExecution ?? [],
  blockedExecutionReasons: packet.blockedExecutionReasons ?? [],
  upstream: {
    proofBundleStatus: proofBundle.bundleStatus ?? null,
    proofBundleReportStatus: proofBundleReport.status ?? null,
    proofBundleReportOutcome: proofBundleReport.outcome ?? null,
    explicitExecutionPacketKind: explicitExecutionPacketDraft.executionPacketKind ?? null,
    candidateGatePacketKind: candidateGatePacket.packetKind ?? null,
    futureWriteGateReviewPacketKind: futureWriteGateReviewPacket.packetKind ?? null
  },
  target: {
    targetTable: packet.targetTable ?? null,
    targetLane: packet.targetLane ?? null,
    targetScope: packet.targetScope ?? null,
    maxRows: packet.maxRows ?? null,
    writeMode: packet.writeMode ?? null,
    duplicatePolicy: packet.duplicatePolicy ?? null
  },
  controls: {
    executeSwitchRequired: packet.executeSwitchRequired === true,
    executeDefault: packet.executeDefault === true,
    confirmationPhraseRequired: packet.confirmationPhraseRequired === true,
    requiredConfirmationPhrasePresent: safeText(packet.requiredConfirmationPhrase),
    serverOnlyCredentialHandling: packet.serverOnlyCredentialHandling === true,
    credentialValueOutputAllowed: packet.credentialValueOutputAllowed === true,
    rollbackDryRunRequired: packet.rollbackDryRunRequired === true,
    aggregateReadbackRequired: packet.aggregateReadbackRequired === true,
    postWriteReviewRequired: packet.postWriteReviewRequired === true
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

function validateProofBundle() {
  if (proofBundle.bundleStatus !== "ready_for_pm_review_no_execution") {
    problems.push("proof bundle must be ready for PM review no execution");
  }
  if (proofBundle.proofsReady !== true) problems.push("proof bundle proofsReady must be true");
  if (!Array.isArray(proofBundle.missingProofs) || proofBundle.missingProofs.length !== 0) {
    problems.push("proof bundle missingProofs must be empty");
  }
  if (proofBundleReport.status !== "twii_pre_execution_proof_bundle_ready_no_execution") {
    problems.push("proof bundle report status must be ready no execution");
  }
  if (proofBundleReport.outcome !== "proof_bundle_ready_future_authorization_still_blocked") {
    problems.push("proof bundle report outcome must keep future authorization blocked");
  }
}

function validatePacket() {
  const expected = {
    authorizationPacketKind: "twii_future_one_time_authorization_packet",
    authorizationScope: "future_one_bounded_twii_write_attempt_after_separate_pm_review",
    preExecutionProofBundlePath: proofBundlePath,
    explicitExecutionPacketDraftPath,
    candidateGatePacketPath,
    futureWriteGateReviewPacketPath,
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    writeMode: "bounded_insert_missing_only",
    duplicatePolicy: "reject_duplicates",
    requiredProofBundleStatus: "ready_for_pm_review_no_execution",
    executeSwitchRequired: true,
    executeDefault: false,
    confirmationPhraseRequired: true,
    requiredConfirmationPhrase: "CEO_PM_AUTHORIZES_ONE_TWII_BOUNDED_WRITE_GATE_20260610_A",
    serverOnlyCredentialHandling: true,
    credentialValueOutputAllowed: false,
    rollbackDryRunRequired: true,
    aggregateReadbackRequired: true,
    postWriteReviewRequired: true,
    promotionAllowed: false,
    rowCoverageScoringAllowed: false,
    scoreSourceRealAllowed: false,
    authorizationReadyForPmReview: true,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  };

  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`packet.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(packet.authorizationId)) problems.push("packet.authorizationId is required");
  if (!Array.isArray(packet.requiredBeforeExecution) || packet.requiredBeforeExecution.length < 5) {
    problems.push("packet.requiredBeforeExecution must list future requirements");
  }
  if (!Array.isArray(packet.blockedExecutionReasons) || packet.blockedExecutionReasons.length < 5) {
    problems.push("packet.blockedExecutionReasons must list blocking reasons");
  }
  validateSafety(packet.safety ?? {});
}

function validateUpstreamPackets() {
  if (explicitExecutionPacketDraft.executionPacketKind !== "twii_explicit_execution_packet_draft") {
    problems.push("explicit execution packet draft kind mismatch");
  }
  if (candidateGatePacket.packetKind !== "twii_write_implementation_candidate_gate_packet") {
    problems.push("candidate gate packet kind mismatch");
  }
  if (futureWriteGateReviewPacket.packetKind !== "twii_future_write_gate_review_packet") {
    problems.push("future write gate review packet kind mismatch");
  }
  for (const [name, upstream] of [
    ["proofBundle", proofBundle],
    ["explicitExecutionPacketDraft", explicitExecutionPacketDraft],
    ["candidateGatePacket", candidateGatePacket],
    ["futureWriteGateReviewPacket", futureWriteGateReviewPacket]
  ]) {
    for (const key of ["targetTable", "targetLane", "targetScope", "maxRows"]) {
      if (upstream[key] !== packet[key]) problems.push(`${name}.${key} must match authorization packet`);
    }
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("packet safety must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`packet safety.${key} must be false`);
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
