import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-phase-1-write-runner-credential-presence-shape-checker-no-secret-values.mjs";
const artifactPath = "data/evidence-intake/phase-1-write-runner-credential-presence-shape-checker-no-secret-values.json";
const scaffoldPath = "data/evidence-intake/phase-1-write-runner-server-only-scaffold-no-execution.json";
const docPath = "docs/PHASE_1_WRITE_RUNNER_CREDENTIAL_PRESENCE_SHAPE_CHECKER_NO_SECRET_VALUES.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const artifactRaw = read(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const scaffold = parseJson(read(scaffoldPath), scaffoldPath);
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

const output = parseJson(run.stdout ?? "", "credential presence shape checker stdout");
if (run.status !== 0) problems.push("credential presence shape checker report must exit 0");

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
        ? "phase_1_write_runner_credential_presence_shape_checker_no_secret_values_ready"
        : "phase_1_write_runner_credential_presence_shape_checker_no_secret_values_blocked",
      credentialCheckMode: artifact.credentialCheckMode ?? null,
      credentialValueRead: artifact.credentialValueRead ?? null,
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
  expect(scaffold.status, "phase_1_write_runner_server_only_scaffold_no_execution_ready", "scaffold status");
  expect(scaffold.credentialPresenceShapePrepared, true, "scaffold credentialPresenceShapePrepared");
  expect(scaffold.credentialValuesRead, false, "scaffold credentialValuesRead");
  expect(scaffold.nextRoute, "phase_1_write_runner_credential_presence_shape_checker_no_secret_values", "scaffold nextRoute");
}

function validateOutput(output) {
  expect(output.status, "phase_1_write_runner_credential_presence_shape_checker_no_secret_values_ready", "output status");
  expect(output.credentialCheckMode, "name_shape_only_no_secret_value_access", "output credentialCheckMode");
  expect(output.sourceScaffoldPath, scaffoldPath, "output sourceScaffoldPath");
  expect(output.credentialValueRead, false, "output credentialValueRead");
  expect(output.credentialValuePrinted, false, "output credentialValuePrinted");
  expect(output.envValueOutput, false, "output envValueOutput");
  expect(output.executionAllowedNow, false, "output executionAllowedNow");
  expect(output.writeGateExecutableNow, false, "output writeGateExecutableNow");
  expect(output.implementationAllowedNow, false, "output implementationAllowedNow");
  expect(output.nextRoute, "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads", "output nextRoute");
  validateShapeResult(output.shapeResult ?? {}, "output.shapeResult");
  validateSafety(output.safety ?? {}, "output.safety");
}

function validateArtifact(artifact) {
  expect(artifact.status, "phase_1_write_runner_credential_presence_shape_checker_no_secret_values_ready", "artifact status");
  expect(artifact.credentialCheckMode, "name_shape_only_no_secret_value_access", "artifact credentialCheckMode");
  expect(artifact.sourceScaffoldPath, scaffoldPath, "artifact sourceScaffoldPath");
  expect(artifact.credentialValueRead, false, "artifact credentialValueRead");
  expect(artifact.credentialValueStored, false, "artifact credentialValueStored");
  expect(artifact.credentialValuePrinted, false, "artifact credentialValuePrinted");
  expect(artifact.envValueOutput, false, "artifact envValueOutput");
  expect(artifact.executionAllowedNow, false, "artifact executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "artifact writeGateExecutableNow");
  expect(artifact.implementationAllowedNow, false, "artifact implementationAllowedNow");
  expect(artifact.nextRoute, "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads", "artifact nextRoute");
  validateShapeResult(artifact.shapeResult ?? {}, "artifact.shapeResult");
  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateShapeResult(shapeResult, label) {
  expect(shapeResult.hasUrlName, true, `${label}.hasUrlName`);
  expect(shapeResult.hasServiceCredentialName, true, `${label}.hasServiceCredentialName`);
  expectArray(shapeResult.requiredNames, ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"], `${label}.requiredNames`);
  expectArray(shapeResult.missingNames, [], `${label}.missingNames`);
  expect(shapeResult.unsafeProblemCount, 0, `${label}.unsafeProblemCount`);
  expect(shapeResult.outputMode, "required_name_presence_only", `${label}.outputMode`);
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_write_runner_credential_presence_shape_checker_no_secret_values_ready",
    "name_shape_only_no_secret_value_access",
    `sourceScaffoldPath=${scaffoldPath}`,
    "credentialValueRead=false",
    "credentialValueStored=false",
    "credentialValuePrinted=false",
    "envValueOutput=false",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "implementationAllowedNow=false",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "missingNames=[]",
    "unsafeProblemCount=0",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No secret value read",
    "No env value output",
    "No Supabase client import",
    "No SQL",
    "No Supabase write",
    "No `daily_prices` mutation",
    "No public real-data claim",
    "No investment advice",
    "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (packageJson.scripts?.["report:phase-1-write-runner-credential-presence-shape-checker-no-secret-values"] !== `node ${reportPath}`) {
    problems.push("package.json missing report:phase-1-write-runner-credential-presence-shape-checker-no-secret-values");
  }
  if (packageJson.scripts?.["check:phase-1-write-runner-credential-presence-shape-checker-no-secret-values"] !== "node scripts/check-phase-1-write-runner-credential-presence-shape-checker-no-secret-values.mjs") {
    problems.push("package.json missing check:phase-1-write-runner-credential-presence-shape-checker-no-secret-values");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-runner-credential-presence-shape-checker-no-secret-values.mjs")) {
    problems.push("review gate missing credential presence shape checker");
  }
  if (!reviewGate.includes('"phase-1-write-runner-credential-presence-shape-checker-no-secret-values"')) {
    problems.push("focused review gate missing credential presence shape checker");
  }
}

function validateBoundaries(stdout) {
  for (const [filePath, text] of [
    [reportPath, read(reportPath)],
    [artifactPath, artifactRaw],
    [docPath, doc],
    ["credential presence shape checker stdout", stdout]
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
    "valuesRead",
    "valuesStored",
    "valuesPrinted",
    "credentialValueRead",
    "credentialValueStored",
    "credentialValuePrinted",
    "envValueOutput",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "secretsOutput",
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
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /process\.env/u,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /credentialValueRead":\s*true/u,
    /credentialValuePrinted":\s*true/u,
    /envValueOutput":\s*true/u
  ];
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
