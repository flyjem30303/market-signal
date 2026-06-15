import fs from "node:fs";

const bridgePath = "data/evidence-intake/phase-1-twii-operator-action-bridge.json";
const docPath = "docs/PHASE_1_TWII_OPERATOR_ACTION_BRIDGE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const bridgeRaw = readText(bridgePath);
const bridge = parseJson(bridgeRaw, bridgePath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);

const checklist = parseJson(readText(bridge.sourceChecklistPacketPath), bridge.sourceChecklistPacketPath);
const checklistGate = parseJson(readText(bridge.sourceChecklistGatePath), bridge.sourceChecklistGatePath);
const operatorBlocker = parseJson(readText(bridge.sourceOperatorBlockerRollupPath), bridge.sourceOperatorBlockerRollupPath);
const writeStopline = parseJson(readText(bridge.sourceWriteStoplineRollupPath), bridge.sourceWriteStoplineRollupPath);

expect(bridge.status, "phase_1_twii_operator_action_bridge_ready_not_executable", "bridge.status");
expect(bridge.bridgeMode, "operator_action_bridge_no_execution", "bridge.bridgeMode");
expect(bridge.targetLane, "TWII", "bridge.targetLane");
expect(bridge.targetScope, "twii_index_daily_prices_missing_rows", "bridge.targetScope");
expect(bridge.targetTable, "daily_prices", "bridge.targetTable");
expect(bridge.maxRows, 60, "bridge.maxRows");
expect(bridge.currentActionStatus, "waiting_external_operator_values", "bridge.currentActionStatus");
expect(bridge.operatorChecklistItemCount, checklist.items?.length, "bridge.operatorChecklistItemCount");
expect(bridge.operatorChecklistMissingItemCount, checklist.items?.filter((item) => item.providedNow === false).length, "bridge.operatorChecklistMissingItemCount");
expect(bridge.writeGateBlockerCount, operatorBlocker.operatorValuesMissing?.length, "bridge.writeGateBlockerCount");
expect(bridge.writeGateBlockerCount, writeStopline.blockersRemaining?.length, "bridge.writeGateBlockerCount vs writeStopline");
expect(bridge.executionAllowedNow, false, "bridge.executionAllowedNow");
expect(bridge.writeGateExecutableNow, false, "bridge.writeGateExecutableNow");
expect(bridge.publicPromotionAllowed, false, "bridge.publicPromotionAllowed");

expect(checklist.checklistKind, "twii_real_operator_intake_checklist_packet", "checklist.checklistKind");
expect(checklist.currentChecklistStatus, "blocked_missing_real_values", "checklist.currentChecklistStatus");
expect(checklistGate.currentChecklistStatus, "blocked_missing_real_values", "checklistGate.currentChecklistStatus");
expect(operatorBlocker.currentMainBlocker, "external_operator_values_missing", "operatorBlocker.currentMainBlocker");
expect(writeStopline.currentStopline, "separate_authorized_execution_attempt_preparation_ready_waiting_external_values", "writeStopline.currentStopline");

for (const action of [
  "provide_real_decision_status_presence",
  "provide_operator_attestation_presence",
  "provide_execution_acknowledgement_presence",
  "provide_server_only_credential_presence_result",
  "keep_mock_boundary_visible"
]) {
  if (!bridge.highestPriorityExternalActions?.includes(action)) {
    problems.push(`highestPriorityExternalActions missing ${action}`);
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
  "realValuesReadNow",
  "realDecisionValueRecordedNow",
  "authorizationValuesRead",
  "executeSwitchValueRead",
  "confirmationPhraseValueRead",
  "credentialValuesRead",
  "rawPayloadOutput",
  "rowPayloadOutput",
  "stockIdPayloadOutput",
  "secretsOutput",
  "envValueOutput",
  "publicPromotionAllowed",
  "scoreSourceRealAllowed"
]) {
  expect(bridge.safety?.[key], false, `bridge.safety.${key}`);
}
expect(bridge.safety?.publicDataSource, "mock", "bridge.safety.publicDataSource");
expect(bridge.safety?.scoreSource, "mock", "bridge.safety.scoreSource");

for (const phrase of [
  "phase_1_twii_operator_action_bridge_ready_not_executable",
  "waiting_external_operator_values",
  "operator checklist items: `6`",
  "write-gate blockers: `9`",
  "Do not create more preparation-only gates",
  "operator_values_shape_recheck_then_pre_execution_readiness_recheck",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase write",
  "No `daily_prices` mutation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

if (
  packageJson.scripts?.["check:phase-1-twii-operator-action-bridge"] !==
  "node scripts/check-phase-1-twii-operator-action-bridge.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-twii-operator-action-bridge`);
}
if (!reviewGate.includes("scripts/check-phase-1-twii-operator-action-bridge.mjs")) {
  problems.push(`${reviewGatePath} missing checker command`);
}
if (!reviewGate.includes('"phase-1-twii-operator-action-bridge"')) {
  problems.push(`${reviewGatePath} missing focused gate name`);
}

for (const [label, text] of [
  [bridgePath, bridgeRaw],
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
      guardedStatus: status === "ok" ? bridge.status : "phase_1_twii_operator_action_bridge_blocked",
      currentActionStatus: bridge.currentActionStatus ?? null,
      operatorChecklistMissingItemCount: bridge.operatorChecklistMissingItemCount ?? null,
      writeGateBlockerCount: bridge.writeGateBlockerCount ?? null,
      postExternalValueReviewRoute: bridge.postExternalValueReviewRoute ?? null,
      publicDataSource: bridge.safety?.publicDataSource ?? null,
      scoreSource: bridge.safety?.scoreSource ?? null,
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
