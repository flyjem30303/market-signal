import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_REAL_ACCEPTED_AUTHORIZATION_EXTERNAL_INTAKE_RECORD_NO_EXECUTION.md";
const artifactPath =
  "data/evidence-intake/phase-1-runtime-promotion-real-accepted-authorization-external-intake-record-no-execution.json";
const goNoGoCheckerPath = "scripts/check-phase-1-runtime-promotion-operator-go-no-go-record-no-execution.mjs";
const defaultTemplatePath = "data/evidence-intake/phase-1-runtime-promotion-bounded-write-authorization-response.template.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";
const problems = [];

const doc = read(docPath);
const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const template = parseJson(read(defaultTemplatePath), defaultTemplatePath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const goNoGo = runJson(goNoGoCheckerPath);

validateDependency();
validateDocs();
validateArtifact();
validateNoCommittedAcceptedAuthorizationResponse();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_real_accepted_authorization_external_intake_record_no_execution_ready"
        : "phase_1_runtime_promotion_real_accepted_authorization_external_intake_record_no_execution_blocked",
      recordDecision: artifact.recordDecision ?? null,
      externalLocalPathOnly: artifact.externalLocalPathOnly === true,
      committedAcceptedAuthorizationResponseAllowed: artifact.committedAcceptedAuthorizationResponseAllowed === true,
      acceptedAuthorizationResponsePresentNow: artifact.acceptedAuthorizationResponsePresentNow === true,
      freshPmGoNoGoForExecutionPresentNow: artifact.freshPmGoNoGoForExecutionPresentNow === true,
      boundedAttemptExecutableNow: false,
      writeGateExecutableNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: ok ? artifact.nextRoute : "keep_mock_and_request_repair",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateDependency() {
  expect(goNoGo.status, "ok", "goNoGo.status");
  expect(goNoGo.guardedStatus, "phase_1_runtime_promotion_operator_go_no_go_record_no_execution_ready", "goNoGo.guardedStatus");
  expect(goNoGo.acceptedAuthorizationResponsePresent, false, "goNoGo.acceptedAuthorizationResponsePresent");
  expect(goNoGo.freshPmGoNoGoForExecutionPresent, false, "goNoGo.freshPmGoNoGoForExecutionPresent");
  expect(goNoGo.boundedAttemptExecutableNow, false, "goNoGo.boundedAttemptExecutableNow");
  expect(goNoGo.writeGateExecutableNow, false, "goNoGo.writeGateExecutableNow");
  expect(template.operatorDecision, "REJECT_KEEP_MOCK", "template.operatorDecision");
  expect(template.confirmationCompleteness, "incomplete", "template.confirmationCompleteness");
}

function validateDocs() {
  for (const [label, text, phrases] of [
    [
      docPath,
      doc,
      [
        "Status: `phase_1_runtime_promotion_real_accepted_authorization_external_intake_record_no_execution_ready`",
        "Decision: `PREPARE_EXTERNAL_AUTHORIZATION_INTAKE_KEEP_MOCK`",
        "`externalLocalPathOnly=true`",
        "`committedAcceptedAuthorizationResponseAllowed=false`",
        "`defaultCommittedTemplateMustRemainRejected=true`",
        "`acceptedAuthorizationResponsePresentNow=false`",
        "`freshPmGoNoGoForExecutionPresentNow=false`",
        "`operatorDecision=APPROVE_ONE_BOUNDED_WRITE_ATTEMPT`",
        "`boundedAttemptExecutableNow=false`",
        "`writeGateExecutableNow=false`",
        "`runnerExecutableNow=false`",
        "`promotionAllowedNow=false`",
        "`publicDataSource=mock`",
        "`scoreSource=mock`",
        "`await_external_local_authorization_response_file_or_keep_mock`"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Runtime Promotion Real Accepted Authorization External Intake Record",
        "phase_1_runtime_promotion_real_accepted_authorization_external_intake_record_no_execution_ready",
        "PREPARE_EXTERNAL_AUTHORIZATION_INTAKE_KEEP_MOCK"
      ]
    ]
  ]) {
    for (const phrase of phrases) if (!text.includes(phrase)) problems.push(`${label} missing phrase: ${phrase}`);
    for (const phrase of hardStops()) if (!text.includes(phrase)) problems.push(`${label} missing hard stop: ${phrase}`);
  }
}

function validateArtifact() {
  expect(
    artifact.recordMode,
    "phase_1_runtime_promotion_real_accepted_authorization_external_intake_record_no_execution",
    "artifact.recordMode"
  );
  expect(
    artifact.recordLabel,
    "PHASE_1_RUNTIME_PROMOTION_REAL_ACCEPTED_AUTHORIZATION_EXTERNAL_INTAKE_RECORD_NO_EXECUTION",
    "artifact.recordLabel"
  );
  expect(artifact.recordDecision, "PREPARE_EXTERNAL_AUTHORIZATION_INTAKE_KEEP_MOCK", "artifact.recordDecision");
  expect(
    artifact.sourceOperatorGoNoGoRecordStatus,
    "phase_1_runtime_promotion_operator_go_no_go_record_no_execution_ready",
    "artifact.sourceOperatorGoNoGoRecordStatus"
  );
  expect(artifact.externalLocalPathOnly, true, "artifact.externalLocalPathOnly");
  expect(artifact.committedAcceptedAuthorizationResponseAllowed, false, "artifact.committedAcceptedAuthorizationResponseAllowed");
  expect(artifact.defaultCommittedTemplateMustRemainRejected, true, "artifact.defaultCommittedTemplateMustRemainRejected");
  expect(artifact.acceptedAuthorizationResponsePresentNow, false, "artifact.acceptedAuthorizationResponsePresentNow");
  expect(artifact.freshPmGoNoGoForExecutionPresentNow, false, "artifact.freshPmGoNoGoForExecutionPresentNow");
  expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
  expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
  expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
  expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
  expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
  expect(artifact.scoreSource, "mock", "artifact.scoreSource");
  expect(artifact.nextRoute, "await_external_local_authorization_response_file_or_keep_mock", "artifact.nextRoute");

  const shape = artifact.requiredExternalResponseShape ?? {};
  expect(shape.responseMode, "phase_1_runtime_promotion_bounded_write_authorization_response", "shape.responseMode");
  expect(shape.responseLabel, "PHASE_1_RUNTIME_PROMOTION_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_FILLED_NO_EXECUTION", "shape.responseLabel");
  expect(shape.operatorDecision, "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT", "shape.operatorDecision");
  expect(shape.targetTable, "daily_prices", "shape.targetTable");
  expect(shape.targetScope, "twii_and_etf_phase_1_missing_row_closure_only", "shape.targetScope");
  expect(shape.maxRowsPerAttempt, 178, "shape.maxRowsPerAttempt");
  expect(shape.confirmationCompleteness, "complete", "shape.confirmationCompleteness");

  expectArray(
    artifact.requiredTrueConfirmations,
    [
      "oneBoundedWriteAttemptOnly",
      "sourceLegalityReviewed",
      "candidateArtifactSetAccepted",
      "serverOnlyCredentialPresenceReviewed",
      "readbackRequired",
      "rollbackOrQuarantineRequired",
      "postRunReviewRequired",
      "publicRuntimeMustRemainMockUntilPromotionReview",
      "noSecretValuesPrintedOrRequested",
      "noRawRowPayloadsPrintedOrRequested",
      "noInvestmentAdviceOrRealtimeGuarantee"
    ],
    "artifact.requiredTrueConfirmations"
  );

  for (const key of [
    "sqlExecuted",
    "sqlGenerated",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "stagingRowsCreated",
    "dailyPricesMutated",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "envMutated",
    "runtimeFlagMutated",
    "publicDataSourcePromoted",
    "scoreSourcePromoted",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(artifact.safety?.[key], false, `artifact.safety.${key}`);
  }
}

function validateNoCommittedAcceptedAuthorizationResponse() {
  for (const filePath of listJsonFiles("data/evidence-intake")) {
    if (filePath === artifactPath) continue;
    if (filePath === defaultTemplatePath) continue;
    const parsed = parseJson(read(filePath), filePath);
    if (
      parsed?.responseMode === "phase_1_runtime_promotion_bounded_write_authorization_response" &&
      parsed?.operatorDecision === "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT"
    ) {
      problems.push(`${filePath} appears to commit an accepted bounded write authorization response`);
    }
  }
}

function validateRegistration() {
  if (
    pkg.scripts?.["check:phase-1-runtime-promotion-real-accepted-authorization-external-intake-record-no-execution"] !==
    "node scripts/check-phase-1-runtime-promotion-real-accepted-authorization-external-intake-record-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-runtime-promotion-real-accepted-authorization-external-intake-record-no-execution`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-real-accepted-authorization-external-intake-record-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing real accepted authorization external intake checker registration`);
  }
  if (!reviewGate.includes('"phase-1-runtime-promotion-real-accepted-authorization-external-intake-record-no-execution"')) {
    problems.push(`${reviewGatePath} missing real accepted authorization external intake focused gate name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [docPath, doc],
    [artifactPath, artifactText],
    [projectStatusPath, projectStatus]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function listJsonFiles(dirPath) {
  const results = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name).replaceAll("\\", "/");
    if (entry.isDirectory()) {
      results.push(...listJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      results.push(fullPath);
    }
  }
  return results;
}

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}: ${run.stderr || run.stdout}`);
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${scriptPath} did not emit JSON: ${error.message}`);
    return {};
  }
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return filePath.endsWith(".json") ? "{}" : "";
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

function hardStops() {
  return [
    "SQL execution",
    "SQL generation",
    "Supabase client import",
    "Supabase read/write",
    "Supabase connection",
    "staging-row creation",
    "`daily_prices` mutation",
    "market-data fetch",
    "market-data ingestion",
    "candidate-row acceptance",
    "raw payload output",
    "row payload output",
    "stock-id payload output",
    "secret or environment value output",
    "production environment mutation",
    "runtime flag mutation",
    "`publicDataSource=supabase`",
    "`scoreSource=real`",
    "real-time precision claim",
    "complete-market coverage claim",
    "investment-advice claim"
  ];
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"boundedAttemptExecutableNow"\s*:\s*true/u,
    /"writeGateExecutableNow"\s*:\s*true/u,
    /"runnerExecutableNow"\s*:\s*true/u,
    /"promotionAllowedNow"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /\b(setx|vercel\s+env|supabase\s+db|psql|alter\s+table|drop\s+table)\b/iu,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
