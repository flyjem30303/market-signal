import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads.json";
const reportPath = "scripts/report-phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads.mjs";
const candidateGatePath = "data/evidence-intake/phase-1-write-runner-candidate-artifact-set-acceptance-gate.json";
const docPath = "docs/PHASE_1_ETF_SANITIZED_CANDIDATE_ARTIFACT_REPLY_TEMPLATE_NO_ROW_PAYLOADS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
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

validateCandidateGate();
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
        ? "phase_1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads_ready"
        : "phase_1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads_blocked",
      templateDecision: artifact.templateDecision ?? null,
      expectedMissingRows: artifact.expectedMissingRows ?? null,
      outputContainsRowPayload: artifact.outputContainsRowPayload ?? null,
      nextRoute: artifact.nextRoute ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateCandidateGate() {
  expect(
    candidateGate.status,
    "phase_1_write_runner_candidate_artifact_set_acceptance_gate_waiting_etf_artifact",
    "candidate gate status"
  );
  expect(candidateGate.artifactSetComplete, false, "candidate gate artifactSetComplete");
  expect(candidateGate.etfArtifactAccepted, false, "candidate gate etfArtifactAccepted");
  expect(candidateGate.nextRoute, "wait_for_a1_etf_sanitized_candidate_artifact_reply", "candidate gate nextRoute");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads_ready", "artifact status");
  expect(artifact.templateMode, "a1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads", "templateMode");
  expect(
    artifact.sourceCandidateGateStatus,
    "phase_1_write_runner_candidate_artifact_set_acceptance_gate_waiting_etf_artifact",
    "sourceCandidateGateStatus"
  );
  expect(artifact.templateDecision, "ready_for_a1_etf_sanitized_aggregate_reply", "templateDecision");
  expect(artifact.targetLane, "ETF", "targetLane");
  expect(artifact.targetScope, "phase_1_core_etf_daily_prices_missing_rows", "targetScope");
  expect(artifact.expectedMissingRows, 118, "expectedMissingRows");
  expect(artifact.requiredSanitizedAggregateOnly, true, "requiredSanitizedAggregateOnly");
  expect(artifact.outputContainsRowPayload, false, "outputContainsRowPayload");
  expect(artifact.outputContainsRawPayload, false, "outputContainsRawPayload");
  expect(artifact.outputContainsStockIdPayload, false, "outputContainsStockIdPayload");
  expect(artifact.outputContainsSecrets, false, "outputContainsSecrets");
  expect(artifact.nextRoute, "a1_reply_then_pm_etf_sanitized_candidate_artifact_path_intake", "nextRoute");

  expectArray(artifact.requiredReplyFields, [
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
  ], "requiredReplyFields");

  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateReport() {
  expect(report.status, "phase_1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads_ready", "report status");
  expect(report.templateDecision, artifact.templateDecision, "report templateDecision");
  expect(report.expectedMissingRows, 118, "report expectedMissingRows");
  expect(report.outputContainsRowPayload, false, "report outputContainsRowPayload");
}

function validateDoc() {
  const requiredTokens = [
    "Phase 1 ETF Sanitized Candidate Artifact Reply Template",
    "phase_1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads_ready",
    "ready_for_a1_etf_sanitized_aggregate_reply",
    "targetLane=ETF",
    "targetScope=phase_1_core_etf_daily_prices_missing_rows",
    "expectedMissingRows=118",
    "requiredSanitizedAggregateOnly=true",
    "outputContainsRowPayload=false",
    "outputContainsRawPayload=false",
    "outputContainsStockIdPayload=false",
    "outputContainsSecrets=false",
    "requiredReplyFields",
    "candidateArtifactPath:",
    "candidateMissingRows: 118",
    "expectedRows: 118",
    "sanitizedAggregateOnly: true",
    "rawPayloadIncluded: false",
    "rowPayloadIncluded: false",
    "stockIdPayloadIncluded: false",
    "secretsIncluded: false",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No raw market data",
    "No row payload",
    "No secret"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["report:phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads"] !==
    `node ${reportPath}`
  ) {
    problems.push("package.json missing report:phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads");
  }
  if (
    packageJson.scripts?.["check:phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads"] !==
    "node scripts/check-phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads.mjs"
  ) {
    problems.push("package.json missing check:phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads");
  }
  if (!reviewGate.includes("scripts/check-phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads.mjs")) {
    problems.push("review gate missing ETF reply template checker");
  }
  if (!reviewGate.includes('"phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads"')) {
    problems.push("focused review gate missing ETF reply template checker");
  }
}

function validateStatus() {
  const requiredTokens = [
    "Latest Phase 1 ETF sanitized candidate artifact reply template slice",
    "docs/PHASE_1_ETF_SANITIZED_CANDIDATE_ARTIFACT_REPLY_TEMPLATE_NO_ROW_PAYLOADS.md",
    "phase_1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads_ready",
    "ready_for_a1_etf_sanitized_aggregate_reply",
    "expectedMissingRows=118",
    "nextRoute=a1_reply_then_pm_etf_sanitized_candidate_artifact_path_intake"
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
    /outputContainsRowPayload"\s*:\s*true/u,
    /outputContainsRawPayload"\s*:\s*true/u,
    /outputContainsSecrets"\s*:\s*true/u,
    /rowPayloadIncluded:\s*true/u,
    /rawPayloadIncluded:\s*true/u,
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
