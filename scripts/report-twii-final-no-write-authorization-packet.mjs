import fs from "node:fs";
import { spawnSync } from "node:child_process";

const packetPath = "data/source-gates/twii-final-no-write-authorization-packet.json";
const readinessReviewPath = "data/source-gates/twii-no-secret-execution-readiness-review.json";
const readinessReportPath = "scripts/report-twii-no-secret-execution-readiness-review.mjs";
const problems = [];

const packet = readJson(packetPath);
const readinessReview = readJson(readinessReviewPath);
const readinessReport = runJsonReport(readinessReportPath, "TWII no-secret execution readiness review");

validatePacket();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_final_no_write_authorization_packet_ready_no_execution" : "blocked",
  outcome: ok
    ? "final_no_write_authorization_packet_ready_execution_still_blocked"
    : "final_no_write_authorization_packet_blocked",
  mode: "twii_final_no_write_authorization_packet_no_execution",
  owner: "CEO/PM",
  packetPath,
  readinessReviewPath,
  readinessReportPath,
  packetReadyForCeoDecision: packet.packetReadyForCeoDecision === true,
  writeAuthorizationDecision: packet.writeAuthorizationDecision ?? null,
  attemptId: packet.attemptId ?? null,
  authorizationMode: packet.authorizationMode ?? null,
  requiredConfirmationPhrase: packet.requiredConfirmationPhrase ?? null,
  target: {
    targetTable: packet.targetTable ?? null,
    targetLane: packet.targetLane ?? null,
    targetScope: packet.targetScope ?? null,
    maxRows: packet.maxRows ?? null
  },
  controls: {
    executeSwitchRequired: packet.executeSwitchRequired === true,
    executeSwitchProvided: packet.executeSwitchProvided === true,
    confirmationPhraseRequired: packet.confirmationPhraseRequired === true,
    confirmationPhraseProvided: packet.confirmationPhraseProvided === true,
    serverOnlyCredentialCheckRequired: packet.serverOnlyCredentialCheckRequired === true,
    serverOnlyCredentialCheckPassed: packet.serverOnlyCredentialCheckPassed === true,
    rollbackDryRunRequired: packet.rollbackDryRunRequired === true,
    rollbackDryRunPassed: packet.rollbackDryRunPassed === true,
    aggregateReadbackRequired: packet.aggregateReadbackRequired === true,
    aggregateReadbackPassed: packet.aggregateReadbackPassed === true,
    postWriteReviewRequired: packet.postWriteReviewRequired === true,
    postWriteReviewPassed: packet.postWriteReviewPassed === true,
    candidateDuplicateRejectionProofRequired: packet.candidateDuplicateRejectionProofRequired === true,
    candidateDuplicateRejectionProofPassed: packet.candidateDuplicateRejectionProofPassed === true
  },
  noExecutionState: {
    executeRequested: false,
    credentialValuesRead: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseWritesEnabled: false,
    dailyPricesMutated: false,
    candidateRowsAccepted: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  openAuthorizationBlockers: packet.openAuthorizationBlockers ?? [],
  currentRoute: "final_no_write_authorization_packet_ready_but_execution_blocked",
  nextIfCeoAcceptsPacket: packet.nextIfCeoAcceptsPacket ?? null,
  nextIfCeoRejectsPacket: packet.nextIfCeoRejectsPacket ?? null,
  blockedExecutionReasons: packet.blockedExecutionReasons ?? [],
  upstream: {
    readinessStatus: readinessReport.status ?? null,
    readinessOutcome: readinessReport.outcome ?? null,
    readinessReviewKind: readinessReview.reviewKind ?? null
  },
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

function validatePacket() {
  const expected = {
    packetKind: "twii_final_no_write_authorization_packet",
    readinessReviewPath,
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    authorizationMode: "final_no_write_authorization_packet",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    packetReadyForCeoDecision: true,
    writeAuthorizationDecision: "blocked_until_explicit_execute_switch_confirmation_and_all_pre_write_controls_pass",
    executeSwitchRequired: true,
    executeSwitchProvided: false,
    confirmationPhraseRequired: true,
    confirmationPhraseProvided: false,
    serverOnlyCredentialCheckRequired: true,
    serverOnlyCredentialCheckPassed: false,
    credentialValuesRead: false,
    rollbackDryRunRequired: true,
    rollbackDryRunPassed: false,
    aggregateReadbackRequired: true,
    aggregateReadbackPassed: false,
    postWriteReviewRequired: true,
    postWriteReviewPassed: false,
    candidateDuplicateRejectionProofRequired: true,
    candidateDuplicateRejectionProofPassed: false,
    executeRequested: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    candidateRowsAccepted: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false,
    promotionAllowed: false,
    scoreSourceRealAllowed: false,
    nextIfCeoAcceptsPacket:
      "pause_for_explicit_execute_switch_and_confirmation_phrase_before_any_bounded_write_attempt",
    nextIfCeoRejectsPacket: "repair_final_no_write_authorization_packet_or_readiness_review"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`packet.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(packet.packetId)) problems.push("packet.packetId is required");
  if (!Array.isArray(packet.openAuthorizationBlockers) || packet.openAuthorizationBlockers.length < 10) {
    problems.push("packet.openAuthorizationBlockers must list remaining blockers");
  }
  if (!Array.isArray(packet.blockedExecutionReasons) || packet.blockedExecutionReasons.length < 12) {
    problems.push("packet.blockedExecutionReasons must describe blocked execution state");
  }
  validateSafety(packet.safety ?? {});
}

function validateUpstream() {
  if (readinessReport.status !== "twii_no_secret_execution_readiness_review_ready_no_execution") {
    problems.push("readiness review report status mismatch");
  }
  if (readinessReport.outcome !== "no_secret_execution_readiness_review_ready_execution_still_blocked") {
    problems.push("readiness review report outcome mismatch");
  }
  if (readinessReview.reviewKind !== "twii_no_secret_execution_readiness_review_no_execution") {
    problems.push("readiness review kind mismatch");
  }
  if (
    readinessReview.nextIfPmAcceptsReview !==
    "prepare_final_no_write_authorization_packet_or_pause_for_chairman_decision"
  ) {
    problems.push("readiness review must route to final no-write authorization packet");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows", "requiredConfirmationPhrase"]) {
    if (readinessReview[key] !== packet[key]) problems.push(`packet.${key} must match readiness review`);
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("packet safety must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "credentialValuesRead",
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
  if (run.status !== 0) problems.push(`${label} must exit 0`);
  try {
    return JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${label} stdout must be JSON`);
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
  return typeof value === "string" && value.trim().length > 0 && value.length <= 500;
}
