import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_A1_A2_OUTCOME_INTAKE_LEDGER.md";
const ledgerPath = "data/source-gates/phase-1-data-online-a1-a2-handoff-outcomes.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const ledgerText = readText(ledgerPath);
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

let ledger = {};
try {
  ledger = JSON.parse(ledgerText);
} catch (error) {
  problems.push(`ledger JSON parse failed: ${error.message}`);
}

validateDoc();
validateLedger();
validateRegistration();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_a1_a2_outcome_intake_ledger_ready_pending"
    : "phase_1_data_online_a1_a2_outcome_intake_ledger_blocked",
  decision: "RECORD_A1_A2_OUTCOMES_AS_PENDING_UNTIL_REVIEWED",
  ledgerPath,
  pendingOutcomes: Array.isArray(ledger.outcomes)
    ? ledger.outcomes.filter((item) => item.status === "pending").length
    : null,
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_a1_a2_outcome_intake_ledger_ready_pending",
    "RECORD_A1_A2_OUTCOMES_AS_PENDING_UNTIL_REVIEWED",
    "data/source-gates/phase-1-data-online-a1-a2-handoff-outcomes.json",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
    "`publicDataSource=mock`",
    "`scoreSource=mock`",
    "`a1_twii_operator_presence_shape_outcome`",
    "`a1_etf_source_rights_acceptance_evidence_outcome`",
    "`a2_twii_etf_public_copy_guard_outcome`",
    "`pending`",
    "`accepted`",
    "`rejected`",
    "`repair_required`",
    "`deferred`",
    "accepted means eligible for PM receiver routing only",
    "pending means no PM integration yet",
    "No row coverage points may be awarded from this ledger",
    "No runtime promotion may happen from this ledger",
    "First executable action still requires a separate authorization gate"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);

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

  for (const token of forbiddenTokens()) if (doc.includes(token)) problems.push(`doc contains forbidden token ${token}`);
}

function validateLedger() {
  const expected = [
    {
      id: "a1_twii_operator_presence_shape_outcome",
      lane: "A1_TWII",
      route: "submit_twii_operator_presence_shape_outcome_no_values"
    },
    {
      id: "a1_etf_source_rights_acceptance_evidence_outcome",
      lane: "A1_ETF",
      route: "submit_etf_source_rights_acceptance_evidence_no_market_rows"
    },
    {
      id: "a2_twii_etf_public_copy_guard_outcome",
      lane: "A2_PUBLIC_COPY",
      route: "submit_twii_etf_public_copy_guard_outcome"
    }
  ];

  expect(ledger.status, "phase_1_data_online_a1_a2_outcome_intake_ledger_ready_pending", "ledger status");
  expect(ledger.decision, "RECORD_A1_A2_OUTCOMES_AS_PENDING_UNTIL_REVIEWED", "ledger decision");
  expect(ledger.publicDataSource, "mock", "ledger publicDataSource");
  expect(ledger.scoreSource, "mock", "ledger scoreSource");
  expect(ledger.dataOnlineDecision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "ledger dataOnlineDecision");
  expect(ledger.executionAllowedNow, false, "ledger executionAllowedNow");
  expect(ledger.supabaseWriteAllowedNow, false, "ledger supabaseWriteAllowedNow");
  expect(ledger.rowCoverageAwardAllowedNow, false, "ledger rowCoverageAwardAllowedNow");

  if (!Array.isArray(ledger.outcomes) || ledger.outcomes.length !== expected.length) {
    problems.push(`ledger outcomes expected ${expected.length}`);
    return;
  }

  const allowedStatuses = new Set(["pending", "accepted", "rejected", "repair_required", "deferred"]);
  const allowedPmRoutes = new Set([
    "pending_no_pm_integration",
    "open_separate_lane_authorization_gate_before_any_write_or_promotion",
    "return_rejected_lane_to_repair_without_runtime_promotion",
    "return_lane_to_a1_a2_repair_with_missing_fields_only",
    "keep_data_online_no_go_and_continue_mock_runtime_truthfulness"
  ]);
  for (const expectedItem of expected) {
    const item = ledger.outcomes.find((entry) => entry.id === expectedItem.id);
    if (!item) {
      problems.push(`ledger missing ${expectedItem.id}`);
      continue;
    }
    expect(item.lane, expectedItem.lane, `${expectedItem.id} lane`);
    expect(item.expectedRoute, expectedItem.route, `${expectedItem.id} expectedRoute`);
    if (!allowedStatuses.has(item.status)) problems.push(`${expectedItem.id} invalid status ${item.status}`);
    if (!allowedPmRoutes.has(item.pmReceiverRoute)) problems.push(`${expectedItem.id} invalid pmReceiverRoute ${item.pmReceiverRoute}`);
    if (item.status === "pending") {
      expect(item.pmReceiverRoute, "pending_no_pm_integration", `${expectedItem.id} pending route`);
      expect(item.recordedBy, "not_recorded", `${expectedItem.id} recordedBy`);
      expect(item.recordedAt, null, `${expectedItem.id} recordedAt`);
      expect(item.safeOutcomeSummary, "Awaiting no-secret outcome.", `${expectedItem.id} safeOutcomeSummary`);
    }
    for (const key of [
      "safeOutcomeSummary",
      "sourceReferenceLabel",
      "remainingRisk",
      "pmReceiverRoute",
      "expectedRoute"
    ]) {
      if (typeof item[key] !== "string" || item[key].trim().length < 8) {
        problems.push(`${expectedItem.id} ${key} must be a non-empty safe string`);
      }
      for (const token of forbiddenTokens()) if (String(item[key]).includes(token)) problems.push(`${expectedItem.id} ${key} contains ${token}`);
    }
  }
}

function validateRegistration() {
  const scriptName = "check:phase-1-data-online-a1-a2-outcome-intake-ledger";
  const scriptCommand = "node scripts/check-phase-1-data-online-a1-a2-outcome-intake-ledger.mjs";
  let packageJson = {};
  try {
    packageJson = JSON.parse(packageJsonText);
  } catch (error) {
    problems.push(`package.json parse failed: ${error.message}`);
  }
  if (packageJson.scripts?.[scriptName] !== scriptCommand) problems.push(`${scriptName} not registered in package.json`);
  if (!reviewGate.includes("scripts/check-phase-1-data-online-a1-a2-outcome-intake-ledger.mjs")) {
    problems.push("review gate does not execute A1/A2 outcome intake ledger");
  }
  if (!reviewGate.includes('"phase-1-data-online-a1-a2-outcome-intake-ledger"')) {
    problems.push("review gate focused set missing A1/A2 outcome intake ledger");
  }
}

function validateReports() {
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
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

function forbiddenTokens() {
  return [
    "write Supabase now",
    "fetch market rows now",
    "candidate rows accepted now",
    "coverage points awarded now",
    "publicDataSource=supabase is approved",
    "scoreSource=real is approved",
    "SUPABASE_SERVICE_ROLE_KEY=",
    "sb_secret_"
  ];
}
