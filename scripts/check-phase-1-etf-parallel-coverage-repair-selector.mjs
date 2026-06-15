import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_ETF_PARALLEL_COVERAGE_REPAIR_SELECTOR.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const sourceScope = runJson("scripts/check-a1-etf-market-price-source-scope-no-fetch.mjs", "ETF source scope");
const fieldContract = runJson("scripts/check-a1-etf-market-price-field-contract-no-fetch.mjs", "ETF field contract");
const syntheticFixture = runJson("scripts/check-etf-market-price-synthetic-fixture.mjs", "ETF synthetic fixture");
const mockHandoff = runJson("scripts/check-etf-market-price-mock-runtime-handoff.mjs", "ETF mock runtime handoff");
const coverageRoute = runJson("scripts/check-etf-daily-prices-coverage-completion-route.mjs", "ETF coverage route");
const candidateReadiness = runJson("scripts/check-etf-source-rights-and-candidate-readiness-packet.mjs", "ETF candidate readiness");
const closureRollup = runJson("scripts/check-phase-1-etf-coverage-closure-readiness-rollup.mjs", "ETF coverage closure rollup");
const sourceRightsGate = runJson("scripts/check-etf-source-rights-outcome-decision-gate.mjs", "ETF source-rights outcome gate", { allowBlocked: true });
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "Phase 1 data online go/no-go");

validateDoc();
validateRegistration();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_etf_parallel_coverage_repair_selector_ready_no_fetch_no_execution"
    : "phase_1_etf_parallel_coverage_repair_selector_blocked",
  missing: problems,
  currentDecision: {
    etfMissingRows: dataOnline.coverage?.etfMissingRows ?? null,
    sourceRightsDecision: sourceRightsGate.decisionStatus ?? null,
    sourceRightsOutcome: sourceRightsGate.currentOutcome ?? null,
    defaultPmRoute: "keep_etf_parallel_coverage_repair_in_mock_runtime_readiness",
    nextA1Route: "prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch",
    nextA2Route: "review_etf_mock_runtime_copy_against_non_advice_and_source_boundary",
    publicDataSource: dataOnline.publicDataSource ?? null,
    scoreSource: dataOnline.scoreSource ?? null
  }
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDoc() {
  const requiredTokens = [
    "phase_1_etf_parallel_coverage_repair_selector_ready_no_fetch_no_execution",
    "ETF is a parallel coverage-repair lane, not an execution lane.",
    "target ETF symbols: `0050`, `006208`",
    "expected ETF rows: `120`",
    "observed ETF rows: `2`",
    "missing ETF rows: `118`",
    "`0050`: `1/60`, missing `59`",
    "`006208`: `1/60`, missing `59`",
    "etf_source_rights_outcome_decision_gate_blocked_external_rights_pending",
    "rejected_for_execution_pending_external_rights",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
    "public data source: `mock`",
    "score source: `mock`",
    "`check:phase-1-etf-coverage-closure-readiness-rollup`",
    "`check:etf-source-rights-outcome-decision-gate`",
    "`keep_etf_parallel_coverage_repair_in_mock_runtime_readiness`",
    "`prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch`",
    "`review_etf_mock_runtime_copy_against_non_advice_and_source_boundary`",
    "`etf_sanitized_candidate_artifact_gate_for_118_missing_rows`"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);

  const forbiddenTokens = [
    "source-rights outcome is accepted",
    "legal_and_redistribution_terms_approved",
    "fetch ETF market rows now",
    "write Supabase now",
    "mutate `daily_prices` now",
    "award row coverage points now",
    "publicDataSource=supabase is approved",
    "scoreSource=real is approved",
    "RUN_REMOTE_NOW",
    "EXECUTION_COMPLETED",
    "sb_secret_",
    "SUPABASE_SERVICE_ROLE_KEY="
  ];
  for (const token of forbiddenTokens) if (doc.includes(token)) problems.push(`doc contains forbidden token ${token}`);

  const boundaryTokens = [
    "SQL execution",
    "Supabase connection, read, or write",
    "staging-row creation",
    "`daily_prices` mutation",
    "ETF market-row fetch, ingestion, storage, output, or commit",
    "ETF candidate row acceptance",
    "ETF row coverage points",
    "`publicDataSource=supabase`",
    "`scoreSource=real`",
    "investment advice"
  ];
  for (const token of boundaryTokens) if (!doc.includes(token)) problems.push(`doc missing boundary ${token}`);
}

function validateRegistration() {
  const scriptName = "check:phase-1-etf-parallel-coverage-repair-selector";
  const scriptCommand = "node scripts/check-phase-1-etf-parallel-coverage-repair-selector.mjs";
  let packageJson = {};
  try {
    packageJson = JSON.parse(packageJsonText);
  } catch (error) {
    problems.push(`package.json parse failed: ${error.message}`);
  }
  if (packageJson.scripts?.[scriptName] !== scriptCommand) problems.push(`${scriptName} not registered in package.json`);
  if (!reviewGate.includes("scripts/check-phase-1-etf-parallel-coverage-repair-selector.mjs")) {
    problems.push("review gate does not execute ETF parallel coverage repair selector");
  }
  if (!reviewGate.includes('"phase-1-etf-parallel-coverage-repair-selector"')) {
    problems.push("review gate focused set missing ETF parallel coverage repair selector");
  }
}

function validateReports() {
  expect(sourceScope.status, "ok", "sourceScope status");
  expect(fieldContract.status, "ok", "fieldContract status");
  expect(syntheticFixture.status, "ok", "syntheticFixture status");
  expect(mockHandoff.status, "ok", "mockHandoff status");
  expect(coverageRoute.status, "ok", "coverageRoute status");
  expect(candidateReadiness.status, "ok", "candidateReadiness status");
  expect(closureRollup.status, "ok", "closureRollup status");
  expect(sourceRightsGate.status, "blocked", "sourceRightsGate status");
  expect(sourceRightsGate.decisionStatus, "etf_source_rights_outcome_decision_gate_blocked_external_rights_pending", "sourceRightsGate decisionStatus");
  expect(sourceRightsGate.currentOutcome, "rejected_for_execution_pending_external_rights", "sourceRightsGate currentOutcome");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.coverage?.etfMissingRows, 118, "dataOnline etfMissingRows");
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
