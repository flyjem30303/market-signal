import { spawnSync } from "node:child_process";
import fs from "node:fs";

const docPath = "docs/TWII_EXACT_EXECUTION_PREFLIGHT_REPAIR_SELECTOR.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const finalExecution = runJson("scripts/report-twii-final-execution-packet-preflight.mjs");
const finalRuntime = runJson("scripts/report-twii-final-runtime-execution-gate-preflight.mjs");
const finalOperator = runJson("scripts/report-twii-final-operator-authorization-packet-preflight.mjs");
const sourceRightsBridge = runJson("scripts/report-twii-source-rights-outcome-gate-bridge.mjs");
const sourceRightsAcceptance = readJson("data/source-gates/twii-source-rights-outcome-acceptance.json");
const fieldAlignment = readJson("data/source-gates/twii-field-contract-asset-mapping-alignment.json");

const requiredDocPhrases = [
  "Status: `twii_exact_execution_preflight_repair_selector_ready_no_execution`",
  "`twii_first_level_1_closure_exact_execution_gate_or_repair`",
  "The blocker is not runner implementation.",
  "The former source-rights and field-contract blockers are now resolved for the next gate only.",
  "`twii_sanitized_candidate_artifact_readiness_gate`",
  "Route 1 - TWII Sanitized Candidate Artifact Readiness Gate",
  "Route id: `twii_sanitized_candidate_artifact_readiness_gate`",
  "Current posture: `selected_next_no_execution`",
  "acceptedForSourceRightsOutcomeGateOnly=4",
  "missingRequiredIds=0",
  "Route 2 - Operator Packet Intake Review",
  "Route id: `twii_operator_packet_intake_review`",
  "Route 3 - Exact Bounded Execution Gate Preparation",
  "Route id: `twii_exact_bounded_execution_gate_prepare_only`",
  "Resolved Route - TWII Source-Rights Outcome Gate",
  "Route id: `twii_source_rights_outcome_gate_acceptance`",
  "Current posture: `resolved_next_gate_only_no_execution`",
  "Resolved Route - TWII Field-Contract And Asset-Mapping Acceptance",
  "Route id: `twii_field_contract_asset_mapping_acceptance`",
  "Current posture: `resolved_for_sanitized_candidate_gate_only`",
  "Next route: `twii_sanitized_candidate_artifact_readiness_gate`",
  "publicDataSource=mock",
  "scoreSource=mock"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:twii-exact-execution-preflight-repair-selector"] !==
  "node scripts/check-twii-exact-execution-preflight-repair-selector.mjs"
) {
  problems.push(`${packagePath} missing check:twii-exact-execution-preflight-repair-selector script`);
}

for (const phrase of [
  "scripts/check-twii-exact-execution-preflight-repair-selector.mjs",
  "twii-exact-execution-preflight-repair-selector"
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

expect(finalExecution.status, "twii_final_execution_packet_preflight_ready_no_execution", "finalExecution.status");
expect(finalRuntime.status, "twii_final_runtime_execution_gate_preflight_ready_no_execution", "finalRuntime.status");
expect(finalOperator.status, "twii_final_operator_authorization_packet_preflight_ready_no_execution", "finalOperator.status");
expect(sourceRightsBridge.status, "ready_for_twii_source_rights_outcome_gate_only", "sourceRightsBridge.status");

expect(finalOperator.candidateArtifactPath, "data/candidates/twii-sanitized-candidate.json", "candidateArtifactPath");
expect(finalOperator.target?.targetTable, "daily_prices", "targetTable");
expect(finalOperator.target?.targetLane, "TWII", "targetLane");
expect(finalOperator.target?.targetScope, "twii_index_daily_prices_missing_rows", "targetScope");
expect(finalOperator.target?.maxRows, 60, "maxRows");
expect(sourceRightsBridge.canOpenTwiiSourceRightsOutcomeGate, true, "canOpenTwiiSourceRightsOutcomeGate");
expect(sourceRightsBridge.counts?.acceptedForSourceRightsOutcomeGateOnly, 4, "acceptedForSourceRightsOutcomeGateOnly");
expect(sourceRightsBridge.counts?.missingRequiredIds, 0, "missingRequiredIds");
expect(
  sourceRightsAcceptance.status,
  "twii_source_rights_outcome_accepted_for_next_gate_only_no_execution",
  "sourceRightsAcceptance.status"
);
expect(
  fieldAlignment.status,
  "twii_field_contract_asset_mapping_aligned_for_sanitized_candidate_gate_no_execution",
  "fieldAlignment.status"
);
expect(fieldAlignment.nextPMRoute, "twii_sanitized_candidate_artifact_readiness_gate", "fieldAlignment.nextPMRoute");

expect(finalOperator.operatorAuthorizationPacketState?.authorizationDecisionAcceptedNow, false, "authorizationDecisionAcceptedNow");
expect(finalOperator.operatorAuthorizationPacketState?.runnerExecutableNow, false, "runnerExecutableNow");
expect(finalOperator.operatorAuthorizationPacketState?.executionAllowedNow, false, "executionAllowedNow");
expect(finalOperator.operatorAuthorizationPacketState?.writeGateExecutableNow, false, "writeGateExecutableNow");
expect(finalOperator.operatorAuthorizationPacketState?.implementationAllowedNow, false, "implementationAllowedNow");

for (const [key, value] of Object.entries(finalOperator.noExecutionState ?? {})) {
  if (value !== false) problems.push(`finalOperator.noExecutionState.${key} must be false`);
}

for (const [key, value] of Object.entries(finalOperator.safety ?? {})) {
  if (key === "publicDataSource") {
    if (value !== "mock") problems.push("finalOperator.safety.publicDataSource must be mock");
    continue;
  }
  if (key === "scoreSource") {
    if (value !== "mock") problems.push("finalOperator.safety.scoreSource must be mock");
    continue;
  }
  if (key === "candidateArtifactReferenceOnly") {
    if (value !== true) problems.push("finalOperator.safety.candidateArtifactReferenceOnly must be true");
    continue;
  }
  if (value !== false) problems.push(`finalOperator.safety.${key} must be false`);
}

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /SQL execution is approved/u,
  /Supabase write is approved/u,
  /daily_prices mutation is approved/u,
  /market-data fetch is approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /investment advice approved/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

const status = problems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "twii_exact_execution_preflight_repair_selector_ready_no_execution",
      selectedNextRoute: "twii_sanitized_candidate_artifact_readiness_gate",
      nextAfterAcceptance: [
        "twii_operator_packet_intake_review",
        "twii_exact_bounded_execution_gate_prepare_only"
      ],
      resolvedRoutes: [
        "twii_source_rights_outcome_gate_acceptance",
        "twii_field_contract_asset_mapping_acceptance"
      ],
      target: finalOperator.target,
      publicDataSource: finalOperator.safety?.publicDataSource,
      scoreSource: finalOperator.safety?.scoreSource,
      twiiExecutionAllowedNow: finalOperator.operatorAuthorizationPacketState?.executionAllowedNow,
      sourceRightsBridgeReady: sourceRightsBridge.canOpenTwiiSourceRightsOutcomeGate,
      problems
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  try {
    return JSON.parse(read(filePath));
  } catch (error) {
    problems.push(`${filePath} invalid JSON: ${error.message}`);
    return {};
  }
}

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 4
  });
  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}`);
  try {
    return JSON.parse(run.stdout);
  } catch {
    problems.push(`${scriptPath} did not emit JSON`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) {
    problems.push(`${label} must be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}
