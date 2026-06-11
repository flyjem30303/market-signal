import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-bounded-operator-authorization-packet-gate.mjs";
const docPath = "docs/TWII_BOUNDED_OPERATOR_AUTHORIZATION_PACKET_GATE.md";
const a1Path = "docs/A1_BOUNDED_OPERATOR_AUTHORIZATION_PACKET_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_BOUNDED_OPERATOR_AUTHORIZATION_PACKET_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-bounded-operator-authorization-packet-gate.json";
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
const output = parseJson(run.stdout ?? "", "bounded operator authorization packet stdout");

if (run.status !== 0) problems.push("bounded operator authorization packet report must exit 0");
if (output.status !== "twii_bounded_operator_authorization_packet_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "bounded_operator_authorization_packet_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "bounded_operator_authorization_packet_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentAuthorizationPacketStatus !== "bounded_operator_authorization_packet_ready_waiting_external_values") problems.push("currentAuthorizationPacketStatus mismatch");
if (output.nextReviewOnlyRoute !== "bounded_operator_authorization_packet_review_then_explicit_execution_packet") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_explicit_execution_packet_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.authorizationValidation?.requiredAuthorizationFieldCount !== 11) problems.push("requiredAuthorizationFieldCount must be 11");
if (output.authorizationValidation?.placeholderCount !== 11) problems.push("placeholderCount must be 11");
if (output.authorizationValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.authorizationValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.authorizationValidation?.authorizationAcceptedNowCount !== 0) problems.push("authorizationAcceptedNowCount must be 0");
for (const key of ["authorizationPacketGatePrepared", "serverOnlyPreExecutionIntegrationReferenced", "preExecutionReadinessRecheckReferenced", "serverOnlyPreExecutionChecksReferenced", "rollbackContractReferenced", "aggregateReadbackContractReferenced", "postRunReviewContractReferenced", "boundedInsertContractReferenced", "requiredAuthorizationFieldsPrepared", "operatorDecisionPresencePrepared", "executeSwitchPresencePrepared", "confirmationPhrasePresencePrepared", "serverOnlyCredentialPresencePrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "boundedExecutionPacketPrecursorPrepared", "reviewOnly", "localOnly", "presenceOnly"]) if (output.authorizationState?.[key] !== true) problems.push(`authorizationState.${key} must be true`);
for (const key of ["externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow"]) if (output.authorizationState?.[key] !== false) problems.push(`authorizationState.${key} must be false`);
if (pkg.scripts?.["report:twii-bounded-operator-authorization-packet-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-bounded-operator-authorization-packet-gate"] !== "node scripts/check-twii-bounded-operator-authorization-packet-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Bounded Operator Authorization Packet Gate", "twii_bounded_operator_authorization_packet_gate_ready_no_execution", "bounded_operator_authorization_packet_ready_execution_still_blocked", "gateMode=bounded_operator_authorization_packet_fail_closed_no_execution", "authorizationPacketGatePrepared=true", "serverOnlyPreExecutionIntegrationReferenced=true", "requiredAuthorizationFieldsPrepared=true", "operatorDecisionPresencePrepared=true", "executeSwitchPresencePrepared=true", "confirmationPhrasePresencePrepared=true", "serverOnlyCredentialPresencePrepared=true", "boundedExecutionPacketPrecursorPrepared=true", "currentAuthorizationPacketStatus=bounded_operator_authorization_packet_ready_waiting_external_values", "nextReviewOnlyRoute=bounded_operator_authorization_packet_review_then_explicit_execution_packet", "allowedNextCommandCategory=review_only_explicit_execution_packet_preparation", "externalOperatorDecisionProvidedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_bounded_operator_authorization_packet_contract_review_ready", "required authorization fields", "presence-only value semantics", "server-only credential presence", "execute switch", "confirmation phrase", "rollback", "readback", "postrun", "duplicate proof", "blocked reasons", "next review-only route", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_bounded_operator_authorization_packet_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "scoreSource=real"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII bounded operator authorization packet gate slice", "docs/TWII_BOUNDED_OPERATOR_AUTHORIZATION_PACKET_GATE.md", "twii_bounded_operator_authorization_packet_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_BOUNDED_OPERATOR_AUTHORIZATION_PACKET_GATE.md` is `accepted` as TWII bounded operator authorization packet gate", "twii_bounded_operator_authorization_packet_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-bounded-operator-authorization-packet-gate.mjs", "name: \"twii-bounded-operator-authorization-packet-gate\"", "\"twii-bounded-operator-authorization-packet-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["bounded operator authorization packet stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentAuthorizationPacketStatus: output.currentAuthorizationPacketStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, placeholderCount: output.authorizationValidation.placeholderCount, providedNowCount: output.authorizationValidation.providedNowCount, valueReadNowCount: output.authorizationValidation.valueReadNowCount, authorizationAcceptedNowCount: output.authorizationValidation.authorizationAcceptedNowCount, reviewOnly: output.authorizationState.reviewOnly, presenceOnly: output.authorizationState.presenceOnly, runnerExecutableNow: output.authorizationState.runnerExecutableNow, executionAllowedNow: output.authorizationState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
