import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-server-only-pre-execution-integration-gate.mjs";
const docPath = "docs/TWII_SERVER_ONLY_PRE_EXECUTION_INTEGRATION_GATE.md";
const a1Path = "docs/A1_SERVER_ONLY_PRE_EXECUTION_INTEGRATION_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_SERVER_ONLY_PRE_EXECUTION_INTEGRATION_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-server-only-pre-execution-integration-gate.json";
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
const output = parseJson(run.stdout ?? "", "server-only pre-execution integration stdout");

if (run.status !== 0) problems.push("server-only pre-execution integration report must exit 0");
if (output.status !== "twii_server_only_pre_execution_integration_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "server_only_pre_execution_integration_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "server_only_pre_execution_integration_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentIntegrationStatus !== "server_only_pre_execution_integration_ready_waiting_external_values") problems.push("currentIntegrationStatus mismatch");
if (output.nextReviewOnlyRoute !== "server_only_pre_execution_integration_review_then_bounded_operator_authorization_packet") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_bounded_operator_authorization_packet_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.integrationValidation?.requiredServerOnlyCheckCount !== 10) problems.push("requiredServerOnlyCheckCount must be 10");
if (output.integrationValidation?.placeholderCount !== 10) problems.push("placeholderCount must be 10");
if (output.integrationValidation?.passedNowCount !== 0) problems.push("passedNowCount must be 0");
if (output.integrationValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
for (const key of ["serverOnlyPreExecutionIntegrationPrepared", "preExecutionReadinessRecheckReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "requiredServerOnlyChecksPrepared", "credentialPresenceSemanticsPrepared", "executeSwitchPresenceSemanticsPrepared", "confirmationPhrasePresenceSemanticsPrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "boundedExecutionPacketPrecursorPrepared", "reviewOnly", "localOnly", "presenceOnly"]) if (output.integrationState?.[key] !== true) problems.push(`integrationState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "serverOnlyCredentialCheckPassed", "credentialPresenceRecheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow"]) if (output.integrationState?.[key] !== false) problems.push(`integrationState.${key} must be false`);
if (pkg.scripts?.["report:twii-server-only-pre-execution-integration-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-server-only-pre-execution-integration-gate"] !== "node scripts/check-twii-server-only-pre-execution-integration-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Server-Only Pre-Execution Integration Gate", "twii_server_only_pre_execution_integration_gate_ready_no_execution", "server_only_pre_execution_integration_ready_execution_still_blocked", "gateMode=server_only_pre_execution_integration_fail_closed_no_execution", "serverOnlyPreExecutionIntegrationPrepared=true", "preExecutionReadinessRecheckReferenced=true", "serverOnlyPreExecutionChecksReferenced=true", "requiredServerOnlyChecksPrepared=true", "credentialPresenceSemanticsPrepared=true", "executeSwitchPresenceSemanticsPrepared=true", "confirmationPhrasePresenceSemanticsPrepared=true", "rollbackDryRunPlaceholderPrepared=true", "aggregateReadbackPlaceholderPrepared=true", "postRunReviewPlaceholderPrepared=true", "candidateDuplicateRejectionPlaceholderPrepared=true", "boundedExecutionPacketPrecursorPrepared=true", "currentIntegrationStatus=server_only_pre_execution_integration_ready_waiting_external_values", "nextReviewOnlyRoute=server_only_pre_execution_integration_review_then_bounded_operator_authorization_packet", "allowedNextCommandCategory=review_only_bounded_operator_authorization_packet_preparation", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_server_only_pre_execution_integration_contract_review_ready", "required server-only checks", "presence-only credential semantics", "execute switch", "confirmation phrase", "rollback", "readback", "postrun", "duplicate proof", "blocked reasons", "next review-only route", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_server_only_pre_execution_integration_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "scoreSource=real"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII server-only pre-execution integration gate slice", "docs/TWII_SERVER_ONLY_PRE_EXECUTION_INTEGRATION_GATE.md", "twii_server_only_pre_execution_integration_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_SERVER_ONLY_PRE_EXECUTION_INTEGRATION_GATE.md` is `accepted` as TWII server-only pre-execution integration gate", "twii_server_only_pre_execution_integration_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-server-only-pre-execution-integration-gate.mjs", "name: \"twii-server-only-pre-execution-integration-gate\"", "\"twii-server-only-pre-execution-integration-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["server-only pre-execution integration stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentIntegrationStatus: output.currentIntegrationStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, placeholderCount: output.integrationValidation.placeholderCount, passedNowCount: output.integrationValidation.passedNowCount, valueReadNowCount: output.integrationValidation.valueReadNowCount, reviewOnly: output.integrationState.reviewOnly, presenceOnly: output.integrationState.presenceOnly, runnerExecutableNow: output.integrationState.runnerExecutableNow, executionAllowedNow: output.integrationState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
