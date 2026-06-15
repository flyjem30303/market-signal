import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_A1_A2_HANDOFF_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const parallelSelector = runJson(
  "scripts/check-phase-1-data-online-parallel-unblock-selector.mjs",
  "data-online parallel unblock selector"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");
const twiiPacket = runJson(
  "scripts/check-phase-1-twii-operator-decision-packet-request.mjs",
  "TWII operator decision packet request"
);
const etfSelector = runJson(
  "scripts/check-phase-1-etf-parallel-coverage-repair-selector.mjs",
  "ETF parallel coverage repair selector"
);
const a2Copy = runJson("scripts/check-a2-twii-operator-decision-public-copy-guard.mjs", "A2 public copy guard");

validateDoc();
validateRegistration();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_a1_a2_handoff_packet_ready_no_execution"
    : "phase_1_data_online_a1_a2_handoff_packet_blocked",
  decision: "KEEP_A1_A2_PARALLEL_DATA_ONLINE_UNBLOCK_ACTIVE",
  dataOnlineDecision: dataOnline.decision ?? null,
  coverage: dataOnline.coverage ?? null,
  workstreams: {
    pm: "integrate_only_accepted_aggregate_safe_outputs",
    a1Twii: "submit_twii_operator_presence_shape_outcome_no_values",
    a1Etf: "submit_etf_source_rights_acceptance_evidence_no_market_rows",
    a2: "submit_twii_etf_public_copy_guard_outcome"
  },
  allowedOutcomeStatuses: ["accepted", "rejected", "repair_required", "deferred"],
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_a1_a2_handoff_packet_ready_no_execution",
    "KEEP_A1_A2_PARALLEL_DATA_ONLINE_UNBLOCK_ACTIVE",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
    "Full Level 1 coverage: `182/360`, missing `178`",
    "TWII missing rows: `60`",
    "ETF missing rows: `118`",
    "`publicDataSource=mock`",
    "`scoreSource=mock`",
    "`integrate_only_accepted_aggregate_safe_outputs`",
    "`submit_twii_operator_presence_shape_outcome_no_values`",
    "`submit_etf_source_rights_acceptance_evidence_no_market_rows`",
    "`submit_twii_etf_public_copy_guard_outcome`",
    "`accepted`",
    "`rejected`",
    "`repair_required`",
    "`deferred`",
    "A1 TWII must not provide value bodies",
    "A1 ETF must not provide market rows",
    "A2 must reject copy that implies real-time, complete coverage, official endorsement, or investment advice",
    "PM may only integrate aggregate-safe accepted outcomes",
    "First executable lane still requires a separate authorization gate"
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

  const forbiddenTokens = [
    "operator values are accepted now",
    "ETF source rights are accepted now",
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
  const scriptName = "check:phase-1-data-online-a1-a2-handoff-packet";
  const scriptCommand = "node scripts/check-phase-1-data-online-a1-a2-handoff-packet.mjs";
  let packageJson = {};
  try {
    packageJson = JSON.parse(packageJsonText);
  } catch (error) {
    problems.push(`package.json parse failed: ${error.message}`);
  }
  if (packageJson.scripts?.[scriptName] !== scriptCommand) problems.push(`${scriptName} not registered in package.json`);
  if (!reviewGate.includes("scripts/check-phase-1-data-online-a1-a2-handoff-packet.mjs")) {
    problems.push("review gate does not execute data-online A1/A2 handoff packet");
  }
  if (!reviewGate.includes('"phase-1-data-online-a1-a2-handoff-packet"')) {
    problems.push("review gate focused set missing data-online A1/A2 handoff packet");
  }
}

function validateReports() {
  expect(parallelSelector.status, "ok", "parallelSelector status");
  expect(parallelSelector.decision, "KEEP_PARALLEL_UNBLOCK_ACTIVE_DATA_ONLINE_NO_GO", "parallelSelector decision");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.coverage?.fullLevel1ExpectedRows, 360, "fullLevel1ExpectedRows");
  expect(dataOnline.coverage?.fullLevel1ObservedRows, 182, "fullLevel1ObservedRows");
  expect(dataOnline.coverage?.fullLevel1MissingRows, 178, "fullLevel1MissingRows");
  expect(dataOnline.coverage?.twiiMissingRows, 60, "twiiMissingRows");
  expect(dataOnline.coverage?.etfMissingRows, 118, "etfMissingRows");
  expect(dataOnline.publicDataSource, "mock", "publicDataSource");
  expect(dataOnline.scoreSource, "mock", "scoreSource");
  expect(twiiPacket.status, "ok", "twiiPacket status");
  expect(etfSelector.status, "ok", "etfSelector status");
  expect(a2Copy.status, "ok", "a2Copy status");
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
