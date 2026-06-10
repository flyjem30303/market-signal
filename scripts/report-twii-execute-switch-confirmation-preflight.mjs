import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-execute-switch-confirmation-preflight.json";
const sourceCredentialGatePath = "data/source-gates/twii-credential-presence-shape-checker.json";
const sourceCredentialGateReportPath = "scripts/report-twii-credential-presence-shape-checker.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceCredentialGate = readJson(sourceCredentialGatePath);
const sourceCredentialGateReport = runJsonReport(
  sourceCredentialGateReportPath,
  "TWII credential presence shape checker"
);
const preflight = inspectSwitchAndConfirmation(gate);

validateGate();
validateUpstream();
validatePreflight(preflight);

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_execute_switch_confirmation_preflight_ready_no_execution" : "blocked",
  outcome: ok
    ? "execute_switch_confirmation_preflight_ready_runtime_still_blocked"
    : "execute_switch_confirmation_preflight_blocked",
  mode: "twii_execute_switch_confirmation_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceCredentialGatePath,
  sourceCredentialGateReportPath,
  sourceCredentialGateAccepted: gate.sourceCredentialGateAccepted === true,
  preflightDecision: gate.preflightDecision ?? null,
  preflightMode: gate.preflightMode ?? null,
  outputMode: gate.outputMode ?? null,
  attemptId: gate.attemptId ?? null,
  executeSwitchName: gate.executeSwitchName ?? null,
  confirmationPhraseName: gate.confirmationPhraseName ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  preflight,
  preparedState: {
    executeSwitchConfirmationPreflightPrepared: gate.executeSwitchConfirmationPreflightPrepared === true,
    executeSwitchValuePrinted: false,
    confirmationPhraseValuePrinted: false,
    credentialValuesRead: false,
    secretValuesPrinted: false
  },
  noExecutionState: {
    executeRequested: false,
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    secretValuesPrinted: false,
    executeSwitchValuePrinted: false,
    confirmationPhraseValuePrinted: false,
    dailyPricesMutated: false,
    candidateRowsAccepted: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  openPreflightBlockers: gate.openPreflightBlockers ?? [],
  currentRoute: "execute_switch_confirmation_preflight_ready_but_runtime_blocked",
  nextIfSwitchAndPhrasePass: gate.nextIfSwitchAndPhrasePass ?? null,
  nextIfSwitchOrPhraseMissing: gate.nextIfSwitchOrPhraseMissing ?? null,
  upstream: {
    credentialGateStatus: sourceCredentialGateReport.status ?? null,
    credentialGateOutcome: sourceCredentialGateReport.outcome ?? null,
    credentialGateKind: sourceCredentialGate.gateKind ?? null
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    secretValuesPrinted: false,
    executeSwitchValuePrinted: false,
    confirmationPhraseValuePrinted: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function inspectSwitchAndConfirmation(gate) {
  const executeSwitchPresent = Object.prototype.hasOwnProperty.call(process.env, gate.executeSwitchName);
  const confirmationPhrasePresent = Object.prototype.hasOwnProperty.call(process.env, gate.confirmationPhraseName);
  const executeSwitchValue = executeSwitchPresent ? process.env[gate.executeSwitchName] : undefined;
  const confirmationPhraseValue = confirmationPhrasePresent ? process.env[gate.confirmationPhraseName] : undefined;
  const missingEnvNames = [];
  if (!executeSwitchPresent) missingEnvNames.push(gate.executeSwitchName);
  if (!confirmationPhrasePresent) missingEnvNames.push(gate.confirmationPhraseName);

  return {
    executeSwitchPresent,
    executeSwitchEnabledShape: executeSwitchValue === "1" || executeSwitchValue === "true",
    confirmationPhrasePresent,
    confirmationPhraseMatched: confirmationPhraseValue === gate.requiredConfirmationPhrase,
    missingEnvNames,
    unsafeProblemCount: 0,
    valuesPrinted: false
  };
}

function validateGate() {
  const expected = {
    gateKind: "twii_execute_switch_confirmation_preflight",
    sourceCredentialGatePath,
    attemptId: "twii-one-attempt-runner-20260610-a",
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
    marketDataFetched: false,
    marketDataIngested: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    candidateRowsAccepted: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false,
    promotionAllowed: false,
    scoreSourceRealAllowed: false,
    preflightDecision: "execute_switch_confirmation_preflight_ready_but_runtime_execution_still_blocked",
    nextIfSwitchAndPhrasePass: "prepare_bounded_insert_missing_only_contract_preflight_without_connecting_supabase",
    nextIfSwitchOrPhraseMissing: "operator_sets_switch_and_confirmation_phrase_then_reruns_preflight"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (!Array.isArray(gate.openPreflightBlockers) || gate.openPreflightBlockers.length < 10) {
    problems.push("gate.openPreflightBlockers must list remaining blockers");
  }
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceCredentialGateReport.status !== "twii_credential_presence_shape_checker_ready_no_execution") {
    problems.push("source credential gate report status mismatch");
  }
  if (sourceCredentialGateReport.outcome !== "credential_presence_shape_checker_ready_runtime_still_blocked") {
    problems.push("source credential gate report outcome mismatch");
  }
  if (sourceCredentialGate.gateKind !== "twii_credential_presence_shape_checker") {
    problems.push("source credential gate kind mismatch");
  }
  if (
    sourceCredentialGate.nextIfAllRequiredNamesPresent !==
    "prepare_execute_switch_confirmation_preflight_without_connecting_supabase"
  ) {
    problems.push("source credential gate must route to execute switch confirmation preflight");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceCredentialGate[key] !== gate[key]) problems.push(`gate.${key} must match source credential gate`);
  }
}

function validatePreflight(preflight) {
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

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("gate safety must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`gate.safety.${key} must be false`);
  }
}

function runJsonReport(scriptPath, label) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${label} report must exit 0`);
  return parseJson(run.stdout ?? "", `${label} stdout`);
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} must be JSON`);
    return {};
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function safeText(value) {
  return typeof value === "string" && /^[A-Za-z0-9_.:/ -]+$/.test(value);
}
