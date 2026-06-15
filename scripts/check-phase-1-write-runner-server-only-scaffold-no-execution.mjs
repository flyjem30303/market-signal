import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-phase-1-write-runner-server-only-scaffold-no-execution.mjs";
const modulePath = "scripts/lib/phase-1-write-runner-server-only-scaffold.mjs";
const artifactPath = "data/evidence-intake/phase-1-write-runner-server-only-scaffold-no-execution.json";
const scopePacketPath = "data/evidence-intake/phase-1-write-runner-implementation-scope-packet-no-execution.json";
const docPath = "docs/PHASE_1_WRITE_RUNNER_SERVER_ONLY_SCAFFOLD_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const moduleSource = read(modulePath);
const artifactRaw = read(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const scopePacket = parseJson(read(scopePacketPath), scopePacketPath);
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

const output = parseJson(run.stdout ?? "", "server-only scaffold stdout");
if (run.status !== 0) problems.push("server-only scaffold report must exit 0");

validatePrerequisites();
validateOutput(output);
validateArtifact(artifact);
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_write_runner_server_only_scaffold_no_execution_ready"
        : "phase_1_write_runner_server_only_scaffold_no_execution_blocked",
      outcome: output.outcome ?? null,
      implementationAllowedNow: output.noExecutionState?.implementationAllowedNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
      publicDataSource: output.safety?.publicDataSource ?? null,
      scoreSource: output.safety?.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(scopePacket.status, "phase_1_write_runner_implementation_scope_packet_no_execution_ready", "scope packet status");
  expect(scopePacket.implementationAllowedNow, false, "scope packet implementationAllowedNow");
  expect(scopePacket.writeGateExecutableNow, false, "scope packet writeGateExecutableNow");
  expect(scopePacket.nextRoute, "phase_1_write_runner_server_only_scaffold_no_execution", "scope packet nextRoute");
}

function validateOutput(output) {
  expect(output.status, "phase_1_write_runner_server_only_scaffold_no_execution_ready", "output status");
  expect(output.outcome, "server_only_scaffold_ready_runtime_still_blocked", "output outcome");
  expect(output.scaffoldMode, "phase_1_write_runner_server_only_scaffold_no_execution", "output scaffoldMode");
  expect(output.sourceScopePacketPath, scopePacketPath, "output sourceScopePacketPath");
  expect(output.modulePath, modulePath, "output modulePath");
  validateTarget(output.target ?? {}, "output.target");
  validatePreparedContracts(output.contracts ?? {}, "output.contracts");
  expectArray(output.contractNames, expectedContracts(), "output.contractNames");
  expectArray(output.blockedActions, expectedBlockedActions(), "output.blockedActions");
  validateNoExecutionState(output.noExecutionState ?? {}, "output.noExecutionState");
  validateSafety(output.safety ?? {}, "output.safety");
  for (const key of [
    "credentialPresence",
    "sanitizedCandidateArtifactPath",
    "boundedInsertMissingOnly",
    "aggregateReadback",
    "rollbackOrQuarantine",
    "postWriteReview",
    "runtimePromotion"
  ]) {
    if (output.preparedContractShapes?.[key]?.prepared !== true) {
      problems.push(`output.preparedContractShapes.${key}.prepared must be true`);
    }
    if (output.preparedContractShapes?.[key]?.executableNow === true) {
      problems.push(`output.preparedContractShapes.${key}.executableNow must not be true`);
    }
  }
}

function validateArtifact(artifact) {
  expect(artifact.status, "phase_1_write_runner_server_only_scaffold_no_execution_ready", "artifact status");
  expect(artifact.outcome, "server_only_scaffold_ready_runtime_still_blocked", "artifact outcome");
  expect(artifact.scaffoldMode, "phase_1_write_runner_server_only_scaffold_no_execution", "artifact scaffoldMode");
  expect(artifact.sourceScopePacketPath, scopePacketPath, "artifact sourceScopePacketPath");
  expect(artifact.modulePath, modulePath, "artifact modulePath");
  validateTarget(artifact, "artifact");
  validatePreparedContracts(artifact, "artifact");
  expectArray(artifact.allowedPreparedContracts, expectedContracts(), "artifact.allowedPreparedContracts");
  expectArray(artifact.blockedRuntimeActions, expectedBlockedActions(), "artifact.blockedRuntimeActions");
  validateNoExecutionState(artifact, "artifact");
  validateSafety(artifact.safety ?? {}, "artifact.safety");
  expect(artifact.nextRoute, "phase_1_write_runner_credential_presence_shape_checker_no_secret_values", "artifact nextRoute");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_write_runner_server_only_scaffold_no_execution_ready",
    "server_only_scaffold_ready_runtime_still_blocked",
    artifactPath,
    modulePath,
    reportPath,
    "scripts/check-phase-1-write-runner-server-only-scaffold-no-execution.mjs",
    `sourceScopePacketPath=${scopePacketPath}`,
    "targetTable=daily_prices",
    "targetScope=twii_and_etf_phase_1_missing_row_closure_only",
    "fullLevel1ExpectedRows=360",
    "fullLevel1ObservedRows=182",
    "fullLevel1MissingRows=178",
    "twiiMissingRows=60",
    "etfMissingRows=118",
    "scaffoldMode=phase_1_write_runner_server_only_scaffold_no_execution",
    "serverOnlyModuleBoundaryPrepared=true",
    "credentialPresenceShapePrepared=true",
    "sanitizedCandidateArtifactPathShapePrepared=true",
    "boundedInsertMissingOnlyContractPrepared=true",
    "aggregateReadbackContractPrepared=true",
    "rollbackOrQuarantineContractPrepared=true",
    "postWriteReviewContractPrepared=true",
    "runtimePromotionContractPrepared=true",
    "supabaseClientImported=false",
    "credentialValuesRead=false",
    "dailyPricesMutated=false",
    "candidateRowsAccepted=false",
    "implementationAllowedNow=false",
    "publicDataSource=mock",
    "scoreSource=mock",
    "does not authorize SQL",
    "Next route: `phase_1_write_runner_credential_presence_shape_checker_no_secret_values`"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (packageJson.scripts?.["report:phase-1-write-runner-server-only-scaffold-no-execution"] !== `node ${reportPath}`) {
    problems.push("package.json missing report:phase-1-write-runner-server-only-scaffold-no-execution");
  }
  if (packageJson.scripts?.["check:phase-1-write-runner-server-only-scaffold-no-execution"] !== "node scripts/check-phase-1-write-runner-server-only-scaffold-no-execution.mjs") {
    problems.push("package.json missing check:phase-1-write-runner-server-only-scaffold-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-runner-server-only-scaffold-no-execution.mjs")) {
    problems.push("review gate missing server-only scaffold checker");
  }
  if (!reviewGate.includes('"phase-1-write-runner-server-only-scaffold-no-execution"')) {
    problems.push("focused review gate missing server-only scaffold checker");
  }
}

function validateBoundaries() {
  for (const [filePath, text] of [
    [reportPath, reportSource],
    [modulePath, moduleSource],
    [artifactPath, artifactRaw],
    [docPath, doc],
    ["server-only scaffold stdout", run.stdout ?? ""]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
    }
  }
}

function validateTarget(target, label) {
  expect(target.targetTable, "daily_prices", `${label}.targetTable`);
  expect(target.targetScope, "twii_and_etf_phase_1_missing_row_closure_only", `${label}.targetScope`);
  expect(target.fullLevel1ExpectedRows, 360, `${label}.fullLevel1ExpectedRows`);
  expect(target.fullLevel1ObservedRows, 182, `${label}.fullLevel1ObservedRows`);
  expect(target.fullLevel1MissingRows, 178, `${label}.fullLevel1MissingRows`);
  expect(target.twiiMissingRows, 60, `${label}.twiiMissingRows`);
  expect(target.etfMissingRows, 118, `${label}.etfMissingRows`);
}

function validatePreparedContracts(contracts, label) {
  for (const [key, expected] of Object.entries({
    serverOnlyModuleBoundaryPrepared: true,
    credentialPresenceShapePrepared: true,
    sanitizedCandidateArtifactPathShapePrepared: true,
    boundedInsertMissingOnlyContractPrepared: true,
    aggregateReadbackContractPrepared: true,
    rollbackOrQuarantineContractPrepared: true,
    postWriteReviewContractPrepared: true,
    runtimePromotionContractPrepared: true
  })) {
    expect(contracts[key], expected, `${label}.${key}`);
  }
}

function validateNoExecutionState(state, label) {
  for (const key of [
    "executeRequested",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "credentialValuesRead",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "promotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    expect(state[key], false, `${label}.${key}`);
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
    "credentialValuePrinted",
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

function expectedContracts() {
  return [
    "server_only_module_boundary",
    "credential_presence_shape_only",
    "sanitized_candidate_artifact_path_shape",
    "bounded_insert_missing_only_contract",
    "aggregate_readback_contract",
    "rollback_or_quarantine_contract",
    "post_write_review_contract",
    "runtime_promotion_contract"
  ];
}

function expectedBlockedActions() {
  return [
    "supabase_client_import",
    "credential_value_read",
    "supabase_connection_attempt",
    "sql_execution",
    "daily_prices_mutation",
    "staging_rows_creation",
    "candidate_row_acceptance",
    "raw_market_data_fetch",
    "raw_payload_output",
    "row_payload_output",
    "secret_output",
    "public_data_source_real_promotion",
    "score_source_real_promotion",
    "investment_advice_claim"
  ];
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
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu
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
