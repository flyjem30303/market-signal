import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-write-gate-preflight-requirements-closure.json";
const inputPreflightPath = "data/evidence-intake/phase-1-write-gate-preflight-after-operator-booleans.json";
const docPath = "docs/PHASE_1_WRITE_GATE_PREFLIGHT_REQUIREMENTS_CLOSURE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const inputPreflight = parseJson(readText(inputPreflightPath), inputPreflightPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);

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
        ? "phase_1_write_gate_preflight_requirements_closure_ready_no_execution"
        : "phase_1_write_gate_preflight_requirements_closure_blocked",
      writeGatePreflightRequirementsClosed: artifact.writeGatePreflightRequirementsClosed ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
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
  expect(
    inputPreflight.status,
    "phase_1_write_gate_preflight_after_operator_booleans_ready_no_execution",
    "input preflight artifact status"
  );
  expect(inputPreflight.operatorBlockersCleared, true, "input operatorBlockersCleared");
  expectArray(inputPreflight.writeGateChecklistRemainingBlockers, [], "input writeGateChecklistRemainingBlockers");
  expect(inputPreflight.writeGateExecutableNow, false, "input writeGateExecutableNow");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_write_gate_preflight_requirements_closure_ready_no_execution", "artifact status");
  expect(artifact.packetMode, "write_gate_preflight_requirements_closure_no_execution", "packetMode");
  expect(artifact.inputPreflight, "phase_1_write_gate_preflight_after_operator_booleans_ready_no_execution", "inputPreflight");
  expect(artifact.operatorBlockersCleared, true, "operatorBlockersCleared");
  expectArray(artifact.writeGateChecklistRemainingBlockers, [], "writeGateChecklistRemainingBlockers");
  expect(artifact.writeGatePreflightRequirementsClosed, true, "writeGatePreflightRequirementsClosed");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.preflightClosureMode, "reference_plans_closed_no_execution", "preflightClosureMode");
  expect(artifact.boundedAttemptScope, "twii_and_etf_phase_1_missing_row_closure_only", "boundedAttemptScope");
  expect(artifact.nextRoute, "phase_1_write_gate_dry_run_after_preflight_requirements", "nextRoute");

  const expectedRequirements = [
    "rollback_plan",
    "aggregate_readback_plan",
    "duplicate_rejection_plan",
    "post_run_review_plan",
    "source_rights_boundary",
    "runtime_fallback_boundary",
    "public_disclosure_boundary"
  ];
  expectArray(
    Array.isArray(artifact.closedRequirements)
      ? artifact.closedRequirements.map((requirement) => requirement.id)
      : artifact.closedRequirements,
    expectedRequirements,
    "closedRequirements"
  );
  for (const requirement of artifact.closedRequirements ?? []) {
    expect(requirement.status, "closed_reference_only", `${requirement.id}.status`);
    if (typeof requirement.evidence !== "string" || requirement.evidence.length < 8) {
      problems.push(`${requirement.id}.evidence must be a non-empty reference`);
    }
  }

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
    "phase_1_write_gate_preflight_requirements_closure_ready_no_execution",
    "write_gate_preflight_requirements_closure_no_execution",
    "inputPreflight=phase_1_write_gate_preflight_after_operator_booleans_ready_no_execution",
    "operatorBlockersCleared=true",
    "writeGateChecklistRemainingBlockers=[]",
    "writeGatePreflightRequirementsClosed=true",
    "writeGateExecutableNow=false",
    "preflightClosureMode=reference_plans_closed_no_execution",
    "boundedAttemptScope=twii_and_etf_phase_1_missing_row_closure_only",
    "nextRoute=phase_1_write_gate_dry_run_after_preflight_requirements",
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
    packageJson.scripts?.["check:phase-1-write-gate-preflight-requirements-closure"] !==
    "node scripts/check-phase-1-write-gate-preflight-requirements-closure.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-gate-preflight-requirements-closure");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-gate-preflight-requirements-closure.mjs")) {
    problems.push("review gate missing write-gate preflight requirements closure checker");
  }
  if (!reviewGate.includes('"phase-1-write-gate-preflight-requirements-closure"')) {
    problems.push("focused review gate missing write-gate preflight requirements closure checker");
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
    /sqlExecuted"\s*:\s*true/u,
    /supabaseReadAttempted"\s*:\s*true/u,
    /supabaseWriteAttempted"\s*:\s*true/u,
    /dailyPricesMutated"\s*:\s*true/u,
    /marketDataFetched"\s*:\s*true/u,
    /marketDataIngested"\s*:\s*true/u,
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
