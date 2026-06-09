import { spawnSync } from "node:child_process";

const problems = [];

const skeleton = runJson(["scripts/report-twii-non-executing-write-runner-skeleton.mjs"], {
  packetPath: "tmp\\twii-non-executing-runner-safe-packet.json",
  execute: "true",
  confirmation: "CEO_PM_ACK_TWII_NON_EXECUTING_WRITE_RUNNER_SKELETON_ONLY"
});
const packetTemplate = runJson(["scripts/report-twii-supabase-write-gate-packet-template.mjs"]);
const runnerBoundary = runJson(["scripts/report-twii-write-gate-runner-boundary.mjs"]);

if (skeleton.status !== "twii_non_executing_write_runner_skeleton_ready_fail_closed") {
  problems.push("fail_closed_skeleton_not_ready");
}
if (packetTemplate.status !== "twii_supabase_write_gate_packet_template_ready_local_only") {
  problems.push("write_gate_packet_template_not_ready");
}
if (runnerBoundary.status !== "twii_write_gate_runner_boundary_ready_local_only") {
  problems.push("runner_boundary_not_ready");
}
assertSafety(skeleton, "skeleton");
assertSafety(packetTemplate, "packetTemplate");
assertSafety(runnerBoundary, "runnerBoundary");

const prerequisiteStatus = {
  sourceRightsDecision: "blocked_or_unresolved",
  fieldContractDecision: "blocked_or_unresolved",
  assetMappingDecision: "blocked_or_unresolved",
  writeGatePacketTemplate: packetTemplate.status === "twii_supabase_write_gate_packet_template_ready_local_only" ? "accepted_local_only" : "blocked",
  runnerBoundary: runnerBoundary.status === "twii_write_gate_runner_boundary_ready_local_only" ? "accepted_local_only" : "blocked",
  failClosedSkeletonTests: skeleton.status === "twii_non_executing_write_runner_skeleton_ready_fail_closed" ? "accepted_local_only" : "blocked",
  rollbackDryRunPlan: "planned_not_executable",
  postWriteReadbackPlan: "planned_not_executable",
  postWriteReviewPlan: "planned_not_executable"
};

const unresolvedCritical = [
  "source_rights_decision_not_accepted_for_real_write",
  "field_contract_decision_not_accepted_for_real_write",
  "asset_mapping_decision_not_accepted_for_real_write",
  "rollback_dry_run_plan_not_executable",
  "post_write_readback_plan_not_executable",
  "post_write_review_plan_not_executable"
];

const report = {
  status: "twii_write_runner_implementation_review_gate_blocked_prerequisites_not_accepted",
  outcome: "implementation_upgrade_blocked_keep_skeleton_non_executing",
  mode: "twii_write_runner_implementation_review_gate",
  owner: "CEO/PM",
  upstream: {
    skeletonStatus: skeleton.status ?? null,
    packetTemplateStatus: packetTemplate.status ?? null,
    runnerBoundaryStatus: runnerBoundary.status ?? null
  },
  prerequisiteStatus,
  unresolvedCritical,
  implementationAllowedNow: false,
  nextAction:
    "Do not add Supabase client or credential access. Route A1/D back to accepted source-rights, field-contract, asset-mapping, rollback/readback/review evidence before implementation.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
process.exit(0);

function runJson(args, options = {}) {
  const extra = [];
  if (options.packetPath) extra.push("--packet-path", options.packetPath);
  if (options.execute) extra.push("--execute", options.execute);
  if (options.confirmation) extra.push("--confirmation", options.confirmation);
  const result = spawnSync(process.execPath, [...args, ...extra], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    return JSON.parse(result.stdout ?? "{}");
  } catch {
    problems.push(`${args[0]} did not return JSON`);
    return {};
  }
}

function assertSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label}_must_stay_mock`);
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key}_must_be_false`);
  }
}

