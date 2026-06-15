import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-twii-operator-value-blocker-rollup.json";
const docPath = "docs/PHASE_1_TWII_OPERATOR_VALUE_BLOCKER_ROLLUP.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const upstreamPaths = {
  finalGoNoGo: "data/source-gates/twii-final-authorization-stopline-go-no-go-gate.json",
  explicitDecision: "data/source-gates/twii-explicit-operator-go-no-go-decision-preparation-gate.json",
  operatorValueIntake: "data/source-gates/twii-operator-value-intake-stopline-preparation-gate.json",
  externalShapeRecheck: "data/source-gates/twii-external-values-shape-recheck-preparation-gate.json",
  preExecutionReadiness: "data/source-gates/twii-pre-execution-readiness-recheck-preparation-gate.json"
};

const problems = [];
const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const upstream = Object.fromEntries(Object.entries(upstreamPaths).map(([key, value]) => [key, parseJson(readText(value), value)]));

expect(artifact.status, "phase_1_twii_operator_value_blocker_rollup_ready_not_executable", "status");
expect(artifact.packetMode, "phase_1_twii_operator_value_blocker_rollup", "packetMode");
expect(artifact.targetLane, "TWII", "targetLane");
expect(artifact.targetTable, "daily_prices", "targetTable");
expect(artifact.maxRows, 60, "maxRows");
expect(artifact.currentMainBlocker, "external_operator_values_missing", "currentMainBlocker");
expect(artifact.nextCEOAction, "prepare_operator_value_collection_or_continue_non_data_runtime_work", "nextCEOAction");
expect(artifact.executionAllowedNow, false, "executionAllowedNow");
expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
expect(artifact.publicPromotionAllowed, false, "publicPromotionAllowed");

const expected = {
  finalGoNoGo: "twii_final_authorization_stopline_go_no_go_gate",
  explicitDecision: "twii_explicit_operator_go_no_go_decision_preparation_gate",
  operatorValueIntake: "twii_operator_value_intake_stopline_preparation_gate",
  externalShapeRecheck: "twii_external_values_shape_recheck_preparation_gate",
  preExecutionReadiness: "twii_pre_execution_readiness_recheck_preparation_gate"
};

for (const [key, gateKind] of Object.entries(expected)) {
  expect(artifact.upstreamGateKinds?.[key], gateKind, `artifact.upstreamGateKinds.${key}`);
  expect(upstream[key].gateKind, gateKind, `${key}.gateKind`);
}

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
  if (!artifact.operatorValuesMissing?.includes(blocker)) problems.push(`operatorValuesMissing missing ${blocker}`);
}

for (const [label, source] of Object.entries(upstream)) {
  for (const key of [
    "runnerExecutableNow",
    "executionAllowedNow",
    "dailyPricesMutated",
    "candidateRowsAccepted"
  ]) {
    const value = source.safety?.[key] ?? source[key];
    if (value !== false) problems.push(`${label}.${key} must be false`);
  }
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
  "secretsOutput",
  "envValueOutput",
  "publicPromotionAllowed",
  "scoreSourceRealAllowed"
]) {
  expect(artifact.safety?.[key], false, `artifact.safety.${key}`);
}
expect(artifact.safety?.publicDataSource, "mock", "artifact.safety.publicDataSource");
expect(artifact.safety?.scoreSource, "mock", "artifact.safety.scoreSource");

for (const phrase of [
  "phase_1_twii_operator_value_blocker_rollup_ready_not_executable",
  "external_operator_values_missing",
  "TWII",
  "daily_prices",
  "60",
  "prepare_operator_value_collection_or_continue_non_data_runtime_work",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase write",
  "No daily_prices mutation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

if (
  packageJson.scripts?.["check:phase-1-twii-operator-value-blocker-rollup"] !==
  "node scripts/check-phase-1-twii-operator-value-blocker-rollup.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-twii-operator-value-blocker-rollup`);
}
if (!reviewGate.includes("scripts/check-phase-1-twii-operator-value-blocker-rollup.mjs")) {
  problems.push(`${reviewGatePath} missing checker command`);
}
if (!reviewGate.includes('"phase-1-twii-operator-value-blocker-rollup"')) {
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
      guardedStatus: status === "ok" ? artifact.status : "phase_1_twii_operator_value_blocker_rollup_blocked",
      currentMainBlocker: artifact.currentMainBlocker ?? null,
      nextCEOAction: artifact.nextCEOAction ?? null,
      missingValueCount: artifact.operatorValuesMissing?.length ?? null,
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
    /guaranteed return/iu,
    /buy now/iu
  ];
}
