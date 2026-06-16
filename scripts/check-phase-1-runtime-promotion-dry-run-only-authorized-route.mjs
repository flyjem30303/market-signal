import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_DRY_RUN_ONLY_AUTHORIZED_ROUTE.md";
const artifactPath = "data/evidence-intake/phase-1-runtime-promotion-dry-run-only-authorized-route.json";
const intakeCheckerPath = "scripts/check-phase-1-runtime-promotion-operator-authorization-response-intake-validator.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const intakeCheck = runJson(intakeCheckerPath);

for (const phrase of [
  "Status: `phase_1_runtime_promotion_dry_run_only_authorized_route_ready_no_execution`",
  "Decision: `PREPARE_DRY_RUN_ONLY_ROUTE_KEEP_MOCK`",
  "`inputValidatorStatus=phase_1_runtime_promotion_operator_authorization_response_intake_validator_ready_no_execution`",
  "`inputOperatorOutcome=APPROVE_DRY_RUN_ONLY`",
  "`promotionAllowedNow=false`",
  "`dryRunOnlyAllowedNow=true`",
  "`boundedAttemptPrepAllowedNow=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`runnerExecutableNow=false`",
  "`runtimeMutationAllowedNow=false`",
  "`dataWriteAllowedNow=false`",
  "`phase_1_runtime_promotion_dry_run_only_preparation_packet_no_execution`"
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

expect(intakeCheck.status, "ok", "intakeCheck.status");
expect(
  intakeCheck.guardedStatus,
  "phase_1_runtime_promotion_operator_authorization_response_intake_validator_ready_no_execution",
  "intakeCheck.guardedStatus"
);
expect(intakeCheck.operatorOutcome, "APPROVE_DRY_RUN_ONLY", "intakeCheck.operatorOutcome");
expect(intakeCheck.nextRoute, "phase_1_runtime_promotion_dry_run_only_authorized_no_execution", "intakeCheck.nextRoute");

expect(artifact.routeMode, "phase_1_runtime_promotion_dry_run_only_authorized_no_execution", "artifact.routeMode");
expect(artifact.routeLabel, "PHASE_1_RUNTIME_PROMOTION_DRY_RUN_ONLY_AUTHORIZED_ROUTE_NO_EXECUTION", "artifact.routeLabel");
expect(
  artifact.inputValidatorStatus,
  "phase_1_runtime_promotion_operator_authorization_response_intake_validator_ready_no_execution",
  "artifact.inputValidatorStatus"
);
expect(artifact.inputOperatorOutcome, "APPROVE_DRY_RUN_ONLY", "artifact.inputOperatorOutcome");
expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
expect(artifact.dryRunOnlyAllowedNow, true, "artifact.dryRunOnlyAllowedNow");
expect(artifact.boundedAttemptPrepAllowedNow, false, "artifact.boundedAttemptPrepAllowedNow");
expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
expect(artifact.scoreSource, "mock", "artifact.scoreSource");
expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
expect(artifact.runtimeMutationAllowedNow, false, "artifact.runtimeMutationAllowedNow");
expect(artifact.dataWriteAllowedNow, false, "artifact.dataWriteAllowedNow");
expect(
  artifact.nextRoute,
  "phase_1_runtime_promotion_dry_run_only_preparation_packet_no_execution",
  "artifact.nextRoute"
);

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
  pkg.scripts?.["check:phase-1-runtime-promotion-dry-run-only-authorized-route"] !==
  "node scripts/check-phase-1-runtime-promotion-dry-run-only-authorized-route.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-dry-run-only-authorized-route script`);
}

if (!reviewGate.includes("phase-1-runtime-promotion-dry-run-only-authorized-route")) {
  problems.push(`${reviewGatePath} missing dry-run-only authorized route registration`);
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
        ? "phase_1_runtime_promotion_dry_run_only_authorized_route_ready_no_execution"
        : "phase_1_runtime_promotion_dry_run_only_authorized_route_blocked",
      promotionAllowedNow: false,
      dryRunOnlyAllowedNow: true,
      boundedAttemptPrepAllowedNow: false,
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
    /"promotionAllowedNow"\s*:\s*true/u,
    /"boundedAttemptPrepAllowedNow"\s*:\s*true/u,
    /"runnerExecutableNow"\s*:\s*true/u,
    /"runtimeMutationAllowedNow"\s*:\s*true/u,
    /"dataWriteAllowedNow"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /\b(setx|vercel\s+env|supabase\s+db|psql|insert|update|delete|upsert|alter\s+table|drop\s+table)\b/iu,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
