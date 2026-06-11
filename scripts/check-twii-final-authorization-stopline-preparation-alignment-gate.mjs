import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-final-authorization-stopline-preparation-alignment-gate.mjs";
const docPath = "docs/TWII_FINAL_AUTHORIZATION_STOPLINE_PREPARATION_ALIGNMENT_GATE.md";
const a1Path = "docs/A1_FINAL_AUTHORIZATION_STOPLINE_PREPARATION_ALIGNMENT_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_FINAL_AUTHORIZATION_STOPLINE_PREPARATION_ALIGNMENT_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-final-authorization-stopline-preparation-alignment-gate.json";
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
const output = parseJson(run.stdout ?? "", "final authorization stopline preparation alignment stdout");

if (run.status !== 0) problems.push("final authorization stopline preparation alignment report must exit 0");
if (output.status !== "twii_final_authorization_stopline_preparation_alignment_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "final_authorization_stopline_preparation_aligned_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "final_authorization_stopline_preparation_alignment_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentStoplinePreparationStatus !== "final_authorization_stopline_preparation_alignment_ready_waiting_external_values") problems.push("currentStoplinePreparationStatus mismatch");
if (output.nextReviewOnlyRoute !== "final_authorization_stopline_preparation_alignment_review_then_explicit_operator_go_no_go_decision_preparation") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_explicit_operator_go_no_go_decision_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.stoplineValidation?.requiredStoplineFieldCount !== 13) problems.push("requiredStoplineFieldCount must be 13");
if (output.stoplineValidation?.placeholderCount !== 13) problems.push("placeholderCount must be 13");
if (output.stoplineValidation?.fieldNameOnlyPlaceholderCount !== 13) problems.push("fieldNameOnlyPlaceholderCount must be 13");
if (output.stoplineValidation?.presenceOnlyPlaceholderCount !== 13) problems.push("presenceOnlyPlaceholderCount must be 13");
if (output.stoplineValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.stoplineValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.stoplineValidation?.stoplineAcceptedNowCount !== 0) problems.push("stoplineAcceptedNowCount must be 0");
for (const key of ["finalAuthorizationStoplinePreparationAlignmentGatePrepared", "separateAuthorizedExecutionAttemptPreparationReferenced", "explicitExecutionPacketPreparationReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "finalAuthorizationStoplineShapePrepared", "requiredStoplineFieldsPrepared", "separateAttemptPreparationHandoffPrepared", "explicitExecutionPacketReferencePrepared", "goNoGoDecisionPresencePrepared", "authorizationPresencePrepared", "executeSwitchPresencePrepared", "confirmationPhrasePresencePrepared", "serverOnlyCredentialPresencePrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "reviewOnly", "localOnly", "shapeOnly", "presenceOnly", "fieldNameOnly", "serverOnly"]) if (output.stoplineState?.[key] !== true) problems.push(`stoplineState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "operatorGoNoGoAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) if (output.stoplineState?.[key] !== false) problems.push(`stoplineState.${key} must be false`);
if (pkg.scripts?.["report:twii-final-authorization-stopline-preparation-alignment-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-final-authorization-stopline-preparation-alignment-gate"] !== "node scripts/check-twii-final-authorization-stopline-preparation-alignment-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Final Authorization Stopline Preparation Alignment Gate", "twii_final_authorization_stopline_preparation_alignment_gate_ready_no_execution", "final_authorization_stopline_preparation_aligned_execution_still_blocked", "gateMode=final_authorization_stopline_preparation_alignment_fail_closed_no_execution", "finalAuthorizationStoplinePreparationAlignmentGatePrepared=true", "separateAuthorizedExecutionAttemptPreparationReferenced=true", "explicitExecutionPacketPreparationReferenced=true", "requiredStoplineFieldsPrepared=true", "separateAttemptPreparationHandoffPrepared=true", "explicitExecutionPacketReferencePrepared=true", "goNoGoDecisionPresencePrepared=true", "authorizationPresencePrepared=true", "executeSwitchPresencePrepared=true", "confirmationPhrasePresencePrepared=true", "serverOnlyCredentialPresencePrepared=true", "finalAuthorizationStoplineShapePrepared=true", "currentStoplinePreparationStatus=final_authorization_stopline_preparation_alignment_ready_waiting_external_values", "nextReviewOnlyRoute=final_authorization_stopline_preparation_alignment_review_then_explicit_operator_go_no_go_decision_preparation", "allowedNextCommandCategory=review_only_explicit_operator_go_no_go_decision_preparation", "externalOperatorDecisionProvidedNow=false", "operatorGoNoGoAcceptedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_final_authorization_stopline_preparation_alignment_contract_review_ready", "final authorization stopline contract", "separate attempt preparation handoff", "explicit execution packet reference", "go/no-go decision presence placeholder", "authorization presence placeholder", "execute switch placeholder", "confirmation phrase placeholder", "server-only credential presence placeholder", "rollback dry-run proof placeholder", "aggregate readback proof placeholder", "post-run review proof placeholder", "duplicate rejection proof placeholder", "blocked reasons", "next route", "fail-closed rules", "PM integration notes", "TWII", "daily_prices", "60 rows"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_final_authorization_stopline_preparation_alignment_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "final authorization stopline preparation alignment", "hard boundaries", "PM integration notes", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII final authorization stopline preparation alignment gate slice", "docs/TWII_FINAL_AUTHORIZATION_STOPLINE_PREPARATION_ALIGNMENT_GATE.md", "twii_final_authorization_stopline_preparation_alignment_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_FINAL_AUTHORIZATION_STOPLINE_PREPARATION_ALIGNMENT_GATE.md` is `accepted` as TWII final authorization stopline preparation alignment gate", "twii_final_authorization_stopline_preparation_alignment_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-final-authorization-stopline-preparation-alignment-gate.mjs", "name: \"twii-final-authorization-stopline-preparation-alignment-gate\"", "\"twii-final-authorization-stopline-preparation-alignment-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["final authorization stopline preparation alignment stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentStoplinePreparationStatus: output.currentStoplinePreparationStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, placeholderCount: output.stoplineValidation.placeholderCount, providedNowCount: output.stoplineValidation.providedNowCount, valueReadNowCount: output.stoplineValidation.valueReadNowCount, stoplineAcceptedNowCount: output.stoplineValidation.stoplineAcceptedNowCount, reviewOnly: output.stoplineState.reviewOnly, presenceOnly: output.stoplineState.presenceOnly, fieldNameOnly: output.stoplineState.fieldNameOnly, serverOnly: output.stoplineState.serverOnly, runnerExecutableNow: output.stoplineState.runnerExecutableNow, executionAllowedNow: output.stoplineState.executionAllowedNow }, null, 2));

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
