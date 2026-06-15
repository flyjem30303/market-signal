import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads.mjs";
const artifactPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads.json";
const requestPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-path-request-no-fetch.json";
const docPath = "docs/PHASE_1_ETF_SANITIZED_CANDIDATE_ARTIFACT_PATH_INTAKE_NO_ROW_PAYLOADS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const artifactRaw = read(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const request = parseJson(read(requestPath), requestPath);
const doc = read(docPath);
const packageJson = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

const output = parseJson(run.stdout ?? "", "ETF candidate artifact intake stdout");
if (run.status !== 0) problems.push("ETF candidate artifact intake report must exit 0");

validatePrerequisites();
validateOutput(output);
validateArtifact(artifact);
validateDoc();
validateRegistration();
validateBoundaries(run.stdout ?? "");

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_etf_sanitized_candidate_artifact_path_intake_accepted_no_row_payloads"
        : "phase_1_etf_sanitized_candidate_artifact_path_intake_blocked",
      intakeDecision: artifact.intakeDecision ?? null,
      blockedUntilA1Reply: artifact.blockedUntilA1Reply ?? null,
      candidateArtifactPathAccepted: artifact.candidateArtifactPathAccepted ?? null,
      nextRoute: artifact.nextRoute ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(request.status, "phase_1_etf_sanitized_candidate_artifact_path_request_no_fetch_ready", "request status");
  expect(request.blockedUntilA1Reply, true, "request blockedUntilA1Reply");
  expect(request.nextRouteIfA1Replies, "phase_1_etf_sanitized_candidate_artifact_path_intake_no_row_payloads", "request nextRouteIfA1Replies");
}

function validateOutput(output) {
  expect(output.status, "phase_1_etf_sanitized_candidate_artifact_path_intake_accepted_no_row_payloads", "output status");
  expect(output.intakeMode, "pm_intake_accept_etf_aggregate_artifact_path_no_row_payloads", "output intakeMode");
  expect(output.sourceRequestPath, requestPath, "output sourceRequestPath");
  expect(output.intakeDecision, "accepted_a1_etf_sanitized_candidate_artifact_path_aggregate_only", "output intakeDecision");
  expect(output.blockedUntilA1Reply, false, "output blockedUntilA1Reply");
  expect(output.candidateArtifactPath, "data/candidates/phase-1-etf-sanitized-candidate.json", "output candidateArtifactPath");
  expect(output.candidateArtifactPathAccepted, true, "output candidateArtifactPathAccepted");
  expect(output.candidateArtifactMetadataRead, true, "output candidateArtifactMetadataRead");
  expect(output.candidateArtifactRead, false, "output candidateArtifactRead");
  expect(output.candidateRowPayloadRead, false, "output candidateRowPayloadRead");
  expect(output.rawPayloadRead, false, "output rawPayloadRead");
  expect(output.expectedMissingRows, 118, "output expectedMissingRows");
  expect(output.executionAllowedNow, false, "output executionAllowedNow");
  expect(output.writeGateExecutableNow, false, "output writeGateExecutableNow");
  expect(output.implementationAllowedNow, false, "output implementationAllowedNow");
  expect(output.nextRoute, "phase_1_write_runner_candidate_artifact_set_acceptance_gate", "output nextRoute");
  validateReplyContract(output.requiredA1ReplyContract ?? {}, "output.requiredA1ReplyContract");
  validateSafety(output.safety ?? {}, "output.safety");
}

function validateArtifact(artifact) {
  expect(artifact.status, "phase_1_etf_sanitized_candidate_artifact_path_intake_accepted_no_row_payloads", "artifact status");
  expect(artifact.intakeMode, "pm_intake_accept_etf_aggregate_artifact_path_no_row_payloads", "artifact intakeMode");
  expect(artifact.sourceRequestPath, requestPath, "artifact sourceRequestPath");
  expect(artifact.intakeDecision, "accepted_a1_etf_sanitized_candidate_artifact_path_aggregate_only", "artifact intakeDecision");
  expect(artifact.blockedUntilA1Reply, false, "artifact blockedUntilA1Reply");
  expect(artifact.candidateArtifactPath, "data/candidates/phase-1-etf-sanitized-candidate.json", "artifact candidateArtifactPath");
  expect(artifact.candidateArtifactPathAccepted, true, "artifact candidateArtifactPathAccepted");
  expect(artifact.candidateArtifactMetadataRead, true, "artifact candidateArtifactMetadataRead");
  expect(artifact.candidateArtifactRead, false, "artifact candidateArtifactRead");
  expect(artifact.candidateRowPayloadRead, false, "artifact candidateRowPayloadRead");
  expect(artifact.rawPayloadRead, false, "artifact rawPayloadRead");
  expect(artifact.expectedMissingRows, 118, "artifact expectedMissingRows");
  expect(artifact.executionAllowedNow, false, "artifact executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "artifact writeGateExecutableNow");
  expect(artifact.implementationAllowedNow, false, "artifact implementationAllowedNow");
  expect(artifact.nextRoute, "phase_1_write_runner_candidate_artifact_set_acceptance_gate", "artifact nextRoute");
  validateReplyContract(artifact.requiredA1ReplyContract ?? {}, "artifact.requiredA1ReplyContract");
  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateReplyContract(contract, label) {
  expect(contract.candidateMissingRowsMustEqual, 118, `${label}.candidateMissingRowsMustEqual`);
  expect(contract.expectedRowsMustEqual, 118, `${label}.expectedRowsMustEqual`);
  expect(contract.sanitizedAggregateOnlyMustBe, true, `${label}.sanitizedAggregateOnlyMustBe`);
  expect(contract.rawPayloadIncludedMustBe, false, `${label}.rawPayloadIncludedMustBe`);
  expect(contract.rowPayloadIncludedMustBe, false, `${label}.rowPayloadIncludedMustBe`);
  expect(contract.stockIdPayloadIncludedMustBe, false, `${label}.stockIdPayloadIncludedMustBe`);
  expect(contract.secretsIncludedMustBe, false, `${label}.secretsIncludedMustBe`);
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_etf_sanitized_candidate_artifact_path_intake_accepted_no_row_payloads",
    "pm_intake_accept_etf_aggregate_artifact_path_no_row_payloads",
    `sourceRequestPath=${requestPath}`,
    "intakeDecision=accepted_a1_etf_sanitized_candidate_artifact_path_aggregate_only",
    "blockedUntilA1Reply=false",
    "candidateArtifactPath=data/candidates/phase-1-etf-sanitized-candidate.json",
    "candidateArtifactPathAccepted=true",
    "candidateArtifactMetadataRead=true",
    "candidateArtifactRead=false",
    "candidateRowPayloadRead=false",
    "rawPayloadRead=false",
    "expectedMissingRows=118",
    "candidateMissingRowsMustEqual=118",
    "expectedRowsMustEqual=118",
    "sanitizedAggregateOnlyMustBe=true",
    "rawPayloadIncludedMustBe=false",
    "rowPayloadIncludedMustBe=false",
    "stockIdPayloadIncludedMustBe=false",
    "secretsIncludedMustBe=false",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "implementationAllowedNow=false",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No candidate row payload read",
    "No row payload read",
    "No Supabase write",
    "No `daily_prices` mutation",
    "phase_1_write_runner_candidate_artifact_set_acceptance_gate"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (packageJson.scripts?.["report:phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads"] !== `node ${reportPath}`) {
    problems.push("package.json missing report:phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads");
  }
  if (packageJson.scripts?.["check:phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads"] !== "node scripts/check-phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads.mjs") {
    problems.push("package.json missing check:phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads");
  }
  if (!reviewGate.includes("scripts/check-phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads.mjs")) {
    problems.push("review gate missing ETF candidate artifact intake checker");
  }
  if (!reviewGate.includes('"phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads"')) {
    problems.push("focused review gate missing ETF candidate artifact intake checker");
  }
}

function validateBoundaries(stdout) {
  for (const [filePath, text] of [
    [reportPath, read(reportPath)],
    [artifactPath, artifactRaw],
    [docPath, doc],
    ["ETF candidate artifact intake stdout", stdout]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
    }
  }
}

function validateSafety(safety, label) {
  expect(safety.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(safety.scoreSource, "mock", `${label}.scoreSource`);
  for (const key of [
    "candidateArtifactRead",
    "candidateRowPayloadRead",
    "rawPayloadRead",
    "stockIdPayloadRead",
    "rowPayloadOutput",
    "rawPayloadOutput",
    "secretsOutput",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "marketDataFetched",
    "marketDataIngested",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(safety[key], false, `${label}.${key}`);
  }
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /candidateArtifactRead":\s*true/u,
    /candidateRowPayloadRead":\s*true/u,
    /dailyPricesMutated":\s*true/u
  ];
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function read(filePath) {
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
    problems.push(`${label} must be JSON: ${error.message}`);
    return {};
  }
}
