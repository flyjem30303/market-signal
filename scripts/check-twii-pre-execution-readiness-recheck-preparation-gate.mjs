import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-pre-execution-readiness-recheck-preparation-gate.mjs";
const docPath = "docs/TWII_PRE_EXECUTION_READINESS_RECHECK_PREPARATION_GATE.md";
const a1Path = "docs/A1_PRE_EXECUTION_READINESS_RECHECK_PREPARATION_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_PRE_EXECUTION_READINESS_RECHECK_PREPARATION_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-pre-execution-readiness-recheck-preparation-gate.json";
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
const output = parseJson(run.stdout ?? "", "pre-execution readiness recheck preparation stdout");

if (run.status !== 0) problems.push("pre-execution readiness recheck preparation report must exit 0");
if (output.status !== "twii_pre_execution_readiness_recheck_preparation_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "pre_execution_readiness_recheck_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "pre_execution_readiness_recheck_preparation_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentReadinessRecheckStatus !== "pre_execution_readiness_recheck_preparation_ready_waiting_external_values") problems.push("currentReadinessRecheckStatus mismatch");
if (output.nextReviewOnlyRoute !== "pre_execution_readiness_recheck_review_then_server_only_pre_execution_integration") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_server_only_pre_execution_integration_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.readinessValidation?.checklistCount !== 7) problems.push("checklistCount must be 7");
if (output.readinessValidation?.checklistPassNowCount !== 0) problems.push("checklistPassNowCount must be 0");
if (output.readinessValidation?.checklistFailNowCount !== 0) problems.push("checklistFailNowCount must be 0");
if (output.readinessValidation?.checklistValueReadNowCount !== 0) problems.push("checklistValueReadNowCount must be 0");
if (output.readinessValidation?.fieldNameOnlyChecklistCount !== 7) problems.push("fieldNameOnlyChecklistCount must be 7");
if (output.readinessValidation?.presenceOnlyChecklistCount !== 7) problems.push("presenceOnlyChecklistCount must be 7");
if (output.readinessValidation?.passFailPlaceholderCount !== 3) problems.push("passFailPlaceholderCount must be 3");
if (output.readinessValidation?.passFailSelectedNowCount !== 0) problems.push("passFailSelectedNowCount must be 0");
if (output.readinessValidation?.passFailValueReadNowCount !== 0) problems.push("passFailValueReadNowCount must be 0");
if (output.readinessValidation?.requiredReadinessFieldCount !== 12) problems.push("requiredReadinessFieldCount must be 12");
if (output.readinessValidation?.placeholderCount !== 12) problems.push("placeholderCount must be 12");
if (output.readinessValidation?.fieldNameOnlyPlaceholderCount !== 12) problems.push("fieldNameOnlyPlaceholderCount must be 12");
if (output.readinessValidation?.presenceOnlyPlaceholderCount !== 12) problems.push("presenceOnlyPlaceholderCount must be 12");
if (output.readinessValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.readinessValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.readinessValidation?.readinessAcceptedNowCount !== 0) problems.push("readinessAcceptedNowCount must be 0");
for (const key of ["preExecutionReadinessRecheckPreparationGatePrepared", "externalValuesShapeRecheckPreparationReferenced", "operatorValueIntakeStoplinePreparationReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "readinessChecklistShapePrepared", "presenceOnlyPassFailPlaceholdersPrepared", "fieldNameOnlyContractPrepared", "serverOnlyCredentialPresenceRecheckPlaceholderPrepared", "executeSwitchPresenceRecheckPlaceholderPrepared", "confirmationPhrasePresenceRecheckPlaceholderPrepared", "rollbackDryRunProofPlaceholderPrepared", "aggregateReadbackProofPlaceholderPrepared", "postRunReviewProofPlaceholderPrepared", "duplicateRejectionProofPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "preExecutionReadinessRecheckShapePrepared", "reviewOnly", "localOnly", "shapeOnly", "presenceOnly", "fieldNameOnly"]) if (output.readinessState?.[key] !== true) problems.push(`readinessState.${key} must be true`);
for (const key of ["externalValuesProvidedNow", "readinessRecheckAcceptedNow", "readinessPassAcceptedNow", "readinessFailAcceptedNow", "fieldValueReadNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) if (output.readinessState?.[key] !== false) problems.push(`readinessState.${key} must be false`);
if (pkg.scripts?.["report:twii-pre-execution-readiness-recheck-preparation-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-pre-execution-readiness-recheck-preparation-gate"] !== "node scripts/check-twii-pre-execution-readiness-recheck-preparation-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Pre-Execution Readiness Recheck Preparation Gate", "twii_pre_execution_readiness_recheck_preparation_gate_ready_no_execution", "pre_execution_readiness_recheck_ready_execution_still_blocked", "gateMode=pre_execution_readiness_recheck_preparation_fail_closed_no_execution", "preExecutionReadinessRecheckPreparationGatePrepared=true", "externalValuesShapeRecheckPreparationReferenced=true", "readinessChecklistShapePrepared=true", "presenceOnlyPassFailPlaceholdersPrepared=true", "fieldNameOnlyContractPrepared=true", "serverOnlyCredentialPresenceRecheckPlaceholderPrepared=true", "executeSwitchPresenceRecheckPlaceholderPrepared=true", "confirmationPhrasePresenceRecheckPlaceholderPrepared=true", "rollbackDryRunProofPlaceholderPrepared=true", "aggregateReadbackProofPlaceholderPrepared=true", "postRunReviewProofPlaceholderPrepared=true", "duplicateRejectionProofPlaceholderPrepared=true", "preExecutionReadinessRecheckShapePrepared=true", "fieldNameOnly=true", "shapeOnly=true", "presenceOnly=true", "currentReadinessRecheckStatus=pre_execution_readiness_recheck_preparation_ready_waiting_external_values", "nextReviewOnlyRoute=pre_execution_readiness_recheck_review_then_server_only_pre_execution_integration", "allowedNextCommandCategory=review_only_server_only_pre_execution_integration_preparation", "externalValuesProvidedNow=false", "readinessRecheckAcceptedNow=false", "readinessPassAcceptedNow=false", "readinessFailAcceptedNow=false", "fieldValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_pre_execution_readiness_recheck_preparation_contract_review_ready", "readiness checklist shape", "field-name-only rules", "presence-only rules", "pass/fail placeholders", "bounded target scope", "TWII", "daily_prices", "60 rows", "server-only credential presence recheck placeholder", "execute switch presence recheck placeholder", "confirmation phrase presence recheck placeholder", "rollback dry-run proof placeholder", "aggregate readback proof placeholder", "post-run review proof placeholder", "duplicate rejection proof placeholder", "blocked reasons", "next route", "fail-closed rules", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_pre_execution_readiness_recheck_preparation_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "hard boundaries", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII pre-execution readiness recheck preparation gate slice", "docs/TWII_PRE_EXECUTION_READINESS_RECHECK_PREPARATION_GATE.md", "twii_pre_execution_readiness_recheck_preparation_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_PRE_EXECUTION_READINESS_RECHECK_PREPARATION_GATE.md` is `accepted` as TWII pre-execution readiness recheck preparation gate", "twii_pre_execution_readiness_recheck_preparation_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-pre-execution-readiness-recheck-preparation-gate.mjs", "name: \"twii-pre-execution-readiness-recheck-preparation-gate\"", "\"twii-pre-execution-readiness-recheck-preparation-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["pre-execution readiness recheck preparation stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentReadinessRecheckStatus: output.currentReadinessRecheckStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, checklistCount: output.readinessValidation.checklistCount, passFailPlaceholderCount: output.readinessValidation.passFailPlaceholderCount, placeholderCount: output.readinessValidation.placeholderCount, providedNowCount: output.readinessValidation.providedNowCount, valueReadNowCount: output.readinessValidation.valueReadNowCount, readinessAcceptedNowCount: output.readinessValidation.readinessAcceptedNowCount, reviewOnly: output.readinessState.reviewOnly, presenceOnly: output.readinessState.presenceOnly, fieldNameOnly: output.readinessState.fieldNameOnly, runnerExecutableNow: output.readinessState.runnerExecutableNow, executionAllowedNow: output.readinessState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
