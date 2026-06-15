import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-twii-write-attempt-stopline-rollup.json";
const docPath = "docs/PHASE_1_TWII_WRITE_ATTEMPT_STOPLINE_ROLLUP.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const upstreamPaths = {
  pmIntake: "data/source-gates/twii-sanitized-candidate-artifact-pm-intake.json",
  reportOnlyChain: "data/source-gates/twii-report-only-dry-run-chain-gate.json",
  boundedExecutionReadiness: "data/source-gates/twii-bounded-execution-packet-readiness-gate.json",
  explicitOperatorPacket: "data/source-gates/twii-explicit-operator-packet-preparation-gate.json",
  separateAuthorizedAttempt: "data/source-gates/twii-separate-authorized-execution-attempt-preparation-gate.json"
};

const problems = [];
const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const upstream = Object.fromEntries(Object.entries(upstreamPaths).map(([key, value]) => [key, parseJson(readText(value), value)]));

expect(artifact.status, "phase_1_twii_write_attempt_stopline_rollup_ready_not_executable", "status");
expect(artifact.packetMode, "phase_1_twii_write_attempt_stopline_rollup", "packetMode");
expect(artifact.targetLane, "TWII", "targetLane");
expect(artifact.targetTable, "daily_prices", "targetTable");
expect(artifact.maxRows, 60, "maxRows");
expect(artifact.currentStopline, "separate_authorized_execution_attempt_preparation_ready_waiting_external_values", "currentStopline");
expect(artifact.nextRoute, "final_authorization_stopline_preparation_before_any_execution", "nextRoute");
expect(artifact.executionAllowedNow, false, "executionAllowedNow");
expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");

const expectedUpstream = {
  pmIntake: "twii_sanitized_candidate_artifact_pm_intake_accepted_for_no_write_dry_run_chain",
  reportOnlyChain: "twii_report_only_dry_run_chain_gate_completed_no_write_aggregate_only",
  boundedExecutionReadiness: "twii_bounded_execution_packet_readiness_gate_ready_no_execution",
  explicitOperatorPacket: "twii_explicit_operator_packet_preparation_gate_ready_no_execution",
  separateAuthorizedAttempt: "twii_separate_authorized_execution_attempt_preparation_gate_ready_no_execution"
};

for (const [key, status] of Object.entries(expectedUpstream)) {
  expect(artifact.upstreamGateStatuses?.[key], status, `artifact.upstreamGateStatuses.${key}`);
}

expect(upstream.pmIntake.status, expectedUpstream.pmIntake, "pmIntake.status");
expect(upstream.reportOnlyChain.status, expectedUpstream.reportOnlyChain, "reportOnlyChain.status");
expect(upstream.boundedExecutionReadiness.status, expectedUpstream.boundedExecutionReadiness, "boundedExecutionReadiness.status");
expect(upstream.explicitOperatorPacket.gateKind, "twii_explicit_operator_packet_preparation_gate", "explicitOperatorPacket.gateKind");
expect(upstream.separateAuthorizedAttempt.gateKind, "twii_separate_authorized_execution_attempt_preparation_gate", "separateAuthorizedAttempt.gateKind");

for (const blocker of [
  "externalOperatorDecisionProvidedNow",
  "operatorAuthorizationAcceptedNow",
  "executeSwitchProvided",
  "confirmationPhraseProvided",
  "serverOnlyCredentialCheckPassed",
  "rollbackDryRunPassed",
  "aggregateReadbackPassed",
  "postRunReviewPassed",
  "candidateDuplicateRejectionProofPassed"
]) {
  if (!artifact.blockersRemaining?.includes(blocker)) problems.push(`blockersRemaining missing ${blocker}`);
  expect(upstream.separateAuthorizedAttempt[blocker], false, `separateAuthorizedAttempt.${blocker}`);
}

for (const key of [
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
  "rowCoverageScoringAllowed",
  "rawPayloadOutput",
  "rowPayloadOutput",
  "stockIdPayloadOutput",
  "secretsOutput",
  "envValueOutput",
  "publicPromotionAllowed",
  "scoreSourceRealAllowed"
]) {
  expect(artifact.safety?.[key], false, `artifact.safety.${key}`);
  const upstreamValue = upstream.separateAuthorizedAttempt.safety?.[key] ?? upstream.separateAuthorizedAttempt[key];
  expect(upstreamValue, false, `separateAuthorizedAttempt.${key}`);
}
expect(artifact.safety?.publicDataSource, "mock", "artifact.safety.publicDataSource");
expect(artifact.safety?.scoreSource, "mock", "artifact.safety.scoreSource");
expect(upstream.separateAuthorizedAttempt.safety?.publicDataSource, "mock", "separateAuthorizedAttempt.safety.publicDataSource");
expect(upstream.separateAuthorizedAttempt.safety?.scoreSource, "mock", "separateAuthorizedAttempt.safety.scoreSource");

for (const phrase of [
  "phase_1_twii_write_attempt_stopline_rollup_ready_not_executable",
  "TWII",
  "daily_prices",
  "60",
  "separate_authorized_execution_attempt_preparation_ready_waiting_external_values",
  "final_authorization_stopline_preparation_before_any_execution",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase write",
  "No daily_prices mutation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

if (
  packageJson.scripts?.["check:phase-1-twii-write-attempt-stopline-rollup"] !==
  "node scripts/check-phase-1-twii-write-attempt-stopline-rollup.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-twii-write-attempt-stopline-rollup`);
}
if (!reviewGate.includes("scripts/check-phase-1-twii-write-attempt-stopline-rollup.mjs")) {
  problems.push(`${reviewGatePath} missing checker command`);
}
if (!reviewGate.includes('"phase-1-twii-write-attempt-stopline-rollup"')) {
  problems.push(`${reviewGatePath} missing focused gate name`);
}

for (const [label, text] of [
  [artifactPath, artifactRaw],
  [docPath, doc]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${String(pattern)}`);
  }
}

const status = problems.length === 0 ? "ok" : "blocked";
console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: status === "ok" ? artifact.status : "phase_1_twii_write_attempt_stopline_rollup_blocked",
      currentStopline: artifact.currentStopline ?? null,
      nextRoute: artifact.nextRoute ?? null,
      blockerCount: artifact.blockersRemaining?.length ?? null,
      publicDataSource: artifact.safety?.publicDataSource ?? null,
      scoreSource: artifact.safety?.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);
if (status !== "ok") process.exit(1);

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function readText(filePath) {
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
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}

function forbiddenPatterns() {
  return [
    /\bsb_secret_/iu,
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
    /https:\/\/[a-z0-9.-]+supabase/iu,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /"rowBody"\s*:/u,
    /"rawPayload"\s*:/u,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
