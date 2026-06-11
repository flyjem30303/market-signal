import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-pre-execution-readiness-recheck-gate-preflight.mjs";
const docPath = "docs/TWII_PRE_EXECUTION_READINESS_RECHECK_GATE_PREFLIGHT.md";
const a1Path = "docs/A1_PRE_EXECUTION_READINESS_RECHECK_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_PRE_EXECUTION_READINESS_RECHECK_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-pre-execution-readiness-recheck-gate-preflight.json";
const recheckPath = "data/source-gates/twii-pre-execution-readiness-recheck.json";
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
const output = parseJson(run.stdout ?? "", "pre-execution readiness recheck stdout");

if (run.status !== 0) problems.push("pre-execution readiness recheck report must exit 0");
if (output.status !== "twii_pre_execution_readiness_recheck_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "pre_execution_readiness_recheck_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.preExecutionReadinessRecheckMode !== "pre_execution_readiness_recheck_fail_closed_no_execution") problems.push("preExecutionReadinessRecheckMode mismatch");
if (output.currentReadinessStatus !== "pre_execution_readiness_recheck_ready_waiting_external_values") problems.push("currentReadinessStatus mismatch");
if (output.nextReviewOnlyRoute !== "operator_values_shape_pass_then_server_only_pre_execution_recheck") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_pre_execution_readiness_recheck") problems.push("allowedNextCommandCategory mismatch");
if (output.readinessValidation?.requiredReadinessCheckCount !== 9) problems.push("requiredReadinessCheckCount must be 9");
if (output.readinessValidation?.placeholderCount !== 9) problems.push("placeholderCount must be 9");
if (output.readinessValidation?.passedNowCount !== 0) problems.push("passedNowCount must be 0");
if (output.readinessValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
for (const key of ["preExecutionReadinessRecheckGatePrepared", "recheckReferenced", "shapeRecheckGateReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "readinessChecklistPrepared", "credentialPresenceSemanticsPrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "reviewOnly", "localOnly", "presenceOnly"]) if (output.readinessState?.[key] !== true) problems.push(`readinessState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "credentialPresenceRecheckPassed", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow"]) if (output.readinessState?.[key] !== false) problems.push(`readinessState.${key} must be false`);
if (pkg.scripts?.["report:twii-pre-execution-readiness-recheck-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-pre-execution-readiness-recheck-gate-preflight"] !== "node scripts/check-twii-pre-execution-readiness-recheck-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Pre-Execution Readiness Recheck Gate Preflight", "twii_pre_execution_readiness_recheck_gate_preflight_ready_no_execution", "pre_execution_readiness_recheck_ready_execution_still_blocked", "preExecutionReadinessRecheckMode=pre_execution_readiness_recheck_fail_closed_no_execution", "preExecutionReadinessRecheckGatePrepared=true", "reviewOnly=true", "localOnly=true", "presenceOnly=true", "readinessChecklistPrepared=true", "credentialPresenceSemanticsPrepared=true", "rollbackDryRunPlaceholderPrepared=true", "aggregateReadbackPlaceholderPrepared=true", "postRunReviewPlaceholderPrepared=true", "candidateDuplicateRejectionPlaceholderPrepared=true", "mockBoundaryRechecked=true", "executionStopLinesPrepared=true", "currentReadinessStatus=pre_execution_readiness_recheck_ready_waiting_external_values", "nextReviewOnlyRoute=operator_values_shape_pass_then_server_only_pre_execution_recheck", "allowedNextCommandCategory=review_only_pre_execution_readiness_recheck", "externalOnlyValuesProvidedNow=false", "credentialPresenceRecheckPassed=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_pre_execution_readiness_recheck_contract_review_ready", "required readiness checks", "presence-only credential semantics", "rollback", "readback", "postrun", "Proof Placeholders", "blocked reasons", "next review-only route", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_pre_execution_readiness_recheck_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "scoreSource=real"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII pre-execution readiness recheck gate preflight slice", "docs/TWII_PRE_EXECUTION_READINESS_RECHECK_GATE_PREFLIGHT.md", "twii_pre_execution_readiness_recheck_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_PRE_EXECUTION_READINESS_RECHECK_GATE_PREFLIGHT.md` is `accepted` as TWII pre-execution readiness recheck gate preflight", "twii_pre_execution_readiness_recheck_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-pre-execution-readiness-recheck-gate-preflight.mjs", "name: \"twii-pre-execution-readiness-recheck-gate-preflight\"", "\"twii-pre-execution-readiness-recheck-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [recheckPath, recheckText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["pre-execution readiness recheck stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentReadinessStatus: output.currentReadinessStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, placeholderCount: output.readinessValidation.placeholderCount, passedNowCount: output.readinessValidation.passedNowCount, valueReadNowCount: output.readinessValidation.valueReadNowCount, reviewOnly: output.readinessState.reviewOnly, presenceOnly: output.readinessState.presenceOnly, runnerExecutableNow: output.readinessState.runnerExecutableNow, executionAllowedNow: output.readinessState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
