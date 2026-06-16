import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_SEPARATE_BOUNDED_WRITE_READBACK_ROLLBACK_PREPARATION.md";
const artifactPath = "data/evidence-intake/phase-1-runtime-promotion-separate-bounded-write-readback-rollback-preparation.json";
const proofReviewCheckerPath = "scripts/check-phase-1-runtime-promotion-dry-run-only-proof-review.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const proofReview = runJson(proofReviewCheckerPath);

const contractCheckers = [
  {
    name: "phase-1-write-runner-bounded-insert-missing-only-contract-no-execution",
    scriptKey: "check:phase-1-write-runner-bounded-insert-missing-only-contract-no-execution",
    scriptPath: "scripts/check-phase-1-write-runner-bounded-insert-missing-only-contract-no-execution.mjs",
    expectedGuardedStatus: "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready"
  },
  {
    name: "phase-1-write-runner-aggregate-readback-contract-no-execution",
    scriptKey: "check:phase-1-write-runner-aggregate-readback-contract-no-execution",
    scriptPath: "scripts/check-phase-1-write-runner-aggregate-readback-contract-no-execution.mjs",
    expectedGuardedStatus: "phase_1_write_runner_aggregate_readback_contract_no_execution_ready"
  },
  {
    name: "phase-1-write-runner-rollback-or-quarantine-contract-no-execution",
    scriptKey: "check:phase-1-write-runner-rollback-or-quarantine-contract-no-execution",
    scriptPath: "scripts/check-phase-1-write-runner-rollback-or-quarantine-contract-no-execution.mjs",
    expectedGuardedStatus: "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready"
  },
  {
    name: "phase-1-write-runner-post-write-review-contract-no-execution",
    scriptKey: "check:phase-1-write-runner-post-write-review-contract-no-execution",
    scriptPath: "scripts/check-phase-1-write-runner-post-write-review-contract-no-execution.mjs",
    expectedGuardedStatus: "phase_1_write_runner_post_write_review_contract_no_execution_ready"
  }
];

for (const phrase of [
  "Status: `phase_1_runtime_promotion_separate_bounded_write_readback_rollback_preparation_ready_no_execution`",
  "Decision: `PREPARE_SEPARATE_BOUNDED_WRITE_READBACK_ROLLBACK_KEEP_MOCK`",
  "`inputProofReviewStatus=phase_1_runtime_promotion_dry_run_only_proof_review_ready_no_execution`",
  "`reviewDecision=PREPARE_SEPARATE_BOUNDED_WRITE_READBACK_ROLLBACK_KEEP_MOCK`",
  "`writeShapePrepared=true`",
  "`readbackShapePrepared=true`",
  "`rollbackOrQuarantineShapePrepared=true`",
  "`postRunReviewShapePrepared=true`",
  "`boundedAttemptExecutableNow=false`",
  "`writeGateExecutableNow=false`",
  "`runnerExecutableNow=false`",
  "`promotionAllowedNow=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`phase_1_runtime_promotion_bounded_attempt_pre_execution_packet_no_execution`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "SQL execution",
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

expect(proofReview.status, "ok", "proofReview.status");
expect(
  proofReview.guardedStatus,
  "phase_1_runtime_promotion_dry_run_only_proof_review_ready_no_execution",
  "proofReview.guardedStatus"
);
expect(
  proofReview.nextRoute,
  "phase_1_runtime_promotion_separate_bounded_write_readback_rollback_preparation_no_execution",
  "proofReview.nextRoute"
);

const contractStatuses = [];
for (const contract of contractCheckers) {
  if (pkg.scripts?.[contract.scriptKey] !== `node ${contract.scriptPath}`) {
    problems.push(`${packagePath} missing ${contract.scriptKey}`);
  }
  if (!reviewGate.includes(contract.scriptPath)) problems.push(`${reviewGatePath} missing ${contract.scriptPath}`);
  if (!reviewGate.includes(`"${contract.name}"`)) problems.push(`${reviewGatePath} missing ${contract.name}`);

  const result = runJson(contract.scriptPath);
  expect(result.status, "ok", `${contract.name}.status`);
  expect(result.guardedStatus, contract.expectedGuardedStatus, `${contract.name}.guardedStatus`);
  contractStatuses.push(result.guardedStatus);
}

expect(
  artifact.packetMode,
  "phase_1_runtime_promotion_separate_bounded_write_readback_rollback_preparation_no_execution",
  "artifact.packetMode"
);
expect(
  artifact.packetLabel,
  "PHASE_1_RUNTIME_PROMOTION_SEPARATE_BOUNDED_WRITE_READBACK_ROLLBACK_PREPARATION_NO_EXECUTION",
  "artifact.packetLabel"
);
expect(
  artifact.inputProofReviewStatus,
  "phase_1_runtime_promotion_dry_run_only_proof_review_ready_no_execution",
  "artifact.inputProofReviewStatus"
);
expect(artifact.reviewDecision, "PREPARE_SEPARATE_BOUNDED_WRITE_READBACK_ROLLBACK_KEEP_MOCK", "artifact.reviewDecision");
expect(artifact.writeShapePrepared, true, "artifact.writeShapePrepared");
expect(artifact.readbackShapePrepared, true, "artifact.readbackShapePrepared");
expect(artifact.rollbackOrQuarantineShapePrepared, true, "artifact.rollbackOrQuarantineShapePrepared");
expect(artifact.postRunReviewShapePrepared, true, "artifact.postRunReviewShapePrepared");
expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
expect(artifact.scoreSource, "mock", "artifact.scoreSource");
expect(
  artifact.nextRoute,
  "phase_1_runtime_promotion_bounded_attempt_pre_execution_packet_no_execution",
  "artifact.nextRoute"
);

expectArray(
  artifact.requiredPreparationContracts,
  [
    "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution",
    "phase_1_write_runner_aggregate_readback_contract_no_execution",
    "phase_1_write_runner_rollback_or_quarantine_contract_no_execution",
    "phase_1_write_runner_post_write_review_contract_no_execution"
  ],
  "artifact.requiredPreparationContracts"
);
expectArray(artifact.requiredPreparationContractStatuses, contractStatuses, "artifact.requiredPreparationContractStatuses");

for (const key of [
  "sqlExecuted",
  "supabaseConnectionAttempted",
  "supabaseReadAttempted",
  "supabaseWriteAttempted",
  "stagingRowsCreated",
  "dailyPricesMutated",
  "marketDataFetched",
  "marketDataIngested",
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
  pkg.scripts?.["check:phase-1-runtime-promotion-separate-bounded-write-readback-rollback-preparation"] !==
  "node scripts/check-phase-1-runtime-promotion-separate-bounded-write-readback-rollback-preparation.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-separate-bounded-write-readback-rollback-preparation`);
}

if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-separate-bounded-write-readback-rollback-preparation.mjs")) {
  problems.push(`${reviewGatePath} missing separate bounded preparation checker registration`);
}
if (!reviewGate.includes('"phase-1-runtime-promotion-separate-bounded-write-readback-rollback-preparation"')) {
  problems.push(`${reviewGatePath} missing separate bounded preparation focused gate name`);
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
        ? "phase_1_runtime_promotion_separate_bounded_write_readback_rollback_preparation_ready_no_execution"
        : "phase_1_runtime_promotion_separate_bounded_write_readback_rollback_preparation_blocked",
      reviewDecision: artifact.reviewDecision ?? null,
      writeShapePrepared: artifact.writeShapePrepared === true,
      readbackShapePrepared: artifact.readbackShapePrepared === true,
      rollbackOrQuarantineShapePrepared: artifact.rollbackOrQuarantineShapePrepared === true,
      postRunReviewShapePrepared: artifact.postRunReviewShapePrepared === true,
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
