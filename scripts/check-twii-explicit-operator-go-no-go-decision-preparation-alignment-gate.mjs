import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-explicit-operator-go-no-go-decision-preparation-alignment-gate.mjs";
const docPath = "docs/TWII_EXPLICIT_OPERATOR_GO_NO_GO_DECISION_PREPARATION_ALIGNMENT_GATE.md";
const a1Path = "docs/A1_EXPLICIT_OPERATOR_GO_NO_GO_DECISION_PREPARATION_ALIGNMENT_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_EXPLICIT_OPERATOR_GO_NO_GO_DECISION_PREPARATION_ALIGNMENT_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-explicit-operator-go-no-go-decision-preparation-alignment-gate.json";
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
const output = parseJson(run.stdout ?? "", "explicit operator go/no-go decision preparation alignment stdout");

if (run.status !== 0) problems.push("explicit operator go/no-go decision preparation alignment report must exit 0");
if (output.status !== "twii_explicit_operator_go_no_go_decision_preparation_alignment_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "explicit_operator_go_no_go_decision_preparation_aligned_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "explicit_operator_go_no_go_decision_preparation_alignment_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.currentDecisionPreparationAlignmentStatus !== "explicit_operator_go_no_go_decision_preparation_alignment_ready_waiting_external_values") problems.push("currentDecisionPreparationAlignmentStatus mismatch");
if (output.nextReviewOnlyRoute !== "explicit_operator_go_no_go_decision_preparation_alignment_review_then_operator_value_intake_stopline_preparation") problems.push("nextReviewOnlyRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_operator_value_intake_stopline_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.decisionValidation?.decisionOptionCount !== 3) problems.push("decisionOptionCount must be 3");
if (output.decisionValidation?.selectedNowCount !== 0) problems.push("selectedNowCount must be 0");
if (output.decisionValidation?.executionAllowedByDecisionCount !== 0) problems.push("executionAllowedByDecisionCount must be 0");
if (output.decisionValidation?.requiredDecisionFieldCount !== 13) problems.push("requiredDecisionFieldCount must be 13");
if (output.decisionValidation?.placeholderCount !== 13) problems.push("placeholderCount must be 13");
if (output.decisionValidation?.fieldNameOnlyPlaceholderCount !== 13) problems.push("fieldNameOnlyPlaceholderCount must be 13");
if (output.decisionValidation?.presenceOnlyPlaceholderCount !== 13) problems.push("presenceOnlyPlaceholderCount must be 13");
if (output.decisionValidation?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.decisionValidation?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
if (output.decisionValidation?.decisionAcceptedNowCount !== 0) problems.push("decisionAcceptedNowCount must be 0");
for (const key of ["explicitOperatorGoNoGoDecisionPreparationAlignmentGatePrepared", "finalAuthorizationStoplinePreparationAlignmentReferenced", "separateAuthorizedExecutionAttemptPreparationReferenced", "explicitExecutionPacketPreparationReferenced", "decisionPreparationShapePrepared", "decisionOptionsPrepared", "decisionOptionsPlaceholderOnly", "requiredDecisionFieldsPrepared", "finalAuthorizationStoplineAlignmentHandoffPrepared", "separateAttemptPreparationReferencePrepared", "explicitExecutionPacketReferencePrepared", "goDecisionPresencePrepared", "noGoDecisionPresencePrepared", "repairRequiredDecisionPresencePrepared", "authorizationPresencePrepared", "executeSwitchPresencePrepared", "confirmationPhrasePresencePrepared", "serverOnlyCredentialPresencePrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "reviewOnly", "localOnly", "shapeOnly", "presenceOnly", "fieldNameOnly", "serverOnly"]) if (output.decisionState?.[key] !== true) problems.push(`decisionState.${key} must be true`);
for (const key of ["explicitDecisionValueReadNow", "operatorGoDecisionAcceptedNow", "operatorNoGoDecisionAcceptedNow", "operatorRepairRequiredDecisionAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) if (output.decisionState?.[key] !== false) problems.push(`decisionState.${key} must be false`);
if (pkg.scripts?.["report:twii-explicit-operator-go-no-go-decision-preparation-alignment-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-explicit-operator-go-no-go-decision-preparation-alignment-gate"] !== "node scripts/check-twii-explicit-operator-go-no-go-decision-preparation-alignment-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Explicit Operator Go/No-Go Decision Preparation Alignment Gate", "twii_explicit_operator_go_no_go_decision_preparation_alignment_gate_ready_no_execution", "explicit_operator_go_no_go_decision_preparation_aligned_execution_still_blocked", "gateMode=explicit_operator_go_no_go_decision_preparation_alignment_fail_closed_no_execution", "explicitOperatorGoNoGoDecisionPreparationAlignmentGatePrepared=true", "finalAuthorizationStoplinePreparationAlignmentReferenced=true", "decisionOptionsPlaceholderOnly=true", "requiredDecisionFieldsPrepared=true", "finalAuthorizationStoplineAlignmentHandoffPrepared=true", "goDecisionPresencePrepared=true", "noGoDecisionPresencePrepared=true", "repairRequiredDecisionPresencePrepared=true", "authorizationPresencePrepared=true", "executeSwitchPresencePrepared=true", "confirmationPhrasePresencePrepared=true", "serverOnlyCredentialPresencePrepared=true", "currentDecisionPreparationAlignmentStatus=explicit_operator_go_no_go_decision_preparation_alignment_ready_waiting_external_values", "nextReviewOnlyRoute=explicit_operator_go_no_go_decision_preparation_alignment_review_then_operator_value_intake_stopline_preparation", "allowedNextCommandCategory=review_only_operator_value_intake_stopline_preparation", "operatorGoDecisionAcceptedNow=false", "operatorNoGoDecisionAcceptedNow=false", "operatorRepairRequiredDecisionAcceptedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_explicit_operator_go_no_go_decision_preparation_alignment_contract_review_ready", "explicit operator go/no-go decision preparation contract", "final authorization stopline alignment handoff", "separate attempt preparation reference", "explicit execution packet reference", "go/no-go/repair-required decision options placeholders", "authorization presence placeholder", "execute switch placeholder", "confirmation phrase placeholder", "server-only credential presence placeholder", "rollback dry-run proof placeholder", "aggregate readback proof placeholder", "post-run review proof placeholder", "duplicate rejection proof placeholder", "blocked reasons", "next route", "fail-closed rules", "PM integration notes", "TWII", "daily_prices", "60 rows"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_explicit_operator_go_no_go_decision_preparation_alignment_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "explicit operator go/no-go decision preparation alignment", "hard boundaries", "PM integration notes", "publicDataSource=mock", "scoreSource=mock"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII explicit operator go/no-go decision preparation alignment gate slice", "docs/TWII_EXPLICIT_OPERATOR_GO_NO_GO_DECISION_PREPARATION_ALIGNMENT_GATE.md", "twii_explicit_operator_go_no_go_decision_preparation_alignment_gate_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_EXPLICIT_OPERATOR_GO_NO_GO_DECISION_PREPARATION_ALIGNMENT_GATE.md` is `accepted` as TWII explicit operator go/no-go decision preparation alignment gate", "twii_explicit_operator_go_no_go_decision_preparation_alignment_gate_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-explicit-operator-go-no-go-decision-preparation-alignment-gate.mjs", "name: \"twii-explicit-operator-go-no-go-decision-preparation-alignment-gate\"", "\"twii-explicit-operator-go-no-go-decision-preparation-alignment-gate\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["explicit operator go/no-go decision preparation alignment stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, currentDecisionPreparationAlignmentStatus: output.currentDecisionPreparationAlignmentStatus, nextReviewOnlyRoute: output.nextReviewOnlyRoute, decisionOptionCount: output.decisionValidation.decisionOptionCount, placeholderCount: output.decisionValidation.placeholderCount, selectedNowCount: output.decisionValidation.selectedNowCount, decisionAcceptedNowCount: output.decisionValidation.decisionAcceptedNowCount, reviewOnly: output.decisionState.reviewOnly, presenceOnly: output.decisionState.presenceOnly, fieldNameOnly: output.decisionState.fieldNameOnly, serverOnly: output.decisionState.serverOnly, runnerExecutableNow: output.decisionState.runnerExecutableNow, executionAllowedNow: output.decisionState.executionAllowedNow }, null, 2));

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
