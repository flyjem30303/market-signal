import { spawnSync } from "node:child_process";

const problems = [];

const skeleton = runJson(["scripts/report-twii-non-executing-write-runner-skeleton.mjs"], {
  packetPath: "tmp\\twii-non-executing-runner-safe-packet.json",
  execute: "true",
  confirmation: "CEO_PM_ACK_TWII_NON_EXECUTING_WRITE_RUNNER_SKELETON_ONLY"
});
const packetTemplate = runJson(["scripts/report-twii-supabase-write-gate-packet-template.mjs"]);
const runnerBoundary = runJson(["scripts/report-twii-write-gate-runner-boundary.mjs"]);
const futureReview = runJson(["scripts/report-twii-future-write-gate-review-packet.mjs"]);

if (skeleton.status !== "twii_non_executing_write_runner_skeleton_ready_fail_closed") problems.push("fail_closed_skeleton_not_ready");
if (packetTemplate.status !== "twii_supabase_write_gate_packet_template_ready_local_only") {
  problems.push("write_gate_packet_template_not_ready");
}
if (runnerBoundary.status !== "twii_write_gate_runner_boundary_ready_local_only") problems.push("runner_boundary_not_ready");
if (futureReview.status !== "twii_future_write_gate_review_packet_ready_no_execution") {
  problems.push("future_write_gate_review_packet_not_ready");
}

assertSafety(skeleton, "skeleton");
assertSafety(packetTemplate, "packetTemplate");
assertSafety(runnerBoundary, "runnerBoundary");
assertSafety(futureReview, "futureReview");

const report = {
  status:
    problems.length === 0
      ? "twii_write_runner_implementation_review_gate_ready_future_review_no_execution"
      : "blocked",
  outcome:
    problems.length === 0
      ? "implementation_review_ready_but_real_write_still_blocked"
      : "implementation_review_blocked",
  mode: "twii_write_runner_implementation_review_gate",
  owner: "CEO/PM",
  upstream: {
    skeletonStatus: skeleton.status ?? null,
    packetTemplateStatus: packetTemplate.status ?? null,
    runnerBoundaryStatus: runnerBoundary.status ?? null,
    futureReviewStatus: futureReview.status ?? null
  },
  prerequisiteStatus: {
    sourceRightsDecision: "accepted_for_future_gate_prep",
    fieldContractDecision: "accepted_for_future_gate_prep",
    assetMappingDecision: "accepted_for_future_gate_prep",
    candidateGatePacket: "accepted_future_gate_only",
    futureWriteGateReviewPacket: futureReview.status === "twii_future_write_gate_review_packet_ready_no_execution" ? "accepted_no_execution" : "blocked",
    writeGatePacketTemplate: packetTemplate.status === "twii_supabase_write_gate_packet_template_ready_local_only" ? "accepted_local_only" : "blocked",
    runnerBoundary: runnerBoundary.status === "twii_write_gate_runner_boundary_ready_local_only" ? "accepted_local_only" : "blocked",
    failClosedSkeletonTests: skeleton.status === "twii_non_executing_write_runner_skeleton_ready_fail_closed" ? "accepted_local_only" : "blocked",
    rollbackDryRunPlan: "accepted_for_future_gate_prep",
    postWriteReadbackPlan: "accepted_for_future_gate_prep",
    postWriteReviewPlan: "accepted_for_future_gate_prep"
  },
  requiredBeforeAnyFutureExecution: [
    "separate_explicit_execution_packet",
    "server_only_credential_handling_check",
    "execute_switch_true",
    "exact_confirmation_phrase",
    "rollback_dry_run",
    "aggregate_post_write_readback",
    "post_write_review",
    "separate_row_coverage_scoring_gate",
    "separate_public_source_promotion_gate"
  ],
  implementationAllowedNow: false,
  writeGateExecutableNow: false,
  nextAction:
    "Prepare a separate future execution packet only if CEO/PM choose to proceed; this report still does not implement or execute writes.",
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
if (problems.length > 0) process.exit(1);

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
