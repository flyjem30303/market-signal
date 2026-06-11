import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-operator-value-intake-stopline-preparation-gate.mjs";
const docPath = "docs/TWII_OPERATOR_VALUE_INTAKE_STOPLINE_PREPARATION_GATE.md";
const a1Path = "docs/A1_OPERATOR_VALUE_INTAKE_STOPLINE_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_OPERATOR_VALUE_INTAKE_STOPLINE_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-operator-value-intake-stopline-preparation-gate.json";
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
const output = parseJson(run.stdout ?? "", "operator value intake stopline preparation stdout");

if (run.status !== 0) problems.push("operator value intake stopline preparation report must exit 0");
if (output.status !== "twii_operator_value_intake_stopline_preparation_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "operator_value_intake_stopline_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "operator_value_intake_stopline_preparation_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentIntakeStoplineStatus !== "operator_value_intake_stopline_ready_waiting_external_values") problems.push("currentIntakeStoplineStatus mismatch");
if (output.nextReviewOnlyRoute !== "operator_value_intake_stopline_review_then_external_values_shape_recheck") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_external_values_shape_recheck_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.valueValidation?.valueClassCount !== 3) problems.push("valueClassCount must be 3");
if (output.valueValidation?.externalOnlyClassCount !== 1) problems.push("externalOnlyClassCount must be 1");
if (output.valueValidation?.pmRefreshableClassCount !== 1) problems.push("pmRefreshableClassCount must be 1");
if (output.valueValidation?.neverStoreClassCount !== 1) problems.push("neverStoreClassCount must be 1");
if (output.valueValidation?.repoStoredValueClassCount !== 1) problems.push("repoStoredValueClassCount must be 1");
if (output.valueValidation?.valueClassProvidedNowCount !== 0) problems.push("valueClassProvidedNowCount must be 0");
if (output.valueValidation?.valueClassReadNowCount !== 0) problems.push("valueClassReadNowCount must be 0");
if (output.valueValidation?.decisionOptionCount !== 3) problems.push("decisionOptionCount must be 3");
if (output.valueValidation?.selectedDecisionCount !== 0) problems.push("selectedDecisionCount must be 0");
if (output.valueValidation?.valueReadDecisionCount !== 0) problems.push("valueReadDecisionCount must be 0");
if (output.valueValidation?.requiredIntakeFieldCount !== 16) problems.push("requiredIntakeFieldCount must be 16");
if (output.valueValidation?.placeholderCount !== 16) problems.push("placeholderCount must be 16");
if (output.valueValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.valueValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.valueValidation?.intakeAcceptedNowCount !== 0) problems.push("intakeAcceptedNowCount must be 0");
for (const key of ["operatorValueIntakeStoplinePreparationGatePrepared", "explicitOperatorGoNoGoDecisionPreparationReferenced", "finalAuthorizationStoplineGoNoGoReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "valueClassesPrepared", "externalOnlyValuesPrepared", "pmRefreshableValuesPrepared", "neverStoreValuesPrepared", "decisionOptionsPrepared", "decisionOptionsPlaceholderOnly", "requiredIntakeFieldsPrepared", "operatorValueIntakePrerequisitesPrepared", "operatorDecisionPresencePrepared", "authorizationPresencePrepared", "executeSwitchPresencePrepared", "confirmationPhrasePresencePrepared", "serverOnlyCredentialPresencePrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "operatorValueIntakeStoplineShapePrepared", "reviewOnly", "localOnly", "presenceOnly"]) if (output.intakeState?.[key] !== true) problems.push(`intakeState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "explicitDecisionValueReadNow", "operatorValueIntakeAcceptedNow", "pmRefreshableValuesAcceptedNow", "neverStoreValuesDetectedNow", "operatorGoDecisionAcceptedNow", "operatorNoGoDecisionAcceptedNow", "operatorRepairRequiredDecisionAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) if (output.intakeState?.[key] !== false) problems.push(`intakeState.${key} must be false`);
if (pkg.scripts?.["report:twii-operator-value-intake-stopline-preparation-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-operator-value-intake-stopline-preparation-gate"] !== "node scripts/check-twii-operator-value-intake-stopline-preparation-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Operator Value Intake Stopline Preparation Gate", "twii_operator_value_intake_stopline_preparation_gate_ready_no_execution", "operator_value_intake_stopline_ready_execution_still_blocked", "gateMode=operator_value_intake_stopline_preparation_fail_closed_no_execution", "operatorValueIntakeStoplinePreparationGatePrepared=true", "explicitOperatorGoNoGoDecisionPreparationReferenced=true", "valueClassesPrepared=true", "externalOnlyValuesPrepared=true", "pmRefreshableValuesPrepared=true", "neverStoreValuesPrepared=true", "decisionOptionsPlaceholderOnly=true", "requiredIntakeFieldsPrepared=true", "operatorValueIntakePrerequisitesPrepared=true", "authorizationPresencePrepared=true", "executeSwitchPresencePrepared=true", "confirmationPhrasePresencePrepared=true", "serverOnlyCredentialPresencePrepared=true", "operatorValueIntakeStoplineShapePrepared=true", "currentIntakeStoplineStatus=operator_value_intake_stopline_ready_waiting_external_values", "nextReviewOnlyRoute=operator_value_intake_stopline_review_then_external_values_shape_recheck", "allowedNextCommandCategory=review_only_external_values_shape_recheck_preparation", "externalOperatorDecisionProvidedNow=false", "explicitDecisionValueReadNow=false", "operatorValueIntakeAcceptedNow=false", "pmRefreshableValuesAcceptedNow=false", "neverStoreValuesDetectedNow=false", "operatorGoDecisionAcceptedNow=false", "operatorNoGoDecisionAcceptedNow=false", "operatorRepairRequiredDecisionAcceptedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_operator_value_intake_stopline_contract_review_ready", "external-only values", "PM-refreshable values", "never-store values", "go", "no_go", "repair_required", "bounded target scope", "TWII", "daily_prices", "60 rows", "authorization presence", "execute switch", "confirmation phrase", "server-only credential presence", "rollback", "readback", "post-run", "duplicate", "blocked reasons", "next route", "fail-closed rules", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_operator_value_intake_stopline_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "hard boundaries", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII operator value intake stopline preparation gate slice", "docs/TWII_OPERATOR_VALUE_INTAKE_STOPLINE_PREPARATION_GATE.md", "twii_operator_value_intake_stopline_preparation_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_OPERATOR_VALUE_INTAKE_STOPLINE_PREPARATION_GATE.md` is `accepted` as TWII operator value intake stopline preparation gate", "twii_operator_value_intake_stopline_preparation_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-operator-value-intake-stopline-preparation-gate.mjs", "name: \"twii-operator-value-intake-stopline-preparation-gate\"", "\"twii-operator-value-intake-stopline-preparation-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["operator value intake stopline preparation stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentIntakeStoplineStatus: output.currentIntakeStoplineStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, valueClassCount: output.valueValidation.valueClassCount, repoStoredValueClassCount: output.valueValidation.repoStoredValueClassCount, decisionOptionCount: output.valueValidation.decisionOptionCount, selectedDecisionCount: output.valueValidation.selectedDecisionCount, placeholderCount: output.valueValidation.placeholderCount, providedNowCount: output.valueValidation.providedNowCount, valueReadNowCount: output.valueValidation.valueReadNowCount, intakeAcceptedNowCount: output.valueValidation.intakeAcceptedNowCount, reviewOnly: output.intakeState.reviewOnly, presenceOnly: output.intakeState.presenceOnly, runnerExecutableNow: output.intakeState.runnerExecutableNow, executionAllowedNow: output.intakeState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
