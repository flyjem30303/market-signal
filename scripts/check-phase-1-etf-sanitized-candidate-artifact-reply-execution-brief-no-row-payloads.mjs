import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads.json";
const reportPath = "scripts/report-phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads.mjs";
const templatePath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads.json";
const validatorPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-intake-validator-no-row-payloads.json";
const candidateGatePath = "data/evidence-intake/phase-1-write-runner-candidate-artifact-set-acceptance-gate.json";
const docPath = "docs/PHASE_1_ETF_SANITIZED_CANDIDATE_ARTIFACT_REPLY_EXECUTION_BRIEF_NO_ROW_PAYLOADS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const template = parseJson(readText(templatePath), templatePath);
const validator = parseJson(readText(validatorPath), validatorPath);
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
        ? "phase_1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads_ready"
        : "phase_1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads_blocked",
      briefDecision: artifact.briefDecision ?? null,
      a1CanExecuteNow: artifact.a1CanExecuteNow ?? null,
      pmCanAcceptNow: artifact.pmCanAcceptNow ?? null,
      expectedMissingRows: artifact.expectedMissingRows ?? null,
      nextRoute: artifact.nextRoute ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateSourceState() {
  expect(template.status, "phase_1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads_ready", "template status");
  expect(validator.status, "phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads_ready", "validator status");
  expect(candidateGate.status, "phase_1_write_runner_candidate_artifact_set_acceptance_gate_waiting_etf_artifact", "candidate gate status");
  expect(candidateGate.etfArtifactAccepted, false, "candidate gate etfArtifactAccepted");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads_ready", "artifact status");
  expect(artifact.briefMode, "a1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads", "briefMode");
  expect(artifact.briefDecision, "a1_can_prepare_etf_reply_aggregate_only_pm_intake_ready", "briefDecision");
  expect(artifact.sourceTemplateStatus, "phase_1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads_ready", "sourceTemplateStatus");
  expect(artifact.sourceValidatorStatus, "phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads_ready", "sourceValidatorStatus");
  expect(artifact.sourceCandidateGateStatus, "phase_1_write_runner_candidate_artifact_set_acceptance_gate_waiting_etf_artifact", "sourceCandidateGateStatus");
  expect(artifact.a1CanExecuteNow, true, "a1CanExecuteNow");
  expect(artifact.pmCanAcceptNow, false, "pmCanAcceptNow");
  expect(artifact.pmAcceptanceRequiresFutureReply, true, "pmAcceptanceRequiresFutureReply");
  expect(artifact.candidateArtifactPathAcceptedNow, false, "candidateArtifactPathAcceptedNow");
  expect(artifact.candidateArtifactReadNow, false, "candidateArtifactReadNow");
  expect(artifact.candidateRowsAcceptedNow, false, "candidateRowsAcceptedNow");
  expect(artifact.targetLane, "ETF", "targetLane");
  expect(artifact.symbolGroup, "ETF", "symbolGroup");
  expect(artifact.targetScope, "phase_1_core_etf_daily_prices_missing_rows", "targetScope");
  expect(artifact.expectedMissingRows, 118, "expectedMissingRows");
  expectArray(
    artifact.replyFields,
    [
      "candidateArtifactPath",
      "artifactId",
      "lane",
      "symbolGroup",
      "scope",
      "sourceLane",
      "coverageWindowSessions",
      "candidateMissingRows",
      "expectedRows",
      "aggregateValidation",
      "sanitizedAggregateOnly",
      "rawPayloadIncluded",
      "rowPayloadIncluded",
      "stockIdPayloadIncluded",
      "secretsIncluded"
    ],
    "replyFields"
  );
  expectDeepEqual(
    artifact.requiredReplyValues,
    {
      lane: "ETF",
      symbolGroup: "ETF",
      scope: "phase_1_core_etf_daily_prices_missing_rows",
      candidateMissingRows: 118,
      expectedRows: 118,
      sanitizedAggregateOnly: true,
      rawPayloadIncluded: false,
      rowPayloadIncluded: false,
      stockIdPayloadIncluded: false,
      secretsIncluded: false
    },
    "requiredReplyValues"
  );
  expectArray(
    artifact.a1Stoplines,
    [
      "do_not_include_raw_payload",
      "do_not_include_row_payload",
      "do_not_include_stock_id_payload",
      "do_not_include_secret_or_credential_value",
      "do_not_execute_sql",
      "do_not_write_supabase",
      "do_not_claim_public_real_data_promotion"
    ],
    "a1Stoplines"
  );
  expect(artifact.nextRoute, "a1_prepare_etf_sanitized_candidate_artifact_reply_then_pm_intake_validator", "nextRoute");
  expect(artifact.nextPmRouteIfReplyArrives, "phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads", "nextPmRouteIfReplyArrives");
  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateReport() {
  expect(report.status, "phase_1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads_ready", "report status");
  expect(report.briefDecision, artifact.briefDecision, "report briefDecision");
  expect(report.a1CanExecuteNow, true, "report a1CanExecuteNow");
  expect(report.pmCanAcceptNow, false, "report pmCanAcceptNow");
  expect(report.expectedMissingRows, 118, "report expectedMissingRows");
}

function validateDoc() {
  const requiredTokens = [
    "Phase 1 ETF Sanitized Candidate Artifact Reply Execution Brief",
    "phase_1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads_ready",
    "a1_can_prepare_etf_reply_aggregate_only_pm_intake_ready",
    "a1CanExecuteNow=true",
    "pmCanAcceptNow=false",
    "pmAcceptanceRequiresFutureReply=true",
    "candidateArtifactPathAcceptedNow=false",
    "candidateArtifactReadNow=false",
    "candidateRowsAcceptedNow=false",
    "targetLane=ETF",
    "symbolGroup=ETF",
    "targetScope=phase_1_core_etf_daily_prices_missing_rows",
    "expectedMissingRows=118",
    "candidateMissingRows: 118",
    "expectedRows: 118",
    "sanitizedAggregateOnly: true",
    "rawPayloadIncluded: false",
    "rowPayloadIncluded: false",
    "stockIdPayloadIncluded: false",
    "secretsIncluded: false",
    "do_not_include_raw_payload",
    "do_not_include_row_payload",
    "do_not_include_stock_id_payload",
    "do_not_include_secret_or_credential_value",
    "No Supabase write",
    "No public real-data promotion"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["report:phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads"] !==
    `node ${reportPath}`
  ) {
    problems.push("package.json missing report:phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads");
  }
  if (
    packageJson.scripts?.["check:phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads"] !==
    "node scripts/check-phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads.mjs"
  ) {
    problems.push("package.json missing check:phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads");
  }
  if (!reviewGate.includes("scripts/check-phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads.mjs")) {
    problems.push("review gate missing ETF reply execution brief checker");
  }
  if (!reviewGate.includes('"phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads"')) {
    problems.push("focused review gate missing ETF reply execution brief checker");
  }
}

function validateStatus() {
  const requiredTokens = [
    "Latest Phase 1 ETF sanitized candidate artifact reply execution brief slice",
    "docs/PHASE_1_ETF_SANITIZED_CANDIDATE_ARTIFACT_REPLY_EXECUTION_BRIEF_NO_ROW_PAYLOADS.md",
    "phase_1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads_ready",
    "a1_can_prepare_etf_reply_aggregate_only_pm_intake_ready",
    "a1CanExecuteNow=true",
    "pmCanAcceptNow=false",
    "expectedMissingRows=118",
    "nextRoute=a1_prepare_etf_sanitized_candidate_artifact_reply_then_pm_intake_validator"
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
    /pmCanAcceptNow"\s*:\s*true/u,
    /candidateArtifactReadNow"\s*:\s*true/u,
    /candidateRowsAcceptedNow"\s*:\s*true/u,
    /rawPayloadIncluded:\s*true/u,
    /rowPayloadIncluded:\s*true/u,
    /stockIdPayloadIncluded:\s*true/u,
    /secretsIncluded:\s*true/u
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

function expectDeepEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
  }
}

function expectArray(actual, expected, label) {
  if (!Array.isArray(actual)) {
    problems.push(`${label} must be an array`);
    return;
  }
  const missing = expected.filter((item) => !actual.includes(item));
  const extra = actual.filter((item) => !expected.includes(item));
  if (missing.length > 0 || extra.length > 0) {
    problems.push(`${label} mismatch missing=${JSON.stringify(missing)} extra=${JSON.stringify(extra)}`);
  }
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
