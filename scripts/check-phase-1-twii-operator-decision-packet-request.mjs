import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_TWII_OPERATOR_DECISION_PACKET_REQUEST.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const intakeReadiness = runJson("scripts/check-phase-1-twii-operator-decision-intake-readiness.mjs", "TWII intake readiness checker");
const visiblePacket = runJson("scripts/report-twii-operator-visible-decision-packet-readiness-gate-preflight.mjs", "TWII visible packet preflight");
const fillSimulation = runJson("scripts/report-twii-operator-packet-fill-simulation-gate-preflight.mjs", "TWII packet fill simulation preflight");
const blocker = runJson("scripts/report-twii-real-operator-packet-intake-blocker-gate-preflight.mjs", "TWII real operator packet blocker preflight");
const nextRoute = runJson("scripts/report-twii-operator-checklist-next-execution-route-gate-preflight.mjs", "TWII next route preflight");

validateDoc();
validateRegistration();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_twii_operator_decision_packet_request_ready_no_execution"
    : "phase_1_twii_operator_decision_packet_request_blocked",
  missing: problems,
  currentDecision: {
    intakeReadiness: intakeReadiness.guardedStatus ?? null,
    visiblePacket: visiblePacket.status ?? null,
    fillSimulation: fillSimulation.status ?? null,
    blocker: blocker.status ?? null,
    nextRoute: nextRoute.status ?? null,
    selectedNextRoute: nextRoute.selectedNextRoute ?? null,
    currentRouteStatus: nextRoute.currentRouteStatus ?? null,
    realValuesProvidedNow: blocker.blockerState?.realValuesProvidedNow ?? null,
    publicDataSource: blocker.safety?.publicDataSource ?? null,
    scoreSource: blocker.safety?.scoreSource ?? null,
    executionAllowedNow: nextRoute.routeState?.executionAllowedNow ?? blocker.safety?.executionAllowedNow ?? null
  }
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDoc() {
  const requiredTokens = [
    "phase_1_twii_operator_decision_packet_request_ready_no_execution",
    "twii-one-attempt-runner-20260610-a",
    "twii_index_daily_prices_missing_rows",
    "data/candidates/twii-sanitized-candidate.json",
    "public data source: `mock`",
    "score source: `mock`",
    "blocked_waiting_real_operator_and_pre_execution_values",
    "operator_submits_one_twii_decision_packet_for_pm_intake_review",
    "wait_for_real_operator_values_execute_switch_confirmation_credentials_and_pre_execution_checks"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);

  for (const status of ["accepted", "rejected", "repair_required", "deferred_or_expired"]) {
    if (!doc.includes(`\`${status}\``)) problems.push(`doc missing status ${status}`);
  }

  for (const field of [
    "decisionStatus",
    "decisionRecordedByRole",
    "decisionRecordedAtLabel",
    "decisionReasonSummary",
    "repairRequiredSummary"
  ]) {
    if (!doc.includes(`\`${field}\``)) problems.push(`doc missing operator field ${field}`);
  }

  const forbiddenTokens = [
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
  ];
  for (const token of forbiddenTokens) if (doc.includes(token)) problems.push(`doc contains forbidden token ${token}`);
}

function validateRegistration() {
  const scriptName = "check:phase-1-twii-operator-decision-packet-request";
  const scriptCommand = "node scripts/check-phase-1-twii-operator-decision-packet-request.mjs";
  let packageJson = {};
  try {
    packageJson = JSON.parse(packageJsonText);
  } catch (error) {
    problems.push(`package.json parse failed: ${error.message}`);
  }
  if (packageJson.scripts?.[scriptName] !== scriptCommand) problems.push(`${scriptName} not registered in package.json`);
  if (!reviewGate.includes("scripts/check-phase-1-twii-operator-decision-packet-request.mjs")) {
    problems.push("review gate does not execute TWII operator decision packet request checker");
  }
  if (!reviewGate.includes('"phase-1-twii-operator-decision-packet-request"')) {
    problems.push("review gate focused set missing TWII operator decision packet request");
  }
}

function validateReports() {
  expect(intakeReadiness.guardedStatus, "phase_1_twii_operator_decision_intake_readiness_ready_no_execution", "intake readiness guardedStatus");
  expect(visiblePacket.status, "twii_operator_visible_decision_packet_readiness_gate_preflight_ready_no_execution", "visible packet status");
  expect(visiblePacket.packetValidation?.packetCount, 3, "visible packet count");
  expect(visiblePacket.packetState?.realDecisionValueRecordedNow, false, "visible packet realDecisionValueRecordedNow");
  expect(visiblePacket.packetState?.executionAllowedNow, false, "visible packet executionAllowedNow");

  expect(fillSimulation.status, "twii_operator_packet_fill_simulation_gate_preflight_ready_no_execution", "fill simulation status");
  expect(fillSimulation.simulationValidation?.simulationCount, 3, "fill simulation count");
  expect(fillSimulation.simulationState?.simulatedFillAcceptedAsReal, false, "fill simulation accepted as real");

  expect(blocker.status, "twii_real_operator_packet_intake_blocker_gate_preflight_ready_no_execution", "blocker status");
  expect(blocker.blockerState?.realValuesProvidedNow, false, "blocker realValuesProvidedNow");
  expect(blocker.blockerState?.realOperatorPacketAcceptedNow, false, "blocker realOperatorPacketAcceptedNow");
  expect(blocker.blockerState?.executionAllowedNow, false, "blocker executionAllowedNow");

  expect(nextRoute.status, "twii_operator_checklist_next_execution_route_gate_preflight_ready_no_execution", "next route status");
  expect(nextRoute.currentRouteStatus, "blocked_waiting_real_operator_and_pre_execution_values", "next route currentRouteStatus");
  expect(nextRoute.selectedNextRoute, "wait_for_real_operator_values_execute_switch_confirmation_credentials_and_pre_execution_checks", "next route selectedNextRoute");

  for (const [label, report] of Object.entries({ visiblePacket, fillSimulation, blocker, nextRoute })) {
    const safety = report.safety ?? {};
    expect(safety.publicDataSource, "mock", `${label}.publicDataSource`);
    expect(safety.scoreSource, "mock", `${label}.scoreSource`);
    for (const key of [
      "sqlExecuted",
      "supabaseConnectionAttempted",
      "supabaseWritesEnabled",
      "marketDataFetched",
      "marketDataIngested",
      "candidateArtifactRowsRead",
      "dailyPricesMutated",
      "stagingRowsCreated",
      "rawPayloadOutput",
      "rowPayloadOutput",
      "stockIdPayloadOutput",
      "secretsOutput",
      "envValueOutput",
      "scoreSourceRealAllowed"
    ]) {
      if (key in safety && safety[key] !== false) problems.push(`${label}.safety.${key} must be false`);
    }
  }
}

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

function runJson(filePath, label) {
  const run = spawnSync(process.execPath, [filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) {
    problems.push(`${label} exited ${run.status}`);
    return {};
  }
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${label} did not emit JSON: ${error.message}`);
    return {};
  }
}
