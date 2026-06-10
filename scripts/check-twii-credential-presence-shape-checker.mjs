import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-credential-presence-shape-checker.mjs";
const docPath = "docs/TWII_CREDENTIAL_PRESENCE_SHAPE_CHECKER.md";
const gatePath = "data/source-gates/twii-credential-presence-shape-checker.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const gate = JSON.parse(read(gatePath));
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

const output = parseJson(run.stdout ?? "", "credential presence shape checker stdout");
if (run.status !== 0) problems.push("credential presence shape checker report must exit 0");
if (output.status !== "twii_credential_presence_shape_checker_ready_no_execution") {
  problems.push("credential presence shape checker status mismatch");
}
if (output.outcome !== "credential_presence_shape_checker_ready_runtime_still_blocked") {
  problems.push("credential presence shape checker outcome mismatch");
}
if (output.credentialCheckMode !== "presence_shape_only_no_secret_read") problems.push("credentialCheckMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
assertGate(gate);
assertPreparedState(output.preparedState ?? {});
assertNoExecutionState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});
assertPresence(output.envPresence ?? {});

if (pkg.scripts?.["report:twii-credential-presence-shape-checker"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-credential-presence-shape-checker`);
}
if (pkg.scripts?.["check:twii-credential-presence-shape-checker"] !== "node scripts/check-twii-credential-presence-shape-checker.mjs") {
  problems.push(`${packagePath} missing check:twii-credential-presence-shape-checker`);
}

for (const phrase of [
  "TWII Credential Presence Shape Checker",
  "twii_credential_presence_shape_checker_ready_no_execution",
  "credential_presence_shape_checker_ready_runtime_still_blocked",
  "data/source-gates/twii-credential-presence-shape-checker.json",
  "sourceScaffoldPath=data/source-gates/twii-server-only-implementation-scaffold.json",
  "credentialCheckMode=presence_shape_only_no_secret_read",
  "requiredEnvNames=[NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TWII_ONE_ATTEMPT_EXECUTE, TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE]",
  "outputMode=boolean_shape_missing_name_unsafe_count_only",
  "credentialPresenceShapeCheckerPrepared=true",
  "credentialValuesRead=false",
  "secretValuesPrinted=false",
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
  "Latest TWII credential presence shape checker slice",
  "docs/TWII_CREDENTIAL_PRESENCE_SHAPE_CHECKER.md",
  "data/source-gates/twii-credential-presence-shape-checker.json",
  "twii_credential_presence_shape_checker_ready_no_execution",
  "credential_presence_shape_checker_ready_runtime_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_CREDENTIAL_PRESENCE_SHAPE_CHECKER.md` is `accepted` as TWII credential presence shape checker",
  "twii_credential_presence_shape_checker_ready_no_execution",
  "credential_presence_shape_checker_ready_runtime_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-credential-presence-shape-checker.mjs",
  "name: \"twii-credential-presence-shape-checker\"",
  "\"twii-credential-presence-shape-checker\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, JSON.stringify(gate)],
  ["credential presence shape checker stdout", run.stdout ?? ""]
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
      implementationAllowedNow: output.noExecutionState.implementationAllowedNow,
      missingEnvNames: output.envPresence.missingEnvNames
    },
    null,
    2
  )
);

function assertGate(gate) {
  const expected = {
    gateKind: "twii_credential_presence_shape_checker",
    sourceScaffoldPath: "data/source-gates/twii-server-only-implementation-scaffold.json",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    credentialCheckMode: "presence_shape_only_no_secret_read",
    outputMode: "boolean_shape_missing_name_unsafe_count_only",
    sourceScaffoldAccepted: true,
    credentialPresenceShapeCheckerPrepared: true,
    credentialValueShapeChecked: false,
    credentialValuesRead: false,
    secretValuesPrinted: false,
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
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  assertArray(
    gate.requiredEnvNames,
    [
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "TWII_ONE_ATTEMPT_EXECUTE",
      "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE"
    ],
    "gate.requiredEnvNames"
  );
}

function assertPreparedState(state) {
  if (state.credentialPresenceShapeCheckerPrepared !== true) {
    problems.push("preparedState.credentialPresenceShapeCheckerPrepared must be true");
  }
  for (const key of ["credentialValueShapeChecked", "credentialValuesRead", "secretValuesPrinted"]) {
    if (state[key] !== false) problems.push(`preparedState.${key} must be false`);
  }
}

function assertPresence(presence) {
  if (presence.requiredEnvCount !== 4) problems.push("envPresence.requiredEnvCount must be 4");
  if (!Array.isArray(presence.missingEnvNames)) problems.push("envPresence.missingEnvNames must be an array");
  if (presence.unsafeEnvNameCount !== 0) problems.push("envPresence.unsafeEnvNameCount must be 0");
  if (presence.unsafeProblemCount !== 0) problems.push("envPresence.unsafeProblemCount must be 0");
  if (presence.valueReadMode !== "presence_key_only") problems.push("envPresence.valueReadMode must be presence_key_only");
  if (presence.valuesPrinted !== false) problems.push("envPresence.valuesPrinted must be false");
}

function assertNoExecutionState(state) {
  for (const key of [
    "executeRequested",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseWritesEnabled",
    "credentialValuesRead",
    "secretValuesPrinted",
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
    "secretValuesPrinted",
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
