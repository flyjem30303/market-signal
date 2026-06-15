import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-write-gate-execution-packet-draft-no-execution.json";
const inputDryRunPath = "data/evidence-intake/phase-1-write-gate-dry-run-after-preflight-requirements.json";
const docPath = "docs/PHASE_1_WRITE_GATE_EXECUTION_PACKET_DRAFT_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const inputDryRun = parseJson(readText(inputDryRunPath), inputDryRunPath);
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
        ? "phase_1_write_gate_execution_packet_draft_no_execution_ready"
        : "phase_1_write_gate_execution_packet_draft_no_execution_blocked",
      executionPacketDraftReady: artifact.executionPacketDraftReady ?? null,
      executionAllowedNow: artifact.executionAllowedNow ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      targetTable: artifact.targetTable ?? null,
      fullLevel1MissingRows: artifact.targetRows?.fullLevel1MissingRows ?? null,
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
    inputDryRun.status,
    "phase_1_write_gate_dry_run_after_preflight_requirements_ready_no_execution",
    "input dry run artifact status"
  );
  expect(inputDryRun.dryRunReady, true, "input dryRunReady");
  expect(inputDryRun.writeGateExecutableNow, false, "input writeGateExecutableNow");
  expect(inputDryRun.nextRoute, "phase_1_write_gate_execution_packet_draft_no_execution", "input nextRoute");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_write_gate_execution_packet_draft_no_execution_ready", "artifact status");
  expect(artifact.packetMode, "write_gate_execution_packet_draft_no_execution", "packetMode");
  expect(artifact.inputDryRun, "phase_1_write_gate_dry_run_after_preflight_requirements_ready_no_execution", "inputDryRun");
  expect(artifact.executionPacketDraftReady, true, "executionPacketDraftReady");
  expect(artifact.executionAllowedNow, false, "executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.boundedAttemptScope, "twii_and_etf_phase_1_missing_row_closure_only", "boundedAttemptScope");
  expect(artifact.targetTable, "daily_prices", "targetTable");
  expect(artifact.nextRoute, "phase_1_write_gate_runner_stub_or_operator_execution_packet_review", "nextRoute");

  const expectedTargetRows = {
    fullLevel1ExpectedRows: 360,
    fullLevel1ObservedRows: 182,
    fullLevel1MissingRows: 178,
    twiiMissingRows: 60,
    etfMissingRows: 118
  };
  for (const [key, expected] of Object.entries(expectedTargetRows)) {
    expect(artifact.targetRows?.[key], expected, `targetRows.${key}`);
  }

  expectArray(
    Array.isArray(artifact.executionPacketRequirements)
      ? artifact.executionPacketRequirements.map((item) => item.id)
      : artifact.executionPacketRequirements,
    [
      "operator_final_go_no_go",
      "sanitized_candidate_artifact_paths",
      "server_only_credentials_present",
      "insert_missing_only_runner",
      "aggregate_readback_runner",
      "rollback_or_quarantine_decision",
      "runtime_promotion_decision"
    ],
    "executionPacketRequirements"
  );
  for (const item of artifact.executionPacketRequirements ?? []) {
    if (typeof item.rule !== "string" || item.rule.length < 16) problems.push(`${item.id}.rule must be explicit`);
    if (
      ![
        "required_before_execution",
        "required_after_execution",
        "required_after_successful_post_run_review"
      ].includes(item.status)
    ) {
      problems.push(`${item.id}.status has unsupported value ${JSON.stringify(item.status)}`);
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
    "phase_1_write_gate_execution_packet_draft_no_execution_ready",
    "write_gate_execution_packet_draft_no_execution",
    "inputDryRun=phase_1_write_gate_dry_run_after_preflight_requirements_ready_no_execution",
    "executionPacketDraftReady=true",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "boundedAttemptScope=twii_and_etf_phase_1_missing_row_closure_only",
    "targetTable=daily_prices",
    "nextRoute=phase_1_write_gate_runner_stub_or_operator_execution_packet_review",
    "fullLevel1ExpectedRows=360",
    "fullLevel1ObservedRows=182",
    "fullLevel1MissingRows=178",
    "twiiMissingRows=60",
    "etfMissingRows=118",
    "operator_final_go_no_go",
    "sanitized_candidate_artifact_paths",
    "server_only_credentials_present",
    "insert_missing_only_runner",
    "aggregate_readback_runner",
    "rollback_or_quarantine_decision",
    "runtime_promotion_decision",
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
    packageJson.scripts?.["check:phase-1-write-gate-execution-packet-draft-no-execution"] !==
    "node scripts/check-phase-1-write-gate-execution-packet-draft-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-gate-execution-packet-draft-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-gate-execution-packet-draft-no-execution.mjs")) {
    problems.push("review gate missing write-gate execution packet draft checker");
  }
  if (!reviewGate.includes('"phase-1-write-gate-execution-packet-draft-no-execution"')) {
    problems.push("focused review gate missing write-gate execution packet draft checker");
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
    /executionAllowedNow"\s*:\s*true/u,
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
