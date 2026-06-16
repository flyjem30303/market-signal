import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_DRY_RUN_ONLY_PROOF_REVIEW.md";
const artifactPath = "data/evidence-intake/phase-1-runtime-promotion-dry-run-only-proof-review.json";
const preparationCheckerPath = "scripts/check-phase-1-runtime-promotion-dry-run-only-preparation-packet.mjs";
const dryRunResultPath = "tmp/phase-1-runtime-promotion-dry-run-only-preparation-result.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const dryRunResult = parseJson(read(dryRunResultPath), dryRunResultPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const preparationCheck = runJson(preparationCheckerPath);

for (const phrase of [
  "Status: `phase_1_runtime_promotion_dry_run_only_proof_review_ready_no_execution`",
  "Decision: `ALLOW_SEPARATE_BOUNDED_PREPARATION_KEEP_MOCK`",
  "`inputPreparationStatus=phase_1_runtime_promotion_dry_run_only_preparation_packet_ready_no_execution`",
  "`dryRunResultStatus=phase_1_runtime_promotion_dry_run_packet_shape_ready_no_execution`",
  "`reviewDecision=ALLOW_SEPARATE_BOUNDED_PREPARATION_KEEP_MOCK`",
  "`separateBoundedPreparationAllowedNow=true`",
  "`boundedAttemptExecutableNow=false`",
  "`writeGateExecutableNow=false`",
  "`runnerExecutableNow=false`",
  "`promotionAllowedNow=false`",
  "`dryRunOnlyAllowedNow=true`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`phase_1_runtime_promotion_separate_bounded_write_readback_rollback_preparation_no_execution`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "SQL execution",
  "Supabase read/write",
  "staging-row creation",
  "`daily_prices` mutation",
  "market-data fetch",
  "raw payload",
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

expect(preparationCheck.status, "ok", "preparationCheck.status");
expect(
  preparationCheck.guardedStatus,
  "phase_1_runtime_promotion_dry_run_only_preparation_packet_ready_no_execution",
  "preparationCheck.guardedStatus"
);
expect(preparationCheck.nextRoute, "phase_1_runtime_promotion_dry_run_only_proof_review_no_execution", "preparationCheck.nextRoute");

expect(dryRunResult.status, "phase_1_runtime_promotion_dry_run_packet_shape_ready_no_execution", "dryRunResult.status");
expect(dryRunResult.ok, true, "dryRunResult.ok");
expect(dryRunResult.promotionAllowedNow, false, "dryRunResult.promotionAllowedNow");
expect(dryRunResult.publicDataSource, "mock", "dryRunResult.publicDataSource");
expect(dryRunResult.scoreSource, "mock", "dryRunResult.scoreSource");

expect(artifact.reviewMode, "phase_1_runtime_promotion_dry_run_only_proof_review_no_execution", "artifact.reviewMode");
expect(artifact.reviewLabel, "PHASE_1_RUNTIME_PROMOTION_DRY_RUN_ONLY_PROOF_REVIEW_NO_EXECUTION", "artifact.reviewLabel");
expect(
  artifact.inputPreparationStatus,
  "phase_1_runtime_promotion_dry_run_only_preparation_packet_ready_no_execution",
  "artifact.inputPreparationStatus"
);
expect(artifact.dryRunResultStatus, "phase_1_runtime_promotion_dry_run_packet_shape_ready_no_execution", "artifact.dryRunResultStatus");
expect(artifact.dryRunResultPath, dryRunResultPath, "artifact.dryRunResultPath");
expect(artifact.reviewDecision, "ALLOW_SEPARATE_BOUNDED_PREPARATION_KEEP_MOCK", "artifact.reviewDecision");
expect(artifact.separateBoundedPreparationAllowedNow, true, "artifact.separateBoundedPreparationAllowedNow");
expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
expect(artifact.dryRunOnlyAllowedNow, true, "artifact.dryRunOnlyAllowedNow");
expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
expect(artifact.scoreSource, "mock", "artifact.scoreSource");
expect(
  artifact.nextRoute,
  "phase_1_runtime_promotion_separate_bounded_write_readback_rollback_preparation_no_execution",
  "artifact.nextRoute"
);

for (const proof of [
  "dry_run_packet_shape_ready_no_execution",
  "runtime_boundary_stays_mock",
  "public_copy_fallback_reviewed",
  "freshness_fallback_reviewed"
]) {
  if (!artifact.acceptedProofs?.includes(proof)) problems.push(`artifact.acceptedProofs missing ${proof}`);
}

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
  pkg.scripts?.["check:phase-1-runtime-promotion-dry-run-only-proof-review"] !==
  "node scripts/check-phase-1-runtime-promotion-dry-run-only-proof-review.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-dry-run-only-proof-review script`);
}

if (!reviewGate.includes("phase-1-runtime-promotion-dry-run-only-proof-review")) {
  problems.push(`${reviewGatePath} missing dry-run-only proof review registration`);
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
        ? "phase_1_runtime_promotion_dry_run_only_proof_review_ready_no_execution"
        : "phase_1_runtime_promotion_dry_run_only_proof_review_blocked",
      reviewDecision: artifact.reviewDecision ?? null,
      separateBoundedPreparationAllowedNow: artifact.separateBoundedPreparationAllowedNow === true,
      boundedAttemptExecutableNow: false,
      writeGateExecutableNow: false,
      promotionAllowedNow: false,
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
