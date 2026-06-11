import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-real-decision-acceptance-dry-run-gate-preflight.mjs";
const docPath = "docs/TWII_REAL_DECISION_ACCEPTANCE_DRY_RUN_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-real-decision-acceptance-dry-run-gate-preflight.json";
const fixturesPath = "data/source-gates/twii-real-decision-acceptance-dry-run-fixtures.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const gateText = read(gatePath);
const fixturesText = read(fixturesPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "real decision acceptance dry-run stdout");

if (run.status !== 0) problems.push("real decision acceptance dry-run report must exit 0");
if (output.status !== "twii_real_decision_acceptance_dry_run_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "real_decision_acceptance_dry_run_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.dryRunGateMode !== "real_decision_acceptance_dry_run_fail_closed_no_execution") problems.push("dryRunGateMode mismatch");
if (output.fixtureValidation?.caseCount !== 3) problems.push("fixture caseCount must be 3");
if (output.fixtureValidation?.validCaseCount !== 3) problems.push("fixture validCaseCount must be 3");
for (const statusName of ["accepted", "rejected", "repair_required"]) if (!(output.fixtureValidation?.observedStatuses ?? []).includes(statusName)) problems.push(`fixture missing ${statusName}`);
for (const key of ["dryRunGatePrepared", "sourceTemplateGateReferenced", "sourceBlankTemplateReferenced", "dryRunFixturesReferenced", "dryRunOnly", "syntheticFixtureOnly", "acceptedPathDryRunPrepared", "rejectedPathDryRunPrepared", "repairRequiredPathDryRunPrepared"]) if (output.dryRunState?.[key] !== true) problems.push(`dryRunState.${key} must be true`);
for (const key of ["realDecisionValueReadNow", "realDecisionValueRecordedNow", "fixtureDecisionAcceptedAsReal", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.dryRunState?.[key] !== false) problems.push(`dryRunState.${key} must be false`);
if (pkg.scripts?.["report:twii-real-decision-acceptance-dry-run-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-real-decision-acceptance-dry-run-gate-preflight"] !== "node scripts/check-twii-real-decision-acceptance-dry-run-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Real Decision Acceptance Dry Run Gate Preflight", "twii_real_decision_acceptance_dry_run_gate_preflight_ready_no_execution", "real_decision_acceptance_dry_run_ready_execution_still_blocked", "dryRunGateMode=real_decision_acceptance_dry_run_fail_closed_no_execution", "dryRunOnly=true", "syntheticFixtureOnly=true", "acceptedPathDryRunPrepared=true", "rejectedPathDryRunPrepared=true", "repairRequiredPathDryRunPrepared=true", "realDecisionValueReadNow=false", "realDecisionValueRecordedNow=false", "fixtureDecisionAcceptedAsReal=false", "acceptedDecisionRecordedNow=false", "rejectedDecisionRecordedNow=false", "repairRequiredDecisionRecordedNow=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["Latest TWII real decision acceptance dry-run gate preflight slice", "docs/TWII_REAL_DECISION_ACCEPTANCE_DRY_RUN_GATE_PREFLIGHT.md", "twii_real_decision_acceptance_dry_run_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_REAL_DECISION_ACCEPTANCE_DRY_RUN_GATE_PREFLIGHT.md` is `accepted` as TWII real decision acceptance dry-run gate preflight", "twii_real_decision_acceptance_dry_run_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-real-decision-acceptance-dry-run-gate-preflight.mjs", "name: \"twii-real-decision-acceptance-dry-run-gate-preflight\"", "\"twii-real-decision-acceptance-dry-run-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [fixturesPath, fixturesText], [docPath, doc], ["real decision acceptance dry-run stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, dryRunGateMode: output.dryRunGateMode, caseCount: output.fixtureValidation.caseCount, validCaseCount: output.fixtureValidation.validCaseCount, dryRunOnly: output.dryRunState.dryRunOnly, realDecisionValueReadNow: output.dryRunState.realDecisionValueReadNow, runnerExecutableNow: output.dryRunState.runnerExecutableNow, executionAllowedNow: output.dryRunState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
