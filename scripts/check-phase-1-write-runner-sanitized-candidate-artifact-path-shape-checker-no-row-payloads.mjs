import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-phase-1-write-runner-sanitized-candidate-artifact-path-shape-checker-no-row-payloads.mjs";
const artifactPath = "data/evidence-intake/phase-1-write-runner-sanitized-candidate-artifact-path-shape-checker-no-row-payloads.json";
const credentialShapePath = "data/evidence-intake/phase-1-write-runner-credential-presence-shape-checker-no-secret-values.json";
const docPath = "docs/PHASE_1_WRITE_RUNNER_SANITIZED_CANDIDATE_ARTIFACT_PATH_SHAPE_CHECKER_NO_ROW_PAYLOADS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const artifactRaw = read(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const credentialShape = parseJson(read(credentialShapePath), credentialShapePath);
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

const output = parseJson(run.stdout ?? "", "candidate artifact path shape checker stdout");
if (run.status !== 0) problems.push("candidate artifact path shape checker report must exit 0");

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
        ? "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads_ready"
        : "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads_blocked",
      candidateArtifactPathSetComplete: artifact.pathShape?.candidateArtifactPathSetComplete ?? null,
      twiiCandidateArtifactPathExists: artifact.pathShape?.twiiCandidateArtifactPathExists ?? null,
      etfCandidateArtifactPathExists: artifact.pathShape?.etfCandidateArtifactPathExists ?? null,
      nextRoute: artifact.nextRoute ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(credentialShape.status, "phase_1_write_runner_credential_presence_shape_checker_no_secret_values_ready", "credential shape status");
  expect(credentialShape.credentialValueRead, false, "credential shape credentialValueRead");
  expect(credentialShape.nextRoute, "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads", "credential shape nextRoute");
}

function validateOutput(output) {
  expect(output.status, "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads_ready", "output status");
  expect(output.pathCheckMode, "path_presence_only_no_row_payloads", "output pathCheckMode");
  expect(output.sourceCredentialShapePath, credentialShapePath, "output sourceCredentialShapePath");
  validatePathShape(output.pathShape ?? {}, "output.pathShape");
  expect(output.executionAllowedNow, false, "output executionAllowedNow");
  expect(output.writeGateExecutableNow, false, "output writeGateExecutableNow");
  expect(output.implementationAllowedNow, false, "output implementationAllowedNow");
  expect(output.nextRoute, "phase_1_etf_sanitized_candidate_artifact_path_request_no_fetch", "output nextRoute");
  validateSafety(output.safety ?? {}, "output.safety");
}

function validateArtifact(artifact) {
  expect(artifact.status, "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads_ready", "artifact status");
  expect(artifact.pathCheckMode, "path_presence_only_no_row_payloads", "artifact pathCheckMode");
  expect(artifact.sourceCredentialShapePath, credentialShapePath, "artifact sourceCredentialShapePath");
  validatePathShape(artifact.pathShape ?? {}, "artifact.pathShape");
  expect(artifact.executionAllowedNow, false, "artifact executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "artifact writeGateExecutableNow");
  expect(artifact.implementationAllowedNow, false, "artifact implementationAllowedNow");
  expect(artifact.nextRoute, "phase_1_etf_sanitized_candidate_artifact_path_request_no_fetch", "artifact nextRoute");
  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validatePathShape(pathShape, label) {
  expect(pathShape.twiiCandidateArtifactPath, "data/candidates/twii-sanitized-candidate.json", `${label}.twiiCandidateArtifactPath`);
  expect(pathShape.twiiCandidateArtifactPathExists, true, `${label}.twiiCandidateArtifactPathExists`);
  expect(pathShape.twiiExpectedMissingRows, 60, `${label}.twiiExpectedMissingRows`);
  expect(pathShape.etfCandidateArtifactPath, null, `${label}.etfCandidateArtifactPath`);
  expect(pathShape.etfCandidateArtifactPathExists, false, `${label}.etfCandidateArtifactPathExists`);
  expect(pathShape.etfExpectedMissingRows, 118, `${label}.etfExpectedMissingRows`);
  expect(pathShape.fullLevel1MissingRows, 178, `${label}.fullLevel1MissingRows`);
  expect(pathShape.candidateArtifactPathSetComplete, false, `${label}.candidateArtifactPathSetComplete`);
  expect(pathShape.outputMode, "path_presence_and_aggregate_counts_only", `${label}.outputMode`);
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads_ready",
    "path_presence_only_no_row_payloads",
    `sourceCredentialShapePath=${credentialShapePath}`,
    "twiiCandidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
    "twiiCandidateArtifactPathExists=true",
    "twiiExpectedMissingRows=60",
    "etfCandidateArtifactPath=null",
    "etfCandidateArtifactPathExists=false",
    "etfExpectedMissingRows=118",
    "fullLevel1MissingRows=178",
    "candidateArtifactPathSetComplete=false",
    "outputMode=path_presence_and_aggregate_counts_only",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "implementationAllowedNow=false",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No candidate artifact content read",
    "No candidate row payload read",
    "No raw payload read",
    "No stock-id payload read",
    "No `daily_prices` mutation",
    "No public real-data claim",
    "phase_1_etf_sanitized_candidate_artifact_path_request_no_fetch"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (packageJson.scripts?.["report:phase-1-write-runner-sanitized-candidate-artifact-path-shape-checker-no-row-payloads"] !== `node ${reportPath}`) {
    problems.push("package.json missing report:phase-1-write-runner-sanitized-candidate-artifact-path-shape-checker-no-row-payloads");
  }
  if (packageJson.scripts?.["check:phase-1-write-runner-sanitized-candidate-artifact-path-shape-checker-no-row-payloads"] !== "node scripts/check-phase-1-write-runner-sanitized-candidate-artifact-path-shape-checker-no-row-payloads.mjs") {
    problems.push("package.json missing check:phase-1-write-runner-sanitized-candidate-artifact-path-shape-checker-no-row-payloads");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-runner-sanitized-candidate-artifact-path-shape-checker-no-row-payloads.mjs")) {
    problems.push("review gate missing candidate artifact path shape checker");
  }
  if (!reviewGate.includes('"phase-1-write-runner-sanitized-candidate-artifact-path-shape-checker-no-row-payloads"')) {
    problems.push("focused review gate missing candidate artifact path shape checker");
  }
}

function validateBoundaries(stdout) {
  for (const [filePath, text] of [
    [reportPath, reportSource],
    [artifactPath, artifactRaw],
    [docPath, doc],
    ["candidate artifact path shape checker stdout", stdout]
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
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(safety[key], false, `${label}.${key}`);
  }
}

function forbiddenPatterns() {
  return [
    /JSON\.parse\s*\(\s*fs\.readFileSync/u,
    /readFileSync\s*\(\s*twiiCandidateArtifactPath/u,
    /readFileSync\s*\(\s*etfCandidateArtifactPath/u,
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
    /rawPayloadRead":\s*true/u,
    /stockIdPayloadRead":\s*true/u
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
