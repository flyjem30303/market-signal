import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-server-only-implementation-scaffold.mjs";
const modulePath = "scripts/lib/twii-server-only-implementation-scaffold.mjs";
const docPath = "docs/TWII_SERVER_ONLY_IMPLEMENTATION_SCAFFOLD.md";
const scaffoldPath = "data/source-gates/twii-server-only-implementation-scaffold.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const moduleSource = read(modulePath);
const doc = read(docPath);
const scaffold = JSON.parse(read(scaffoldPath));
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

const output = parseJson(run.stdout ?? "", "server-only implementation scaffold stdout");
if (run.status !== 0) problems.push("server-only implementation scaffold report must exit 0");
if (output.status !== "twii_server_only_implementation_scaffold_ready_no_execution") {
  problems.push("server-only implementation scaffold status mismatch");
}
if (output.outcome !== "server_only_implementation_scaffold_ready_runtime_still_blocked") {
  problems.push("server-only implementation scaffold outcome mismatch");
}
if (output.scaffoldMode !== "server_only_implementation_scaffold_no_execution") problems.push("scaffoldMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
assertScaffold(scaffold);
assertPreparedContracts(output.preparedContracts ?? {});
assertNoExecutionState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});
assertArray(output.allowedPreparedContracts, expectedContracts(), "output.allowedPreparedContracts");
assertArray(output.blockedRuntimeActions, expectedBlockedRuntimeActions(), "output.blockedRuntimeActions");

if (pkg.scripts?.["report:twii-server-only-implementation-scaffold"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-server-only-implementation-scaffold`);
}
if (pkg.scripts?.["check:twii-server-only-implementation-scaffold"] !== "node scripts/check-twii-server-only-implementation-scaffold.mjs") {
  problems.push(`${packagePath} missing check:twii-server-only-implementation-scaffold`);
}

for (const phrase of [
  "TWII Server-Only Implementation Scaffold",
  "twii_server_only_implementation_scaffold_ready_no_execution",
  "server_only_implementation_scaffold_ready_runtime_still_blocked",
  "data/source-gates/twii-server-only-implementation-scaffold.json",
  "scripts/lib/twii-server-only-implementation-scaffold.mjs",
  "sourceScopePacketPath=data/source-gates/twii-implementation-scope-packet.json",
  "scaffoldMode=server_only_implementation_scaffold_no_execution",
  "requiredConfirmationPhrase=CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
  "executeSwitchName=TWII_ONE_ATTEMPT_EXECUTE",
  "confirmationPhraseName=TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
  "serverOnlyModuleBoundaryPrepared=true",
  "credentialPresenceShapePrepared=true",
  "boundedInsertMissingOnlyContractPrepared=true",
  "aggregateReadbackContractPrepared=true",
  "postWriteReviewContractPrepared=true",
  "supabaseClientImported=false",
  "credentialValuesRead=false",
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
  "Latest TWII server-only implementation scaffold slice",
  "docs/TWII_SERVER_ONLY_IMPLEMENTATION_SCAFFOLD.md",
  "data/source-gates/twii-server-only-implementation-scaffold.json",
  "twii_server_only_implementation_scaffold_ready_no_execution",
  "server_only_implementation_scaffold_ready_runtime_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_SERVER_ONLY_IMPLEMENTATION_SCAFFOLD.md` is `accepted` as TWII server-only implementation scaffold",
  "twii_server_only_implementation_scaffold_ready_no_execution",
  "server_only_implementation_scaffold_ready_runtime_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-server-only-implementation-scaffold.mjs",
  "name: \"twii-server-only-implementation-scaffold\"",
  "\"twii-server-only-implementation-scaffold\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [modulePath, moduleSource],
  [docPath, doc],
  [scaffoldPath, JSON.stringify(scaffold)],
  ["server-only implementation scaffold stdout", run.stdout ?? ""]
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

function assertScaffold(scaffold) {
  const expected = {
    scaffoldKind: "twii_server_only_implementation_scaffold",
    sourceScopePacketPath: "data/source-gates/twii-implementation-scope-packet.json",
    modulePath: "scripts/lib/twii-server-only-implementation-scaffold.mjs",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    scaffoldMode: "server_only_implementation_scaffold_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    sourceScopePacketAccepted: true,
    serverOnlyModuleBoundaryPrepared: true,
    credentialPresenceShapePrepared: true,
    boundedInsertMissingOnlyContractPrepared: true,
    aggregateReadbackContractPrepared: true,
    postWriteReviewContractPrepared: true,
    scaffoldDecision: "prepared_server_only_contracts_but_runtime_implementation_still_blocked",
    supabaseClientImported: false,
    credentialValuesRead: false,
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
    if (scaffold[key] !== value) problems.push(`scaffold.${key} must be ${JSON.stringify(value)}`);
  }
  assertArray(scaffold.allowedPreparedContracts, expectedContracts(), "scaffold.allowedPreparedContracts");
  assertArray(scaffold.blockedRuntimeActions, expectedBlockedRuntimeActions(), "scaffold.blockedRuntimeActions");
}

function assertPreparedContracts(contracts) {
  for (const [key, value] of Object.entries({
    serverOnlyModuleBoundaryPrepared: true,
    credentialPresenceShapePrepared: true,
    boundedInsertMissingOnlyContractPrepared: true,
    aggregateReadbackContractPrepared: true,
    postWriteReviewContractPrepared: true
  })) {
    if (contracts[key] !== value) problems.push(`preparedContracts.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertNoExecutionState(state) {
  for (const key of [
    "executeRequested",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseWritesEnabled",
    "credentialValuesRead",
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

function expectedContracts() {
  return [
    "server_only_module_boundary",
    "credential_presence_shape_only",
    "bounded_insert_missing_only_contract",
    "aggregate_readback_contract",
    "post_write_review_contract"
  ];
}

function expectedBlockedRuntimeActions() {
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
