import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_TWII_OPERATOR_DECISION_INTAKE_READINESS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = readText(docPath);
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const quickstart = runJson("scripts/check-phase-1-twii-bounded-write-operator-decision-quickstart.mjs", "TWII operator quickstart checker");
const template = runJson("scripts/report-twii-real-decision-intake-packet-template-gate-preflight.mjs", "TWII real decision intake template preflight");
const dryRun = runJson("scripts/report-twii-real-decision-acceptance-dry-run-gate-preflight.mjs", "TWII real decision acceptance dry-run preflight");
const mockRecorder = runJson("scripts/report-twii-decision-intake-recorder-mock-gate-preflight.mjs", "TWII decision intake mock recorder preflight");
const acceptedIntake = runJson("scripts/report-twii-accepted-decision-record-intake-gate-preflight.mjs", "TWII accepted decision record intake preflight");
const nextRoute = runJson("scripts/report-twii-operator-checklist-next-execution-route-gate-preflight.mjs", "TWII operator checklist next route preflight");

validateDoc();
validateRegistration();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_twii_operator_decision_intake_readiness_ready_no_execution"
    : "phase_1_twii_operator_decision_intake_readiness_blocked",
  missing: problems,
  currentDecision: {
    quickstart: quickstart.guardedStatus ?? null,
    template: template.status ?? null,
    dryRun: dryRun.status ?? null,
    mockRecorder: mockRecorder.status ?? null,
    acceptedIntake: acceptedIntake.status ?? null,
    nextRoute: nextRoute.status ?? null,
    selectedNextRoute: nextRoute.selectedNextRoute ?? null,
    publicDataSource: nextRoute.safety?.publicDataSource ?? null,
    scoreSource: nextRoute.safety?.scoreSource ?? null,
    executionAllowedNow: nextRoute.routeState?.executionAllowedNow ?? null
  }
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDoc() {
  const requiredTokens = [
    "phase_1_twii_operator_decision_intake_readiness_ready_no_execution",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
    "twii_index_daily_prices_missing_rows",
    "data/candidates/twii-sanitized-candidate.json",
    "candidate artifact rows read now: `false`",
    "real decision value recorded now: `false`",
    "runner executable now: `false`",
    "execution allowed now: `false`",
    "public data source: `mock`",
    "score source: `mock`",
    "operator_supplies_or_rejects_twii_decision_packet_in_separate_step"
  ];
  for (const token of requiredTokens) {
    if (!doc.includes(token)) problems.push(`doc missing ${token}`);
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
  for (const token of forbiddenTokens) {
    if (doc.includes(token)) problems.push(`doc contains forbidden token ${token}`);
  }
}

function validateRegistration() {
  const scriptName = "check:phase-1-twii-operator-decision-intake-readiness";
  const scriptCommand = "node scripts/check-phase-1-twii-operator-decision-intake-readiness.mjs";
  let packageJson = {};
  try {
    packageJson = JSON.parse(packageJsonText);
  } catch (error) {
    problems.push(`package.json parse failed: ${error.message}`);
  }
  if (packageJson.scripts?.[scriptName] !== scriptCommand) problems.push(`${scriptName} not registered in package.json`);
  if (!reviewGate.includes("scripts/check-phase-1-twii-operator-decision-intake-readiness.mjs")) {
    problems.push("review gate does not execute TWII operator decision intake readiness checker");
  }
  if (!reviewGate.includes('"phase-1-twii-operator-decision-intake-readiness"')) {
    problems.push("review gate focused set missing TWII operator decision intake readiness");
  }
}

function validateReports() {
  expect(quickstart.guardedStatus, "phase_1_twii_bounded_write_operator_decision_quickstart_ready_no_execution", "quickstart guardedStatus");
  expect(template.status, "twii_real_decision_intake_packet_template_gate_preflight_ready_no_execution", "template status");
  expect(template.outcome, "real_decision_intake_packet_template_ready_execution_still_blocked", "template outcome");
  expect(template.templateState?.realDecisionValueRecordedNow, false, "template realDecisionValueRecordedNow");
  expect(template.templateState?.executionAllowedNow, false, "template executionAllowedNow");

  expect(dryRun.status, "twii_real_decision_acceptance_dry_run_gate_preflight_ready_no_execution", "dryRun status");
  expect(dryRun.outcome, "real_decision_acceptance_dry_run_ready_execution_still_blocked", "dryRun outcome");
  expect(dryRun.safety?.realDecisionValueRecordedNow, false, "dryRun realDecisionValueRecordedNow");

  expect(mockRecorder.status, "twii_decision_intake_recorder_mock_gate_preflight_ready_no_execution", "mockRecorder status");
  expect(mockRecorder.outcome, "decision_intake_recorder_mock_ready_execution_still_blocked", "mockRecorder outcome");
  expect(mockRecorder.safety?.mockRecordAcceptedAsReal, false, "mockRecorder mockRecordAcceptedAsReal");

  expect(acceptedIntake.status, "twii_accepted_decision_record_intake_gate_preflight_ready_no_execution", "acceptedIntake status");
  expect(acceptedIntake.outcome, "accepted_decision_record_intake_gate_ready_execution_still_blocked", "acceptedIntake outcome");
  expect(acceptedIntake.intakeState?.decisionValueRecordedNow, false, "acceptedIntake decisionValueRecordedNow");
  expect(acceptedIntake.intakeState?.acceptedDecisionRecordedNow, false, "acceptedIntake acceptedDecisionRecordedNow");
  expect(acceptedIntake.intakeState?.executionAllowedNow, false, "acceptedIntake executionAllowedNow");

  expect(nextRoute.status, "twii_operator_checklist_next_execution_route_gate_preflight_ready_no_execution", "nextRoute status");
  expect(nextRoute.currentRouteStatus, "blocked_waiting_real_operator_and_pre_execution_values", "nextRoute currentRouteStatus");
  expect(nextRoute.routeValidation?.routeCanAdvanceWithoutRealValues, false, "nextRoute routeCanAdvanceWithoutRealValues");
  expect(nextRoute.safety?.publicDataSource, "mock", "nextRoute publicDataSource");
  expect(nextRoute.safety?.scoreSource, "mock", "nextRoute scoreSource");

  for (const [label, report] of Object.entries({ template, dryRun, mockRecorder, acceptedIntake, nextRoute })) {
    const safety = report.safety ?? {};
    for (const key of [
      "sqlExecuted",
      "supabaseConnectionAttempted",
      "supabaseWritesEnabled",
      "marketDataFetched",
      "marketDataIngested",
      "dailyPricesMutated",
      "stagingRowsCreated",
      "rawPayloadOutput",
      "rowPayloadOutput",
      "stockIdPayloadOutput",
      "secretsOutput",
      "envValueOutput",
      "scoreSourceRealAllowed"
    ]) {
      if (safety[key] !== false) problems.push(`${label}.safety.${key} must be false`);
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
