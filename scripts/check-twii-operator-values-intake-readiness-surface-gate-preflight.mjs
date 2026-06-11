import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-operator-values-intake-readiness-surface-gate-preflight.mjs";
const docPath = "docs/TWII_OPERATOR_VALUES_INTAKE_READINESS_SURFACE_GATE_PREFLIGHT.md";
const a1Path = "docs/A1_OPERATOR_VALUES_INTAKE_READINESS_SURFACE_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_OPERATOR_VALUES_INTAKE_READINESS_SURFACE_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-operator-values-intake-readiness-surface-gate-preflight.json";
const surfacePath = "data/source-gates/twii-operator-values-intake-readiness-surface.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const a1 = read(a1Path);
const a2 = read(a2Path);
const gateText = read(gatePath);
const surfaceText = read(surfacePath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "operator values intake readiness surface stdout");

if (run.status !== 0) problems.push("operator values intake readiness surface report must exit 0");
if (output.status !== "twii_operator_values_intake_readiness_surface_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "operator_values_intake_surface_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.operatorValuesIntakeSurfaceMode !== "operator_values_intake_readiness_surface_fail_closed_no_execution") problems.push("operatorValuesIntakeSurfaceMode mismatch");
if (output.currentIntakeStatus !== "blocked_waiting_external_operator_values") problems.push("currentIntakeStatus mismatch");
if (output.nextReviewOnlyRoute !== "operator_supplies_external_values_then_pm_runs_pre_execution_readiness_recheck") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_operator_values_shape_recheck") problems.push("allowedNextCommandCategory mismatch");
if (output.intakeValidation?.requiredInputClassCount !== 3) problems.push("requiredInputClassCount must be 3");
if (output.intakeValidation?.externalOnlyValueCount < 5) problems.push("externalOnlyValueCount must be >= 5");
if (output.intakeValidation?.pmRefreshableValueCount < 6) problems.push("pmRefreshableValueCount must be >= 6");
if (output.intakeValidation?.neverStoreValueCount < 10) problems.push("neverStoreValueCount must be >= 10");
if (output.intakeValidation?.blockedReasonCount < 10) problems.push("blockedReasonCount must be >= 10");
for (const key of ["operatorValuesIntakeSurfaceGatePrepared", "surfaceReferenced", "nextExecutionRouteGateReferenced", "executeSwitchIntakeGateReferenced", "serverOnlyPreExecutionChecksReferenced", "postRunReviewContractReferenced", "surfaceReviewOnly", "localOnly", "inputClassesPrepared", "externalOnlyValuesPrepared", "pmRefreshableValuesPrepared", "neverStoreValuesPrepared", "blockedReasonsPrepared", "nextRoutePrepared"]) if (output.intakeState?.[key] !== true) problems.push(`intakeState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "realValuesProvidedNow", "executeSwitchProvided", "confirmationPhraseProvided", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.intakeState?.[key] !== false) problems.push(`intakeState.${key} must be false`);
if (pkg.scripts?.["report:twii-operator-values-intake-readiness-surface-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-operator-values-intake-readiness-surface-gate-preflight"] !== "node scripts/check-twii-operator-values-intake-readiness-surface-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Operator Values Intake Readiness Surface Gate Preflight", "twii_operator_values_intake_readiness_surface_gate_preflight_ready_no_execution", "operator_values_intake_surface_ready_execution_still_blocked", "operatorValuesIntakeSurfaceMode=operator_values_intake_readiness_surface_fail_closed_no_execution", "surfaceReviewOnly=true", "localOnly=true", "inputClassesPrepared=true", "externalOnlyValuesPrepared=true", "pmRefreshableValuesPrepared=true", "neverStoreValuesPrepared=true", "currentIntakeStatus=blocked_waiting_external_operator_values", "nextReviewOnlyRoute=operator_supplies_external_values_then_pm_runs_pre_execution_readiness_recheck", "allowedNextCommandCategory=review_only_operator_values_shape_recheck", "externalOnlyValuesProvidedNow=false", "realValuesProvidedNow=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "serverOnlyCredentialCheckPassed=false", "credentialValuesRead=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_operator_values_intake_readiness_surface_contract_review_ready", "required input classes", "external-only values", "pm-refreshable values", "never-store values", "blocked reasons", "next route", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_operator_values_intake_readiness_surface_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "scoreSource=real"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII operator values intake readiness surface gate preflight slice", "docs/TWII_OPERATOR_VALUES_INTAKE_READINESS_SURFACE_GATE_PREFLIGHT.md", "twii_operator_values_intake_readiness_surface_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_OPERATOR_VALUES_INTAKE_READINESS_SURFACE_GATE_PREFLIGHT.md` is `accepted` as TWII operator values intake readiness surface gate preflight", "twii_operator_values_intake_readiness_surface_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-operator-values-intake-readiness-surface-gate-preflight.mjs", "name: \"twii-operator-values-intake-readiness-surface-gate-preflight\"", "\"twii-operator-values-intake-readiness-surface-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [surfacePath, surfaceText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["operator values intake readiness surface stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentIntakeStatus: output.currentIntakeStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, externalOnlyValueCount: output.intakeValidation.externalOnlyValueCount, neverStoreValueCount: output.intakeValidation.neverStoreValueCount, surfaceReviewOnly: output.intakeState.surfaceReviewOnly, externalOnlyValuesProvidedNow: output.intakeState.externalOnlyValuesProvidedNow, runnerExecutableNow: output.intakeState.runnerExecutableNow, executionAllowedNow: output.intakeState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
