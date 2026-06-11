import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-final-authorization-stopline-go-no-go-gate.mjs";
const docPath = "docs/TWII_FINAL_AUTHORIZATION_STOPLINE_GO_NO_GO_GATE.md";
const a1Path = "docs/A1_FINAL_AUTHORIZATION_STOPLINE_GO_NO_GO_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_FINAL_AUTHORIZATION_STOPLINE_GO_NO_GO_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-final-authorization-stopline-go-no-go-gate.json";
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
const output = parseJson(run.stdout ?? "", "final authorization stopline go/no-go stdout");

if (run.status !== 0) problems.push("final authorization stopline go/no-go report must exit 0");
if (output.status !== "twii_final_authorization_stopline_go_no_go_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "final_authorization_stopline_go_no_go_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "final_authorization_stopline_go_no_go_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentGoNoGoStatus !== "final_authorization_stopline_go_no_go_ready_waiting_external_values") problems.push("currentGoNoGoStatus mismatch");
if (output.nextReviewOnlyRoute !== "final_authorization_stopline_review_then_explicit_operator_go_no_go_decision") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_explicit_operator_go_no_go_decision_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.goNoGoValidation?.requiredGoNoGoFieldCount !== 11) problems.push("requiredGoNoGoFieldCount must be 11");
if (output.goNoGoValidation?.placeholderCount !== 11) problems.push("placeholderCount must be 11");
if (output.goNoGoValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.goNoGoValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.goNoGoValidation?.goAcceptedNowCount !== 0) problems.push("goAcceptedNowCount must be 0");
for (const key of ["finalAuthorizationStoplineGoNoGoGatePrepared", "separateAuthorizedExecutionAttemptReadinessReferenced", "explicitExecutionPacketPreparationReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "requiredGoNoGoFieldsPrepared", "goNoGoPrerequisitesPrepared", "operatorDecisionPresencePrepared", "authorizationPresencePrepared", "executeSwitchPresencePrepared", "confirmationPhrasePresencePrepared", "serverOnlyCredentialPresencePrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "finalAuthorizationStoplineShapePrepared", "reviewOnly", "localOnly", "presenceOnly"]) if (output.goNoGoState?.[key] !== true) problems.push(`goNoGoState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "operatorGoNoGoAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) if (output.goNoGoState?.[key] !== false) problems.push(`goNoGoState.${key} must be false`);
if (pkg.scripts?.["report:twii-final-authorization-stopline-go-no-go-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-final-authorization-stopline-go-no-go-gate"] !== "node scripts/check-twii-final-authorization-stopline-go-no-go-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Final Authorization Stopline Go/No-Go Gate", "twii_final_authorization_stopline_go_no_go_gate_ready_no_execution", "final_authorization_stopline_go_no_go_ready_execution_still_blocked", "gateMode=final_authorization_stopline_go_no_go_fail_closed_no_execution", "finalAuthorizationStoplineGoNoGoGatePrepared=true", "separateAuthorizedExecutionAttemptReadinessReferenced=true", "explicitExecutionPacketPreparationReferenced=true", "requiredGoNoGoFieldsPrepared=true", "goNoGoPrerequisitesPrepared=true", "operatorDecisionPresencePrepared=true", "authorizationPresencePrepared=true", "executeSwitchPresencePrepared=true", "confirmationPhrasePresencePrepared=true", "serverOnlyCredentialPresencePrepared=true", "finalAuthorizationStoplineShapePrepared=true", "currentGoNoGoStatus=final_authorization_stopline_go_no_go_ready_waiting_external_values", "nextReviewOnlyRoute=final_authorization_stopline_review_then_explicit_operator_go_no_go_decision", "allowedNextCommandCategory=review_only_explicit_operator_go_no_go_decision_preparation", "externalOperatorDecisionProvidedNow=false", "operatorGoNoGoAcceptedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_final_authorization_stopline_go_no_go_contract_review_ready", "go/no-go prerequisites", "bounded target scope", "TWII", "daily_prices", "60 rows", "server-only credential presence", "execute switch", "confirmation phrase", "rollback dry-run", "aggregate readback", "post-run review", "candidate duplicate rejection", "blocked reasons", "next route", "fail-closed rules", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_final_authorization_stopline_go_no_go_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "hard boundaries", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII final authorization stopline go/no-go gate slice", "docs/TWII_FINAL_AUTHORIZATION_STOPLINE_GO_NO_GO_GATE.md", "twii_final_authorization_stopline_go_no_go_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_FINAL_AUTHORIZATION_STOPLINE_GO_NO_GO_GATE.md` is `accepted` as TWII final authorization stopline go/no-go gate", "twii_final_authorization_stopline_go_no_go_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-final-authorization-stopline-go-no-go-gate.mjs", "name: \"twii-final-authorization-stopline-go-no-go-gate\"", "\"twii-final-authorization-stopline-go-no-go-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["final authorization stopline go/no-go stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentGoNoGoStatus: output.currentGoNoGoStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, placeholderCount: output.goNoGoValidation.placeholderCount, providedNowCount: output.goNoGoValidation.providedNowCount, valueReadNowCount: output.goNoGoValidation.valueReadNowCount, goAcceptedNowCount: output.goNoGoValidation.goAcceptedNowCount, reviewOnly: output.goNoGoState.reviewOnly, presenceOnly: output.goNoGoState.presenceOnly, runnerExecutableNow: output.goNoGoState.runnerExecutableNow, executionAllowedNow: output.goNoGoState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
