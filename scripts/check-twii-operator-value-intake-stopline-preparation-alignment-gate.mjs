import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-operator-value-intake-stopline-preparation-alignment-gate.mjs";
const docPath = "docs/TWII_OPERATOR_VALUE_INTAKE_STOPLINE_PREPARATION_ALIGNMENT_GATE.md";
const a1Path = "docs/A1_OPERATOR_VALUE_INTAKE_STOPLINE_PREPARATION_ALIGNMENT_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_OPERATOR_VALUE_INTAKE_STOPLINE_PREPARATION_ALIGNMENT_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-operator-value-intake-stopline-preparation-alignment-gate.json";
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
const output = parseJson(run.stdout ?? "", "operator value intake stopline preparation alignment stdout");

if (run.status !== 0) problems.push("operator value intake stopline preparation alignment report must exit 0");
if (output.status !== "twii_operator_value_intake_stopline_preparation_alignment_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "operator_value_intake_stopline_preparation_aligned_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "operator_value_intake_stopline_preparation_alignment_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentIntakeStoplineAlignmentStatus !== "operator_value_intake_stopline_preparation_alignment_ready_waiting_external_values") problems.push("currentIntakeStoplineAlignmentStatus mismatch");
if (output.nextReviewOnlyRoute !== "operator_value_intake_stopline_preparation_alignment_review_then_external_values_shape_recheck_preparation") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_external_values_shape_recheck_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.intakeValidation?.valueClassCount !== 3) problems.push("valueClassCount must be 3");
if (output.intakeValidation?.valueClassProvidedNowCount !== 0) problems.push("valueClassProvidedNowCount must be 0");
if (output.intakeValidation?.requiredIntakeFieldCount !== 16) problems.push("requiredIntakeFieldCount must be 16");
if (output.intakeValidation?.placeholderCount !== 16) problems.push("placeholderCount must be 16");
if (output.intakeValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.intakeValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.intakeValidation?.intakeAcceptedNowCount !== 0) problems.push("intakeAcceptedNowCount must be 0");
for (const key of ["operatorValueIntakeStoplinePreparationAlignmentGatePrepared", "explicitOperatorGoNoGoDecisionPreparationAlignmentReferenced", "finalAuthorizationStoplinePreparationAlignmentReferenced", "operatorValueIntakeStoplineShapePrepared", "valueClassesPrepared", "valueClassPlaceholdersPrepared", "externalOnlyValuesPrepared", "pmRefreshableValuesPrepared", "neverStoreValuesPrepared", "requiredIntakeFieldsPrepared", "operatorValueIntakePrerequisitesPrepared", "authorizationPresencePrepared", "executeSwitchPresencePrepared", "confirmationPhrasePresencePrepared", "serverOnlyCredentialPresencePrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "reviewOnly", "localOnly", "shapeOnly", "presenceOnly", "fieldNameOnly", "serverOnly"]) if (output.intakeState?.[key] !== true) problems.push(`intakeState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "pmRefreshableValuesAcceptedNow", "neverStoreValuesDetectedNow", "operatorValueIntakeAcceptedNow", "authorizationValueReadNow", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow"]) if (output.intakeState?.[key] !== false) problems.push(`intakeState.${key} must be false`);
if (pkg.scripts?.["report:twii-operator-value-intake-stopline-preparation-alignment-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-operator-value-intake-stopline-preparation-alignment-gate"] !== "node scripts/check-twii-operator-value-intake-stopline-preparation-alignment-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Operator Value Intake Stopline Preparation Alignment Gate", "twii_operator_value_intake_stopline_preparation_alignment_gate_ready_no_execution", "operator_value_intake_stopline_preparation_aligned_execution_still_blocked", "gateMode=operator_value_intake_stopline_preparation_alignment_fail_closed_no_execution", "operatorValueIntakeStoplinePreparationAlignmentGatePrepared=true", "explicitOperatorGoNoGoDecisionPreparationAlignmentReferenced=true", "valueClassesPrepared=true", "valueClassPlaceholdersPrepared=true", "externalOnlyValuesPrepared=true", "pmRefreshableValuesPrepared=true", "neverStoreValuesPrepared=true", "requiredIntakeFieldsPrepared=true", "currentIntakeStoplineAlignmentStatus=operator_value_intake_stopline_preparation_alignment_ready_waiting_external_values", "nextReviewOnlyRoute=operator_value_intake_stopline_preparation_alignment_review_then_external_values_shape_recheck_preparation", "allowedNextCommandCategory=review_only_external_values_shape_recheck_preparation", "externalOnlyValuesProvidedNow=false", "pmRefreshableValuesAcceptedNow=false", "neverStoreValuesDetectedNow=false", "operatorValueIntakeAcceptedNow=false", "authorizationValueReadNow=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_operator_value_intake_stopline_preparation_alignment_contract_review_ready", "operator value intake contract", "explicit operator go/no-go decision preparation alignment handoff", "final authorization stopline alignment reference", "value class placeholders", "external-only value placeholder", "PM-refreshable value placeholder", "never-store value placeholder", "authorization presence placeholder", "execute switch placeholder", "confirmation phrase placeholder", "server-only credential presence placeholder", "rollback dry-run proof placeholder", "aggregate readback proof placeholder", "post-run review proof placeholder", "duplicate rejection proof placeholder", "blocked reasons", "next route", "fail-closed rules", "PM integration notes", "TWII", "daily_prices", "60 rows"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_operator_value_intake_stopline_preparation_alignment_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "operator value intake stopline preparation alignment", "hard boundaries", "PM integration notes", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII operator value intake stopline preparation alignment gate slice", "docs/TWII_OPERATOR_VALUE_INTAKE_STOPLINE_PREPARATION_ALIGNMENT_GATE.md", "twii_operator_value_intake_stopline_preparation_alignment_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_OPERATOR_VALUE_INTAKE_STOPLINE_PREPARATION_ALIGNMENT_GATE.md` is `accepted` as TWII operator value intake stopline preparation alignment gate", "twii_operator_value_intake_stopline_preparation_alignment_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-operator-value-intake-stopline-preparation-alignment-gate.mjs", "name: \"twii-operator-value-intake-stopline-preparation-alignment-gate\"", "\"twii-operator-value-intake-stopline-preparation-alignment-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["operator value intake stopline preparation alignment stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentIntakeStoplineAlignmentStatus: output.currentIntakeStoplineAlignmentStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, valueClassCount: output.intakeValidation.valueClassCount, placeholderCount: output.intakeValidation.placeholderCount, providedNowCount: output.intakeValidation.providedNowCount, intakeAcceptedNowCount: output.intakeValidation.intakeAcceptedNowCount, reviewOnly: output.intakeState.reviewOnly, presenceOnly: output.intakeState.presenceOnly, fieldNameOnly: output.intakeState.fieldNameOnly, serverOnly: output.intakeState.serverOnly, runnerExecutableNow: output.intakeState.runnerExecutableNow, executionAllowedNow: output.intakeState.executionAllowedNow }, null, 2));

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
