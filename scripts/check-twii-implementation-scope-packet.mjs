import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-implementation-scope-packet.mjs";
const docPath = "docs/TWII_IMPLEMENTATION_SCOPE_PACKET.md";
const packetPath = "data/source-gates/twii-implementation-scope-packet.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const packet = JSON.parse(read(packetPath));
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

const output = parseJson(run.stdout ?? "", "implementation scope packet stdout");
if (run.status !== 0) problems.push("implementation scope packet report must exit 0");
if (output.status !== "twii_implementation_scope_packet_ready_no_execution") {
  problems.push("implementation scope packet status mismatch");
}
if (output.outcome !== "implementation_scope_packet_ready_implementation_still_blocked") {
  problems.push("implementation scope packet outcome mismatch");
}
if (output.scopeMode !== "implementation_scope_packet_no_execution") problems.push("scopeMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
assertPacket(packet);
assertNoExecutionState(output.noExecutionState ?? {});
assertImplementationControls(output.implementationControls ?? {});
assertSafety(output.safety ?? {});
assertArray(output.allowedFutureCodeScopes, expectedAllowedFutureCodeScopes(), "output.allowedFutureCodeScopes");
assertArray(output.forbiddenCurrentCodeScopes, expectedForbiddenCurrentCodeScopes(), "output.forbiddenCurrentCodeScopes");

if (pkg.scripts?.["report:twii-implementation-scope-packet"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-implementation-scope-packet`);
}
if (pkg.scripts?.["check:twii-implementation-scope-packet"] !== "node scripts/check-twii-implementation-scope-packet.mjs") {
  problems.push(`${packagePath} missing check:twii-implementation-scope-packet`);
}

for (const phrase of [
  "TWII Implementation Scope Packet",
  "twii_implementation_scope_packet_ready_no_execution",
  "implementation_scope_packet_ready_implementation_still_blocked",
  "data/source-gates/twii-implementation-scope-packet.json",
  "scopeMode=implementation_scope_packet_no_execution",
  "requiredConfirmationPhrase=CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
  "executeSwitchName=TWII_ONE_ATTEMPT_EXECUTE",
  "confirmationPhraseName=TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
  "implementationReviewGateAccepted=true",
  "supabaseClientImplementationAllowed=false",
  "credentialPresenceCheckImplementationAllowed=false",
  "boundedInsertImplementationAllowed=false",
  "allowedFutureCodeScopes=[server_only_module_boundary, credential_presence_shape_only, bounded_insert_missing_only_contract, aggregate_readback_contract, post_write_review_contract]",
  "forbiddenCurrentCodeScopes=[supabase_client_import, credential_value_read, supabase_connection_attempt, daily_prices_mutation, raw_market_data_fetch, row_payload_output, stock_id_payload_output, scoreSource_real_promotion]",
  "executeRequested=false",
  "sqlExecuted=false",
  "supabaseClientImported=false",
  "supabaseConnectionAttempted=false",
  "supabaseWritesEnabled=false",
  "dailyPricesMutated=false",
  "candidateRowsAccepted=false",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII implementation scope packet slice",
  "docs/TWII_IMPLEMENTATION_SCOPE_PACKET.md",
  "data/source-gates/twii-implementation-scope-packet.json",
  "twii_implementation_scope_packet_ready_no_execution",
  "implementation_scope_packet_ready_implementation_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_IMPLEMENTATION_SCOPE_PACKET.md` is `accepted` as TWII implementation scope packet",
  "twii_implementation_scope_packet_ready_no_execution",
  "implementation_scope_packet_ready_implementation_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-implementation-scope-packet.mjs",
  "name: \"twii-implementation-scope-packet\"",
  "\"twii-implementation-scope-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [packetPath, JSON.stringify(packet)],
  ["implementation scope packet stdout", run.stdout ?? ""]
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
      implementationAllowedNow: output.noExecutionState.implementationAllowedNow
    },
    null,
    2
  )
);

function assertPacket(packet) {
  const expected = {
    packetKind: "twii_implementation_scope_packet",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    scopeMode: "implementation_scope_packet_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    implementationReviewGateAccepted: true,
    supabaseClientImplementationAllowed: false,
    credentialPresenceCheckImplementationAllowed: false,
    boundedInsertImplementationAllowed: false,
    implementationScopeDecision: "blocked_until_scope_packet_is_explicitly_authorized_after_all_controls_pass",
    executeRequested: false,
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseWritesEnabled: false,
    dailyPricesMutated: false,
    candidateRowsAccepted: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`packet.${key} must be ${JSON.stringify(value)}`);
  }
  assertArray(packet.allowedFutureCodeScopes, expectedAllowedFutureCodeScopes(), "packet.allowedFutureCodeScopes");
  assertArray(packet.forbiddenCurrentCodeScopes, expectedForbiddenCurrentCodeScopes(), "packet.forbiddenCurrentCodeScopes");
}

function assertImplementationControls(controls) {
  for (const [key, value] of Object.entries({
    supabaseClientImplementationAllowed: false,
    credentialPresenceCheckImplementationAllowed: false,
    boundedInsertImplementationAllowed: false
  })) {
    if (controls[key] !== value) problems.push(`implementationControls.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertNoExecutionState(state) {
  for (const key of [
    "executeRequested",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseWritesEnabled",
    "dailyPricesMutated",
    "candidateRowsAccepted",
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
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "credentialValuesRead",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety[key] !== false) problems.push(`safety.${key} must be false`);
  }
}

function expectedAllowedFutureCodeScopes() {
  return [
    "server_only_module_boundary",
    "credential_presence_shape_only",
    "bounded_insert_missing_only_contract",
    "aggregate_readback_contract",
    "post_write_review_contract"
  ];
}

function expectedForbiddenCurrentCodeScopes() {
  return [
    "supabase_client_import",
    "credential_value_read",
    "supabase_connection_attempt",
    "daily_prices_mutation",
    "raw_market_data_fetch",
    "row_payload_output",
    "stock_id_payload_output",
    "scoreSource_real_promotion"
  ];
}

function assertArray(actual, expected, label) {
  if (!Array.isArray(actual)) {
    problems.push(`${label} must be an array`);
    return;
  }
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    problems.push(`${label} mismatch`);
  }
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient/u,
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

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} must be JSON`);
    return {};
  }
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}
