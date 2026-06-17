import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const pathGatePath = "scripts/run-phase-1-current-scope-candidate-artifact-path-shape-gate-once.mjs";
const headerGatePath = "scripts/run-phase-1-current-scope-candidate-artifact-header-gate-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_CANDIDATE_ARTIFACT_HEADER_GATE_NO_ROW_PAYLOADS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const headerGateSource = read(headerGatePath);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-header-gate-"));
try {
  const acceptedArtifactPath = path.join(tempDir, "accepted-artifact.json");
  const rowPayloadArtifactPath = path.join(tempDir, "row-payload-artifact.json");
  const realPromotionArtifactPath = path.join(tempDir, "real-promotion-artifact.json");
  const etfScopeArtifactPath = path.join(tempDir, "etf-scope-artifact.json");
  const acceptedPathResultPath = path.join(tempDir, "accepted-path-result.json");
  const rejectedPathResultPath = path.join(tempDir, "rejected-path-result.json");

  fs.writeFileSync(acceptedArtifactPath, JSON.stringify(makeAcceptedArtifact(), null, 2), "utf8");
  fs.writeFileSync(rowPayloadArtifactPath, JSON.stringify({ ...makeAcceptedArtifact(), rows: [] }, null, 2), "utf8");
  fs.writeFileSync(
    realPromotionArtifactPath,
    JSON.stringify({ ...makeAcceptedArtifact(), safetyFlags: { ...makeAcceptedArtifact().safetyFlags, publicDataSource: "NOT_MOCK" } }, null, 2),
    "utf8"
  );
  fs.writeFileSync(etfScopeArtifactPath, JSON.stringify({ ...makeAcceptedArtifact(), scope: "twii_plus_0050_006208_daily_close" }, null, 2), "utf8");

  fs.writeFileSync(acceptedPathResultPath, JSON.stringify(makeAcceptedPathResult(acceptedArtifactPath), null, 2), "utf8");
  fs.writeFileSync(rejectedPathResultPath, JSON.stringify(makeRejectedPathResult(acceptedArtifactPath), null, 2), "utf8");

  validateMissingRun(runNode(headerGatePath, []));
  validateAcceptedRun(runNode(headerGatePath, ["--path-result", acceptedPathResultPath]));
  validateRejectedRun("rejected path result", runNode(headerGatePath, ["--path-result", rejectedPathResultPath]));
  validateRejectedRun("row payload artifact", runNode(headerGatePath, ["--path-result", writePathResult(tempDir, rowPayloadArtifactPath)]));
  validateRejectedRun("real promotion artifact", runNode(headerGatePath, ["--path-result", writePathResult(tempDir, realPromotionArtifactPath)]));
  validateRejectedRun("etf scope artifact", runNode(headerGatePath, ["--path-result", writePathResult(tempDir, etfScopeArtifactPath)]));
  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(
    JSON.stringify(
      {
        status: ok ? "ok" : "blocked",
        guardedStatus: ok
          ? "phase_1_current_scope_candidate_artifact_header_gate_no_row_payloads_ready"
          : "phase_1_current_scope_candidate_artifact_header_gate_no_row_payloads_blocked",
        acceptedHeaderReady: true,
        rowPayloadRejected: true,
        realPromotionRejected: true,
        etfScopeRejected: true,
        candidateRowsAcceptedNow: false,
        writeGateOpenedNow: false,
        publicDataSource: "mock",
        scoreSource: "mock",
        nextRoute: ok ? "prepare_candidate_artifact_aggregate_contract_gate_no_row_payloads" : "keep_mock_and_repair_header_gate",
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
      start: "EXAMPLE_ONLY",
      end: "EXAMPLE_ONLY"
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

function makeAcceptedPathResult(candidateArtifactPath) {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_candidate_artifact_path_shape_gate_ready_no_row_payloads",
    candidateArtifactPathShapeReadyNow: true,
    candidateArtifactPath,
    candidateArtifactExistsNow: true,
    candidateArtifactReadNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "prepare_candidate_artifact_header_contract_no_row_payloads",
    problems: []
  };
}

function makeRejectedPathResult(candidateArtifactPath) {
  return {
    ...makeAcceptedPathResult(candidateArtifactPath),
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_artifact_path_shape_gate_blocked_no_row_payloads",
    candidateArtifactPathShapeReadyNow: false,
    nextRoute: "keep_mock_and_request_repair",
    problems: ["synthetic rejected path result for header-gate branch proof"]
  };
}

function writePathResult(dir, candidateArtifactPath) {
  const filePath = path.join(dir, `${path.basename(candidateArtifactPath)}.path-result.json`);
  fs.writeFileSync(filePath, JSON.stringify(makeAcceptedPathResult(candidateArtifactPath), null, 2), "utf8");
  return filePath;
}

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.output.status, "blocked", "missing.status");
  expect(run.output.candidateArtifactHeaderAcceptedNow, false, "missing.candidateArtifactHeaderAcceptedNow");
  expect(run.output.candidateRowsAcceptedNow, false, "missing.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "missing.writeGateOpenedNow");
}

function validateAcceptedRun(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.output.status, "ok", "accepted.status");
  expect(run.output.guardedStatus, "phase_1_current_scope_candidate_artifact_header_gate_accepted_no_rows", "accepted.guardedStatus");
  expect(run.output.candidateArtifactHeaderAcceptedNow, true, "accepted.candidateArtifactHeaderAcceptedNow");
  expect(run.output.candidateArtifactContentOutputNow, false, "accepted.candidateArtifactContentOutputNow");
  expect(run.output.candidateRowsAcceptedNow, false, "accepted.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "accepted.writeGateOpenedNow");
  expect(run.output.publicDataSource, "mock", "accepted.publicDataSource");
  expect(run.output.scoreSource, "mock", "accepted.scoreSource");
  expect(run.output.nextRoute, "prepare_candidate_artifact_aggregate_contract_gate_no_row_payloads", "accepted.nextRoute");
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
        "phase_1_current_scope_candidate_artifact_header_gate_no_row_payloads_ready",
        "run:phase-1-current-scope-candidate-artifact-header-gate-once",
        "check:phase-1-current-scope-candidate-artifact-header-gate-no-row-payloads",
        "--path-result",
        "The candidate artifact JSON may be parsed only for header and aggregate metadata.",
        "No artifact content is printed.",
        "`candidateRowsAcceptedNow=false`",
        "`writeGateOpenedNow=false`",
        "`publicDataSource=mock`",
        "`scoreSource=mock`",
        "prepare_candidate_artifact_aggregate_contract_gate_no_row_payloads"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Phase 1 Current-Scope Candidate Artifact Header Gate",
        "phase_1_current_scope_candidate_artifact_header_gate_no_row_payloads_ready",
        "prepare_candidate_artifact_aggregate_contract_gate_no_row_payloads"
      ]
    ]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-candidate-artifact-header-gate-once"] !==
    "node scripts/run-phase-1-current-scope-candidate-artifact-header-gate-once.mjs"
  ) {
    problems.push(`${packagePath} missing run:phase-1-current-scope-candidate-artifact-header-gate-once`);
  }
  if (
    pkg.scripts?.["check:phase-1-current-scope-candidate-artifact-header-gate-no-row-payloads"] !==
    "node scripts/check-phase-1-current-scope-candidate-artifact-header-gate-no-row-payloads.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-current-scope-candidate-artifact-header-gate-no-row-payloads`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-candidate-artifact-header-gate-no-row-payloads.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope candidate artifact header checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-candidate-artifact-header-gate-no-row-payloads"')) {
    problems.push(`${reviewGatePath} missing current-scope candidate artifact header focused name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [headerGatePath, headerGateSource],
    [docPath, doc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
  if (headerGateSource.includes("console.log(artifact") || headerGateSource.includes("JSON.stringify(artifact")) {
    problems.push(`${headerGatePath} must not print candidate artifact content`);
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
