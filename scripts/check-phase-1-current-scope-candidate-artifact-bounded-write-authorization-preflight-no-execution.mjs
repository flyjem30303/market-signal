import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const preflightPath = "scripts/run-phase-1-current-scope-candidate-artifact-bounded-write-authorization-preflight-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_CANDIDATE_ARTIFACT_BOUNDED_WRITE_AUTHORIZATION_PREFLIGHT_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const preflightSource = read(preflightPath);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-write-preflight-"));
try {
  const acceptedRecordPath = path.join(tempDir, "accepted-pm-record.json");
  const blockedRecordPath = path.join(tempDir, "blocked-pm-record.json");
  const rowPayloadRecordPath = path.join(tempDir, "row-payload-pm-record.json");
  const realPromotionRecordPath = path.join(tempDir, "real-promotion-pm-record.json");
  const etfScopeRecordPath = path.join(tempDir, "etf-scope-pm-record.json");

  fs.writeFileSync(acceptedRecordPath, JSON.stringify(makeAcceptedPmRecord(), null, 2), "utf8");
  fs.writeFileSync(blockedRecordPath, JSON.stringify(makeBlockedPmRecord(), null, 2), "utf8");
  fs.writeFileSync(rowPayloadRecordPath, JSON.stringify({ ...makeAcceptedPmRecord(), rows: [] }, null, 2), "utf8");
  fs.writeFileSync(realPromotionRecordPath, JSON.stringify({ ...makeAcceptedPmRecord(), scoreSource: "NOT_MOCK" }, null, 2), "utf8");
  fs.writeFileSync(etfScopeRecordPath, JSON.stringify({ ...makeAcceptedPmRecord(), scope: "twii_plus_0050_006208_daily_close" }, null, 2), "utf8");

  validateMissingRun(runNode(preflightPath, []));
  validateAcceptedRun(runNode(preflightPath, ["--pm-record", acceptedRecordPath]));
  validateRejectedRun("blocked PM record", runNode(preflightPath, ["--pm-record", blockedRecordPath]));
  validateRejectedRun("row payload PM record", runNode(preflightPath, ["--pm-record", rowPayloadRecordPath]));
  validateRejectedRun("real promotion PM record", runNode(preflightPath, ["--pm-record", realPromotionRecordPath]));
  validateRejectedRun("etf scope PM record", runNode(preflightPath, ["--pm-record", etfScopeRecordPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(
    JSON.stringify(
      {
        status: ok ? "ok" : "blocked",
        guardedStatus: ok
          ? "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_no_execution_ready"
          : "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_no_execution_blocked",
        acceptedPreflightReady: true,
        blockedRecordRejected: true,
        rowPayloadRejected: true,
        realPromotionRejected: true,
        etfScopeRejected: true,
        operatorAuthorizationRequired: true,
        boundedWriteExecutableNow: false,
        candidateRowsAcceptedNow: false,
        writeGateOpenedNow: false,
        sqlExecuted: false,
        supabaseWriteAttempted: false,
        dailyPricesMutated: false,
        publicDataSource: "mock",
        scoreSource: "mock",
        nextRoute: ok ? "prepare_explicit_operator_bounded_write_authorization_packet_no_execution" : "keep_mock_and_repair_bounded_write_preflight",
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

function makeAcceptedPmRecord() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_accepted_no_rows",
    pmDecision: "accepted",
    pmAcceptanceRecordedNow: true,
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
    candidateArtifactContentOutputNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "prepare_candidate_artifact_bounded_write_authorization_preflight_no_execution",
    problems: []
  };
}

function makeBlockedPmRecord() {
  return {
    ...makeAcceptedPmRecord(),
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_blocked_no_rows",
    pmAcceptanceRecordedNow: false,
    nextRoute: "keep_mock_and_request_pm_or_aggregate_repair",
    problems: ["synthetic blocked PM record for write-preflight branch proof"]
  };
}

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.output.status, "blocked", "missing.status");
  expect(run.output.operatorAuthorizationRequired, true, "missing.operatorAuthorizationRequired");
  expect(run.output.boundedWriteExecutableNow, false, "missing.boundedWriteExecutableNow");
  expect(run.output.candidateRowsAcceptedNow, false, "missing.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "missing.writeGateOpenedNow");
}

function validateAcceptedRun(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.output.status, "ok", "accepted.status");
  expect(
    run.output.guardedStatus,
    "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_ready_no_execution",
    "accepted.guardedStatus"
  );
  expect(run.output.preflightPreparedNow, true, "accepted.preflightPreparedNow");
  expect(run.output.operatorAuthorizationRequired, true, "accepted.operatorAuthorizationRequired");
  expect(run.output.boundedWriteExecutableNow, false, "accepted.boundedWriteExecutableNow");
  expect(run.output.candidateRowsAcceptedNow, false, "accepted.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "accepted.writeGateOpenedNow");
  expect(run.output.sqlExecuted, false, "accepted.sqlExecuted");
  expect(run.output.supabaseWriteAttempted, false, "accepted.supabaseWriteAttempted");
  expect(run.output.dailyPricesMutated, false, "accepted.dailyPricesMutated");
  expect(run.output.publicDataSource, "mock", "accepted.publicDataSource");
  expect(run.output.scoreSource, "mock", "accepted.scoreSource");
  expect(run.output.preflightPacket?.operatorAuthorizationRequired, true, "accepted.preflightPacket.operatorAuthorizationRequired");
  expect(run.output.preflightPacket?.boundedWriteExecutableNow, false, "accepted.preflightPacket.boundedWriteExecutableNow");
  expect(run.output.preflightPacket?.candidateRowsAcceptedNow, false, "accepted.preflightPacket.candidateRowsAcceptedNow");
  expect(run.output.preflightPacket?.writeGateOpenedNow, false, "accepted.preflightPacket.writeGateOpenedNow");
  if (!Array.isArray(run.output.preflightPacket?.requiredFutureInputs) || run.output.preflightPacket.requiredFutureInputs.length < 5) {
    problems.push("accepted preflight packet must list requiredFutureInputs");
  }
  if (!Array.isArray(run.output.preflightPacket?.stopConditions) || run.output.preflightPacket.stopConditions.length < 5) {
    problems.push("accepted preflight packet must list stopConditions");
  }
  if (!Array.isArray(run.output.preflightPacket?.rollbackReadbackRequirements) || run.output.preflightPacket.rollbackReadbackRequirements.length < 3) {
    problems.push("accepted preflight packet must list rollbackReadbackRequirements");
  }
  if (!Array.isArray(run.output.preflightPacket?.postRunReviewRequirements) || run.output.preflightPacket.postRunReviewRequirements.length < 3) {
    problems.push("accepted preflight packet must list postRunReviewRequirements");
  }
  expect(run.output.nextRoute, "prepare_explicit_operator_bounded_write_authorization_packet_no_execution", "accepted.nextRoute");
}

function validateRejectedRun(label, run) {
  expect(run.exitCode, 1, `${label}.exitCode`);
  expect(run.output.status, "blocked", `${label}.status`);
  expect(run.output.boundedWriteExecutableNow, false, `${label}.boundedWriteExecutableNow`);
  expect(run.output.candidateRowsAcceptedNow, false, `${label}.candidateRowsAcceptedNow`);
  expect(run.output.writeGateOpenedNow, false, `${label}.writeGateOpenedNow`);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [
      docPath,
      doc,
      [
        "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_no_execution_ready",
        "run:phase-1-current-scope-candidate-artifact-bounded-write-authorization-preflight-once",
        "check:phase-1-current-scope-candidate-artifact-bounded-write-authorization-preflight-no-execution",
        "--pm-record",
        "`operatorAuthorizationRequired=true`",
        "`boundedWriteExecutableNow=false`",
        "`candidateRowsAcceptedNow=false`",
        "`writeGateOpenedNow=false`",
        "`sqlExecuted=false`",
        "`supabaseWriteAttempted=false`",
        "`dailyPricesMutated=false`",
        "`publicDataSource=mock`",
        "`scoreSource=mock`",
        "prepare_explicit_operator_bounded_write_authorization_packet_no_execution"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Phase 1 Current-Scope Candidate Artifact Bounded Write Authorization Preflight",
        "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_no_execution_ready",
        "prepare_explicit_operator_bounded_write_authorization_packet_no_execution"
      ]
    ]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-candidate-artifact-bounded-write-authorization-preflight-once"] !==
    "node scripts/run-phase-1-current-scope-candidate-artifact-bounded-write-authorization-preflight-once.mjs"
  ) {
    problems.push(`${packagePath} missing run:phase-1-current-scope-candidate-artifact-bounded-write-authorization-preflight-once`);
  }
  if (
    pkg.scripts?.["check:phase-1-current-scope-candidate-artifact-bounded-write-authorization-preflight-no-execution"] !==
    "node scripts/check-phase-1-current-scope-candidate-artifact-bounded-write-authorization-preflight-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-current-scope-candidate-artifact-bounded-write-authorization-preflight-no-execution`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-candidate-artifact-bounded-write-authorization-preflight-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope candidate artifact bounded write preflight checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-candidate-artifact-bounded-write-authorization-preflight-no-execution"')) {
    problems.push(`${reviewGatePath} missing current-scope candidate artifact bounded write preflight focused name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [preflightPath, preflightSource],
    [docPath, doc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
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
    /boundedWriteExecutableNow"\s*:\s*true/u,
    /candidateRowsAcceptedNow"\s*:\s*true/u,
    /writeGateOpenedNow"\s*:\s*true/u,
    /sqlExecuted"\s*:\s*true/u,
    /supabaseWriteAttempted"\s*:\s*true/u,
    /dailyPricesMutated"\s*:\s*true/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
