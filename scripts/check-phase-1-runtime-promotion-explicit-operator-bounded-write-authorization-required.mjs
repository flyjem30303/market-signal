import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_EXPLICIT_OPERATOR_BOUNDED_WRITE_AUTHORIZATION_REQUIRED.md";
const artifactPath = "data/evidence-intake/phase-1-runtime-promotion-explicit-operator-bounded-write-authorization-required.json";
const preExecutionCheckerPath = "scripts/check-phase-1-runtime-promotion-bounded-attempt-pre-execution-packet-no-execution.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const preExecution = runJson(preExecutionCheckerPath);

for (const phrase of [
  "Status: `phase_1_runtime_promotion_explicit_operator_bounded_write_authorization_required_ready`",
  "Decision: `BLOCK_EXECUTION_UNTIL_EXPLICIT_BOUNDED_WRITE_AUTHORIZATION`",
  "`sourcePreExecutionStatus=phase_1_runtime_promotion_bounded_attempt_pre_execution_packet_no_execution_ready`",
  "`gateDecision=BLOCK_EXECUTION_UNTIL_EXPLICIT_BOUNDED_WRITE_AUTHORIZATION`",
  "`currentAuthorizationPresent=false`",
  "`dryRunAuthorizationAcceptedAsWriteAuthorization=false`",
  "`historicalGeneralAuthorizationAcceptedAsWriteAuthorization=false`",
  "`boundedAttemptExecutableNow=false`",
  "`writeGateExecutableNow=false`",
  "`runnerExecutableNow=false`",
  "`promotionAllowedNow=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`operatorDecision=APPROVE_ONE_BOUNDED_WRITE_ATTEMPT`",
  "`targetTable=daily_prices`",
  "`targetScope=twii_and_etf_phase_1_missing_row_closure_only`",
  "`maxRowsPerAttempt=178`",
  "`mustConfirmReadback=true`",
  "`mustConfirmRollbackOrQuarantine=true`",
  "`mustConfirmPostRunReview=true`",
  "`mustKeepPublicRuntimeMockUntilPromotionReview=true`",
  "`await_explicit_operator_bounded_write_authorization`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
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
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

expect(preExecution.status, "ok", "preExecution.status");
expect(
  preExecution.guardedStatus,
  "phase_1_runtime_promotion_bounded_attempt_pre_execution_packet_no_execution_ready",
  "preExecution.guardedStatus"
);
expect(
  preExecution.nextRoute,
  "phase_1_runtime_promotion_explicit_operator_bounded_write_authorization_required",
  "preExecution.nextRoute"
);

expect(artifact.gateMode, "phase_1_runtime_promotion_explicit_operator_bounded_write_authorization_required", "artifact.gateMode");
expect(
  artifact.gateLabel,
  "PHASE_1_RUNTIME_PROMOTION_EXPLICIT_OPERATOR_BOUNDED_WRITE_AUTHORIZATION_REQUIRED",
  "artifact.gateLabel"
);
expect(
  artifact.sourcePreExecutionStatus,
  "phase_1_runtime_promotion_bounded_attempt_pre_execution_packet_no_execution_ready",
  "artifact.sourcePreExecutionStatus"
);
expect(artifact.gateDecision, "BLOCK_EXECUTION_UNTIL_EXPLICIT_BOUNDED_WRITE_AUTHORIZATION", "artifact.gateDecision");
expect(artifact.currentAuthorizationPresent, false, "artifact.currentAuthorizationPresent");
expect(artifact.dryRunAuthorizationAcceptedAsWriteAuthorization, false, "artifact.dryRunAuthorizationAcceptedAsWriteAuthorization");
expect(
  artifact.historicalGeneralAuthorizationAcceptedAsWriteAuthorization,
  false,
  "artifact.historicalGeneralAuthorizationAcceptedAsWriteAuthorization"
);
expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
expect(artifact.scoreSource, "mock", "artifact.scoreSource");
expect(artifact.nextRoute, "await_explicit_operator_bounded_write_authorization", "artifact.nextRoute");

const auth = artifact.acceptableAuthorizationShape ?? {};
expect(auth.operatorDecision, "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT", "auth.operatorDecision");
expect(auth.targetTable, "daily_prices", "auth.targetTable");
expect(auth.targetScope, "twii_and_etf_phase_1_missing_row_closure_only", "auth.targetScope");
expect(auth.maxRowsPerAttempt, 178, "auth.maxRowsPerAttempt");
expect(auth.mustConfirmReadback, true, "auth.mustConfirmReadback");
expect(auth.mustConfirmRollbackOrQuarantine, true, "auth.mustConfirmRollbackOrQuarantine");
expect(auth.mustConfirmPostRunReview, true, "auth.mustConfirmPostRunReview");
expect(auth.mustKeepPublicRuntimeMockUntilPromotionReview, true, "auth.mustKeepPublicRuntimeMockUntilPromotionReview");

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

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-explicit-operator-bounded-write-authorization-required"] !==
  "node scripts/check-phase-1-runtime-promotion-explicit-operator-bounded-write-authorization-required.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-explicit-operator-bounded-write-authorization-required`);
}

if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-explicit-operator-bounded-write-authorization-required.mjs")) {
  problems.push(`${reviewGatePath} missing explicit operator bounded write authorization checker registration`);
}
if (!reviewGate.includes('"phase-1-runtime-promotion-explicit-operator-bounded-write-authorization-required"')) {
  problems.push(`${reviewGatePath} missing explicit operator bounded write authorization focused gate name`);
}

for (const [label, text] of [
  [docPath, doc],
  [artifactPath, artifactText]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
  }
}

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_explicit_operator_bounded_write_authorization_required_ready"
        : "phase_1_runtime_promotion_explicit_operator_bounded_write_authorization_required_blocked",
      gateDecision: artifact.gateDecision ?? null,
      currentAuthorizationPresent: artifact.currentAuthorizationPresent === true,
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

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}`);
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${scriptPath} did not emit JSON: ${error.message}`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
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
    /"currentAuthorizationPresent"\s*:\s*true/u,
    /"dryRunAuthorizationAcceptedAsWriteAuthorization"\s*:\s*true/u,
    /"historicalGeneralAuthorizationAcceptedAsWriteAuthorization"\s*:\s*true/u,
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
