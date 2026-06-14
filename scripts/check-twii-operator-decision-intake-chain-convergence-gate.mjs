import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-operator-decision-intake-chain-convergence-gate.mjs";
const docPath = "docs/TWII_OPERATOR_DECISION_INTAKE_CHAIN_CONVERGENCE_GATE.md";
const gatePath = "data/source-gates/twii-operator-decision-intake-chain-convergence-gate.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const gateText = read(gatePath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "operator decision intake chain convergence stdout");

if (run.status !== 0) problems.push("operator decision intake chain convergence report must exit 0");
if (output.status !== "twii_operator_decision_intake_chain_convergence_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "operator_decision_intake_chain_converged_execution_still_blocked") problems.push("outcome mismatch");
if (output.nextPMRoute !== "twii_pre_execution_readiness_recheck_preparation_gate") problems.push("nextPMRoute mismatch");
if (output.chain?.readyGateCount !== 5) problems.push("readyGateCount must be 5");
if (output.chain?.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
if (output.chain?.publicDataSource !== "mock") problems.push("publicDataSource must be mock");
if (output.chain?.scoreSource !== "mock") problems.push("scoreSource must be mock");
for (const key of [
  "operatorExecutionPacketChainConverged",
  "explicitOperatorGoNoGoDecisionPreparationAlignmentReady",
  "explicitOperatorGoNoGoDecisionPreparationReady",
  "operatorValueIntakeStoplinePreparationReady",
  "externalValuesShapeRecheckPreparationReady",
  "preExecutionReadinessRecheckPreparationPreparedAsNextRoute",
  "mockBoundaryPreserved",
  "noExecution",
  "noSecretValues",
  "noRawPayload"
]) if (output.chainState?.[key] !== true) problems.push(`chainState.${key} must be true`);
if (pkg.scripts?.["report:twii-operator-decision-intake-chain-convergence-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-operator-decision-intake-chain-convergence-gate"] !== "node scripts/check-twii-operator-decision-intake-chain-convergence-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of [
  "TWII Operator Decision Intake Chain Convergence Gate",
  "twii_operator_decision_intake_chain_convergence_gate_ready_no_execution",
  "operator_decision_intake_chain_converged_execution_still_blocked",
  "nextPMRoute=twii_pre_execution_readiness_recheck_preparation_gate",
  "readyGateCount=5",
  "operatorExecutionPacketChainConverged=true",
  "explicitOperatorGoNoGoDecisionPreparationAlignmentReady=true",
  "explicitOperatorGoNoGoDecisionPreparationReady=true",
  "operatorValueIntakeStoplinePreparationReady=true",
  "externalValuesShapeRecheckPreparationReady=true",
  "preExecutionReadinessRecheckPreparationPreparedAsNextRoute=true",
  "executionAllowedNow=false",
  "publicDataSource=mock",
  "scoreSource=mock"
]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of [
  "TWII Operator Decision Intake Chain Convergence Gate",
  "twii_operator_decision_intake_chain_convergence_gate_ready_no_execution",
  "twii_pre_execution_readiness_recheck_preparation_gate"
]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of [
  "scripts/check-twii-operator-decision-intake-chain-convergence-gate.mjs",
  "name: \"twii-operator-decision-intake-chain-convergence-gate\"",
  "\"twii-operator-decision-intake-chain-convergence-gate\""
]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], ["operator decision intake chain convergence stdout", run.stdout ?? ""]]) {
  for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "ok",
  guardedStatus: output.status,
  outcome: output.outcome,
  nextPMRoute: output.nextPMRoute,
  readyGateCount: output.chain.readyGateCount,
  executionAllowedNow: output.chain.executionAllowedNow,
  publicDataSource: output.chain.publicDataSource,
  scoreSource: output.chain.scoreSource
}, null, 2));

function forbiddenPatterns() {
  return [
    /from\s+["']@supabase\/supabase-js["']/,
    /createClient\s*\(/,
    /\.from\s*\(/,
    /\.insert\s*\(/,
    /\.upsert\s*\(/,
    /\.update\s*\(/,
    /\.delete\s*\(/,
    /scoreSource\s*[:=]\s*["']real["']/,
    /publicDataSource\s*[:=]\s*["']supabase["']/
  ];
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "{}";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} is not JSON: ${error.message}`);
    return {};
  }
}
