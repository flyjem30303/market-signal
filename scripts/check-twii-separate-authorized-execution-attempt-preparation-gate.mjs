import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-separate-authorized-execution-attempt-preparation-gate.mjs";
const docPath = "docs/TWII_SEPARATE_AUTHORIZED_EXECUTION_ATTEMPT_PREPARATION_GATE.md";
const a1Path = "docs/A1_SEPARATE_AUTHORIZED_EXECUTION_ATTEMPT_PREPARATION_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_SEPARATE_AUTHORIZED_EXECUTION_ATTEMPT_PREPARATION_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-separate-authorized-execution-attempt-preparation-gate.json";
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
const output = parseJson(run.stdout ?? "", "separate authorized execution attempt preparation stdout");

if (run.status !== 0) problems.push("separate authorized execution attempt preparation report must exit 0");
if (output.status !== "twii_separate_authorized_execution_attempt_preparation_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "separate_authorized_execution_attempt_prepared_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "separate_authorized_execution_attempt_preparation_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentAttemptPreparationStatus !== "separate_authorized_execution_attempt_preparation_ready_waiting_external_values") problems.push("currentAttemptPreparationStatus mismatch");
if (output.nextReviewOnlyRoute !== "separate_authorized_execution_attempt_preparation_review_then_final_authorization_stopline_preparation") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_final_authorization_stopline_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.attemptValidation?.requiredAttemptFieldCount !== 13) problems.push("requiredAttemptFieldCount must be 13");
if (output.attemptValidation?.placeholderCount !== 13) problems.push("placeholderCount must be 13");
if (output.attemptValidation?.fieldNameOnlyPlaceholderCount !== 13) problems.push("fieldNameOnlyPlaceholderCount must be 13");
if (output.attemptValidation?.presenceOnlyPlaceholderCount !== 13) problems.push("presenceOnlyPlaceholderCount must be 13");
if (output.attemptValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.attemptValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.attemptValidation?.attemptAuthorizedNowCount !== 0) problems.push("attemptAuthorizedNowCount must be 0");
for (const key of ["separateAuthorizedExecutionAttemptPreparationGatePrepared", "explicitExecutionPacketPreparationReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "separateAuthorizedAttemptShapePrepared", "requiredAttemptFieldsPrepared", "explicitExecutionPacketHandoffPrepared", "operatorDecisionPresencePrepared", "authorizationPresencePrepared", "executeSwitchPresencePrepared", "confirmationPhrasePresencePrepared", "serverOnlyCredentialPresencePrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "reviewOnly", "localOnly", "shapeOnly", "presenceOnly", "fieldNameOnly", "serverOnly"]) if (output.attemptState?.[key] !== true) problems.push(`attemptState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) if (output.attemptState?.[key] !== false) problems.push(`attemptState.${key} must be false`);
if (pkg.scripts?.["report:twii-separate-authorized-execution-attempt-preparation-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-separate-authorized-execution-attempt-preparation-gate"] !== "node scripts/check-twii-separate-authorized-execution-attempt-preparation-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Separate Authorized Execution Attempt Preparation Gate", "twii_separate_authorized_execution_attempt_preparation_gate_ready_no_execution", "separate_authorized_execution_attempt_prepared_execution_still_blocked", "gateMode=separate_authorized_execution_attempt_preparation_fail_closed_no_execution", "separateAuthorizedExecutionAttemptPreparationGatePrepared=true", "explicitExecutionPacketPreparationReferenced=true", "requiredAttemptFieldsPrepared=true", "explicitExecutionPacketHandoffPrepared=true", "operatorDecisionPresencePrepared=true", "authorizationPresencePrepared=true", "executeSwitchPresencePrepared=true", "confirmationPhrasePresencePrepared=true", "serverOnlyCredentialPresencePrepared=true", "separateAuthorizedAttemptShapePrepared=true", "currentAttemptPreparationStatus=separate_authorized_execution_attempt_preparation_ready_waiting_external_values", "nextReviewOnlyRoute=separate_authorized_execution_attempt_preparation_review_then_final_authorization_stopline_preparation", "allowedNextCommandCategory=review_only_final_authorization_stopline_preparation", "externalOperatorDecisionProvidedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_separate_authorized_execution_attempt_preparation_contract_review_ready", "separate authorized execution attempt contract", "required attempt fields", "explicit execution packet handoff", "bounded target scope", "TWII", "daily_prices", "60 rows", "server-only credential presence placeholder", "execute switch placeholder", "confirmation phrase placeholder", "rollback dry-run proof placeholder", "aggregate readback proof placeholder", "post-run review proof placeholder", "duplicate rejection proof placeholder", "blocked reasons", "next route", "fail-closed rules", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_separate_authorized_execution_attempt_preparation_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "separate authorized execution attempt preparation", "hard boundaries", "PM integration notes", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII separate authorized execution attempt preparation gate slice", "docs/TWII_SEPARATE_AUTHORIZED_EXECUTION_ATTEMPT_PREPARATION_GATE.md", "twii_separate_authorized_execution_attempt_preparation_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_SEPARATE_AUTHORIZED_EXECUTION_ATTEMPT_PREPARATION_GATE.md` is `accepted` as TWII separate authorized execution attempt preparation gate", "twii_separate_authorized_execution_attempt_preparation_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-separate-authorized-execution-attempt-preparation-gate.mjs", "name: \"twii-separate-authorized-execution-attempt-preparation-gate\"", "\"twii-separate-authorized-execution-attempt-preparation-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["separate authorized execution attempt preparation stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentAttemptPreparationStatus: output.currentAttemptPreparationStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, placeholderCount: output.attemptValidation.placeholderCount, providedNowCount: output.attemptValidation.providedNowCount, valueReadNowCount: output.attemptValidation.valueReadNowCount, attemptAuthorizedNowCount: output.attemptValidation.attemptAuthorizedNowCount, reviewOnly: output.attemptState.reviewOnly, presenceOnly: output.attemptState.presenceOnly, fieldNameOnly: output.attemptState.fieldNameOnly, serverOnly: output.attemptState.serverOnly, runnerExecutableNow: output.attemptState.runnerExecutableNow, executionAllowedNow: output.attemptState.executionAllowedNow }, null, 2));

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
