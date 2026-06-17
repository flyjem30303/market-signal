import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const aggregateGatePath = "scripts/run-phase-1-current-scope-candidate-artifact-aggregate-gate-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_CANDIDATE_ARTIFACT_AGGREGATE_GATE_NO_ROW_PAYLOADS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const aggregateGateSource = read(aggregateGatePath);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-aggregate-gate-"));
try {
  const acceptedArtifactPath = path.join(tempDir, "accepted-artifact.json");
  const exampleDateArtifactPath = path.join(tempDir, "example-date-artifact.json");
  const duplicateArtifactPath = path.join(tempDir, "duplicate-artifact.json");
  const rowPayloadArtifactPath = path.join(tempDir, "row-payload-artifact.json");
  const realPromotionArtifactPath = path.join(tempDir, "real-promotion-artifact.json");
  const etfScopeArtifactPath = path.join(tempDir, "etf-scope-artifact.json");
  const acceptedHeaderResultPath = path.join(tempDir, "accepted-header-result.json");
  const rejectedHeaderResultPath = path.join(tempDir, "rejected-header-result.json");

  fs.writeFileSync(acceptedArtifactPath, JSON.stringify(makeAcceptedArtifact(), null, 2), "utf8");
  fs.writeFileSync(
    exampleDateArtifactPath,
    JSON.stringify({ ...makeAcceptedArtifact(), dateBounds: { start: "EXAMPLE_ONLY", end: "2026-03-31" } }, null, 2),
    "utf8"
  );
  fs.writeFileSync(duplicateArtifactPath, JSON.stringify({ ...makeAcceptedArtifact(), duplicateCount: 1 }, null, 2), "utf8");
  fs.writeFileSync(rowPayloadArtifactPath, JSON.stringify({ ...makeAcceptedArtifact(), rows: [] }, null, 2), "utf8");
  fs.writeFileSync(
    realPromotionArtifactPath,
    JSON.stringify({ ...makeAcceptedArtifact(), safetyFlags: { ...makeAcceptedArtifact().safetyFlags, publicDataSource: "NOT_MOCK" } }, null, 2),
    "utf8"
  );
  fs.writeFileSync(etfScopeArtifactPath, JSON.stringify({ ...makeAcceptedArtifact(), scope: "twii_plus_0050_006208_daily_close" }, null, 2), "utf8");
  fs.writeFileSync(acceptedHeaderResultPath, JSON.stringify(makeAcceptedHeaderResult(), null, 2), "utf8");
  fs.writeFileSync(rejectedHeaderResultPath, JSON.stringify(makeRejectedHeaderResult(), null, 2), "utf8");

  validateMissingRun(runNode(aggregateGatePath, []));
  validateAcceptedRun(runNode(aggregateGatePath, ["--header-result", acceptedHeaderResultPath, "--candidate-artifact", acceptedArtifactPath]));
  validateRejectedRun(
    "rejected header result",
    runNode(aggregateGatePath, ["--header-result", rejectedHeaderResultPath, "--candidate-artifact", acceptedArtifactPath])
  );
  validateRejectedRun(
    "example-only date artifact",
    runNode(aggregateGatePath, ["--header-result", acceptedHeaderResultPath, "--candidate-artifact", exampleDateArtifactPath])
  );
  validateRejectedRun(
    "duplicate artifact",
    runNode(aggregateGatePath, ["--header-result", acceptedHeaderResultPath, "--candidate-artifact", duplicateArtifactPath])
  );
  validateRejectedRun(
    "row payload artifact",
    runNode(aggregateGatePath, ["--header-result", acceptedHeaderResultPath, "--candidate-artifact", rowPayloadArtifactPath])
  );
  validateRejectedRun(
    "real promotion artifact",
    runNode(aggregateGatePath, ["--header-result", acceptedHeaderResultPath, "--candidate-artifact", realPromotionArtifactPath])
  );
  validateRejectedRun(
    "etf scope artifact",
    runNode(aggregateGatePath, ["--header-result", acceptedHeaderResultPath, "--candidate-artifact", etfScopeArtifactPath])
  );

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(
    JSON.stringify(
      {
        status: ok ? "ok" : "blocked",
        guardedStatus: ok
          ? "phase_1_current_scope_candidate_artifact_aggregate_gate_no_row_payloads_ready"
          : "phase_1_current_scope_candidate_artifact_aggregate_gate_no_row_payloads_blocked",
        acceptedAggregateReady: true,
        exampleOnlyDateRejected: true,
        duplicateRejected: true,
        rowPayloadRejected: true,
        realPromotionRejected: true,
        etfScopeRejected: true,
        candidateRowsAcceptedNow: false,
        writeGateOpenedNow: false,
        publicDataSource: "mock",
        scoreSource: "mock",
        nextRoute: ok ? "prepare_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads" : "keep_mock_and_repair_aggregate_gate",
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

function makeAcceptedArtifact() {
  return {
    artifactId: "phase-1-current-scope-sanitized-candidate-example",
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    sourceLane: "official-free-automatable-daily-close",
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
    sanitizedAggregateOnly: true,
    rawPayloadIncluded: false,
    rowPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false,
    safetyFlags: {
      publicDataSource: "mock",
      scoreSource: "mock",
      candidateRowsAcceptedNow: false,
      writeGateOpenedNow: false,
      sqlExecuted: false,
      supabaseWriteAttempted: false,
      dailyPricesMutated: false,
      marketDataFetched: false,
      marketDataIngested: false
    }
  };
}

function makeAcceptedHeaderResult() {
  const artifact = makeAcceptedArtifact();
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_candidate_artifact_header_gate_accepted_no_rows",
    candidateArtifactHeaderAcceptedNow: true,
    artifactId: artifact.artifactId,
    phase1Universe: artifact.phase1Universe,
    scope: artifact.scope,
    aggregateRowCount: artifact.aggregateRowCount,
    symbolsCoveredCount: artifact.symbolsCoveredCount,
    candidateArtifactContentOutputNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "prepare_candidate_artifact_aggregate_contract_gate_no_row_payloads",
    problems: []
  };
}

function makeRejectedHeaderResult() {
  return {
    ...makeAcceptedHeaderResult(),
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_artifact_header_gate_blocked_no_rows",
    candidateArtifactHeaderAcceptedNow: false,
    nextRoute: "keep_mock_and_request_repair",
    problems: ["synthetic rejected header result for aggregate-gate branch proof"]
  };
}

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.output.status, "blocked", "missing.status");
  expect(run.output.candidateArtifactAggregateAcceptedNow, false, "missing.candidateArtifactAggregateAcceptedNow");
  expect(run.output.candidateRowsAcceptedNow, false, "missing.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "missing.writeGateOpenedNow");
}

function validateAcceptedRun(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.output.status, "ok", "accepted.status");
  expect(run.output.guardedStatus, "phase_1_current_scope_candidate_artifact_aggregate_gate_accepted_no_rows", "accepted.guardedStatus");
  expect(run.output.candidateArtifactAggregateAcceptedNow, true, "accepted.candidateArtifactAggregateAcceptedNow");
  expect(run.output.coverageWindowSessions, 60, "accepted.coverageWindowSessions");
  expect(run.output.aggregateRowCount, 6000, "accepted.aggregateRowCount");
  expect(run.output.symbolsCoveredCount, 100, "accepted.symbolsCoveredCount");
  expect(run.output.duplicateCount, 0, "accepted.duplicateCount");
  expect(run.output.rejectedCount, 0, "accepted.rejectedCount");
  expect(run.output.missingRequiredFieldCount, 0, "accepted.missingRequiredFieldCount");
  expect(run.output.forbiddenFieldCount, 0, "accepted.forbiddenFieldCount");
  expect(run.output.candidateArtifactContentOutputNow, false, "accepted.candidateArtifactContentOutputNow");
  expect(run.output.candidateRowsAcceptedNow, false, "accepted.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "accepted.writeGateOpenedNow");
  expect(run.output.publicDataSource, "mock", "accepted.publicDataSource");
  expect(run.output.scoreSource, "mock", "accepted.scoreSource");
  expect(run.output.nextRoute, "prepare_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads", "accepted.nextRoute");
}

function validateRejectedRun(label, run) {
  expect(run.exitCode, 1, `${label}.exitCode`);
  expect(run.output.status, "blocked", `${label}.status`);
  expect(run.output.candidateRowsAcceptedNow, false, `${label}.candidateRowsAcceptedNow`);
  expect(run.output.writeGateOpenedNow, false, `${label}.writeGateOpenedNow`);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [
      docPath,
      doc,
      [
        "phase_1_current_scope_candidate_artifact_aggregate_gate_no_row_payloads_ready",
        "run:phase-1-current-scope-candidate-artifact-aggregate-gate-once",
        "check:phase-1-current-scope-candidate-artifact-aggregate-gate-no-row-payloads",
        "--header-result",
        "--candidate-artifact",
        "`coverageWindowSessions`",
        "`aggregateRowCount`",
        "`symbolsCoveredCount`",
        "`duplicateCount=0`",
        "`rejectedCount=0`",
        "`missingRequiredFieldCount=0`",
        "`forbiddenFieldCount=0`",
        "`candidateRowsAcceptedNow=false`",
        "`writeGateOpenedNow=false`",
        "`publicDataSource=mock`",
        "`scoreSource=mock`",
        "prepare_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Phase 1 Current-Scope Candidate Artifact Aggregate Gate",
        "phase_1_current_scope_candidate_artifact_aggregate_gate_no_row_payloads_ready",
        "prepare_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads"
      ]
    ]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-candidate-artifact-aggregate-gate-once"] !==
    "node scripts/run-phase-1-current-scope-candidate-artifact-aggregate-gate-once.mjs"
  ) {
    problems.push(`${packagePath} missing run:phase-1-current-scope-candidate-artifact-aggregate-gate-once`);
  }
  if (
    pkg.scripts?.["check:phase-1-current-scope-candidate-artifact-aggregate-gate-no-row-payloads"] !==
    "node scripts/check-phase-1-current-scope-candidate-artifact-aggregate-gate-no-row-payloads.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-current-scope-candidate-artifact-aggregate-gate-no-row-payloads`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-candidate-artifact-aggregate-gate-no-row-payloads.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope candidate artifact aggregate checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-candidate-artifact-aggregate-gate-no-row-payloads"')) {
    problems.push(`${reviewGatePath} missing current-scope candidate artifact aggregate focused name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [aggregateGatePath, aggregateGateSource],
    [docPath, doc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
  if (aggregateGateSource.includes("console.log(artifact") || aggregateGateSource.includes("JSON.stringify(artifact")) {
    problems.push(`${aggregateGatePath} must not print candidate artifact content`);
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
