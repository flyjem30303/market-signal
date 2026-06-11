import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-final-execution-packet-preflight.mjs";
const docPath = "docs/TWII_FINAL_EXECUTION_PACKET_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-final-execution-packet-preflight.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const gateText = read(gatePath);
const gate = JSON.parse(gateText);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

const output = parseJson(run.stdout ?? "", "final execution packet preflight stdout");
if (run.status !== 0) problems.push("final execution packet preflight report must exit 0");
if (output.status !== "twii_final_execution_packet_preflight_ready_no_execution") {
  problems.push("final execution packet preflight status mismatch");
}
if (output.outcome !== "final_execution_packet_ready_runtime_still_blocked") {
  problems.push("final execution packet preflight outcome mismatch");
}
if (output.mode !== "twii_final_execution_packet_preflight_no_execution") {
  problems.push("final execution packet preflight mode mismatch");
}
if (output.packetMode !== "final_execution_packet_preflight_no_execution") problems.push("packetMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (output.target?.maxRows !== 60) problems.push("maxRows must be 60");

assertGate(gate);
assertFinalExecutionPacketState(output.finalExecutionPacketState ?? {});
assertCandidateState(output.candidateState ?? {});
assertNoExecutionState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-final-execution-packet-preflight"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-final-execution-packet-preflight`);
}
if (
  pkg.scripts?.["check:twii-final-execution-packet-preflight"] !==
  "node scripts/check-twii-final-execution-packet-preflight.mjs"
) {
  problems.push(`${packagePath} missing check:twii-final-execution-packet-preflight`);
}

for (const phrase of [
  "TWII Final Execution Packet Preflight",
  "twii_final_execution_packet_preflight_ready_no_execution",
  "final_execution_packet_ready_runtime_still_blocked",
  "data/source-gates/twii-final-execution-packet-preflight.json",
  "sourceRollbackGatePath=data/source-gates/twii-rollback-readiness-contract-preflight.json",
  "candidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
  "packetMode=final_execution_packet_preflight_no_execution",
  "finalExecutionPacketPrepared=true",
  "allPreExecutionContractsReferenced=true",
  "executeSwitchRequirementPrepared=true",
  "confirmationPhraseRequirementPrepared=true",
  "candidateArtifactReferenceOnly=true",
  "candidateArtifactRowsRead=false",
  "rowPayloadRead=false",
  "rawPayloadRead=false",
  "finalExecutionAllowedNow=false",
  "implementationAllowedNow=false",
  "requiredExecuteSwitchName=TWII_ONE_ATTEMPT_EXECUTE",
  "requiredConfirmationPhraseName=TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
  "sqlExecuted=false",
  "supabaseClientImported=false",
  "supabaseConnectionAttempted=false",
  "supabaseWritesEnabled=false",
  "supabaseReadsEnabled=false",
  "dailyPricesMutated=false",
  "candidateRowsAccepted=false",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII final execution packet preflight slice",
  "docs/TWII_FINAL_EXECUTION_PACKET_PREFLIGHT.md",
  "data/source-gates/twii-final-execution-packet-preflight.json",
  "twii_final_execution_packet_preflight_ready_no_execution",
  "final_execution_packet_ready_runtime_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_FINAL_EXECUTION_PACKET_PREFLIGHT.md` is `accepted` as TWII final execution packet preflight",
  "twii_final_execution_packet_preflight_ready_no_execution",
  "final_execution_packet_ready_runtime_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-final-execution-packet-preflight.mjs",
  "name: \"twii-final-execution-packet-preflight\"",
  "\"twii-final-execution-packet-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, gateText],
  ["final execution packet preflight stdout", run.stdout ?? ""]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: output.status,
      acceptedOutcome: output.outcome,
      packetMode: output.packetMode,
      finalExecutionAllowedNow: output.finalExecutionPacketState.finalExecutionAllowedNow,
      implementationAllowedNow: output.noExecutionState.implementationAllowedNow
    },
    null,
    2
  )
);

function assertGate(gate) {
  const expected = {
    gateKind: "twii_final_execution_packet_preflight",
    sourceRollbackGatePath: "data/source-gates/twii-rollback-readiness-contract-preflight.json",
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    packetMode: "final_execution_packet_preflight_no_execution",
    sourceRollbackGateAccepted: true,
    finalExecutionPacketPrepared: true,
    allPreExecutionContractsReferenced: true,
    executeSwitchRequirementPrepared: true,
    confirmationPhraseRequirementPrepared: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false,
    packetDecision: "final_execution_packet_preflight_ready_but_runtime_execution_still_blocked",
    nextIfPacketAccepted: "operator_reviews_final_execution_packet_then_supplies_explicit_execute_switch_and_confirmation",
    nextIfPacketRejected: "repair_final_execution_packet_or_pre_execution_contract_chain",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (gate.finalExecutionPacket?.operationKind !== "future_final_execution_packet_no_execution") {
    problems.push("finalExecutionPacket.operationKind mismatch");
  }
}

function assertFinalExecutionPacketState(state) {
  for (const key of [
    "sourceRollbackGateAccepted",
    "finalExecutionPacketPrepared",
    "allPreExecutionContractsReferenced",
    "executeSwitchRequirementPrepared",
    "confirmationPhraseRequirementPrepared"
  ]) {
    if (state[key] !== true) problems.push(`finalExecutionPacketState.${key} must be true`);
  }
  if (state.finalExecutionAllowedNow !== false) problems.push("finalExecutionPacketState.finalExecutionAllowedNow must be false");
  if (state.implementationAllowedNow !== false) problems.push("finalExecutionPacketState.implementationAllowedNow must be false");
}

function assertCandidateState(state) {
  if (state.candidateArtifactReferenceOnly !== true) problems.push("candidateState.candidateArtifactReferenceOnly must be true");
  for (const key of ["candidateArtifactRowsRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead"]) {
    if (state[key] !== false) problems.push(`candidateState.${key} must be false`);
  }
}

function assertNoExecutionState(state) {
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "envValueOutput",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow"
  ]) {
    if (state[key] !== false) problems.push(`noExecutionState.${key} must be false`);
  }
}

function assertSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("safety must stay publicDataSource=mock and scoreSource=mock");
  }
  if (safety.candidateArtifactReferenceOnly !== true) problems.push("safety.candidateArtifactReferenceOnly must be true");
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "candidateArtifactRowsRead",
    "sourcePayloadRead",
    "rowPayloadRead",
    "rawPayloadRead",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "envValueOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety[key] !== false) problems.push(`safety.${key} must be false`);
  }
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /row coverage scoring is approved/iu
  ];
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}
