import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const recordPath = "scripts/run-phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_CANDIDATE_ARTIFACT_AGGREGATE_PM_ACCEPTANCE_RECORD_NO_ROW_PAYLOADS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const recordSource = read(recordPath);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-pm-record-"));
try {
  const acceptedAggregatePath = path.join(tempDir, "accepted-aggregate.json");
  const blockedAggregatePath = path.join(tempDir, "blocked-aggregate.json");
  const exampleOnlyAggregatePath = path.join(tempDir, "example-only-aggregate.json");
  const rowPayloadAggregatePath = path.join(tempDir, "row-payload-aggregate.json");
  const realPromotionAggregatePath = path.join(tempDir, "real-promotion-aggregate.json");
  const etfScopeAggregatePath = path.join(tempDir, "etf-scope-aggregate.json");

  fs.writeFileSync(acceptedAggregatePath, JSON.stringify(makeAcceptedAggregate(), null, 2), "utf8");
  fs.writeFileSync(blockedAggregatePath, JSON.stringify(makeBlockedAggregate(), null, 2), "utf8");
  fs.writeFileSync(
    exampleOnlyAggregatePath,
    JSON.stringify({ ...makeAcceptedAggregate(), dateBounds: { start: "EXAMPLE_ONLY", end: "2026-03-31" } }, null, 2),
    "utf8"
  );
  fs.writeFileSync(rowPayloadAggregatePath, JSON.stringify({ ...makeAcceptedAggregate(), rows: [] }, null, 2), "utf8");
  fs.writeFileSync(realPromotionAggregatePath, JSON.stringify({ ...makeAcceptedAggregate(), publicDataSource: "NOT_MOCK" }, null, 2), "utf8");
  fs.writeFileSync(etfScopeAggregatePath, JSON.stringify({ ...makeAcceptedAggregate(), scope: "twii_plus_0050_006208_daily_close" }, null, 2), "utf8");

  validateMissingRun(runNode(recordPath, []));
  validateAcceptedRun(runNode(recordPath, ["--aggregate-result", acceptedAggregatePath, "--pm-decision", "accepted"]));
  validateRejectedRun("explicit rejected PM decision", runNode(recordPath, ["--aggregate-result", acceptedAggregatePath, "--pm-decision", "rejected"]));
  validateRejectedRun("blocked aggregate", runNode(recordPath, ["--aggregate-result", blockedAggregatePath, "--pm-decision", "accepted"]));
  validateRejectedRun("example-only aggregate", runNode(recordPath, ["--aggregate-result", exampleOnlyAggregatePath, "--pm-decision", "accepted"]));
  validateRejectedRun("row payload aggregate", runNode(recordPath, ["--aggregate-result", rowPayloadAggregatePath, "--pm-decision", "accepted"]));
  validateRejectedRun("real promotion aggregate", runNode(recordPath, ["--aggregate-result", realPromotionAggregatePath, "--pm-decision", "accepted"]));
  validateRejectedRun("etf scope aggregate", runNode(recordPath, ["--aggregate-result", etfScopeAggregatePath, "--pm-decision", "accepted"]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(
    JSON.stringify(
      {
        status: ok ? "ok" : "blocked",
        guardedStatus: ok
          ? "phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads_ready"
          : "phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads_blocked",
        acceptedRecordReady: true,
        rejectedDecisionBlocked: true,
        blockedAggregateRejected: true,
        rowPayloadRejected: true,
        realPromotionRejected: true,
        etfScopeRejected: true,
        candidateRowsAcceptedNow: false,
        writeGateOpenedNow: false,
        publicDataSource: "mock",
        scoreSource: "mock",
        nextRoute: ok ? "prepare_candidate_artifact_bounded_write_authorization_preflight_no_execution" : "keep_mock_and_repair_pm_record",
        problems
      },
      null,
      2
    )
  );

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedAggregate() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_candidate_artifact_aggregate_gate_accepted_no_rows",
    candidateArtifactAggregateAcceptedNow: true,
    artifactId: "phase-1-current-scope-sanitized-candidate-example",
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    coverageWindowSessions: 60,
    aggregateRowCount: 6000,
    symbolsCoveredCount: 100,
    dateBounds: {
      start: "2026-01-02",
      end: "2026-03-31"
    },
    duplicateCount: 0,
    rejectedCount: 0,
    missingRequiredFieldCount: 0,
    forbiddenFieldCount: 0,
    candidateArtifactContentOutputNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "prepare_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads",
    problems: []
  };
}

function makeBlockedAggregate() {
  return {
    ...makeAcceptedAggregate(),
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_artifact_aggregate_gate_blocked_no_rows",
    candidateArtifactAggregateAcceptedNow: false,
    nextRoute: "keep_mock_and_request_aggregate_contract_repair",
    problems: ["synthetic blocked aggregate result for PM record branch proof"]
  };
}

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.output.status, "blocked", "missing.status");
  expect(run.output.pmAcceptanceRecordedNow, false, "missing.pmAcceptanceRecordedNow");
  expect(run.output.candidateRowsAcceptedNow, false, "missing.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "missing.writeGateOpenedNow");
}

function validateAcceptedRun(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.output.status, "ok", "accepted.status");
  expect(run.output.guardedStatus, "phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_accepted_no_rows", "accepted.guardedStatus");
  expect(run.output.pmDecision, "accepted", "accepted.pmDecision");
  expect(run.output.pmAcceptanceRecordedNow, true, "accepted.pmAcceptanceRecordedNow");
  expect(run.output.coverageWindowSessions, 60, "accepted.coverageWindowSessions");
  expect(run.output.aggregateRowCount, 6000, "accepted.aggregateRowCount");
  expect(run.output.symbolsCoveredCount, 100, "accepted.symbolsCoveredCount");
  expect(run.output.candidateArtifactContentOutputNow, false, "accepted.candidateArtifactContentOutputNow");
  expect(run.output.candidateRowsAcceptedNow, false, "accepted.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "accepted.writeGateOpenedNow");
  expect(run.output.publicDataSource, "mock", "accepted.publicDataSource");
  expect(run.output.scoreSource, "mock", "accepted.scoreSource");
  expect(run.output.nextRoute, "prepare_candidate_artifact_bounded_write_authorization_preflight_no_execution", "accepted.nextRoute");
}

function validateRejectedRun(label, run) {
  expect(run.exitCode, 1, `${label}.exitCode`);
  expect(run.output.status, "blocked", `${label}.status`);
  expect(run.output.pmAcceptanceRecordedNow, false, `${label}.pmAcceptanceRecordedNow`);
  expect(run.output.candidateRowsAcceptedNow, false, `${label}.candidateRowsAcceptedNow`);
  expect(run.output.writeGateOpenedNow, false, `${label}.writeGateOpenedNow`);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [
      docPath,
      doc,
      [
        "phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads_ready",
        "run:phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-once",
        "check:phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-no-row-payloads",
        "--aggregate-result",
        "--pm-decision accepted",
        "`pmAcceptanceRecordedNow=true`",
        "`candidateRowsAcceptedNow=false`",
        "`writeGateOpenedNow=false`",
        "`publicDataSource=mock`",
        "`scoreSource=mock`",
        "prepare_candidate_artifact_bounded_write_authorization_preflight_no_execution"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Phase 1 Current-Scope Candidate Artifact Aggregate PM Acceptance Record",
        "phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads_ready",
        "prepare_candidate_artifact_bounded_write_authorization_preflight_no_execution"
      ]
    ]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-once"] !==
    "node scripts/run-phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-once.mjs"
  ) {
    problems.push(`${packagePath} missing run:phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-once`);
  }
  if (
    pkg.scripts?.["check:phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-no-row-payloads"] !==
    "node scripts/check-phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-no-row-payloads.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-no-row-payloads`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-no-row-payloads.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope candidate artifact aggregate PM record checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-no-row-payloads"')) {
    problems.push(`${reviewGatePath} missing current-scope candidate artifact aggregate PM record focused name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [recordPath, recordSource],
    [docPath, doc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
  if (recordSource.includes("console.log(aggregateResult") || recordSource.includes("JSON.stringify(aggregateResult")) {
    problems.push(`${recordPath} must not print aggregate result content`);
  }
}

function runNode(scriptPath, args) {
  const run = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  let output = {};
  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${scriptPath} ${args.join(" ")} did not emit JSON: ${error.message}`);
  }
  return { exitCode: run.status, output };
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return filePath.endsWith(".json") ? "{}" : "";
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

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\.rpc\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /candidateRowsAcceptedNow"\s*:\s*true/u,
    /writeGateOpenedNow"\s*:\s*true/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
