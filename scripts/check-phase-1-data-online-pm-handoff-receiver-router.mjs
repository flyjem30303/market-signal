import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_PM_HANDOFF_RECEIVER_ROUTER.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const handoff = runJson("scripts/check-phase-1-data-online-a1-a2-handoff-packet.mjs", "A1/A2 handoff packet");
const parallelSelector = runJson(
  "scripts/check-phase-1-data-online-parallel-unblock-selector.mjs",
  "data-online parallel selector"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validateDoc();
validateRegistration();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_pm_handoff_receiver_router_ready_no_execution"
    : "phase_1_data_online_pm_handoff_receiver_router_blocked",
  decision: "PM_RECEIVES_A1_A2_OUTCOMES_AND_ROUTES_WITHOUT_EXECUTION",
  routes: {
    allAccepted: "open_separate_lane_authorization_gate_before_any_write_or_promotion",
    anyRejected: "return_rejected_lane_to_repair_without_runtime_promotion",
    anyRepairRequired: "return_lane_to_a1_a2_repair_with_missing_fields_only",
    anyDeferred: "keep_data_online_no_go_and_continue_mock_runtime_truthfulness",
    mixed: "integrate_only_accepted_aggregate_safe_outputs_and_keep_remaining_lanes_blocked"
  },
  dataOnlineDecision: dataOnline.decision ?? null,
  coverage: dataOnline.coverage ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_pm_handoff_receiver_router_ready_no_execution",
    "PM_RECEIVES_A1_A2_OUTCOMES_AND_ROUTES_WITHOUT_EXECUTION",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
    "Full Level 1 coverage: `182/360`, missing `178`",
    "TWII missing rows: `60`",
    "ETF missing rows: `118`",
    "`publicDataSource=mock`",
    "`scoreSource=mock`",
    "`open_separate_lane_authorization_gate_before_any_write_or_promotion`",
    "`return_rejected_lane_to_repair_without_runtime_promotion`",
    "`return_lane_to_a1_a2_repair_with_missing_fields_only`",
    "`keep_data_online_no_go_and_continue_mock_runtime_truthfulness`",
    "`integrate_only_accepted_aggregate_safe_outputs_and_keep_remaining_lanes_blocked`",
    "All-accepted does not execute anything by itself",
    "Mixed outcomes must not block accepted aggregate-safe PM integration",
    "Rejected or repair-required outcomes do not reset already accepted lanes",
    "Deferred outcomes preserve `NO_GO` without creating fake progress",
    "First executable action still requires a separate authorization gate"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);

  const outcomeTokens = ["`accepted`", "`rejected`", "`repair_required`", "`deferred`"];
  for (const token of outcomeTokens) if (!doc.includes(token)) problems.push(`doc missing outcome ${token}`);

  const boundaryTokens = [
    "SQL execution",
    "Supabase connection, read, or write",
    "staging-row creation",
    "`daily_prices` mutation",
    "TWII or ETF market-row fetch",
    "raw payload output",
    "operator value storage",
    "candidate row acceptance",
    "row coverage points",
    "`publicDataSource=supabase`",
    "`scoreSource=real`",
    "investment advice"
  ];
  for (const token of boundaryTokens) if (!doc.includes(token)) problems.push(`doc missing boundary ${token}`);

  const forbiddenTokens = [
    "execute now",
    "write Supabase now",
    "fetch market rows now",
    "candidate rows accepted now",
    "coverage points awarded now",
    "publicDataSource=supabase is approved",
    "scoreSource=real is approved",
    "SUPABASE_SERVICE_ROLE_KEY=",
    "sb_secret_"
  ];
  for (const token of forbiddenTokens) if (doc.includes(token)) problems.push(`doc contains forbidden token ${token}`);
}

function validateRegistration() {
  const scriptName = "check:phase-1-data-online-pm-handoff-receiver-router";
  const scriptCommand = "node scripts/check-phase-1-data-online-pm-handoff-receiver-router.mjs";
  let packageJson = {};
  try {
    packageJson = JSON.parse(packageJsonText);
  } catch (error) {
    problems.push(`package.json parse failed: ${error.message}`);
  }
  if (packageJson.scripts?.[scriptName] !== scriptCommand) problems.push(`${scriptName} not registered in package.json`);
  if (!reviewGate.includes("scripts/check-phase-1-data-online-pm-handoff-receiver-router.mjs")) {
    problems.push("review gate does not execute PM handoff receiver router");
  }
  if (!reviewGate.includes('"phase-1-data-online-pm-handoff-receiver-router"')) {
    problems.push("review gate focused set missing PM handoff receiver router");
  }
}

function validateReports() {
  expect(handoff.status, "ok", "handoff status");
  expect(handoff.guardedStatus, "phase_1_data_online_a1_a2_handoff_packet_ready_no_execution", "handoff guardedStatus");
  expect(parallelSelector.status, "ok", "parallelSelector status");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.coverage?.fullLevel1ExpectedRows, 360, "fullLevel1ExpectedRows");
  expect(dataOnline.coverage?.fullLevel1ObservedRows, 182, "fullLevel1ObservedRows");
  expect(dataOnline.coverage?.fullLevel1MissingRows, 178, "fullLevel1MissingRows");
  expect(dataOnline.coverage?.twiiMissingRows, 60, "twiiMissingRows");
  expect(dataOnline.coverage?.etfMissingRows, 118, "etfMissingRows");
  expect(dataOnline.publicDataSource, "mock", "publicDataSource");
  expect(dataOnline.scoreSource, "mock", "scoreSource");
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
