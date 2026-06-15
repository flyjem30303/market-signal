import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-write-gate-preflight-after-operator-booleans.json";
const docPath = "docs/PHASE_1_WRITE_GATE_PREFLIGHT_AFTER_OPERATOR_BOOLEANS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const finalOperatorResult = runJson(
  "scripts/check-phase-1-final-operator-boolean-reviewed-result.mjs",
  "final operator boolean reviewed result"
);
const checklist = runJson(
  "scripts/check-phase-1-data-online-write-gate-checklist-runner-no-execution.mjs",
  "write gate checklist runner"
);

validatePrerequisites();
validateArtifact();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_write_gate_preflight_after_operator_booleans_ready_no_execution"
        : "phase_1_write_gate_preflight_after_operator_booleans_blocked",
      operatorBlockersCleared: artifact.operatorBlockersCleared ?? null,
      writeGateChecklistRemainingBlockers: artifact.writeGateChecklistRemainingBlockers ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      preflightReadyNow: artifact.preflightReadyNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
      publicDataSource: artifact.safety?.publicDataSource ?? null,
      scoreSource: artifact.safety?.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(finalOperatorResult.status, "ok", "final operator result status");
  expect(
    finalOperatorResult.guardedStatus,
    "phase_1_final_operator_boolean_reviewed_result_ready_no_values",
    "final operator result guarded status"
  );
  expect(finalOperatorResult.operatorValuesSatisfied, true, "operatorValuesSatisfied");
  expect(finalOperatorResult.operatorOwnedPresenceConfirmationSatisfied, true, "operatorOwnedPresenceConfirmationSatisfied");
  expect(checklist.status, "ok", "checklist status");
  expectArray(checklist.remainingBlockers, [], "checklist remainingBlockers");
  expect(checklist.writeGateExecutableNow, false, "checklist writeGateExecutableNow");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_write_gate_preflight_after_operator_booleans_ready_no_execution", "artifact status");
  expect(artifact.packetMode, "write_gate_preflight_after_operator_booleans_no_execution", "packetMode");
  expect(artifact.inputReviewedResult, "phase_1_final_operator_boolean_reviewed_result_ready_no_values", "inputReviewedResult");
  expect(artifact.operatorBlockersCleared, true, "operatorBlockersCleared");
  expectArray(artifact.writeGateChecklistRemainingBlockers, [], "writeGateChecklistRemainingBlockers");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.preflightReadyNow, false, "preflightReadyNow");
  expect(artifact.nextRoute, "phase_1_write_gate_preflight_requirements_closure", "nextRoute");
  expectArray(artifact.preflightRequiredItems, [
    "rollback_plan",
    "aggregate_readback_plan",
    "duplicate_rejection_plan",
    "post_run_review_plan",
    "source_rights_boundary",
    "runtime_fallback_boundary",
    "public_disclosure_boundary"
  ], "preflightRequiredItems");
  expect(artifact.safety?.publicDataSource, "mock", "publicDataSource");
  expect(artifact.safety?.scoreSource, "mock", "scoreSource");
  for (const key of [
    "valuesRead",
    "valuesStored",
    "valuesPrinted",
    "valuesHashed",
    "valuesCompared",
    "valuesTransformed",
    "credentialValueRead",
    "credentialValueStored",
    "credentialValuePrinted",
    "sqlExecuted",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(artifact.safety?.[key], false, `safety.${key}`);
  }
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_write_gate_preflight_after_operator_booleans_ready_no_execution",
    "write_gate_preflight_after_operator_booleans_no_execution",
    "operatorBlockersCleared=true",
    "writeGateChecklistRemainingBlockers=[]",
    "writeGateExecutableNow=false",
    "preflightReadyNow=false",
    "nextRoute=phase_1_write_gate_preflight_requirements_closure",
    "rollback_plan",
    "aggregate_readback_plan",
    "duplicate_rejection_plan",
    "post_run_review_plan",
    "source_rights_boundary",
    "runtime_fallback_boundary",
    "public_disclosure_boundary",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No value read",
    "No value storage",
    "No value printing",
    "No value hashing",
    "No value comparison",
    "No value transformation",
    "No credential value read",
    "No credential value storage",
    "No credential value output",
    "No SQL",
    "No Supabase read",
    "No Supabase write",
    "No staging rows",
    "No `daily_prices` mutation",
    "No market-data fetch",
    "No market-data ingestion",
    "No raw payload output",
    "No row payload output",
    "No secret output",
    "No source promotion",
    "No score promotion",
    "No public real-data claim",
    "No investment advice"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-write-gate-preflight-after-operator-booleans"] !==
    "node scripts/check-phase-1-write-gate-preflight-after-operator-booleans.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-gate-preflight-after-operator-booleans");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-gate-preflight-after-operator-booleans.mjs")) {
    problems.push("review gate missing write-gate preflight after operator booleans checker");
  }
  if (!reviewGate.includes('"phase-1-write-gate-preflight-after-operator-booleans"')) {
    problems.push("focused review gate missing write-gate preflight after operator booleans checker");
  }
}

function validateBoundaries() {
  const forbiddenPatterns = [
    /sb_secret_/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
    /https:\/\/[a-z0-9.-]+supabase/iu,
    /"executeSwitchValue"\s*:/u,
    /"confirmationPhraseValue"\s*:/u,
    /"operatorDecisionValue"\s*:/u,
    /"credentialValue"\s*:/u,
    /valuesRead"\s*:\s*true/u,
    /valuesStored"\s*:\s*true/u,
    /valuesPrinted"\s*:\s*true/u,
    /valuesHashed"\s*:\s*true/u,
    /valuesCompared"\s*:\s*true/u,
    /valuesTransformed"\s*:\s*true/u,
    /supabaseReadAttempted"\s*:\s*true/u,
    /supabaseWriteAttempted"\s*:\s*true/u,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /writeGateExecutableNow"\s*:\s*true/u
  ];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(artifactRaw)) problems.push(`${artifactPath} contains forbidden pattern ${pattern}`);
    if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${pattern}`);
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

function runJson(filePath, label) {
  const run = spawnSync(process.execPath, [filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 180000,
    windowsHide: true
  });
  if (run.status !== 0) {
    problems.push(`${label} exited ${run.status}`);
    return {};
  }
  return parseJson(run.stdout, label);
}
