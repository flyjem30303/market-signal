import fs from "node:fs";
import { spawnSync } from "node:child_process";

const reviewPath = "data/source-gates/twii-no-secret-execution-readiness-review.json";
const preflightPath = "data/source-gates/twii-server-only-runner-preflight.json";
const preflightReportPath = "scripts/report-twii-server-only-runner-preflight.mjs";
const problems = [];

const review = readJson(reviewPath);
const preflight = readJson(preflightPath);
const preflightReport = runJsonReport(preflightReportPath, "TWII server-only runner preflight");

validateReview();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_no_secret_execution_readiness_review_ready_no_execution" : "blocked",
  outcome: ok ? "no_secret_execution_readiness_review_ready_execution_still_blocked" : "no_secret_execution_readiness_review_blocked",
  mode: "twii_no_secret_execution_readiness_review_no_execution",
  owner: "PM/CEO",
  reviewPath,
  preflightPath,
  preflightReportPath,
  reviewReadyForPmDecision: review.reviewReadyForPmDecision === true,
  readinessDecision: review.readinessDecision ?? null,
  attemptId: review.attemptId ?? null,
  reviewMode: review.reviewMode ?? null,
  requiredConfirmationPhrase: review.requiredConfirmationPhrase ?? null,
  target: {
    targetTable: review.targetTable ?? null,
    targetLane: review.targetLane ?? null,
    targetScope: review.targetScope ?? null,
    maxRows: review.maxRows ?? null
  },
  controls: {
    executeSwitchRequired: review.executeSwitchRequired === true,
    executeSwitchProvided: review.executeSwitchProvided === true,
    confirmationPhraseRequired: review.confirmationPhraseRequired === true,
    confirmationPhraseProvided: review.confirmationPhraseProvided === true,
    serverOnlyCredentialCheckRequired: review.serverOnlyCredentialCheckRequired === true,
    serverOnlyCredentialCheckPassed: review.serverOnlyCredentialCheckPassed === true,
    rollbackDryRunRequired: review.rollbackDryRunRequired === true,
    rollbackDryRunPassed: review.rollbackDryRunPassed === true,
    aggregateReadbackRequired: review.aggregateReadbackRequired === true,
    aggregateReadbackPassed: review.aggregateReadbackPassed === true,
    postWriteReviewRequired: review.postWriteReviewRequired === true,
    postWriteReviewPassed: review.postWriteReviewPassed === true,
    candidateDuplicateRejectionProofRequired: review.candidateDuplicateRejectionProofRequired === true,
    candidateDuplicateRejectionProofPassed: review.candidateDuplicateRejectionProofPassed === true
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
  openReadinessBlockers: review.openReadinessBlockers ?? [],
  currentRoute: "no_secret_execution_readiness_review_ready_but_execution_blocked",
  nextIfPmAcceptsReview: review.nextIfPmAcceptsReview ?? null,
  nextIfPmRejectsReview: review.nextIfPmRejectsReview ?? null,
  blockedExecutionReasons: review.blockedExecutionReasons ?? [],
  upstream: {
    preflightStatus: preflightReport.status ?? null,
    preflightOutcome: preflightReport.outcome ?? null,
    preflightKind: preflight.preflightKind ?? null
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

function validateReview() {
  const expected = {
    reviewKind: "twii_no_secret_execution_readiness_review_no_execution",
    preflightPath,
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    reviewMode: "no_secret_execution_readiness_review_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
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
    reviewReadyForPmDecision: true,
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
    readinessDecision: "blocked_until_all_required_controls_are_supplied_and_reviewed",
    nextIfPmAcceptsReview: "prepare_final_no_write_authorization_packet_or_pause_for_chairman_decision",
    nextIfPmRejectsReview: "repair_no_secret_execution_readiness_review_or_preflight"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (review[key] !== value) problems.push(`review.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(review.reviewId)) problems.push("review.reviewId is required");
  if (!Array.isArray(review.openReadinessBlockers) || review.openReadinessBlockers.length < 10) {
    problems.push("review.openReadinessBlockers must list remaining blockers");
  }
  if (!Array.isArray(review.blockedExecutionReasons) || review.blockedExecutionReasons.length < 12) {
    problems.push("review.blockedExecutionReasons must describe blocked execution state");
  }
  validateSafety(review.safety ?? {});
}

function validateUpstream() {
  if (preflightReport.status !== "twii_server_only_runner_preflight_ready_no_execution") {
    problems.push("preflight report status mismatch");
  }
  if (preflightReport.outcome !== "server_only_runner_preflight_ready_execution_still_blocked") {
    problems.push("preflight report outcome mismatch");
  }
  if (preflight.preflightKind !== "twii_server_only_runner_preflight_no_execution") {
    problems.push("preflight kind mismatch");
  }
  if (preflight.nextIfPmAcceptsPreflight !== "prepare_no_secret_execution_readiness_review_before_any_real_attempt") {
    problems.push("preflight must route to no-secret readiness review");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows", "requiredConfirmationPhrase"]) {
    if (preflight[key] !== review[key]) problems.push(`review.${key} must match preflight`);
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("review safety must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`review safety.${key} must be false`);
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
