import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-bounded-operator-authorization-packet-preparation-gate.mjs";
const docPath = "docs/TWII_BOUNDED_OPERATOR_AUTHORIZATION_PACKET_PREPARATION_GATE.md";
const a1Path = "docs/A1_BOUNDED_OPERATOR_AUTHORIZATION_PACKET_PREPARATION_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_BOUNDED_OPERATOR_AUTHORIZATION_PACKET_PREPARATION_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-bounded-operator-authorization-packet-preparation-gate.json";
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
const output = parseJson(run.stdout ?? "", "bounded operator authorization packet preparation stdout");

if (run.status !== 0) problems.push("bounded operator authorization packet preparation report must exit 0");
if (output.status !== "twii_bounded_operator_authorization_packet_preparation_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "bounded_operator_authorization_packet_prepared_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "bounded_operator_authorization_packet_preparation_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentAuthorizationPacketPreparationStatus !== "bounded_operator_authorization_packet_preparation_ready_waiting_external_values") problems.push("currentAuthorizationPacketPreparationStatus mismatch");
if (output.nextReviewOnlyRoute !== "bounded_operator_authorization_packet_preparation_review_then_explicit_execution_packet_preparation") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_explicit_execution_packet_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.authorizationPacketValidation?.valueClassCount !== 3) problems.push("valueClassCount must be 3");
if (output.authorizationPacketValidation?.valueClassPreparedCount !== 3) problems.push("valueClassPreparedCount must be 3");
if (output.authorizationPacketValidation?.valueClassProvidedNowCount !== 0) problems.push("valueClassProvidedNowCount must be 0");
if (output.authorizationPacketValidation?.valueClassValueReadNowCount !== 0) problems.push("valueClassValueReadNowCount must be 0");
if (output.authorizationPacketValidation?.requiredAuthorizationPacketFieldCount !== 14) problems.push("requiredAuthorizationPacketFieldCount must be 14");
if (output.authorizationPacketValidation?.placeholderCount !== 14) problems.push("placeholderCount must be 14");
if (output.authorizationPacketValidation?.fieldNameOnlyPlaceholderCount !== 14) problems.push("fieldNameOnlyPlaceholderCount must be 14");
if (output.authorizationPacketValidation?.presenceOnlyPlaceholderCount !== 14) problems.push("presenceOnlyPlaceholderCount must be 14");
if (output.authorizationPacketValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.authorizationPacketValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.authorizationPacketValidation?.authorizationAcceptedNowCount !== 0) problems.push("authorizationAcceptedNowCount must be 0");
for (const key of ["boundedOperatorAuthorizationPacketPreparationGatePrepared", "serverOnlyPreExecutionIntegrationPreparationReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "boundedAuthorizationPacketShapePrepared", "packetRequiredFieldsPrepared", "externalOnlyValuesPrepared", "pmRefreshableValuesPrepared", "neverStoreValuesPrepared", "serverOnlyCredentialPresencePlaceholderPrepared", "executeSwitchPlaceholderPrepared", "confirmationPhrasePlaceholderPrepared", "rollbackDryRunProofPlaceholderPrepared", "aggregateReadbackProofPlaceholderPrepared", "postRunReviewProofPlaceholderPrepared", "duplicateRejectionProofPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "reviewOnly", "localOnly", "shapeOnly", "presenceOnly", "fieldNameOnly", "serverOnly"]) if (output.authorizationPacketState?.[key] !== true) problems.push(`authorizationPacketState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "pmRefreshableValuesAcceptedNow", "neverStoreValuesDetectedNow", "externalOperatorDecisionProvidedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) if (output.authorizationPacketState?.[key] !== false) problems.push(`authorizationPacketState.${key} must be false`);
if (pkg.scripts?.["report:twii-bounded-operator-authorization-packet-preparation-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-bounded-operator-authorization-packet-preparation-gate"] !== "node scripts/check-twii-bounded-operator-authorization-packet-preparation-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Bounded Operator Authorization Packet Preparation Gate", "twii_bounded_operator_authorization_packet_preparation_gate_ready_no_execution", "bounded_operator_authorization_packet_prepared_execution_still_blocked", "gateMode=bounded_operator_authorization_packet_preparation_fail_closed_no_execution", "boundedOperatorAuthorizationPacketPreparationGatePrepared=true", "serverOnlyPreExecutionIntegrationPreparationReferenced=true", "serverOnlyPreExecutionChecksReferenced=true", "boundedAuthorizationPacketShapePrepared=true", "packetRequiredFieldsPrepared=true", "externalOnlyValuesPrepared=true", "pmRefreshableValuesPrepared=true", "neverStoreValuesPrepared=true", "serverOnlyCredentialPresencePlaceholderPrepared=true", "executeSwitchPlaceholderPrepared=true", "confirmationPhrasePlaceholderPrepared=true", "rollbackDryRunProofPlaceholderPrepared=true", "aggregateReadbackProofPlaceholderPrepared=true", "postRunReviewProofPlaceholderPrepared=true", "duplicateRejectionProofPlaceholderPrepared=true", "currentAuthorizationPacketPreparationStatus=bounded_operator_authorization_packet_preparation_ready_waiting_external_values", "nextReviewOnlyRoute=bounded_operator_authorization_packet_preparation_review_then_explicit_execution_packet_preparation", "allowedNextCommandCategory=review_only_explicit_execution_packet_preparation", "externalOnlyValuesProvidedNow=false", "pmRefreshableValuesAcceptedNow=false", "neverStoreValuesDetectedNow=false", "externalOperatorDecisionProvidedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_bounded_operator_authorization_packet_preparation_contract_review_ready", "bounded authorization contract", "packet required fields", "external-only values", "PM-refreshable values", "never-store values", "server-only credential presence placeholder", "execute switch placeholder", "confirmation phrase placeholder", "rollback dry-run proof placeholder", "aggregate readback proof placeholder", "post-run review proof placeholder", "duplicate rejection proof placeholder", "bounded target scope", "TWII", "daily_prices", "60 rows", "blocked reasons", "next route", "fail-closed rules", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_bounded_operator_authorization_packet_preparation_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "operator authorization packet preparation", "hard boundaries", "PM integration notes", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII bounded operator authorization packet preparation gate slice", "docs/TWII_BOUNDED_OPERATOR_AUTHORIZATION_PACKET_PREPARATION_GATE.md", "twii_bounded_operator_authorization_packet_preparation_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_BOUNDED_OPERATOR_AUTHORIZATION_PACKET_PREPARATION_GATE.md` is `accepted` as TWII bounded operator authorization packet preparation gate", "twii_bounded_operator_authorization_packet_preparation_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-bounded-operator-authorization-packet-preparation-gate.mjs", "name: \"twii-bounded-operator-authorization-packet-preparation-gate\"", "\"twii-bounded-operator-authorization-packet-preparation-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["bounded operator authorization packet preparation stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentAuthorizationPacketPreparationStatus: output.currentAuthorizationPacketPreparationStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, valueClassCount: output.authorizationPacketValidation.valueClassCount, placeholderCount: output.authorizationPacketValidation.placeholderCount, providedNowCount: output.authorizationPacketValidation.providedNowCount, valueReadNowCount: output.authorizationPacketValidation.valueReadNowCount, authorizationAcceptedNowCount: output.authorizationPacketValidation.authorizationAcceptedNowCount, reviewOnly: output.authorizationPacketState.reviewOnly, presenceOnly: output.authorizationPacketState.presenceOnly, fieldNameOnly: output.authorizationPacketState.fieldNameOnly, serverOnly: output.authorizationPacketState.serverOnly, runnerExecutableNow: output.authorizationPacketState.runnerExecutableNow, executionAllowedNow: output.authorizationPacketState.executionAllowedNow }, null, 2));

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
