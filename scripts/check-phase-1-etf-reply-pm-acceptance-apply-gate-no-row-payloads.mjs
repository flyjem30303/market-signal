import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads.json";
const reportPath = "scripts/report-phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads.mjs";
const validatorPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-intake-validator-no-row-payloads.json";
const executionBriefPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads.json";
const candidateGatePath = "data/evidence-intake/phase-1-write-runner-candidate-artifact-set-acceptance-gate.json";
const docPath = "docs/PHASE_1_ETF_REPLY_PM_ACCEPTANCE_APPLY_GATE_NO_ROW_PAYLOADS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const validator = parseJson(readText(validatorPath), validatorPath);
const executionBrief = parseJson(readText(executionBriefPath), executionBriefPath);
const candidateGate = parseJson(readText(candidateGatePath), candidateGatePath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const status = readText(statusPath);

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
if (reportRun.status !== 0) problems.push("report script must exit 0");
const report = parseJson(reportRun.stdout ?? "", "report stdout");

validateSourceState();
validateArtifact();
validateReport();
validateDoc();
validateRegistration();
validateStatus();
validateBoundaries();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_etf_reply_pm_acceptance_apply_gate_no_row_payloads_ready"
        : "phase_1_etf_reply_pm_acceptance_apply_gate_no_row_payloads_blocked",
      applyDecision: artifact.applyDecision ?? null,
      applyAllowedNow: artifact.applyAllowedNow ?? null,
      requiredFutureReplyStatus: artifact.requiredFutureReplyStatus ?? null,
      nextRoute: artifact.nextRoute ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateSourceState() {
  expect(validator.status, "phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads_ready", "validator status");
  expect(executionBrief.status, "phase_1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads_ready", "execution brief status");
  expect(candidateGate.status, "phase_1_write_runner_candidate_artifact_set_acceptance_gate_waiting_etf_artifact", "candidate gate status");
  expect(candidateGate.twiiArtifactAccepted, true, "candidate gate twiiArtifactAccepted");
  expect(candidateGate.etfArtifactAccepted, false, "candidate gate etfArtifactAccepted");
  expect(candidateGate.artifactSetComplete, false, "candidate gate artifactSetComplete");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_etf_reply_pm_acceptance_apply_gate_no_row_payloads_ready", "artifact status");
  expect(artifact.applyGateMode, "pm_apply_etf_reply_acceptance_after_validator_pass_no_row_payloads", "applyGateMode");
  expect(artifact.applyDecision, "ready_to_apply_future_validator_pass_without_reading_rows", "applyDecision");
  expect(artifact.sourceValidatorStatus, "phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads_ready", "sourceValidatorStatus");
  expect(artifact.sourceExecutionBriefStatus, "phase_1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads_ready", "sourceExecutionBriefStatus");
  expect(artifact.sourceCandidateGateStatus, "phase_1_write_runner_candidate_artifact_set_acceptance_gate_waiting_etf_artifact", "sourceCandidateGateStatus");
  expect(artifact.applyAllowedNow, false, "applyAllowedNow");
  expect(artifact.futureReplyRequired, true, "futureReplyRequired");
  expect(artifact.requiredFutureReplyStatus, "validator_passed_future_a1_etf_reply", "requiredFutureReplyStatus");
  expect(artifact.currentEtfArtifactAccepted, false, "currentEtfArtifactAccepted");
  expect(artifact.futureEtfArtifactAcceptedAfterPass, true, "futureEtfArtifactAcceptedAfterPass");
  expect(artifact.futureArtifactSetCompleteAfterPass, true, "futureArtifactSetCompleteAfterPass");
  expect(artifact.futureExpectedMissingRows, 178, "futureExpectedMissingRows");
  expect(artifact.futureTwiiMissingRows, 60, "futureTwiiMissingRows");
  expect(artifact.futureEtfMissingRows, 118, "futureEtfMissingRows");
  expect(artifact.candidateArtifactReadNow, false, "candidateArtifactReadNow");
  expect(artifact.candidateRowsAcceptedNow, false, "candidateRowsAcceptedNow");
  expect(artifact.executionAllowedNow, false, "executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.promotionAllowedNow, false, "promotionAllowedNow");
  expect(artifact.nextRoute, "wait_for_future_a1_etf_reply_then_run_pm_intake_validator", "nextRoute");
  expect(artifact.nextRouteIfFutureReplyPasses, "phase_1_write_runner_candidate_artifact_set_acceptance_gate_etf_artifact_accepted", "nextRouteIfFutureReplyPasses");
  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateReport() {
  expect(report.status, "phase_1_etf_reply_pm_acceptance_apply_gate_no_row_payloads_ready", "report status");
  expect(report.applyDecision, artifact.applyDecision, "report applyDecision");
  expect(report.applyAllowedNow, false, "report applyAllowedNow");
  expect(report.requiredFutureReplyStatus, "validator_passed_future_a1_etf_reply", "report requiredFutureReplyStatus");
  expect(report.futureArtifactSetCompleteAfterPass, true, "report futureArtifactSetCompleteAfterPass");
}

function validateDoc() {
  const requiredTokens = [
    "Phase 1 ETF Reply PM Acceptance Apply Gate",
    "phase_1_etf_reply_pm_acceptance_apply_gate_no_row_payloads_ready",
    "ready_to_apply_future_validator_pass_without_reading_rows",
    "applyAllowedNow=false",
    "futureReplyRequired=true",
    "requiredFutureReplyStatus=validator_passed_future_a1_etf_reply",
    "currentEtfArtifactAccepted=false",
    "futureEtfArtifactAcceptedAfterPass=true",
    "futureArtifactSetCompleteAfterPass=true",
    "futureExpectedMissingRows=178",
    "futureTwiiMissingRows=60",
    "futureEtfMissingRows=118",
    "candidateArtifactReadNow=false",
    "candidateRowsAcceptedNow=false",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "promotionAllowedNow=false",
    "No row payload read",
    "No candidate row acceptance",
    "No Supabase write",
    "No public real-data promotion"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["report:phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads"] !==
    `node ${reportPath}`
  ) {
    problems.push("package.json missing report:phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads");
  }
  if (
    packageJson.scripts?.["check:phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads"] !==
    "node scripts/check-phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads.mjs"
  ) {
    problems.push("package.json missing check:phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads");
  }
  if (!reviewGate.includes("scripts/check-phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads.mjs")) {
    problems.push("review gate missing ETF PM acceptance apply gate checker");
  }
  if (!reviewGate.includes('"phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads"')) {
    problems.push("focused review gate missing ETF PM acceptance apply gate checker");
  }
}

function validateStatus() {
  const requiredTokens = [
    "Latest Phase 1 ETF reply PM acceptance apply gate slice",
    "docs/PHASE_1_ETF_REPLY_PM_ACCEPTANCE_APPLY_GATE_NO_ROW_PAYLOADS.md",
    "phase_1_etf_reply_pm_acceptance_apply_gate_no_row_payloads_ready",
    "ready_to_apply_future_validator_pass_without_reading_rows",
    "applyAllowedNow=false",
    "futureArtifactSetCompleteAfterPass=true",
    "nextRoute=wait_for_future_a1_etf_reply_then_run_pm_intake_validator"
  ];
  for (const token of requiredTokens) if (!status.includes(token)) problems.push(`${statusPath} missing ${token}`);
}

function validateBoundaries() {
  const texts = [
    [artifactPath, artifactRaw],
    [docPath, doc],
    ["report stdout", reportRun.stdout ?? ""]
  ];
  const forbiddenPatterns = [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\.rpc\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /applyAllowedNow"\s*:\s*true/u,
    /candidateArtifactReadNow"\s*:\s*true/u,
    /candidateRowsAcceptedNow"\s*:\s*true/u,
    /executionAllowedNow"\s*:\s*true/u,
    /writeGateExecutableNow"\s*:\s*true/u,
    /promotionAllowedNow"\s*:\s*true/u
  ];
  for (const [label, text] of texts) {
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function validateSafety(safety, label) {
  expect(safety.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(safety.scoreSource, "mock", `${label}.scoreSource`);
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "candidateArtifactRowsRead",
    "rowPayloadRead",
    "rawPayloadRead",
    "rowPayloadOutput",
    "rawPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(safety[key], false, `${label}.${key}`);
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}
