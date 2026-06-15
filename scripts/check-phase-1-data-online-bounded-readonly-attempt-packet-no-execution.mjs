import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_BOUNDED_READONLY_ATTEMPT_PACKET_NO_EXECUTION.md";
const packetPath = "data/evidence-intake/phase-1-bounded-readonly-attempt-packet.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packet = parseJson(readText(packetPath), packetPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const preflight = runJson(
  "scripts/check-phase-1-data-online-readonly-gate-preflight-no-execution.mjs",
  "readonly gate preflight"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validatePacket();
validateDoc();
validateRegistration();
validateNoSecretsOrExecution();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_bounded_readonly_attempt_packet_no_execution_ready"
    : "phase_1_data_online_bounded_readonly_attempt_packet_no_execution_blocked",
  packetMode: "bounded_readonly_attempt_packet_no_execution",
  attemptPacketReady: ok,
  attemptId: packet.attemptId ?? null,
  executionAuthorizedNow: false,
  readonlyAttemptExecutableNow: false,
  writeGateExecutableNow: false,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(preflight.status, "ok", "preflight status");
  expect(
    preflight.guardedStatus,
    "phase_1_data_online_readonly_gate_preflight_no_execution_ready",
    "preflight guarded status"
  );
  expect(preflight.operatorDecisionRequired, true, "preflight operatorDecisionRequired");
  expect(preflight.readonlyAttemptExecutableNow, false, "preflight readonlyAttemptExecutableNow");
  expect(preflight.writeGateExecutableNow, false, "preflight writeGateExecutableNow");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validatePacket() {
  expect(packet.status, "bounded_readonly_attempt_packet_ready_no_execution", "packet status");
  expect(packet.packetMode, "bounded_readonly_attempt_packet_no_execution", "packet mode");
  expect(packet.attemptId, "phase1-data-online-readonly-20260615-a", "packet attemptId");
  expect(packet.targetSystem, "Supabase PostgREST readonly", "packet targetSystem");
  expect(packet.scope, "aggregate_readonly_daily_prices_level1_coverage", "packet scope");
  expect(packet.operatorDecisionRequired, true, "packet operatorDecisionRequired");
  expect(packet.executionAuthorizedNow, false, "packet executionAuthorizedNow");
  expect(packet.readonlyAttemptExecutableNow, false, "packet readonlyAttemptExecutableNow");
  expect(packet.writeGateExecutableNow, false, "packet writeGateExecutableNow");
  expect(packet.publicDataSource, "mock", "packet publicDataSource");
  expect(packet.scoreSource, "mock", "packet scoreSource");
  expect(packet.allowedOutputShape, "aggregate_counts_only_no_rows_no_payloads", "packet allowedOutputShape");
  expect(packet.postRunReviewRequired, true, "packet postRunReviewRequired");
  expect(packet.maxAttemptCount, 1, "packet maxAttemptCount");
  if (!Array.isArray(packet.allowedTables) || packet.allowedTables.join(",") !== "daily_prices") {
    problems.push("packet allowedTables must contain only daily_prices");
  }
  if (!Array.isArray(packet.allowedAggregateFields) || packet.allowedAggregateFields.length < 5) {
    problems.push("packet allowedAggregateFields must list aggregate-only fields");
  }
  if (!Array.isArray(packet.forbiddenFields) || packet.forbiddenFields.length < 8) {
    problems.push("packet forbiddenFields must list forbidden row/raw/secret fields");
  }
  if (!Array.isArray(packet.failClosedConditions) || packet.failClosedConditions.length < 5) {
    problems.push("packet failClosedConditions must list fail-closed conditions");
  }
  if (!Array.isArray(packet.nextCommandsPreview) || packet.nextCommandsPreview.length !== 2) {
    problems.push("packet nextCommandsPreview must list runner and post-run review previews");
  }
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_bounded_readonly_attempt_packet_no_execution_ready",
    "bounded_readonly_attempt_packet_no_execution",
    "attemptId=phase1-data-online-readonly-20260615-a",
    "scope=aggregate_readonly_daily_prices_level1_coverage",
    "operatorDecisionRequired=true",
    "executionAuthorizedNow=false",
    "readonlyAttemptExecutableNow=false",
    "writeGateExecutableNow=false",
    "allowedOutputShape=aggregate_counts_only_no_rows_no_payloads",
    "maxAttemptCount=1",
    "postRunReviewRequired=true",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
    "publicDataSource=mock",
    "scoreSource=mock",
    "This packet does not execute a Supabase request",
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
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-data-online-bounded-readonly-attempt-packet-no-execution"] !==
    "node scripts/check-phase-1-data-online-bounded-readonly-attempt-packet-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-bounded-readonly-attempt-packet-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-bounded-readonly-attempt-packet-no-execution.mjs")) {
    problems.push("review gate missing bounded readonly attempt packet checker command");
  }
  if (!reviewGate.includes('"phase-1-data-online-bounded-readonly-attempt-packet-no-execution"')) {
    problems.push("focused review gate missing bounded readonly attempt packet checker name");
  }
}

function validateNoSecretsOrExecution() {
  for (const [label, text] of [
    [docPath, doc],
    [packetPath, JSON.stringify(packet)]
  ]) {
    for (const token of [
      "sb_secret_",
      "SUPABASE_SERVICE_ROLE_KEY",
      "service_role",
      "executeSwitchValue=",
      "confirmationPhraseValue=",
      "sqlExecuted=true",
      "supabaseReadAllowedNow=true",
      "supabaseWriteAllowedNow=true",
      "readonlyAttemptExecutableNow=true",
      "executionAuthorizedNow=true",
      "writeGateExecutableNow=true",
      "dailyPricesMutated=true",
      "marketRowsFetched=true",
      "rawPayloadStored=true",
      "publicDataSource=supabase",
      "scoreSource=real"
    ]) {
      if (text.includes(token)) problems.push(`${label} contains forbidden token ${token}`);
    }
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
