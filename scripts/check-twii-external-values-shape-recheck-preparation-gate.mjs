import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-external-values-shape-recheck-preparation-gate.mjs";
const docPath = "docs/TWII_EXTERNAL_VALUES_SHAPE_RECHECK_PREPARATION_GATE.md";
const a1Path = "docs/A1_EXTERNAL_VALUES_SHAPE_RECHECK_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_EXTERNAL_VALUES_SHAPE_RECHECK_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-external-values-shape-recheck-preparation-gate.json";
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
const output = parseJson(run.stdout ?? "", "external values shape recheck preparation stdout");

if (run.status !== 0) problems.push("external values shape recheck preparation report must exit 0");
if (output.status !== "twii_external_values_shape_recheck_preparation_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "external_values_shape_recheck_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "external_values_shape_recheck_preparation_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentShapeRecheckStatus !== "external_values_shape_recheck_preparation_ready_waiting_external_values") problems.push("currentShapeRecheckStatus mismatch");
if (output.nextReviewOnlyRoute !== "external_values_shape_recheck_review_then_pre_execution_readiness_recheck") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_pre_execution_readiness_recheck_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.shapeValidation?.allowedPlaceholderClassCount !== 3) problems.push("allowedPlaceholderClassCount must be 3");
if (output.shapeValidation?.allowedPlaceholderProvidedNowCount !== 0) problems.push("allowedPlaceholderProvidedNowCount must be 0");
if (output.shapeValidation?.allowedPlaceholderValueReadNowCount !== 0) problems.push("allowedPlaceholderValueReadNowCount must be 0");
if (output.shapeValidation?.fieldNameOnlyClassCount !== 3) problems.push("fieldNameOnlyClassCount must be 3");
if (output.shapeValidation?.forbiddenSurfaceCount !== 10) problems.push("forbiddenSurfaceCount must be 10");
if (output.shapeValidation?.decisionOptionCount !== 3) problems.push("decisionOptionCount must be 3");
if (output.shapeValidation?.selectedDecisionCount !== 0) problems.push("selectedDecisionCount must be 0");
if (output.shapeValidation?.valueReadDecisionCount !== 0) problems.push("valueReadDecisionCount must be 0");
if (output.shapeValidation?.shapeAcceptedDecisionCount !== 0) problems.push("shapeAcceptedDecisionCount must be 0");
if (output.shapeValidation?.requiredShapeFieldCount !== 17) problems.push("requiredShapeFieldCount must be 17");
if (output.shapeValidation?.placeholderCount !== 17) problems.push("placeholderCount must be 17");
if (output.shapeValidation?.fieldNameOnlyPlaceholderCount !== 17) problems.push("fieldNameOnlyPlaceholderCount must be 17");
if (output.shapeValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.shapeValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.shapeValidation?.shapeAcceptedNowCount !== 0) problems.push("shapeAcceptedNowCount must be 0");
for (const key of ["externalValuesShapeRecheckPreparationGatePrepared", "operatorValueIntakeStoplinePreparationReferenced", "explicitOperatorGoNoGoDecisionPreparationReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "valueClassShapeRulesPrepared", "fieldNameOnlyContractPrepared", "presenceOnlyChecksPrepared", "allowedPlaceholderClassesPrepared", "forbiddenValueSurfacesPrepared", "decisionShapePlaceholdersPrepared", "authorizationPresenceShapePlaceholderPrepared", "executeSwitchPresenceShapePlaceholderPrepared", "confirmationPhrasePresenceShapePlaceholderPrepared", "serverOnlyCredentialPresenceShapePlaceholderPrepared", "rollbackShapePlaceholderPrepared", "aggregateReadbackShapePlaceholderPrepared", "postRunReviewShapePlaceholderPrepared", "candidateDuplicateRejectionShapePlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "externalValuesShapeRecheckShapePrepared", "reviewOnly", "localOnly", "shapeOnly", "presenceOnly", "fieldNameOnly"]) if (output.shapeState?.[key] !== true) problems.push(`shapeState.${key} must be true`);
for (const key of ["externalValuesProvidedNow", "externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "explicitDecisionValueReadNow", "shapeRecheckAcceptedNow", "fieldValueReadNow", "forbiddenValueSurfaceDetectedNow", "operatorGoDecisionAcceptedNow", "operatorNoGoDecisionAcceptedNow", "operatorRepairRequiredDecisionAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) if (output.shapeState?.[key] !== false) problems.push(`shapeState.${key} must be false`);
if (pkg.scripts?.["report:twii-external-values-shape-recheck-preparation-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-external-values-shape-recheck-preparation-gate"] !== "node scripts/check-twii-external-values-shape-recheck-preparation-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII External Values Shape Recheck Preparation Gate", "twii_external_values_shape_recheck_preparation_gate_ready_no_execution", "external_values_shape_recheck_ready_execution_still_blocked", "gateMode=external_values_shape_recheck_preparation_fail_closed_no_execution", "externalValuesShapeRecheckPreparationGatePrepared=true", "operatorValueIntakeStoplinePreparationReferenced=true", "valueClassShapeRulesPrepared=true", "fieldNameOnlyContractPrepared=true", "presenceOnlyChecksPrepared=true", "allowedPlaceholderClassesPrepared=true", "forbiddenValueSurfacesPrepared=true", "decisionShapePlaceholdersPrepared=true", "authorizationPresenceShapePlaceholderPrepared=true", "executeSwitchPresenceShapePlaceholderPrepared=true", "confirmationPhrasePresenceShapePlaceholderPrepared=true", "serverOnlyCredentialPresenceShapePlaceholderPrepared=true", "externalValuesShapeRecheckShapePrepared=true", "fieldNameOnly=true", "shapeOnly=true", "presenceOnly=true", "currentShapeRecheckStatus=external_values_shape_recheck_preparation_ready_waiting_external_values", "nextReviewOnlyRoute=external_values_shape_recheck_review_then_pre_execution_readiness_recheck", "allowedNextCommandCategory=review_only_pre_execution_readiness_recheck_preparation", "externalValuesProvidedNow=false", "explicitDecisionValueReadNow=false", "shapeRecheckAcceptedNow=false", "fieldValueReadNow=false", "forbiddenValueSurfaceDetectedNow=false", "operatorGoDecisionAcceptedNow=false", "operatorNoGoDecisionAcceptedNow=false", "operatorRepairRequiredDecisionAcceptedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_external_values_shape_recheck_contract_review_ready", "value class shape rules", "field-name-only contract", "presence-only checks", "allowed placeholder classes", "forbidden value surfaces", "bounded target scope", "TWII", "daily_prices", "60 rows", "go", "no_go", "repair_required", "authorization presence", "execute switch", "confirmation phrase", "server-only credential presence", "rollback", "readback", "post-run", "duplicate", "blocked reasons", "next route", "fail-closed rules", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_external_values_shape_recheck_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "hard boundaries", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII external values shape recheck preparation gate slice", "docs/TWII_EXTERNAL_VALUES_SHAPE_RECHECK_PREPARATION_GATE.md", "twii_external_values_shape_recheck_preparation_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_EXTERNAL_VALUES_SHAPE_RECHECK_PREPARATION_GATE.md` is `accepted` as TWII external values shape recheck preparation gate", "twii_external_values_shape_recheck_preparation_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-external-values-shape-recheck-preparation-gate.mjs", "name: \"twii-external-values-shape-recheck-preparation-gate\"", "\"twii-external-values-shape-recheck-preparation-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["external values shape recheck preparation stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentShapeRecheckStatus: output.currentShapeRecheckStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, allowedPlaceholderClassCount: output.shapeValidation.allowedPlaceholderClassCount, forbiddenSurfaceCount: output.shapeValidation.forbiddenSurfaceCount, decisionOptionCount: output.shapeValidation.decisionOptionCount, selectedDecisionCount: output.shapeValidation.selectedDecisionCount, placeholderCount: output.shapeValidation.placeholderCount, providedNowCount: output.shapeValidation.providedNowCount, valueReadNowCount: output.shapeValidation.valueReadNowCount, shapeAcceptedNowCount: output.shapeValidation.shapeAcceptedNowCount, reviewOnly: output.shapeState.reviewOnly, shapeOnly: output.shapeState.shapeOnly, fieldNameOnly: output.shapeState.fieldNameOnly, runnerExecutableNow: output.shapeState.runnerExecutableNow, executionAllowedNow: output.shapeState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
