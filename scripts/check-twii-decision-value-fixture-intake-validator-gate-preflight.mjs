import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-decision-value-fixture-intake-validator-gate-preflight.mjs";
const docPath = "docs/TWII_DECISION_VALUE_FIXTURE_INTAKE_VALIDATOR_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-decision-value-fixture-intake-validator-gate-preflight.json";
const fixturePath = "data/source-gates/twii-decision-value-fixture-intake-validator-safe-fixtures.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const gateText = read(gatePath);
const fixtureText = read(fixturePath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "decision fixture validator stdout");

if (run.status !== 0) problems.push("decision fixture validator report must exit 0");
if (output.status !== "twii_decision_value_fixture_intake_validator_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "decision_value_fixture_intake_validator_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.fixtureValidatorMode !== "decision_value_fixture_intake_validator_fail_closed_no_execution") problems.push("fixtureValidatorMode mismatch");
if (output.validation?.caseCount !== 5) problems.push("fixture caseCount must be 5");
if (output.validation?.validCount !== 3) problems.push("fixture validCount must be 3");
if (output.validation?.invalidCount !== 2) problems.push("fixture invalidCount must be 2");
for (const key of ["fixtureValidatorPrepared", "sourceDecisionIntakeGateReferenced", "safeFixturesReferenced", "safeFixturesAreSynthetic"]) if (output.validatorState?.[key] !== true) problems.push(`validatorState.${key} must be true`);
for (const key of ["realDecisionValueReadNow", "fixtureDecisionValueAcceptedAsReal", "decisionValueRecordedNow", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.validatorState?.[key] !== false) problems.push(`validatorState.${key} must be false`);
if (pkg.scripts?.["report:twii-decision-value-fixture-intake-validator-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-decision-value-fixture-intake-validator-gate-preflight"] !== "node scripts/check-twii-decision-value-fixture-intake-validator-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Decision Value Fixture Intake Validator Gate Preflight", "twii_decision_value_fixture_intake_validator_gate_preflight_ready_no_execution", "decision_value_fixture_intake_validator_ready_execution_still_blocked", "safeFixturesAreSynthetic=true", "realDecisionValueReadNow=false", "fixtureDecisionValueAcceptedAsReal=false", "acceptedDecisionRecordedNow=false", "runnerExecutableNow=false", "executionAllowedNow=false", "allowedStatuses=[accepted,rejected,repair_required]", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["Latest TWII decision value fixture intake validator gate preflight slice", "docs/TWII_DECISION_VALUE_FIXTURE_INTAKE_VALIDATOR_GATE_PREFLIGHT.md", "twii_decision_value_fixture_intake_validator_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_DECISION_VALUE_FIXTURE_INTAKE_VALIDATOR_GATE_PREFLIGHT.md` is `accepted` as TWII decision value fixture intake validator gate preflight", "twii_decision_value_fixture_intake_validator_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-decision-value-fixture-intake-validator-gate-preflight.mjs", "name: \"twii-decision-value-fixture-intake-validator-gate-preflight\"", "\"twii-decision-value-fixture-intake-validator-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [fixturePath, fixtureText], [docPath, doc], ["decision fixture validator stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, fixtureValidatorMode: output.fixtureValidatorMode, caseCount: output.validation.caseCount, validCount: output.validation.validCount, invalidCount: output.validation.invalidCount, realDecisionValueReadNow: output.validatorState.realDecisionValueReadNow, runnerExecutableNow: output.validatorState.runnerExecutableNow, executionAllowedNow: output.validatorState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
