import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-operator-values-shape-recheck-gate-preflight.mjs";
const docPath = "docs/TWII_OPERATOR_VALUES_SHAPE_RECHECK_GATE_PREFLIGHT.md";
const a1Path = "docs/A1_OPERATOR_VALUES_SHAPE_RECHECK_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_OPERATOR_VALUES_SHAPE_RECHECK_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-operator-values-shape-recheck-gate-preflight.json";
const recheckPath = "data/source-gates/twii-operator-values-shape-recheck.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const a1 = read(a1Path);
const a2 = read(a2Path);
const gateText = read(gatePath);
const recheckText = read(recheckPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "operator values shape recheck stdout");

if (run.status !== 0) problems.push("operator values shape recheck report must exit 0");
if (output.status !== "twii_operator_values_shape_recheck_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "operator_values_shape_recheck_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.operatorValuesShapeRecheckMode !== "operator_values_shape_recheck_fail_closed_no_execution") problems.push("operatorValuesShapeRecheckMode mismatch");
if (output.currentRecheckStatus !== "shape_recheck_ready_waiting_external_values") problems.push("currentRecheckStatus mismatch");
if (output.nextReviewOnlyRoute !== "external_values_shape_recheck_then_pre_execution_readiness_recheck") problems.push("nextReviewOnlyRoute mismatch");
if (output.shapeValidation?.requiredShapeFieldCount !== 8) problems.push("requiredShapeFieldCount must be 8");
if (output.shapeValidation?.externalValuePlaceholderCount < 5) problems.push("externalValuePlaceholderCount must be >= 5");
if (output.shapeValidation?.placeholdersProvidedNowCount !== 0) problems.push("placeholdersProvidedNowCount must be 0");
if (output.shapeValidation?.placeholdersValueReadNowCount !== 0) problems.push("placeholdersValueReadNowCount must be 0");
for (const key of ["operatorValuesShapeRecheckGatePrepared", "shapeRecheckReferenced", "intakeSurfaceGateReferenced", "intakeSurfaceReferenced", "presenceOnly", "shapeOnly", "localOnly", "externalValuePlaceholdersOnly", "requiredShapeFieldsPrepared", "externalValuePlaceholderRulesPrepared", "blockedReasonsPrepared", "nextRoutePrepared"]) if (output.shapeState?.[key] !== true) problems.push(`shapeState.${key} must be true`);
for (const key of ["realValuesProvidedNow", "realValuesReadNow", "externalOnlyValuesProvidedNow", "executeSwitchProvided", "confirmationPhraseProvided", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.shapeState?.[key] !== false) problems.push(`shapeState.${key} must be false`);
if (pkg.scripts?.["report:twii-operator-values-shape-recheck-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-operator-values-shape-recheck-gate-preflight"] !== "node scripts/check-twii-operator-values-shape-recheck-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Operator Values Shape Recheck Gate Preflight", "twii_operator_values_shape_recheck_gate_preflight_ready_no_execution", "operator_values_shape_recheck_ready_execution_still_blocked", "operatorValuesShapeRecheckMode=operator_values_shape_recheck_fail_closed_no_execution", "presenceOnly=true", "shapeOnly=true", "localOnly=true", "externalValuePlaceholdersOnly=true", "requiredShapeFieldsPrepared=true", "externalValuePlaceholderRulesPrepared=true", "currentRecheckStatus=shape_recheck_ready_waiting_external_values", "nextReviewOnlyRoute=external_values_shape_recheck_then_pre_execution_readiness_recheck", "allowedNextCommandCategory=review_only_shape_presence_recheck", "realValuesProvidedNow=false", "realValuesReadNow=false", "externalOnlyValuesProvidedNow=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "credentialValuesRead=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_operator_values_shape_recheck_contract_review_ready", "required shape fields", "presence-only semantics", "external value placeholder rules", "blocked reasons", "next review-only route", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_operator_values_shape_recheck_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "scoreSource=real"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII operator values shape recheck gate preflight slice", "docs/TWII_OPERATOR_VALUES_SHAPE_RECHECK_GATE_PREFLIGHT.md", "twii_operator_values_shape_recheck_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_OPERATOR_VALUES_SHAPE_RECHECK_GATE_PREFLIGHT.md` is `accepted` as TWII operator values shape recheck gate preflight", "twii_operator_values_shape_recheck_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-operator-values-shape-recheck-gate-preflight.mjs", "name: \"twii-operator-values-shape-recheck-gate-preflight\"", "\"twii-operator-values-shape-recheck-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [recheckPath, recheckText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["operator values shape recheck stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentRecheckStatus: output.currentRecheckStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, externalValuePlaceholderCount: output.shapeValidation.externalValuePlaceholderCount, placeholdersProvidedNowCount: output.shapeValidation.placeholdersProvidedNowCount, presenceOnly: output.shapeState.presenceOnly, shapeOnly: output.shapeState.shapeOnly, runnerExecutableNow: output.shapeState.runnerExecutableNow, executionAllowedNow: output.shapeState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
