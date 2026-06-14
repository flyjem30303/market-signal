import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-final-stopline-to-operator-intake-chain-convergence-gate.mjs";
const gatePath = "data/source-gates/twii-final-stopline-to-operator-intake-chain-convergence-gate.json";
const docPath = "docs/TWII_FINAL_STOPLINE_TO_OPERATOR_INTAKE_CHAIN_CONVERGENCE_GATE.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const pkg = JSON.parse(read(packagePath));
const doc = readMaybe(docPath);
const status = read(statusPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "final stopline to operator intake chain convergence stdout");

if (run.status !== 0) problems.push("final stopline to operator intake chain convergence report must exit 0");
if (output.status !== "twii_final_stopline_to_operator_intake_chain_convergence_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "final_stopline_to_operator_intake_chain_converged_execution_still_blocked") problems.push("outcome mismatch");
if (output.nextPMRoute !== "twii_external_values_shape_recheck_preparation_gate") problems.push("nextPMRoute mismatch");
if (output.chain?.readyGateCount !== 3) problems.push("readyGateCount must be 3");
if (output.chain?.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
if (output.chain?.publicDataSource !== "mock") problems.push("publicDataSource must be mock");
if (output.chain?.scoreSource !== "mock") problems.push("scoreSource must be mock");
for (const key of [
  "finalAuthorizationStoplineGoNoGoReady",
  "explicitOperatorGoNoGoDecisionPreparationReady",
  "operatorValueIntakeStoplinePreparationReady",
  "externalValuesShapeRecheckPreparationPreparedAsNextRoute",
  "mockBoundaryPreserved",
  "noExecution",
  "noSecretValues",
  "noRawPayload"
]) if (output.chainState?.[key] !== true) problems.push(`chainState.${key} must be true`);
for (const [key, value] of Object.entries({
  finalStoplineGoNoGoStatus: "twii_final_authorization_stopline_go_no_go_gate_ready_no_execution",
  explicitOperatorGoNoGoStatus: "twii_explicit_operator_go_no_go_decision_preparation_gate_ready_no_execution",
  operatorValueIntakeStatus: "twii_operator_value_intake_stopline_preparation_gate_ready_no_execution",
  externalValuesShapeStatus: "twii_external_values_shape_recheck_preparation_gate_ready_no_execution"
})) if (output.upstream?.[key] !== value) problems.push(`${key} mismatch`);
if (pkg.scripts?.["report:twii-final-stopline-to-operator-intake-chain-convergence-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-final-stopline-to-operator-intake-chain-convergence-gate"] !== "node scripts/check-twii-final-stopline-to-operator-intake-chain-convergence-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of [
  "TWII Final Stopline To Operator Intake Chain Convergence Gate",
  "twii_final_stopline_to_operator_intake_chain_convergence_gate_ready_no_execution",
  "final_stopline_to_operator_intake_chain_converged_execution_still_blocked",
  "nextPMRoute=twii_external_values_shape_recheck_preparation_gate",
  "readyGateCount=3",
  "finalAuthorizationStoplineGoNoGoReady=true",
  "explicitOperatorGoNoGoDecisionPreparationReady=true",
  "operatorValueIntakeStoplinePreparationReady=true",
  "externalValuesShapeRecheckPreparationPreparedAsNextRoute=true",
  "executionAllowedNow=false",
  "publicDataSource=mock",
  "scoreSource=mock"
]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of [
  "TWII Final Stopline To Operator Intake Chain Convergence Gate",
  "twii_final_stopline_to_operator_intake_chain_convergence_gate_ready_no_execution",
  "twii_external_values_shape_recheck_preparation_gate"
]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of [
  "scripts/check-twii-final-stopline-to-operator-intake-chain-convergence-gate.mjs",
  "name: \"twii-final-stopline-to-operator-intake-chain-convergence-gate\"",
  "\"twii-final-stopline-to-operator-intake-chain-convergence-gate\""
]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, readMaybe(gatePath)], [docPath, doc], [reportPath, readMaybe(reportPath)], ["stdout", run.stdout ?? ""]]) {
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

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readMaybe(filePath) {
  try {
    return read(filePath);
  } catch {
    return "";
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
