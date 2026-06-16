import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-daily-prices-final-bounded-write-execution-packet-no-execution.json";
const docPath = "docs/PHASE_1_DAILY_PRICES_FINAL_BOUNDED_WRITE_EXECUTION_PACKET_NO_EXECUTION.md";
const sourceCheckerPath = "scripts/check-phase-1-runtime-promotion-fresh-pm-go-no-go-after-input-convergence-no-execution.mjs";
const runnerPath = "scripts/run-phase-1-daily-prices-bounded-insert-missing-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const source = runJson(sourceCheckerPath);
const dryRun = runDryRunner();

validateSource();
validateDryRun();
validateArtifact();
validateDoc();
validateRegistration();
validateProjectStatus();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_daily_prices_final_bounded_write_execution_packet_superseded_no_execution"
        : "phase_1_daily_prices_final_bounded_write_execution_packet_no_execution_blocked",
      packetDecision: artifact.packetDecision ?? null,
      dryRunStatus: dryRun.status ?? null,
      commandAccepted: dryRun.commandAccepted === true,
      candidateArtifactAccepted: dryRun.candidateArtifactAccepted === true,
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

function validateSource() {
  expect(source.status, "ok", "source.status");
  expect(
    source.guardedStatus,
    "phase_1_runtime_promotion_fresh_pm_go_no_go_after_input_convergence_no_execution_ready",
    "source.guardedStatus"
  );
  expect(source.freshPmGoNoGoForExecutionPresent, true, "source.freshPmGoNoGoForExecutionPresent");
  expect(source.acceptedAuthorizationResponsePresent, true, "source.acceptedAuthorizationResponsePresent");
  expect(source.preRunInputsConverged, true, "source.preRunInputsConverged");
}

function validateDryRun() {
  expect(dryRun.status, "phase_1_daily_prices_bounded_insert_missing_ready_not_executed", "dryRun.status");
  expect(dryRun.commandAccepted, true, "dryRun.commandAccepted");
  expect(dryRun.executionRequested, false, "dryRun.executionRequested");
  expect(dryRun.candidateArtifactAccepted, true, "dryRun.candidateArtifactAccepted");
  expect(dryRun.candidateRowCount, 178, "dryRun.candidateRowCount");
  expect(dryRun.symbolCounts?.TWII, 60, "dryRun.symbolCounts.TWII");
  expect(dryRun.symbolCounts?.["0050"], 59, "dryRun.symbolCounts.0050");
  expect(dryRun.symbolCounts?.["006208"], 59, "dryRun.symbolCounts.006208");
  expect(dryRun.credentialPresence?.nextPublicSupabaseUrl, true, "dryRun.credentialPresence.nextPublicSupabaseUrl");
  expect(dryRun.credentialPresence?.serviceRoleKey, true, "dryRun.credentialPresence.serviceRoleKey");
  expect(dryRun.remoteAttempted, false, "dryRun.remoteAttempted");
  expect(dryRun.connectionAttempted, false, "dryRun.connectionAttempted");
  expect(dryRun.readbackAttempted, false, "dryRun.readbackAttempted");
  expect(dryRun.insertedRows, 0, "dryRun.insertedRows");
  expect(dryRun.safety?.publicDataSource, "mock", "dryRun.safety.publicDataSource");
  expect(dryRun.safety?.scoreSource, "mock", "dryRun.safety.scoreSource");
  if (Array.isArray(dryRun.problems) && dryRun.problems.length > 0) problems.push(`dryRun problems: ${dryRun.problems.join(",")}`);
}

function validateArtifact() {
  expect(artifact.packetMode, "phase_1_daily_prices_final_bounded_write_execution_packet_no_execution", "artifact.packetMode");
  expect(
    artifact.packetDecision,
    "SUPERSEDED_BY_PHASE_1_TWII_PLUS_LISTED_STOCK_SCOPE_KEEP_MOCK",
    "artifact.packetDecision"
  );
  expect(artifact.supersededByPhase1Scope, true, "artifact.supersededByPhase1Scope");
  expect(artifact.currentPhase1Universe, "twii_plus_listed_stock_daily_close", "artifact.currentPhase1Universe");
  expectArray(artifact.deferredSymbols, ["0050", "006208"], "artifact.deferredSymbols");
  expect(
    artifact.sourceFreshPmGoNoGoStatus,
    "phase_1_runtime_promotion_fresh_pm_go_no_go_after_input_convergence_no_execution_ready",
    "artifact.sourceFreshPmGoNoGoStatus"
  );
  expect(artifact.runnerPath, runnerPath, "artifact.runnerPath");
  expect(artifact.authorizationId, "PHASE1-DAILY-PRICES-BOUNDED-WRITE-2026-06-16-A", "artifact.authorizationId");
  expect(artifact.acknowledgeFlag, "CEO_AUTHORIZED_ONE_PHASE1_BOUNDED_WRITE_ATTEMPT_20260616_A", "artifact.acknowledgeFlag");
  expect(artifact.candidateArtifactPath, "tmp/phase-1-sanitized-row-payload-candidate.json", "artifact.candidateArtifactPath");
  expect(artifact.postRunReviewPath, "tmp/phase-1-daily-prices-bounded-write-post-run-review.local.md", "artifact.postRunReviewPath");
  if (!artifact.dryRunCommand?.includes("--post-run-review tmp\\phase-1-daily-prices-bounded-write-post-run-review.local.md")) {
    problems.push("artifact.dryRunCommand missing expected post-run-review path");
  }
  if (!artifact.executionCommand?.includes("--execute")) problems.push("artifact.executionCommand missing --execute");
  expect(artifact.dryRunReadinessObserved?.status, dryRun.status, "artifact.dryRunReadinessObserved.status");
  expect(artifact.dryRunReadinessObserved?.commandAccepted, true, "artifact.dryRunReadinessObserved.commandAccepted");
  expect(artifact.dryRunReadinessObserved?.candidateArtifactAccepted, true, "artifact.dryRunReadinessObserved.candidateArtifactAccepted");
  expect(artifact.dryRunReadinessObserved?.credentialPresence?.serviceRoleKey, true, "artifact.dryRunReadinessObserved.credentialPresence.serviceRoleKey");
  expect(artifact.executeSwitchRequired, true, "artifact.executeSwitchRequired");
  expect(artifact.executeSwitchPresentInDryRun, false, "artifact.executeSwitchPresentInDryRun");
  expect(artifact.executeSwitchPresentInExecutionCommand, true, "artifact.executeSwitchPresentInExecutionCommand");
  expect(artifact.postRunReviewRequired, true, "artifact.postRunReviewRequired");
  expect(artifact.readbackRequired, true, "artifact.readbackRequired");
  expect(artifact.rollbackOrQuarantineRequired, true, "artifact.rollbackOrQuarantineRequired");
  expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
  expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
  expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
  expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
  expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
  expect(artifact.scoreSource, "mock", "artifact.scoreSource");
  expect(
    artifact.nextRoute,
    "prepare_phase_1_twii_plus_listed_stock_daily_close_bounded_packet_no_execution",
    "artifact.nextRoute"
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

function validateDoc() {
  for (const phrase of [
    "Status: `phase_1_daily_prices_final_bounded_write_execution_packet_superseded_no_execution`",
    "Decision: `SUPERSEDED_BY_PHASE_1_TWII_PLUS_LISTED_STOCK_SCOPE_KEEP_MOCK`",
    "Current Phase 1 universe: `twii_plus_listed_stock_daily_close`",
    "Deferred symbols: `0050`, `006208`",
    "`status=phase_1_daily_prices_bounded_insert_missing_ready_not_executed`",
    "`commandAccepted=true`",
    "`candidateArtifactAccepted=true`",
    "`candidateRowCount=178`",
    "`credentialPresence.nextPublicSupabaseUrl=true`",
    "`credentialPresence.serviceRoleKey=true`",
    "`executionRequested=false`",
    "`remoteAttempted=false`",
    "`connectionAttempted=false`",
    "`readbackAttempted=false`",
    "--execute",
    "`executeSwitchRequired=true`",
    "`executeSwitchPresentInDryRun=false`",
    "`executeSwitchPresentInExecutionCommand=true`",
    "`boundedAttemptExecutableNow=false`",
    "`writeGateExecutableNow=false`",
    "`runnerExecutableNow=false`",
    "`promotionAllowedNow=false`",
    "`publicDataSource=mock`",
    "`scoreSource=mock`",
    "`prepare_phase_1_twii_plus_listed_stock_daily_close_bounded_packet_no_execution`"
  ]) {
    if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

function validateRegistration() {
  if (
    pkg.scripts?.["check:phase-1-daily-prices-final-bounded-write-execution-packet-no-execution"] !==
    "node scripts/check-phase-1-daily-prices-final-bounded-write-execution-packet-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing final bounded write execution packet checker script`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-daily-prices-final-bounded-write-execution-packet-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing final bounded write execution packet checker registration`);
  }
  if (!reviewGate.includes('"phase-1-daily-prices-final-bounded-write-execution-packet-no-execution"')) {
    problems.push(`${reviewGatePath} missing final bounded write execution packet focused gate name`);
  }
}

function validateProjectStatus() {
  for (const phrase of [
    "Latest Daily Prices Final Bounded Write Execution Packet",
    "phase_1_daily_prices_final_bounded_write_execution_packet_superseded_no_execution",
    "SUPERSEDED_BY_PHASE_1_TWII_PLUS_LISTED_STOCK_SCOPE_KEEP_MOCK"
  ]) {
    if (!projectStatus.includes(phrase)) problems.push(`${projectStatusPath} missing phrase: ${phrase}`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [artifactPath, artifactText],
    [docPath, doc],
    [projectStatusPath, projectStatus]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function runDryRunner() {
  const run = spawnSync(
    process.execPath,
    [
      runnerPath,
      "--authorization-id",
      "PHASE1-DAILY-PRICES-BOUNDED-WRITE-2026-06-16-A",
      "--acknowledge-bounded-write-once",
      "CEO_AUTHORIZED_ONE_PHASE1_BOUNDED_WRITE_ATTEMPT_20260616_A",
      "--candidate-artifact",
      "tmp\\phase-1-sanitized-row-payload-candidate.json",
      "--post-run-review",
      "tmp\\phase-1-daily-prices-bounded-write-post-run-review.local.md"
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      shell: false,
      timeout: 120000,
      windowsHide: true
    }
  );
  if (run.status !== 0) problems.push(`${runnerPath} dry run exited ${run.status}: ${run.stderr || run.stdout}`);
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${runnerPath} dry run did not emit JSON: ${error.message}`);
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

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"boundedAttemptExecutableNow"\s*:\s*true/u,
    /"writeGateExecutableNow"\s*:\s*true/u,
    /"runnerExecutableNow"\s*:\s*true/u,
    /"promotionAllowedNow"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
