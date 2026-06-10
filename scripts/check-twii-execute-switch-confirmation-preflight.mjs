import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-execute-switch-confirmation-preflight.mjs";
const docPath = "docs/TWII_EXECUTE_SWITCH_CONFIRMATION_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-execute-switch-confirmation-preflight.json";
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

const output = parseJson(run.stdout ?? "", "execute switch confirmation preflight stdout");
if (run.status !== 0) problems.push("execute switch confirmation preflight report must exit 0");
if (output.status !== "twii_execute_switch_confirmation_preflight_ready_no_execution") {
  problems.push("execute switch confirmation preflight status mismatch");
}
if (output.outcome !== "execute_switch_confirmation_preflight_ready_runtime_still_blocked") {
  problems.push("execute switch confirmation preflight outcome mismatch");
}
if (output.preflightMode !== "execute_switch_confirmation_shape_only_no_execution") problems.push("preflightMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
assertGate(gate);
assertPreparedState(output.preparedState ?? {});
assertNoExecutionState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});
assertPreflight(output.preflight ?? {});

if (pkg.scripts?.["report:twii-execute-switch-confirmation-preflight"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-execute-switch-confirmation-preflight`);
}
if (
  pkg.scripts?.["check:twii-execute-switch-confirmation-preflight"] !==
  "node scripts/check-twii-execute-switch-confirmation-preflight.mjs"
) {
  problems.push(`${packagePath} missing check:twii-execute-switch-confirmation-preflight`);
}

for (const phrase of [
  "TWII Execute Switch Confirmation Preflight",
  "twii_execute_switch_confirmation_preflight_ready_no_execution",
  "execute_switch_confirmation_preflight_ready_runtime_still_blocked",
  "data/source-gates/twii-execute-switch-confirmation-preflight.json",
  "sourceCredentialGatePath=data/source-gates/twii-credential-presence-shape-checker.json",
  "preflightMode=execute_switch_confirmation_shape_only_no_execution",
  "executeSwitchName=TWII_ONE_ATTEMPT_EXECUTE",
  "confirmationPhraseName=TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
  "requiredConfirmationPhrase=CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
  "outputMode=boolean_shape_match_missing_name_unsafe_count_only",
  "executeSwitchValuePrinted=false",
  "confirmationPhraseValuePrinted=false",
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
  "Latest TWII execute switch confirmation preflight slice",
  "docs/TWII_EXECUTE_SWITCH_CONFIRMATION_PREFLIGHT.md",
  "data/source-gates/twii-execute-switch-confirmation-preflight.json",
  "twii_execute_switch_confirmation_preflight_ready_no_execution",
  "execute_switch_confirmation_preflight_ready_runtime_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_EXECUTE_SWITCH_CONFIRMATION_PREFLIGHT.md` is `accepted` as TWII execute switch confirmation preflight",
  "twii_execute_switch_confirmation_preflight_ready_no_execution",
  "execute_switch_confirmation_preflight_ready_runtime_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-execute-switch-confirmation-preflight.mjs",
  "name: \"twii-execute-switch-confirmation-preflight\"",
  "\"twii-execute-switch-confirmation-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, JSON.stringify(gate)],
  ["execute switch confirmation preflight stdout", run.stdout ?? ""]
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
      missingEnvNames: output.preflight.missingEnvNames
    },
    null,
    2
  )
);

function assertGate(gate) {
  const expected = {
    gateKind: "twii_execute_switch_confirmation_preflight",
    sourceCredentialGatePath: "data/source-gates/twii-credential-presence-shape-checker.json",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    preflightMode: "execute_switch_confirmation_shape_only_no_execution",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    sourceCredentialGateAccepted: true,
    executeSwitchConfirmationPreflightPrepared: true,
    outputMode: "boolean_shape_match_missing_name_unsafe_count_only",
    executeSwitchValuePrinted: false,
    confirmationPhraseValuePrinted: false,
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
}

function assertPreparedState(state) {
  if (state.executeSwitchConfirmationPreflightPrepared !== true) {
    problems.push("preparedState.executeSwitchConfirmationPreflightPrepared must be true");
  }
  for (const key of [
    "executeSwitchValuePrinted",
    "confirmationPhraseValuePrinted",
    "credentialValuesRead",
    "secretValuesPrinted"
  ]) {
    if (state[key] !== false) problems.push(`preparedState.${key} must be false`);
  }
}

function assertPreflight(preflight) {
  for (const key of [
    "executeSwitchPresent",
    "executeSwitchEnabledShape",
    "confirmationPhrasePresent",
    "confirmationPhraseMatched",
    "valuesPrinted"
  ]) {
    if (typeof preflight[key] !== "boolean") problems.push(`preflight.${key} must be boolean`);
  }
  if (!Array.isArray(preflight.missingEnvNames)) problems.push("preflight.missingEnvNames must be an array");
  if (preflight.unsafeProblemCount !== 0) problems.push("preflight.unsafeProblemCount must be 0");
  if (preflight.valuesPrinted !== false) problems.push("preflight.valuesPrinted must be false");
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
    "executeSwitchValuePrinted",
    "confirmationPhraseValuePrinted",
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
    "executeSwitchValuePrinted",
    "confirmationPhraseValuePrinted",
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
