import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-server-only-pre-execution-integration-preparation-gate.mjs";
const docPath = "docs/TWII_SERVER_ONLY_PRE_EXECUTION_INTEGRATION_PREPARATION_GATE.md";
const a1Path = "docs/A1_SERVER_ONLY_PRE_EXECUTION_INTEGRATION_PREPARATION_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_SERVER_ONLY_PRE_EXECUTION_INTEGRATION_PREPARATION_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-server-only-pre-execution-integration-preparation-gate.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const a1 = read(a1Path);
const a2 = read(a2Path);
const gateText = read(gatePath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "server-only pre-execution integration preparation stdout");

if (run.status !== 0) problems.push("server-only pre-execution integration preparation report must exit 0");
if (output.status !== "twii_server_only_pre_execution_integration_preparation_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "server_only_pre_execution_integration_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "server_only_pre_execution_integration_preparation_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentIntegrationStatus !== "server_only_pre_execution_integration_preparation_ready_waiting_external_values") problems.push("currentIntegrationStatus mismatch");
if (output.nextReviewOnlyRoute !== "server_only_pre_execution_integration_review_then_bounded_operator_authorization_packet") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_bounded_operator_authorization_packet_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.integrationValidation?.checklistCount !== 8) problems.push("checklistCount must be 8");
if (output.integrationValidation?.integratedNowCount !== 0) problems.push("integratedNowCount must be 0");
if (output.integrationValidation?.checklistValueReadNowCount !== 0) problems.push("checklistValueReadNowCount must be 0");
if (output.integrationValidation?.fieldNameOnlyChecklistCount !== 8) problems.push("fieldNameOnlyChecklistCount must be 8");
if (output.integrationValidation?.presenceOnlyChecklistCount !== 8) problems.push("presenceOnlyChecklistCount must be 8");
if (output.integrationValidation?.requiredIntegrationFieldCount !== 12) problems.push("requiredIntegrationFieldCount must be 12");
if (output.integrationValidation?.placeholderCount !== 12) problems.push("placeholderCount must be 12");
if (output.integrationValidation?.fieldNameOnlyPlaceholderCount !== 12) problems.push("fieldNameOnlyPlaceholderCount must be 12");
if (output.integrationValidation?.presenceOnlyPlaceholderCount !== 12) problems.push("presenceOnlyPlaceholderCount must be 12");
if (output.integrationValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.integrationValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.integrationValidation?.integrationAcceptedNowCount !== 0) problems.push("integrationAcceptedNowCount must be 0");
for (const key of ["serverOnlyPreExecutionIntegrationPreparationGatePrepared", "preExecutionReadinessRecheckPreparationReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "serverOnlyIntegrationShapePrepared", "readinessChecklistHandoffPrepared", "presenceOnlyIntegrationPlaceholdersPrepared", "serverOnlyBoundaryAssertionsPrepared", "serverOnlyCredentialPresenceIntegrationPlaceholderPrepared", "executeSwitchPresenceIntegrationPlaceholderPrepared", "confirmationPhrasePresenceIntegrationPlaceholderPrepared", "rollbackDryRunProofPlaceholderPrepared", "aggregateReadbackProofPlaceholderPrepared", "postRunReviewProofPlaceholderPrepared", "duplicateRejectionProofPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "reviewOnly", "localOnly", "shapeOnly", "presenceOnly", "fieldNameOnly", "serverOnly"]) if (output.integrationState?.[key] !== true) problems.push(`integrationState.${key} must be true`);
for (const key of ["externalValuesProvidedNow", "serverOnlyIntegrationAcceptedNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) if (output.integrationState?.[key] !== false) problems.push(`integrationState.${key} must be false`);
if (pkg.scripts?.["report:twii-server-only-pre-execution-integration-preparation-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-server-only-pre-execution-integration-preparation-gate"] !== "node scripts/check-twii-server-only-pre-execution-integration-preparation-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Server-Only Pre-Execution Integration Preparation Gate", "twii_server_only_pre_execution_integration_preparation_gate_ready_no_execution", "server_only_pre_execution_integration_ready_execution_still_blocked", "gateMode=server_only_pre_execution_integration_preparation_fail_closed_no_execution", "serverOnlyPreExecutionIntegrationPreparationGatePrepared=true", "preExecutionReadinessRecheckPreparationReferenced=true", "serverOnlyPreExecutionChecksReferenced=true", "serverOnlyIntegrationShapePrepared=true", "readinessChecklistHandoffPrepared=true", "presenceOnlyIntegrationPlaceholdersPrepared=true", "serverOnlyBoundaryAssertionsPrepared=true", "serverOnlyCredentialPresenceIntegrationPlaceholderPrepared=true", "executeSwitchPresenceIntegrationPlaceholderPrepared=true", "confirmationPhrasePresenceIntegrationPlaceholderPrepared=true", "rollbackDryRunProofPlaceholderPrepared=true", "aggregateReadbackProofPlaceholderPrepared=true", "postRunReviewProofPlaceholderPrepared=true", "duplicateRejectionProofPlaceholderPrepared=true", "currentIntegrationStatus=server_only_pre_execution_integration_preparation_ready_waiting_external_values", "nextReviewOnlyRoute=server_only_pre_execution_integration_review_then_bounded_operator_authorization_packet", "allowedNextCommandCategory=review_only_bounded_operator_authorization_packet_preparation", "externalValuesProvidedNow=false", "serverOnlyIntegrationAcceptedNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_server_only_pre_execution_integration_preparation_contract_review_ready", "server-only boundary", "readiness checklist handoff", "presence-only rules", "field-name-only rules", "bounded target scope", "TWII", "daily_prices", "60 rows", "server-only credential presence integration placeholder", "execute switch presence integration placeholder", "confirmation phrase presence integration placeholder", "rollback dry-run proof placeholder", "aggregate readback proof placeholder", "post-run review proof placeholder", "duplicate rejection proof placeholder", "blocked reasons", "next route", "fail-closed rules", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_server_only_pre_execution_integration_preparation_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "hard boundaries", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII server-only pre-execution integration preparation gate slice", "docs/TWII_SERVER_ONLY_PRE_EXECUTION_INTEGRATION_PREPARATION_GATE.md", "twii_server_only_pre_execution_integration_preparation_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_SERVER_ONLY_PRE_EXECUTION_INTEGRATION_PREPARATION_GATE.md` is `accepted` as TWII server-only pre-execution integration preparation gate", "twii_server_only_pre_execution_integration_preparation_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-server-only-pre-execution-integration-preparation-gate.mjs", "name: \"twii-server-only-pre-execution-integration-preparation-gate\"", "\"twii-server-only-pre-execution-integration-preparation-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["server-only pre-execution integration preparation stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentIntegrationStatus: output.currentIntegrationStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, checklistCount: output.integrationValidation.checklistCount, placeholderCount: output.integrationValidation.placeholderCount, providedNowCount: output.integrationValidation.providedNowCount, valueReadNowCount: output.integrationValidation.valueReadNowCount, integrationAcceptedNowCount: output.integrationValidation.integrationAcceptedNowCount, reviewOnly: output.integrationState.reviewOnly, presenceOnly: output.integrationState.presenceOnly, fieldNameOnly: output.integrationState.fieldNameOnly, serverOnly: output.integrationState.serverOnly, runnerExecutableNow: output.integrationState.runnerExecutableNow, executionAllowedNow: output.integrationState.executionAllowedNow }, null, 2));

function forbiddenPatterns() {
  return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/];
}
function includesCaseInsensitive(text, phrase) {
  return text.toLowerCase().includes(phrase.toLowerCase());
}
function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}
function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} is not JSON: ${error.message}`);
    return {};
  }
}
