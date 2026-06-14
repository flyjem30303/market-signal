import fs from "node:fs";
import { spawnSync } from "node:child_process";

const node = process.execPath;
const docPath = "docs/PHASE_1_TWII_BOUNDED_WRITE_OPERATOR_DECISION_QUICKSTART.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const dataOnlineReportPath = "scripts/check-phase-1-data-online-go-no-go-status.mjs";
const operatorReportPath = "scripts/report-twii-final-operator-authorization-packet-preflight.mjs";
const routeReportPath = "scripts/report-twii-operator-checklist-next-execution-route-gate-preflight.mjs";

const missing = [];
const blocked = [];

const doc = read(docPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const dataOnline = runJson(dataOnlineReportPath, "Phase 1 data online Go/No-Go");
const operator = runJson(operatorReportPath, "TWII final operator authorization packet preflight");
const route = runJson(routeReportPath, "TWII operator checklist next execution route");

for (const token of [
  "phase_1_twii_bounded_write_operator_decision_quickstart_ready_no_execution",
  "READY_FOR_OPERATOR_DECISION_PACKET_REVIEW_BUT_EXECUTION_BLOCKED",
  "`twii-one-attempt-runner-20260610-a`",
  "`daily_prices`",
  "`TWII`",
  "`twii_index_daily_prices_missing_rows`",
  "`60`",
  "`data/candidates/twii-sanitized-candidate.json`",
  "`realDecisionStatus`",
  "`realDecisionRecordedBy`",
  "`realDecisionRecordedAt`",
  "`realDecisionReasonSummary`",
  "`operatorAttestation`",
  "`executionAcknowledgement`",
  "`TWII_ONE_ATTEMPT_EXECUTE`",
  "`TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE`",
  "`accepted_for_explicit_attempt_decision_review`",
  "`rejected`",
  "`repair_required`",
  "`deferred_or_expired`",
  "`authorizationDecisionAcceptedNow=false`",
  "`runnerExecutableNow=false`",
  "`executionAllowedNow=false`",
  "`writeGateExecutableNow=false`",
  "`implementationAllowedNow=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "operator_reviews_twii_bounded_write_packet_then_supplies_external_decision_or_rejects"
]) {
  if (!doc.includes(token)) missing.push(`${docPath}: ${token}`);
}

for (const forbidden of [
  "executeSwitchValue",
  "confirmationPhraseValue",
  "credentialValue",
  "secretValue",
  "authorizationValue",
  "operatorDecisionValue",
  "rowBody",
  "tradeDateList",
  "marketValue",
  "sourcePayload",
  "rawPayload",
  "stockIdPayload",
  "personalizedAdvice",
  "buySellHoldSignal",
  "publicDataSource=supabase",
  "scoreSource=real"
]) {
  if (doc.includes(forbidden)) blocked.push(`${docPath}: forbidden value/payload token ${forbidden}`);
}

const scriptName = "check:phase-1-twii-bounded-write-operator-decision-quickstart";
const scriptCommand = "node scripts/check-phase-1-twii-bounded-write-operator-decision-quickstart.mjs";

if (packageJson.scripts?.[scriptName] !== scriptCommand) {
  missing.push(`${packagePath}: ${scriptName}`);
}

if (!reviewGate.includes("scripts/check-phase-1-twii-bounded-write-operator-decision-quickstart.mjs")) {
  missing.push(`${reviewGatePath}: checker registered`);
}

if (!reviewGate.includes('"phase-1-twii-bounded-write-operator-decision-quickstart"')) {
  missing.push(`${reviewGatePath}: focused gate name`);
}

if (dataOnline.status !== "ok") blocked.push("data-online Go/No-Go check must be ok");
if (dataOnline.decision !== "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO") blocked.push("data-online decision must stay NO_GO");
if (dataOnline.coverage?.fullLevel1ExpectedRows !== 360) blocked.push("Level 1 expected rows must be 360");
if (dataOnline.coverage?.fullLevel1ObservedRows !== 182) blocked.push("Level 1 observed rows must be 182");
if (dataOnline.coverage?.fullLevel1MissingRows !== 178) blocked.push("Level 1 missing rows must be 178");
if (dataOnline.coverage?.twiiMissingRows !== 60) blocked.push("TWII missing rows must be 60");
if (dataOnline.coverage?.etfMissingRows !== 118) blocked.push("ETF missing rows must be 118");
if (dataOnline.publicDataSource !== "mock") blocked.push("publicDataSource must remain mock");
if (dataOnline.scoreSource !== "mock") blocked.push("scoreSource must remain mock");
if (dataOnline.twiiExecutionAllowedNow !== false) blocked.push("TWII execution must remain blocked");

if (operator.status !== "twii_final_operator_authorization_packet_preflight_ready_no_execution") blocked.push("operator preflight status mismatch");
if (operator.outcome !== "final_operator_authorization_packet_ready_execution_still_blocked") blocked.push("operator preflight outcome mismatch");
if (operator.attemptId !== "twii-one-attempt-runner-20260610-a") blocked.push("attempt id mismatch");
if (operator.target?.targetTable !== "daily_prices") blocked.push("target table mismatch");
if (operator.target?.targetLane !== "TWII") blocked.push("target lane mismatch");
if (operator.target?.targetScope !== "twii_index_daily_prices_missing_rows") blocked.push("target scope mismatch");
if (operator.target?.maxRows !== 60) blocked.push("max rows mismatch");
if (operator.candidateArtifactPath !== "data/candidates/twii-sanitized-candidate.json") blocked.push("candidate artifact path mismatch");
if (operator.operatorAuthorizationPacketState?.authorizationDecisionAcceptedNow !== false) blocked.push("authorization decision must remain false");
if (operator.operatorAuthorizationPacketState?.runnerExecutableNow !== false) blocked.push("runner must remain non-executable");
if (operator.operatorAuthorizationPacketState?.executionAllowedNow !== false) blocked.push("execution must remain blocked");
if (operator.operatorAuthorizationPacketState?.writeGateExecutableNow !== false) blocked.push("write gate must remain blocked");
if (operator.operatorAuthorizationPacketState?.implementationAllowedNow !== false) blocked.push("implementation must remain blocked");
if (operator.requirementNames?.requiredExecuteSwitchName !== "TWII_ONE_ATTEMPT_EXECUTE") blocked.push("execute switch name mismatch");
if (operator.requirementNames?.requiredConfirmationPhraseName !== "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE") blocked.push("confirmation phrase name mismatch");
if (operator.safety?.candidateArtifactReferenceOnly !== true) blocked.push("candidate artifact must be reference-only");

for (const key of [
  "sqlExecuted",
  "supabaseConnectionAttempted",
  "supabaseWritesEnabled",
  "marketDataFetched",
  "marketDataIngested",
  "candidateRowsAccepted",
  "candidateArtifactRowsRead",
  "authorizationValuesRead",
  "executeSwitchValueRead",
  "confirmationPhraseValueRead",
  "credentialValuesRead",
  "sourcePayloadRead",
  "rowPayloadRead",
  "rawPayloadRead",
  "dailyPricesMutated",
  "stagingRowsCreated",
  "rowCoverageScoringAllowed",
  "rawPayloadOutput",
  "rowPayloadOutput",
  "stockIdPayloadOutput",
  "secretsOutput",
  "envValueOutput",
  "publicPromotionAllowed",
  "scoreSourceRealAllowed"
]) {
  if (operator.safety?.[key] !== false) blocked.push(`operator.safety.${key} must remain false`);
}

if (route.status !== "twii_operator_checklist_next_execution_route_gate_preflight_ready_no_execution") blocked.push("next execution route status mismatch");
if (route.currentRouteStatus !== "blocked_waiting_real_operator_and_pre_execution_values") blocked.push("next route must remain blocked waiting values");
if (route.routeState?.realValuesProvidedNow !== false) blocked.push("real values must not be provided now");
if (route.routeState?.runnerExecutableNow !== false) blocked.push("route runner must remain blocked");
if (route.routeState?.executionAllowedNow !== false) blocked.push("route execution must remain blocked");
if (route.routeState?.implementationAllowedNow !== false) blocked.push("route implementation must remain blocked");

console.log(
  JSON.stringify(
    {
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked",
      guardedStatus: "phase_1_twii_bounded_write_operator_decision_quickstart_ready_no_execution",
      missing,
      blocked,
      currentDecision: {
        dataOnline: dataOnline.decision ?? null,
        operatorOutcome: operator.outcome ?? null,
        routeStatus: route.currentRouteStatus ?? null,
        publicDataSource: dataOnline.publicDataSource ?? null,
        scoreSource: dataOnline.scoreSource ?? null,
        twiiExecutionAllowedNow: dataOnline.twiiExecutionAllowedNow ?? null
      }
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(path) {
  if (!fs.existsSync(path)) {
    missing.push(`${path}: file exists`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}

function runJson(path, label) {
  const result = spawnSync(node, [path], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });

  if (result.status !== 0) {
    blocked.push(`${label}: exited ${result.status}`);
    return {};
  }

  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    blocked.push(`${label}: stdout is not JSON: ${error.message}`);
    return {};
  }
}
