import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-credential-presence-shape-checker.json";
const sourceScaffoldPath = "data/source-gates/twii-server-only-implementation-scaffold.json";
const sourceScaffoldReportPath = "scripts/report-twii-server-only-implementation-scaffold.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceScaffold = readJson(sourceScaffoldPath);
const sourceScaffoldReport = runJsonReport(sourceScaffoldReportPath, "TWII server-only implementation scaffold");
const envPresence = inspectEnvironmentPresence(gate.requiredEnvNames ?? []);

validateGate();
validateUpstream();
validatePresenceOutput(envPresence);

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_credential_presence_shape_checker_ready_no_execution" : "blocked",
  outcome: ok
    ? "credential_presence_shape_checker_ready_runtime_still_blocked"
    : "credential_presence_shape_checker_blocked",
  mode: "twii_credential_presence_shape_checker_no_secret_read",
  owner: "CEO/PM",
  gatePath,
  sourceScaffoldPath,
  sourceScaffoldReportPath,
  sourceScaffoldAccepted: gate.sourceScaffoldAccepted === true,
  credentialPresenceDecision: gate.credentialPresenceDecision ?? null,
  credentialCheckMode: gate.credentialCheckMode ?? null,
  outputMode: gate.outputMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  requiredEnvNames: gate.requiredEnvNames ?? [],
  envPresence,
  preparedState: {
    credentialPresenceShapeCheckerPrepared: gate.credentialPresenceShapeCheckerPrepared === true,
    credentialValueShapeChecked: false,
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
    dailyPricesMutated: false,
    candidateRowsAccepted: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  openCredentialBlockers: gate.openCredentialBlockers ?? [],
  currentRoute: "credential_presence_shape_checker_ready_but_runtime_blocked",
  nextIfAllRequiredNamesPresent: gate.nextIfAllRequiredNamesPresent ?? null,
  nextIfRequiredNamesMissing: gate.nextIfRequiredNamesMissing ?? null,
  upstream: {
    sourceScaffoldStatus: sourceScaffoldReport.status ?? null,
    sourceScaffoldOutcome: sourceScaffoldReport.outcome ?? null,
    sourceScaffoldKind: sourceScaffold.scaffoldKind ?? null
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

function inspectEnvironmentPresence(requiredEnvNames) {
  const unsafeNames = requiredEnvNames.filter((name) => !/^[A-Z0-9_]+$/.test(name));
  const missingEnvNames = requiredEnvNames.filter((name) => !Object.prototype.hasOwnProperty.call(process.env, name));
  return {
    requiredEnvCount: requiredEnvNames.length,
    presentEnvCount: requiredEnvNames.length - missingEnvNames.length,
    missingEnvNames,
    unsafeEnvNameCount: unsafeNames.length,
    unsafeProblemCount: unsafeNames.length,
    valueReadMode: "presence_key_only",
    valuesPrinted: false
  };
}

function validateGate() {
  const expected = {
    gateKind: "twii_credential_presence_shape_checker",
    sourceScaffoldPath,
    attemptId: "twii-one-attempt-runner-20260610-a",
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
    credentialPresenceDecision: "presence_shape_checker_ready_but_runtime_execution_still_blocked",
    nextIfAllRequiredNamesPresent: "prepare_execute_switch_confirmation_preflight_without_connecting_supabase",
    nextIfRequiredNamesMissing: "operator_sets_missing_environment_names_then_reruns_presence_shape_checker"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
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
  if (!Array.isArray(gate.openCredentialBlockers) || gate.openCredentialBlockers.length < 10) {
    problems.push("gate.openCredentialBlockers must list remaining blockers");
  }
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceScaffoldReport.status !== "twii_server_only_implementation_scaffold_ready_no_execution") {
    problems.push("source scaffold report status mismatch");
  }
  if (sourceScaffoldReport.outcome !== "server_only_implementation_scaffold_ready_runtime_still_blocked") {
    problems.push("source scaffold report outcome mismatch");
  }
  if (sourceScaffold.scaffoldKind !== "twii_server_only_implementation_scaffold") {
    problems.push("source scaffold kind mismatch");
  }
  if (sourceScaffold.nextIfCeoAcceptsScaffold !== "authorize_credential_presence_shape_checker_without_reading_secret_values") {
    problems.push("source scaffold must route to credential presence shape checker");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceScaffold[key] !== gate[key]) problems.push(`gate.${key} must match source scaffold`);
  }
}

function validatePresenceOutput(presence) {
  if (presence.requiredEnvCount !== 4) problems.push("presence.requiredEnvCount must be 4");
  if (!Array.isArray(presence.missingEnvNames)) problems.push("presence.missingEnvNames must be an array");
  if (presence.unsafeEnvNameCount !== 0) problems.push("presence.unsafeEnvNameCount must be 0");
  if (presence.unsafeProblemCount !== 0) problems.push("presence.unsafeProblemCount must be 0");
  if (presence.valueReadMode !== "presence_key_only") problems.push("presence.valueReadMode must be presence_key_only");
  if (presence.valuesPrinted !== false) problems.push("presence.valuesPrinted must be false");
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

function assertArray(actual, expected, label) {
  if (!Array.isArray(actual)) {
    problems.push(`${label} must be an array`);
    return;
  }
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    problems.push(`${label} mismatch`);
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
