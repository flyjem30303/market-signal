import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-separate-authorized-execution-attempt-readiness-gate.mjs";
const docPath = "docs/TWII_SEPARATE_AUTHORIZED_EXECUTION_ATTEMPT_READINESS_GATE.md";
const a1Path = "docs/A1_SEPARATE_AUTHORIZED_EXECUTION_ATTEMPT_READINESS_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_SEPARATE_AUTHORIZED_EXECUTION_ATTEMPT_READINESS_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-separate-authorized-execution-attempt-readiness-gate.json";
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
const output = parseJson(run.stdout ?? "", "separate authorized execution attempt readiness stdout");

if (run.status !== 0) problems.push("separate authorized execution attempt readiness report must exit 0");
if (output.status !== "twii_separate_authorized_execution_attempt_readiness_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "separate_authorized_execution_attempt_readiness_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "separate_authorized_execution_attempt_readiness_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentAttemptReadinessStatus !== "separate_authorized_execution_attempt_readiness_ready_waiting_external_values") problems.push("currentAttemptReadinessStatus mismatch");
if (output.nextReviewOnlyRoute !== "separate_authorized_execution_attempt_readiness_review_then_final_authorization_stopline") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_final_authorization_stopline_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.attemptReadinessValidation?.requiredAttemptReadinessFieldCount !== 11) problems.push("requiredAttemptReadinessFieldCount must be 11");
if (output.attemptReadinessValidation?.placeholderCount !== 11) problems.push("placeholderCount must be 11");
if (output.attemptReadinessValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.attemptReadinessValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.attemptReadinessValidation?.attemptAuthorizedNowCount !== 0) problems.push("attemptAuthorizedNowCount must be 0");
for (const key of ["separateAuthorizedExecutionAttemptReadinessGatePrepared", "explicitExecutionPacketPreparationReferenced", "boundedOperatorAuthorizationPacketReferenced", "serverOnlyPreExecutionIntegrationReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "requiredAttemptReadinessFieldsPrepared", "operatorDecisionPresencePrepared", "authorizationPresencePrepared", "executeSwitchPresencePrepared", "confirmationPhrasePresencePrepared", "serverOnlyCredentialPresencePrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "separateAuthorizedAttemptReadinessShapePrepared", "reviewOnly", "localOnly", "presenceOnly"]) if (output.attemptReadinessState?.[key] !== true) problems.push(`attemptReadinessState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow"]) if (output.attemptReadinessState?.[key] !== false) problems.push(`attemptReadinessState.${key} must be false`);
if (pkg.scripts?.["report:twii-separate-authorized-execution-attempt-readiness-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-separate-authorized-execution-attempt-readiness-gate"] !== "node scripts/check-twii-separate-authorized-execution-attempt-readiness-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Separate Authorized Execution Attempt Readiness Gate", "twii_separate_authorized_execution_attempt_readiness_gate_ready_no_execution", "separate_authorized_execution_attempt_readiness_ready_execution_still_blocked", "gateMode=separate_authorized_execution_attempt_readiness_fail_closed_no_execution", "separateAuthorizedExecutionAttemptReadinessGatePrepared=true", "explicitExecutionPacketPreparationReferenced=true", "boundedOperatorAuthorizationPacketReferenced=true", "requiredAttemptReadinessFieldsPrepared=true", "operatorDecisionPresencePrepared=true", "authorizationPresencePrepared=true", "executeSwitchPresencePrepared=true", "confirmationPhrasePresencePrepared=true", "serverOnlyCredentialPresencePrepared=true", "separateAuthorizedAttemptReadinessShapePrepared=true", "currentAttemptReadinessStatus=separate_authorized_execution_attempt_readiness_ready_waiting_external_values", "nextReviewOnlyRoute=separate_authorized_execution_attempt_readiness_review_then_final_authorization_stopline", "allowedNextCommandCategory=review_only_final_authorization_stopline_preparation", "externalOperatorDecisionProvidedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_separate_authorized_execution_attempt_readiness_contract_review_ready", "required attempt readiness fields", "presence-only authorization semantics", "server-only credential presence", "execute switch", "confirmation phrase", "rollback", "readback", "post-run", "duplicate proof", "blocked reasons", "next review-only route", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_separate_authorized_execution_attempt_readiness_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "scoreSource=real"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII separate authorized execution attempt readiness gate slice", "docs/TWII_SEPARATE_AUTHORIZED_EXECUTION_ATTEMPT_READINESS_GATE.md", "twii_separate_authorized_execution_attempt_readiness_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_SEPARATE_AUTHORIZED_EXECUTION_ATTEMPT_READINESS_GATE.md` is `accepted` as TWII separate authorized execution attempt readiness gate", "twii_separate_authorized_execution_attempt_readiness_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-separate-authorized-execution-attempt-readiness-gate.mjs", "name: \"twii-separate-authorized-execution-attempt-readiness-gate\"", "\"twii-separate-authorized-execution-attempt-readiness-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["separate authorized execution attempt readiness stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentAttemptReadinessStatus: output.currentAttemptReadinessStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, placeholderCount: output.attemptReadinessValidation.placeholderCount, providedNowCount: output.attemptReadinessValidation.providedNowCount, valueReadNowCount: output.attemptReadinessValidation.valueReadNowCount, attemptAuthorizedNowCount: output.attemptReadinessValidation.attemptAuthorizedNowCount, reviewOnly: output.attemptReadinessState.reviewOnly, presenceOnly: output.attemptReadinessState.presenceOnly, runnerExecutableNow: output.attemptReadinessState.runnerExecutableNow, executionAllowedNow: output.attemptReadinessState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
