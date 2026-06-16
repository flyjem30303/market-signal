import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_BOUNDED_ATTEMPT_PRE_EXECUTION_PACKET_NO_EXECUTION.md";
const artifactPath = "data/evidence-intake/phase-1-runtime-promotion-bounded-attempt-pre-execution-packet-no-execution.json";
const preparationCheckerPath = "scripts/check-phase-1-runtime-promotion-separate-bounded-write-readback-rollback-preparation.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const preparation = runJson(preparationCheckerPath);

for (const phrase of [
  "Status: `phase_1_runtime_promotion_bounded_attempt_pre_execution_packet_no_execution_ready`",
  "Decision: `PREPARE_BOUNDED_ATTEMPT_PRE_EXECUTION_PACKET_KEEP_MOCK`",
  "`sourcePreparationStatus=phase_1_runtime_promotion_separate_bounded_write_readback_rollback_preparation_ready_no_execution`",
  "`packetDecision=PREPARE_BOUNDED_ATTEMPT_PRE_EXECUTION_PACKET_KEEP_MOCK`",
  "`operatorBoundedWriteAuthorizationPresent=false`",
  "`exactExecutionCommandPrepared=false`",
  "`sqlPrepared=false`",
  "`supabaseClientPrepared=false`",
  "`writeTarget=daily_prices`",
  "`targetScope=twii_and_etf_phase_1_missing_row_closure_only`",
  "`maxRowsPerAttempt=178`",
  "`boundedAttemptExecutableNow=false`",
  "`writeGateExecutableNow=false`",
  "`runnerExecutableNow=false`",
  "`promotionAllowedNow=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`phase_1_runtime_promotion_explicit_operator_bounded_write_authorization_required`"
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

expect(preparation.status, "ok", "preparation.status");
expect(
  preparation.guardedStatus,
  "phase_1_runtime_promotion_separate_bounded_write_readback_rollback_preparation_ready_no_execution",
  "preparation.guardedStatus"
);
expect(
  preparation.nextRoute,
  "phase_1_runtime_promotion_bounded_attempt_pre_execution_packet_no_execution",
  "preparation.nextRoute"
);

expect(artifact.packetMode, "phase_1_runtime_promotion_bounded_attempt_pre_execution_packet_no_execution", "artifact.packetMode");
expect(
  artifact.packetLabel,
  "PHASE_1_RUNTIME_PROMOTION_BOUNDED_ATTEMPT_PRE_EXECUTION_PACKET_NO_EXECUTION",
  "artifact.packetLabel"
);
expect(
  artifact.sourcePreparationStatus,
  "phase_1_runtime_promotion_separate_bounded_write_readback_rollback_preparation_ready_no_execution",
  "artifact.sourcePreparationStatus"
);
expect(artifact.packetDecision, "PREPARE_BOUNDED_ATTEMPT_PRE_EXECUTION_PACKET_KEEP_MOCK", "artifact.packetDecision");
expect(artifact.operatorBoundedWriteAuthorizationPresent, false, "artifact.operatorBoundedWriteAuthorizationPresent");
expect(artifact.exactExecutionCommandPrepared, false, "artifact.exactExecutionCommandPrepared");
expect(artifact.sqlPrepared, false, "artifact.sqlPrepared");
expect(artifact.supabaseClientPrepared, false, "artifact.supabaseClientPrepared");
expect(artifact.writeTarget, "daily_prices", "artifact.writeTarget");
expect(artifact.targetScope, "twii_and_etf_phase_1_missing_row_closure_only", "artifact.targetScope");
expect(artifact.maxRowsPerAttempt, 178, "artifact.maxRowsPerAttempt");
expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
expect(artifact.scoreSource, "mock", "artifact.scoreSource");
expect(
  artifact.nextRoute,
  "phase_1_runtime_promotion_explicit_operator_bounded_write_authorization_required",
  "artifact.nextRoute"
);

expectArray(
  artifact.requiredBeforeExecution,
  [
    "explicit_operator_bounded_write_authorization",
    "server_only_credential_presence_shape_check",
    "candidate_artifact_set_acceptance_gate",
    "bounded_insert_missing_only_contract_ready",
    "aggregate_readback_contract_ready",
    "rollback_or_quarantine_contract_ready",
    "post_write_review_contract_ready",
    "fresh_pm_go_no_go"
  ],
  "artifact.requiredBeforeExecution"
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

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-bounded-attempt-pre-execution-packet-no-execution"] !==
  "node scripts/check-phase-1-runtime-promotion-bounded-attempt-pre-execution-packet-no-execution.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-bounded-attempt-pre-execution-packet-no-execution`);
}

if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-bounded-attempt-pre-execution-packet-no-execution.mjs")) {
  problems.push(`${reviewGatePath} missing bounded attempt pre-execution checker registration`);
}
if (!reviewGate.includes('"phase-1-runtime-promotion-bounded-attempt-pre-execution-packet-no-execution"')) {
  problems.push(`${reviewGatePath} missing bounded attempt pre-execution focused gate name`);
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
        ? "phase_1_runtime_promotion_bounded_attempt_pre_execution_packet_no_execution_ready"
        : "phase_1_runtime_promotion_bounded_attempt_pre_execution_packet_no_execution_blocked",
      packetDecision: artifact.packetDecision ?? null,
      operatorBoundedWriteAuthorizationPresent: artifact.operatorBoundedWriteAuthorizationPresent === true,
      exactExecutionCommandPrepared: artifact.exactExecutionCommandPrepared === true,
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
    /"operatorBoundedWriteAuthorizationPresent"\s*:\s*true/u,
    /"exactExecutionCommandPrepared"\s*:\s*true/u,
    /"sqlPrepared"\s*:\s*true/u,
    /"supabaseClientPrepared"\s*:\s*true/u,
    /"boundedAttemptExecutableNow"\s*:\s*true/u,
    /"writeGateExecutableNow"\s*:\s*true/u,
    /"runnerExecutableNow"\s*:\s*true/u,
    /"promotionAllowedNow"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /\b(setx|vercel\s+env|supabase\s+db|psql|insert|update|delete|upsert|alter\s+table|drop\s+table)\b/iu,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
