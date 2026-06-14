import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_ETF_COVERAGE_CLOSURE_READINESS_ROLLUP.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const sourceScope = runJson("scripts/check-a1-etf-market-price-source-scope-no-fetch.mjs", "ETF market-price source scope");
const fieldContract = runJson("scripts/check-a1-etf-market-price-field-contract-no-fetch.mjs", "ETF market-price field contract");
const syntheticFixture = runJson("scripts/check-etf-market-price-synthetic-fixture.mjs", "ETF market-price synthetic fixture");
const mockHandoff = runJson("scripts/check-etf-market-price-mock-runtime-handoff.mjs", "ETF market-price mock runtime handoff");
const coverageRoute = runJson("scripts/check-etf-daily-prices-coverage-completion-route.mjs", "ETF daily prices coverage completion route");
const candidateReadiness = runJson("scripts/check-etf-source-rights-and-candidate-readiness-packet.mjs", "ETF source-rights and candidate readiness packet");
const sourceRightsGate = runJson("scripts/check-etf-source-rights-outcome-decision-gate.mjs", "ETF source-rights outcome decision gate", { allowBlocked: true });
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "Phase 1 data-online go/no-go");

validateDoc();
validateRegistration();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_etf_coverage_closure_readiness_rollup_ready_rights_blocked"
    : "phase_1_etf_coverage_closure_readiness_rollup_blocked",
  missing: problems,
  currentDecision: {
    sourceScope: sourceScope.status ?? null,
    fieldContract: fieldContract.status ?? null,
    syntheticFixture: syntheticFixture.status ?? null,
    mockHandoff: mockHandoff.status ?? null,
    coverageRoute: coverageRoute.status ?? null,
    candidateReadiness: candidateReadiness.status ?? null,
    sourceRightsGate: sourceRightsGate.status ?? null,
    sourceRightsDecision: sourceRightsGate.decisionStatus ?? null,
    sourceRightsOutcome: sourceRightsGate.currentOutcome ?? null,
    dataOnlineDecision: dataOnline.decision ?? null,
    etfMissingRows: dataOnline.coverage?.etfMissingRows ?? null,
    publicDataSource: dataOnline.publicDataSource ?? null,
    scoreSource: dataOnline.scoreSource ?? null
  }
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDoc() {
  const requiredTokens = [
    "phase_1_etf_coverage_closure_readiness_rollup_ready_rights_blocked",
    "target symbols: `0050`, `006208`",
    "expected ETF rows: `120`",
    "observed ETF rows: `2`",
    "missing ETF rows: `118`",
    "`0050`: `1/60`, missing `59`",
    "`006208`: `1/60`, missing `59`",
    "legal_and_redistribution_terms_unapproved",
    "rejected_for_execution_pending_external_rights",
    "public data source: `mock`",
    "score source: `mock`",
    "check:etf-source-rights-outcome-decision-gate",
    "ETF sanitized candidate artifact gate for exactly `118` missing rows"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);

  const forbiddenTokens = [
    "source rights are approved",
    "legal_and_redistribution_terms_approved",
    "candidate generation is approved",
    "SQL execution is approved",
    "Supabase connection is approved",
    "Supabase writes are approved",
    "daily_prices mutation is approved",
    "row coverage points awarded",
    "publicDataSource=supabase is approved",
    "scoreSource=real is approved",
    "RUN_REMOTE_NOW",
    "EXECUTION_COMPLETED",
    "sb_secret_",
    "SUPABASE_SERVICE_ROLE_KEY="
  ];
  for (const token of forbiddenTokens) if (doc.includes(token)) problems.push(`doc contains forbidden token ${token}`);
}

function validateRegistration() {
  const scriptName = "check:phase-1-etf-coverage-closure-readiness-rollup";
  const scriptCommand = "node scripts/check-phase-1-etf-coverage-closure-readiness-rollup.mjs";
  let packageJson = {};
  try {
    packageJson = JSON.parse(packageJsonText);
  } catch (error) {
    problems.push(`package.json parse failed: ${error.message}`);
  }
  if (packageJson.scripts?.[scriptName] !== scriptCommand) problems.push(`${scriptName} not registered in package.json`);
  if (!reviewGate.includes("scripts/check-phase-1-etf-coverage-closure-readiness-rollup.mjs")) {
    problems.push("review gate does not execute ETF closure rollup checker");
  }
  if (!reviewGate.includes('"phase-1-etf-coverage-closure-readiness-rollup"')) {
    problems.push("review gate focused set missing ETF closure rollup");
  }
}

function validateReports() {
  expect(sourceScope.status, "ok", "sourceScope status");
  expect(fieldContract.status, "ok", "fieldContract status");
  expect(syntheticFixture.status, "ok", "syntheticFixture status");
  expect(mockHandoff.status, "ok", "mockHandoff status");
  expect(coverageRoute.status, "ok", "coverageRoute status");
  expect(candidateReadiness.status, "ok", "candidateReadiness status");
  expect(sourceRightsGate.status, "blocked", "sourceRightsGate status");
  expect(sourceRightsGate.decisionStatus, "etf_source_rights_outcome_decision_gate_blocked_external_rights_pending", "sourceRightsGate decisionStatus");
  expect(sourceRightsGate.currentOutcome, "rejected_for_execution_pending_external_rights", "sourceRightsGate currentOutcome");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.coverage?.etfMissingRows, 118, "dataOnline etfMissingRows");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");

  for (const [label, report] of Object.entries({ sourceScope, fieldContract, syntheticFixture, mockHandoff })) {
    expect(report.publicDataSource, "mock", `${label}.publicDataSource`);
    expect(report.scoreSource, "mock", `${label}.scoreSource`);
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

function runJson(filePath, label, options = {}) {
  const run = spawnSync(process.execPath, [filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0 && !options.allowBlocked) {
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
