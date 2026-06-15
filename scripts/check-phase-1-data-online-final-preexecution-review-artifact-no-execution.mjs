import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_FINAL_PREEXECUTION_REVIEW_ARTIFACT_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const executionShape = runJson(
  "scripts/check-phase-1-data-online-execution-values-dry-run-shape-no-execution.mjs",
  "execution values dry-run shape"
);
const operatorCredentialPresence = runJson(
  "scripts/check-phase-1-data-online-operator-credential-presence-packet-no-execution.mjs",
  "operator credential presence packet"
);
const serverOnlyPresenceRecheck = runJson(
  "scripts/check-phase-1-data-online-server-only-presence-recheck-no-execution.mjs",
  "server-only presence recheck"
);
const operatorOwnedPresenceConfirmation = runJson(
  "scripts/check-phase-1-data-online-operator-owned-presence-confirmation-path-no-execution.mjs",
  "operator-owned presence confirmation path"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_final_preexecution_review_artifact_no_execution_ready"
    : "phase_1_data_online_final_preexecution_review_artifact_no_execution_blocked",
  packetMode: "final_preexecution_review_artifact_no_execution",
  operatorOwnedPresenceConfirmationStatus:
    operatorOwnedPresenceConfirmation.operatorOwnedPresenceConfirmationStatus ?? null,
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(executionShape.status, "ok", "execution values dry-run shape status");
  expect(
    executionShape.guardedStatus,
    "phase_1_data_online_execution_values_dry_run_shape_no_execution_ready",
    "execution values dry-run shape guarded status"
  );
  expect(operatorCredentialPresence.status, "ok", "operator credential presence packet status");
  expect(
    operatorCredentialPresence.guardedStatus,
    "phase_1_data_online_operator_credential_presence_packet_no_execution_ready",
    "operator credential presence packet guarded status"
  );
  expect(
    operatorCredentialPresence.operatorCredentialPacketStatus,
    "ready_for_external_operator_values_and_server_presence_check",
    "operator credential packet status"
  );
  expect(serverOnlyPresenceRecheck.status, "ok", "server-only presence recheck status");
  expect(
    serverOnlyPresenceRecheck.guardedStatus,
    "phase_1_data_online_server_only_presence_recheck_no_execution_ready",
    "server-only presence recheck guarded status"
  );
  expect(
    serverOnlyPresenceRecheck.presenceRecheckStatus,
    "prepared_waiting_external_presence",
    "server-only presence recheck status"
  );
  expect(operatorOwnedPresenceConfirmation.status, "ok", "operator-owned presence confirmation path status");
  expect(
    operatorOwnedPresenceConfirmation.guardedStatus,
    "phase_1_data_online_operator_owned_presence_confirmation_path_no_execution_ready",
    "operator-owned presence confirmation path guarded status"
  );
  expect(
    operatorOwnedPresenceConfirmation.operatorOwnedPresenceConfirmationStatus,
    "prepared_external_only",
    "operator-owned presence confirmation status"
  );
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_final_preexecution_review_artifact_no_execution_ready",
    "final_preexecution_review_artifact_no_execution",
    "operator_decision_packet_included",
    "server_preexecution_readiness_included",
    "execution_values_dry_run_shape_included",
    "operator_credential_presence_packet_included",
    "server_only_presence_recheck_included",
    "operator_owned_presence_confirmation_path_included",
    "operatorOwnedPresenceConfirmationStatus=prepared_external_only",
    "presenceConfirmationMode=boolean_presence_only_external_operator_owned",
    "prepared_waiting_external_presence",
    "ready_for_external_operator_values_and_server_presence_check",
    "rollback_plan_shape_included",
    "aggregate_readback_plan_shape_included",
    "post_run_review_checklist_included",
    "duplicate_rejection_expectation_included",
    "idempotency_key_shape_included",
    "bounded_row_scope_shape_included",
    "twii_and_etf_phase_1_missing_row_closure_only",
    "final_review_artifact_only_no_execution",
    "value_presence_only_no_values",
    "credential_value_must_not_be_printed",
    "publicDataSource=mock",
    "scoreSource=mock",
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
    packageJson.scripts?.["check:phase-1-data-online-final-preexecution-review-artifact-no-execution"] !==
    "node scripts/check-phase-1-data-online-final-preexecution-review-artifact-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-final-preexecution-review-artifact-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-final-preexecution-review-artifact-no-execution.mjs")) {
    problems.push("review gate missing final preexecution review artifact checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-final-preexecution-review-artifact-no-execution"')) {
    problems.push("focused review gate missing final preexecution review artifact checker");
  }
}

function validateBoundaries() {
  const forbidden = [
    "executeSwitchValue=",
    "confirmationPhraseValue=",
    "SUPABASE_SERVICE_ROLE_KEY=",
    "sqlExecuted=true",
    "supabaseReadAllowedNow=true",
    "supabaseWriteAllowedNow=true",
    "stagingRowsCreated=true",
    "dailyPricesMutated=true",
    "marketRowsFetched=true",
    "rawPayloadStored=true",
    "publicDataSource=supabase",
    "scoreSource=real",
    "executionAllowedNow=true"
  ];
  for (const token of forbidden) if (doc.includes(token)) problems.push(`doc contains unsafe token ${token}`);
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
