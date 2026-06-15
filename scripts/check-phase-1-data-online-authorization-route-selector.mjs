import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_AUTHORIZATION_ROUTE_SELECTOR.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);
const aggregation = runJson(
  "scripts/check-phase-1-data-online-accepted-outcome-aggregation-gate.mjs",
  "accepted outcome aggregation gate"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validateDoc();
validateCurrentRoute();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_authorization_route_selector_ready_no_execution"
    : "phase_1_data_online_authorization_route_selector_blocked",
  currentAggregationDecision: aggregation.decision ?? null,
  currentAggregationRoute: aggregation.route ?? null,
  selectedRouteNow: "keep_mock_runtime_and_wait_for_required_a1_a2_outcomes",
  allAcceptedNextRoute: "open_phase_1_data_online_single_authorization_packet_review_only",
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_authorization_route_selector_ready_no_execution",
    "keep_mock_runtime_and_wait_for_required_a1_a2_outcomes",
    "open_phase_1_data_online_single_authorization_packet_review_only",
    "The selector does not execute the authorization packet",
    "Accepted outcomes only allow PM to open one review-only authorization packet",
    "`a1_twii_operator_presence_shape_outcome`",
    "`a1_etf_source_rights_acceptance_evidence_outcome`",
    "`a2_twii_etf_public_copy_guard_outcome`",
    "publicDataSource=mock",
    "scoreSource=mock"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);
}

function validateCurrentRoute() {
  expect(aggregation.status, "ok", "aggregation status");
  expect(
    aggregation.decision,
    "OUTCOME_AGGREGATION_PENDING_KEEP_DATA_ONLINE_NO_GO",
    "current aggregation decision"
  );
  expect(
    aggregation.route,
    "keep_data_online_no_go_until_required_outcomes_are_accepted",
    "current aggregation route"
  );
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateRegistration() {
  const packageJson = parseJson(packageJsonText, "package.json");
  if (
    packageJson.scripts?.["check:phase-1-data-online-authorization-route-selector"] !==
    "node scripts/check-phase-1-data-online-authorization-route-selector.mjs"
  ) {
    problems.push("authorization route selector checker not registered in package.json");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-authorization-route-selector.mjs")) {
    problems.push("review gate does not execute authorization route selector checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-authorization-route-selector"')) {
    problems.push("focused review gate missing authorization route selector checker");
  }
}

function validateBoundaries() {
  const forbidden = [
    "sqlExecuted=true",
    "supabaseWriteAllowedNow=true",
    "dailyPricesMutated=true",
    "publicDataSource=supabase",
    "scoreSource=real"
  ];
  for (const token of forbidden) if (doc.includes(token)) problems.push(`doc contains unsafe token ${token}`);

  const boundaryTokens = [
    "No SQL",
    "No Supabase read or write",
    "No staging rows",
    "No `daily_prices` mutation",
    "No market-row fetch",
    "No raw payload output",
    "No source promotion",
    "No score promotion",
    "No public real-data claim",
    "No investment advice"
  ];
  for (const token of boundaryTokens) if (!doc.includes(token)) problems.push(`doc missing boundary ${token}`);
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
