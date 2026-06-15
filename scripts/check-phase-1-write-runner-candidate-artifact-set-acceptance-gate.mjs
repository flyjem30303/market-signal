import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-write-runner-candidate-artifact-set-acceptance-gate.json";
const reportPath = "scripts/report-phase-1-write-runner-candidate-artifact-set-acceptance-gate.mjs";
const sourceReviewPath = "data/evidence-intake/phase-1-write-runner-post-write-review-contract-no-execution.json";
const etfIntakePath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads.json";
const docPath = "docs/PHASE_1_WRITE_RUNNER_CANDIDATE_ARTIFACT_SET_ACCEPTANCE_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const sourceReview = parseJson(readText(sourceReviewPath), sourceReviewPath);
const etfIntake = parseJson(readText(etfIntakePath), etfIntakePath);
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

validatePrerequisites();
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
        ? "phase_1_write_runner_candidate_artifact_set_acceptance_gate_artifact_set_complete_no_execution"
        : "phase_1_write_runner_candidate_artifact_set_acceptance_gate_blocked",
      artifactSetComplete: artifact.artifactSetComplete ?? null,
      etfArtifactAccepted: artifact.etfArtifactAccepted ?? null,
      executionAllowedNow: artifact.executionAllowedNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(
    sourceReview.status,
    "phase_1_write_runner_post_write_review_contract_no_execution_ready",
    "source review status"
  );
  expect(sourceReview.nextRoute, "phase_1_write_runner_candidate_artifact_set_acceptance_gate", "source review nextRoute");
  expect(
    etfIntake.status,
    "phase_1_etf_sanitized_candidate_artifact_path_intake_accepted_no_row_payloads",
    "ETF intake status"
  );
  expect(etfIntake.blockedUntilA1Reply, false, "ETF blockedUntilA1Reply");
  expect(etfIntake.candidateArtifactPathAccepted, true, "ETF candidateArtifactPathAccepted");
  expect(etfIntake.expectedMissingRows, 118, "ETF expectedMissingRows");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_write_runner_candidate_artifact_set_acceptance_gate_artifact_set_complete_no_execution", "artifact status");
  expect(artifact.gateMode, "candidate_artifact_set_acceptance_gate", "gateMode");
  expect(artifact.sourceReviewStatus, "phase_1_write_runner_post_write_review_contract_no_execution_ready", "sourceReviewStatus");
  expect(artifact.acceptanceDecision, "artifact_set_complete_twii_and_etf_aggregate_artifacts_accepted_no_execution", "acceptanceDecision");
  expect(artifact.twiiArtifactAccepted, true, "twiiArtifactAccepted");
  expect(artifact.etfArtifactAccepted, true, "etfArtifactAccepted");
  expect(artifact.artifactSetComplete, true, "artifactSetComplete");
  expect(artifact.expectedMissingRows, 178, "expectedMissingRows");
  expect(artifact.twiiMissingRows, 60, "twiiMissingRows");
  expect(artifact.etfMissingRows, 118, "etfMissingRows");
  expect(artifact.executionAllowedNow, false, "executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.implementationAllowedNow, false, "implementationAllowedNow");
  expect(artifact.promotionAllowedNow, false, "promotionAllowedNow");
  expect(artifact.nextRoute, "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution", "nextRoute");

  expectArray(artifact.requiredA1ReplyFields, [
    "candidateArtifactPath",
    "artifactId",
    "lane",
    "scope",
    "coverageWindowSessions",
    "candidateMissingRows",
    "expectedRows",
    "aggregateValidation",
    "sanitizedAggregateOnly",
    "rawPayloadIncluded",
    "rowPayloadIncluded",
    "stockIdPayloadIncluded",
    "secretsIncluded"
  ], "requiredA1ReplyFields");

  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateReport() {
  expect(report.status, "phase_1_write_runner_candidate_artifact_set_acceptance_gate_artifact_set_complete_no_execution", "report status");
  expect(report.artifactSetComplete, true, "report artifactSetComplete");
  expect(report.etfArtifactAccepted, true, "report etfArtifactAccepted");
  expect(report.executionAllowedNow, false, "report executionAllowedNow");
}

function validateDoc() {
  const requiredTokens = [
    "Phase 1 Write Runner Candidate Artifact Set Acceptance Gate",
    "phase_1_write_runner_candidate_artifact_set_acceptance_gate_artifact_set_complete_no_execution",
    "artifact_set_complete_twii_and_etf_aggregate_artifacts_accepted_no_execution",
    "twiiArtifactAccepted=true",
    "etfArtifactAccepted=true",
    "artifactSetComplete=true",
    "expectedMissingRows=178",
    "twiiMissingRows=60",
    "etfMissingRows=118",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "implementationAllowedNow=false",
    "promotionAllowedNow=false",
    "requiredA1ReplyFields",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No candidate row acceptance",
    "No Supabase write",
    "No public real-data promotion",
    "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["report:phase-1-write-runner-candidate-artifact-set-acceptance-gate"] !==
    `node ${reportPath}`
  ) {
    problems.push("package.json missing report:phase-1-write-runner-candidate-artifact-set-acceptance-gate");
  }
  if (
    packageJson.scripts?.["check:phase-1-write-runner-candidate-artifact-set-acceptance-gate"] !==
    "node scripts/check-phase-1-write-runner-candidate-artifact-set-acceptance-gate.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-runner-candidate-artifact-set-acceptance-gate");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-runner-candidate-artifact-set-acceptance-gate.mjs")) {
    problems.push("review gate missing candidate artifact set acceptance checker");
  }
  if (!reviewGate.includes('"phase-1-write-runner-candidate-artifact-set-acceptance-gate"')) {
    problems.push("focused review gate missing candidate artifact set acceptance checker");
  }
}

function validateStatus() {
  const requiredTokens = [
    "Latest Phase 1 candidate artifact set acceptance gate slice",
    "docs/PHASE_1_WRITE_RUNNER_CANDIDATE_ARTIFACT_SET_ACCEPTANCE_GATE.md",
    "phase_1_write_runner_candidate_artifact_set_acceptance_gate_artifact_set_complete_no_execution",
    "artifactSetComplete=true",
    "etfArtifactAccepted=true",
    "nextRoute=phase_1_write_runner_bounded_insert_missing_only_contract_no_execution"
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
