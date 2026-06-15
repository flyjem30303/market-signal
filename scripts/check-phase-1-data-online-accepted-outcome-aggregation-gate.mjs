import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_ACCEPTED_OUTCOME_AGGREGATION_GATE.md";
const ledgerPath = "data/source-gates/phase-1-data-online-a1-a2-handoff-outcomes.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const ledger = parseJson(readText(ledgerPath), "ledger");
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

const route = deriveRoute(ledger.outcomes ?? []);

validateDoc();
validateLedger();
validateRegistration();
validateDataOnline();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_accepted_outcome_aggregation_gate_ready_no_go"
    : "phase_1_data_online_accepted_outcome_aggregation_gate_blocked",
  decision: route.decision,
  route: route.route,
  outcomeCounts: route.counts,
  blockers: route.blockers,
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function deriveRoute(outcomes) {
  const counts = {
    accepted: 0,
    deferred: 0,
    pending: 0,
    rejected: 0,
    repair_required: 0
  };
  const blockers = [];
  for (const item of outcomes) {
    if (counts[item.status] === undefined) {
      blockers.push(`${item.id}:invalid_status_${item.status}`);
      continue;
    }
    counts[item.status] += 1;
    if (item.status !== "accepted") blockers.push(`${item.id}:${item.status}`);
  }
  if (counts.rejected > 0) {
    return {
      blockers,
      counts,
      decision: "OUTCOME_REJECTED_REPAIR_BEFORE_DATA_ONLINE",
      route: "return_rejected_lanes_to_repair_and_keep_data_online_no_go"
    };
  }
  if (counts.repair_required > 0) {
    return {
      blockers,
      counts,
      decision: "OUTCOME_REPAIR_REQUIRED_BEFORE_DATA_ONLINE",
      route: "return_repair_required_lanes_to_a1_a2_and_keep_data_online_no_go"
    };
  }
  if (counts.pending > 0 || counts.deferred > 0) {
    return {
      blockers,
      counts,
      decision: "OUTCOME_AGGREGATION_PENDING_KEEP_DATA_ONLINE_NO_GO",
      route: "keep_data_online_no_go_until_required_outcomes_are_accepted"
    };
  }
  if (counts.accepted === 3) {
    return {
      blockers,
      counts,
      decision: "ALL_REQUIRED_OUTCOMES_ACCEPTED_OPEN_SEPARATE_AUTHORIZATION_GATE",
      route: "open_separate_lane_authorization_gate_before_any_write_or_promotion"
    };
  }
  return {
    blockers,
    counts,
    decision: "OUTCOME_AGGREGATION_INVALID_KEEP_DATA_ONLINE_NO_GO",
    route: "repair_outcome_ledger_shape_before_any_authorization_gate"
  };
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_accepted_outcome_aggregation_gate_ready_no_go",
    "OUTCOME_AGGREGATION_PENDING_KEEP_DATA_ONLINE_NO_GO",
    "keep_data_online_no_go_until_required_outcomes_are_accepted",
    "ALL_REQUIRED_OUTCOMES_ACCEPTED_OPEN_SEPARATE_AUTHORIZATION_GATE",
    "open_separate_lane_authorization_gate_before_any_write_or_promotion",
    "OUTCOME_REJECTED_REPAIR_BEFORE_DATA_ONLINE",
    "OUTCOME_REPAIR_REQUIRED_BEFORE_DATA_ONLINE",
    "`a1_twii_operator_presence_shape_outcome`",
    "`a1_etf_source_rights_acceptance_evidence_outcome`",
    "`a2_twii_etf_public_copy_guard_outcome`",
    "All accepted does not execute anything",
    "Aggregation never awards row coverage points",
    "Aggregation never changes `publicDataSource=mock` or `scoreSource=mock`",
    "A separate authorization gate remains required before any write, readback, promotion, or public real-data claim"
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
}

function validateLedger() {
  expect(ledger.publicDataSource, "mock", "ledger publicDataSource");
  expect(ledger.scoreSource, "mock", "ledger scoreSource");
  expect(ledger.dataOnlineDecision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "ledger dataOnlineDecision");
  expect(ledger.executionAllowedNow, false, "ledger executionAllowedNow");
  expect(ledger.supabaseWriteAllowedNow, false, "ledger supabaseWriteAllowedNow");
  expect(ledger.rowCoverageAwardAllowedNow, false, "ledger rowCoverageAwardAllowedNow");
  if (!Array.isArray(ledger.outcomes) || ledger.outcomes.length !== 3) problems.push("ledger must include exactly 3 outcomes");
  if (route.counts.pending !== 3) {
    problems.push("current aggregation gate should see all 3 outcomes pending until A1/A2 reviewed results exist");
  }
  expect(route.decision, "OUTCOME_AGGREGATION_PENDING_KEEP_DATA_ONLINE_NO_GO", "current route decision");
  expect(route.route, "keep_data_online_no_go_until_required_outcomes_are_accepted", "current route");
}

function validateRegistration() {
  const packageJson = parseJson(packageJsonText, "package.json");
  if (
    packageJson.scripts?.["check:phase-1-data-online-accepted-outcome-aggregation-gate"] !==
    "node scripts/check-phase-1-data-online-accepted-outcome-aggregation-gate.mjs"
  ) {
    problems.push("aggregation checker not registered in package.json");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-accepted-outcome-aggregation-gate.mjs")) {
    problems.push("review gate does not execute aggregation checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-accepted-outcome-aggregation-gate"')) {
    problems.push("focused review gate missing aggregation checker");
  }
}

function validateDataOnline() {
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
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) {
    problems.push(`${label} exited ${run.status}`);
    return {};
  }
  return parseJson(run.stdout, label);
}
