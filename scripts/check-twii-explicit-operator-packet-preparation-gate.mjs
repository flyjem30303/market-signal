import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-explicit-operator-packet-preparation-gate.mjs";
const docPath = "docs/TWII_EXPLICIT_OPERATOR_PACKET_PREPARATION_GATE.md";
const gatePath = "data/source-gates/twii-explicit-operator-packet-preparation-gate.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const gateText = read(gatePath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const output = parseJson(run.stdout ?? "", "explicit operator packet preparation stdout");

if (run.status !== 0) problems.push("explicit operator packet preparation report must exit 0");
if (output.status !== "twii_explicit_operator_packet_preparation_gate_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "explicit_operator_packet_prepared_execution_still_blocked") problems.push("outcome mismatch");
if (output.gateMode !== "explicit_operator_packet_preparation_fail_closed_no_execution") problems.push("gateMode mismatch");
if (output.nextPMRoute !== "twii_separate_authorized_execution_attempt_preparation_gate") problems.push("nextPMRoute mismatch");
if (output.packetReadiness?.requiredFieldCount !== 12) problems.push("requiredFieldCount must be 12");
if (output.packetReadiness?.placeholderCount !== 12) problems.push("placeholderCount must be 12");
if (output.packetReadiness?.providedNowCount !== 0) problems.push("providedNowCount must be 0");
if (output.packetReadiness?.valueReadNowCount !== 0) problems.push("valueReadNowCount must be 0");
for (const key of [
  "boundedExecutionPacketReadinessReferenced",
  "boundedOperatorAuthorizationPacketPreparationReferenced",
  "explicitExecutionPacketPreparationReferenced",
  "serverOnlyIntegrationReferenced",
  "rollbackReadinessReferenced",
  "aggregateReadbackReferenced",
  "postRunReviewReferenced",
  "duplicateRejectionReferenced",
  "publicCopyTruthfulnessReferenced",
  "mockBoundaryPreserved",
  "executionStopLinesPrepared",
  "reviewOnly",
  "localOnly",
  "fieldNameOnly",
  "presenceOnly",
  "noSecretValues"
]) if (output.packetState?.[key] !== true) problems.push(`packetState.${key} must be true`);
for (const key of [
  "operatorDecisionProvidedNow",
  "operatorAuthorizationAcceptedNow",
  "executeSwitchProvided",
  "confirmationPhraseProvided",
  "serverOnlyCredentialCheckPassed",
  "rollbackDryRunPassed",
  "aggregateReadbackPassed",
  "postRunReviewPassed",
  "candidateDuplicateRejectionProofPassed",
  "executionAllowedNow",
  "writeGateExecutableNow",
  "publicPromotionAllowed",
  "scoreSourceRealAllowed"
]) if (output.packetState?.[key] !== false) problems.push(`packetState.${key} must be false`);
if (pkg.scripts?.["report:twii-explicit-operator-packet-preparation-gate"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-explicit-operator-packet-preparation-gate"] !== "node scripts/check-twii-explicit-operator-packet-preparation-gate.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of [
  "TWII Explicit Operator Packet Preparation Gate",
  "twii_explicit_operator_packet_preparation_gate_ready_no_execution",
  "explicit_operator_packet_prepared_execution_still_blocked",
  "gateMode=explicit_operator_packet_preparation_fail_closed_no_execution",
  "nextPMRoute=twii_separate_authorized_execution_attempt_preparation_gate",
  "boundedExecutionPacketReadinessReferenced=true",
  "boundedOperatorAuthorizationPacketPreparationReferenced=true",
  "explicitExecutionPacketPreparationReferenced=true",
  "serverOnlyIntegrationReferenced=true",
  "rollbackReadinessReferenced=true",
  "aggregateReadbackReferenced=true",
  "postRunReviewReferenced=true",
  "duplicateRejectionReferenced=true",
  "publicCopyTruthfulnessReferenced=true",
  "operatorDecisionProvidedNow=false",
  "operatorAuthorizationAcceptedNow=false",
  "executeSwitchProvided=false",
  "confirmationPhraseProvided=false",
  "serverOnlyCredentialCheckPassed=false",
  "rollbackDryRunPassed=false",
  "aggregateReadbackPassed=false",
  "postRunReviewPassed=false",
  "candidateDuplicateRejectionProofPassed=false",
  "executionAllowedNow=false",
  "publicDataSource=mock",
  "scoreSource=mock"
]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of [
  "TWII Explicit Operator Packet Preparation Gate",
  "twii_explicit_operator_packet_preparation_gate_ready_no_execution",
  "twii_separate_authorized_execution_attempt_preparation_gate"
]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of [
  "scripts/check-twii-explicit-operator-packet-preparation-gate.mjs",
  "name: \"twii-explicit-operator-packet-preparation-gate\"",
  "\"twii-explicit-operator-packet-preparation-gate\""
]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [docPath, doc], ["explicit operator packet preparation stdout", run.stdout ?? ""]]) {
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
  requiredFieldCount: output.packetReadiness.requiredFieldCount,
  placeholderCount: output.packetReadiness.placeholderCount,
  providedNowCount: output.packetReadiness.providedNowCount,
  valueReadNowCount: output.packetReadiness.valueReadNowCount,
  executionAllowedNow: output.packetState.executionAllowedNow,
  publicDataSource: output.safety.publicDataSource,
  scoreSource: output.safety.scoreSource
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
