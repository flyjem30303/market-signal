import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-external-values-shape-recheck-preparation-alignment-gate.mjs";
const docPath = "docs/TWII_EXTERNAL_VALUES_SHAPE_RECHECK_PREPARATION_ALIGNMENT_GATE.md";
const a1Path = "docs/A1_EXTERNAL_VALUES_SHAPE_RECHECK_PREPARATION_ALIGNMENT_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_EXTERNAL_VALUES_SHAPE_RECHECK_PREPARATION_ALIGNMENT_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-external-values-shape-recheck-preparation-alignment-gate.json";
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
const output = parseJson(run.stdout ?? "", "external values shape recheck preparation alignment stdout");

if (run.status !== 0) problems.push("external values shape recheck preparation alignment report must exit 0");
if (output.status !== "twii_external_values_shape_recheck_preparation_alignment_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "external_values_shape_recheck_preparation_aligned_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "external_values_shape_recheck_preparation_alignment_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentShapeRecheckAlignmentStatus !== "external_values_shape_recheck_preparation_alignment_ready_waiting_external_values") problems.push("currentShapeRecheckAlignmentStatus mismatch");
if (output.nextReviewOnlyRoute !== "external_values_shape_recheck_preparation_alignment_review_then_pre_execution_readiness_recheck_preparation") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_pre_execution_readiness_recheck_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.shapeValidation?.allowedPlaceholderClassCount !== 3) problems.push("allowedPlaceholderClassCount must be 3");
if (output.shapeValidation?.forbiddenSurfaceCount !== 10) problems.push("forbiddenSurfaceCount must be 10");
if (output.shapeValidation?.decisionOptionCount !== 3) problems.push("decisionOptionCount must be 3");
if (output.shapeValidation?.requiredShapeFieldCount !== 17) problems.push("requiredShapeFieldCount must be 17");
if (output.shapeValidation?.placeholderCount !== 17) problems.push("placeholderCount must be 17");
if (output.shapeValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.shapeValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.shapeValidation?.shapeAcceptedNowCount !== 0) problems.push("shapeAcceptedNowCount must be 0");
for (const key of ["externalValuesShapeRecheckPreparationAlignmentGatePrepared", "operatorValueIntakeStoplinePreparationAlignmentReferenced", "operatorValueIntakeStoplinePreparationReferenced", "preExecutionReadinessRecheckPreparationReferenced", "valueClassShapeRulesPrepared", "fieldNameOnlyContractPrepared", "presenceOnlyChecksPrepared", "allowedPlaceholderClassesPrepared", "forbiddenValueSurfacesPrepared", "decisionShapePlaceholdersPrepared", "authorizationPresenceShapePlaceholderPrepared", "executeSwitchPresenceShapePlaceholderPrepared", "confirmationPhrasePresenceShapePlaceholderPrepared", "serverOnlyCredentialPresenceShapePlaceholderPrepared", "rollbackShapePlaceholderPrepared", "aggregateReadbackShapePlaceholderPrepared", "postRunReviewShapePlaceholderPrepared", "candidateDuplicateRejectionShapePlaceholderPrepared", "externalValuesShapeRecheckAlignmentShapePrepared", "reviewOnly", "localOnly", "shapeOnly", "presenceOnly", "fieldNameOnly", "serverOnly"]) if (output.shapeState?.[key] !== true) problems.push(`shapeState.${key} must be true`);
for (const key of ["externalValuesProvidedNow", "externalOnlyValuesProvidedNow", "pmRefreshableValuesAcceptedNow", "neverStoreValuesDetectedNow", "shapeRecheckAcceptedNow", "fieldValueReadNow", "forbiddenValueSurfaceDetectedNow", "operatorValueIntakeAcceptedNow", "authorizationValueReadNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow"]) if (output.shapeState?.[key] !== false) problems.push(`shapeState.${key} must be false`);
if (pkg.scripts?.["report:twii-external-values-shape-recheck-preparation-alignment-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-external-values-shape-recheck-preparation-alignment-gate"] !== "node scripts/check-twii-external-values-shape-recheck-preparation-alignment-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII External Values Shape Recheck Preparation Alignment Gate", "twii_external_values_shape_recheck_preparation_alignment_gate_ready_no_execution", "external_values_shape_recheck_preparation_aligned_execution_still_blocked", "gateMode=external_values_shape_recheck_preparation_alignment_fail_closed_no_execution", "externalValuesShapeRecheckPreparationAlignmentGatePrepared=true", "operatorValueIntakeStoplinePreparationAlignmentReferenced=true", "valueClassShapeRulesPrepared=true", "fieldNameOnlyContractPrepared=true", "presenceOnlyChecksPrepared=true", "allowedPlaceholderClassesPrepared=true", "forbiddenValueSurfacesPrepared=true", "decisionShapePlaceholdersPrepared=true", "authorizationPresenceShapePlaceholderPrepared=true", "executeSwitchPresenceShapePlaceholderPrepared=true", "confirmationPhrasePresenceShapePlaceholderPrepared=true", "serverOnlyCredentialPresenceShapePlaceholderPrepared=true", "externalValuesShapeRecheckAlignmentShapePrepared=true", "fieldNameOnly=true", "shapeOnly=true", "presenceOnly=true", "serverOnly=true", "currentShapeRecheckAlignmentStatus=external_values_shape_recheck_preparation_alignment_ready_waiting_external_values", "nextReviewOnlyRoute=external_values_shape_recheck_preparation_alignment_review_then_pre_execution_readiness_recheck_preparation", "allowedNextCommandCategory=review_only_pre_execution_readiness_recheck_preparation", "externalValuesProvidedNow=false", "shapeRecheckAcceptedNow=false", "fieldValueReadNow=false", "forbiddenValueSurfaceDetectedNow=false", "operatorValueIntakeAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_external_values_shape_recheck_preparation_alignment_contract_review_ready", "external values shape contract", "operator value intake stopline preparation alignment handoff", "value class rules", "field-name-only placeholders", "presence-only checks", "allowed placeholder classes", "forbidden value surfaces", "decision placeholder", "authorization presence placeholder", "execute switch placeholder", "confirmation phrase placeholder", "server-only credential presence placeholder", "rollback dry-run proof placeholder", "aggregate readback proof placeholder", "post-run review proof placeholder", "duplicate rejection proof placeholder", "blocked reasons", "next route", "fail-closed rules", "PM integration notes", "TWII", "daily_prices", "60 rows", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_external_values_shape_recheck_preparation_alignment_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "external values shape recheck preparation alignment", "hard boundaries", "PM integration notes", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII external values shape recheck preparation alignment gate slice", "docs/TWII_EXTERNAL_VALUES_SHAPE_RECHECK_PREPARATION_ALIGNMENT_GATE.md", "twii_external_values_shape_recheck_preparation_alignment_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_EXTERNAL_VALUES_SHAPE_RECHECK_PREPARATION_ALIGNMENT_GATE.md` is `accepted` as TWII external values shape recheck preparation alignment gate", "twii_external_values_shape_recheck_preparation_alignment_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-external-values-shape-recheck-preparation-alignment-gate.mjs", "name: \"twii-external-values-shape-recheck-preparation-alignment-gate\"", "\"twii-external-values-shape-recheck-preparation-alignment-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["external values shape recheck preparation alignment stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentShapeRecheckAlignmentStatus: output.currentShapeRecheckAlignmentStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, allowedPlaceholderClassCount: output.shapeValidation.allowedPlaceholderClassCount, forbiddenSurfaceCount: output.shapeValidation.forbiddenSurfaceCount, decisionOptionCount: output.shapeValidation.decisionOptionCount, placeholderCount: output.shapeValidation.placeholderCount, providedNowCount: output.shapeValidation.providedNowCount, valueReadNowCount: output.shapeValidation.valueReadNowCount, shapeAcceptedNowCount: output.shapeValidation.shapeAcceptedNowCount, reviewOnly: output.shapeState.reviewOnly, shapeOnly: output.shapeState.shapeOnly, fieldNameOnly: output.shapeState.fieldNameOnly, serverOnly: output.shapeState.serverOnly, runnerExecutableNow: output.shapeState.runnerExecutableNow, executionAllowedNow: output.shapeState.executionAllowedNow }, null, 2));

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
