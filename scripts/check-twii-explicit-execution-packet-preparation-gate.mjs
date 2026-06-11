import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-explicit-execution-packet-preparation-gate.mjs";
const docPath = "docs/TWII_EXPLICIT_EXECUTION_PACKET_PREPARATION_GATE.md";
const a1Path = "docs/A1_EXPLICIT_EXECUTION_PACKET_PREPARATION_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_EXPLICIT_EXECUTION_PACKET_PREPARATION_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-explicit-execution-packet-preparation-gate.json";
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
const output = parseJson(run.stdout ?? "", "explicit execution packet preparation stdout");

if (run.status !== 0) problems.push("explicit execution packet preparation report must exit 0");
if (output.status !== "twii_explicit_execution_packet_preparation_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "explicit_execution_packet_preparation_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "explicit_execution_packet_preparation_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentExecutionPacketStatus !== "explicit_execution_packet_preparation_ready_waiting_external_values") problems.push("currentExecutionPacketStatus mismatch");
if (output.nextReviewOnlyRoute !== "explicit_execution_packet_review_then_separate_authorized_execution_attempt") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_separate_execution_attempt_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.executionPacketValidation?.requiredExecutionPacketFieldCount !== 11) problems.push("requiredExecutionPacketFieldCount must be 11");
if (output.executionPacketValidation?.placeholderCount !== 11) problems.push("placeholderCount must be 11");
if (output.executionPacketValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.executionPacketValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.executionPacketValidation?.executionAuthorizedNowCount !== 0) problems.push("executionAuthorizedNowCount must be 0");
for (const key of ["explicitExecutionPacketPreparationGatePrepared", "boundedOperatorAuthorizationPacketReferenced", "serverOnlyPreExecutionIntegrationReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "requiredExecutionPacketFieldsPrepared", "operatorDecisionPresencePrepared", "authorizationPresencePrepared", "executeSwitchPresencePrepared", "confirmationPhrasePresencePrepared", "serverOnlyCredentialPresencePrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "explicitExecutionPacketShapePrepared", "reviewOnly", "localOnly", "presenceOnly"]) if (output.executionPacketState?.[key] !== true) problems.push(`executionPacketState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow"]) if (output.executionPacketState?.[key] !== false) problems.push(`executionPacketState.${key} must be false`);
if (pkg.scripts?.["report:twii-explicit-execution-packet-preparation-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-explicit-execution-packet-preparation-gate"] !== "node scripts/check-twii-explicit-execution-packet-preparation-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Explicit Execution Packet Preparation Gate", "twii_explicit_execution_packet_preparation_gate_ready_no_execution", "explicit_execution_packet_preparation_ready_execution_still_blocked", "gateMode=explicit_execution_packet_preparation_fail_closed_no_execution", "explicitExecutionPacketPreparationGatePrepared=true", "boundedOperatorAuthorizationPacketReferenced=true", "requiredExecutionPacketFieldsPrepared=true", "operatorDecisionPresencePrepared=true", "authorizationPresencePrepared=true", "executeSwitchPresencePrepared=true", "confirmationPhrasePresencePrepared=true", "serverOnlyCredentialPresencePrepared=true", "explicitExecutionPacketShapePrepared=true", "currentExecutionPacketStatus=explicit_execution_packet_preparation_ready_waiting_external_values", "nextReviewOnlyRoute=explicit_execution_packet_review_then_separate_authorized_execution_attempt", "allowedNextCommandCategory=review_only_separate_execution_attempt_preparation", "externalOperatorDecisionProvidedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_explicit_execution_packet_preparation_contract_review_ready", "required execution packet fields", "presence-only authorization semantics", "server-only credential presence", "execute switch", "confirmation phrase", "rollback", "readback", "post-run", "duplicate proof", "blocked reasons", "next review-only route", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_explicit_execution_packet_preparation_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "scoreSource=real"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII explicit execution packet preparation gate slice", "docs/TWII_EXPLICIT_EXECUTION_PACKET_PREPARATION_GATE.md", "twii_explicit_execution_packet_preparation_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_EXPLICIT_EXECUTION_PACKET_PREPARATION_GATE.md` is `accepted` as TWII explicit execution packet preparation gate", "twii_explicit_execution_packet_preparation_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-explicit-execution-packet-preparation-gate.mjs", "name: \"twii-explicit-execution-packet-preparation-gate\"", "\"twii-explicit-execution-packet-preparation-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["explicit execution packet preparation stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentExecutionPacketStatus: output.currentExecutionPacketStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, placeholderCount: output.executionPacketValidation.placeholderCount, providedNowCount: output.executionPacketValidation.providedNowCount, valueReadNowCount: output.executionPacketValidation.valueReadNowCount, executionAuthorizedNowCount: output.executionPacketValidation.executionAuthorizedNowCount, reviewOnly: output.executionPacketState.reviewOnly, presenceOnly: output.executionPacketState.presenceOnly, runnerExecutableNow: output.executionPacketState.runnerExecutableNow, executionAllowedNow: output.executionPacketState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
