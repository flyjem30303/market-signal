import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-project-progress-snapshot.mjs";
const cadencePath = "src/lib/runtime-delivery-cadence.ts";
const workstreamPath = "src/lib/runtime-workstream-integration-queue.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = fs.readFileSync(reportPath, "utf8");
const cadenceSource = fs.readFileSync(cadencePath, "utf8");
const workstreamSource = fs.readFileSync(workstreamPath, "utf8");
const requiredSource = `${reportSource}\n${cadenceSource}\n${workstreamSource}`;
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const requiredSourcePhrases = [
  "mode: \"local_project_progress_snapshot\"",
  "status: \"local_ready_remote_paused\"",
  "getProjectProgressSummary",
  "getRuntimeReadinessSummary",
  "getRuntimeGateDecisionBrief",
  "getRuntimeDeliveryCadence",
  "getRuntimeWorkstreamIntegrationQueue",
  "getRowCoverageSecondAttemptReadiness",
  "getFreshnessRuntimeActivationSummary",
  "getFreshnessReadonlyLatestEvidenceSummary",
  "automatedRemoteRun: false",
  "connectionAttempted: false",
  "ingestionStarted: false",
  "publicDataSource: \"mock\"",
  "rowPayloadsPrinted: false",
  "scoreSource: \"mock\"",
  "scoreSourceRealEnabled: false",
  "secretsPrinted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false",
  "runtimeRoute",
  "currentDefaultRoute",
  "separateRemoteTrigger",
  "runtimeDefaultRoute",
  "runtimeSeparateRemoteTrigger",
  "post_readonly_runtime_decision",
  "requires_separate_ceo_named_action",
  "CEO explicitly names a bounded schema, freshness, quality, or source-depth gate",
  "cadenceAssessment",
  "runtimeWorkstreamIntegration",
  "pm_mainline_active_parallel_inputs_pending",
  "runtime_readiness_integration",
  "pmRuntime",
  "a1Evidence",
  "a2PublicCopy",
  "iLaunchOps",
  "pm_runtime_mainline",
  "a1_evidence_handoff",
  "a2_public_copy_gate",
  "i_launch_operations_guard",
  "Do not wait for A1, A2, or I",
  "recent_slices_too_fragmented",
  "larger_mock_runtime_product_slice",
  "runtime product 70 / blocker closure 20 / governance 10",
  "Keep mandatory gates",
  "before any Supabase connection attempt",
  "before any SQL execution",
  "before any market-data fetch or ingestion",
  "before any publicDataSource promotion",
  "before any scoreSource=real transition",
  "after any remote attempt post-run review",
  "blockerExecutionQueue",
  "bounded_row_coverage_decision_ready",
  "Data 45 / Engineering 35 / Legal-Investment 20",
  "npm run report:source-rights-disclosure-local-review",
  "npm run report:model-credibility-local-review",
  "npm run report:data-quality-field-validity-qa-review",
  "runtime product 70 / blocker closure 20 / governance 10",
  "唯讀驗證後公開 Beta 決策，接著資料結構/新鮮度/品質檢查點",
  "decisionNodes",
  "id: \"local-verification\"",
  "id: \"row-coverage-readonly\"",
  "id: \"data-quality-evidence\"",
  "id: \"runtime-public-state\"",
  "id: \"source-rights-and-disclosure\"",
  "id: \"model-credibility\"",
  "bounded_decision_ready_waiting_explicit_remote_execution_request",
  "mock_public_runtime",
  "publicDataSource and scoreSource remain mock"
];

const forbiddenSourcePatterns = [
  /@supabase\/supabase-js/,
  /createClient/,
  /fetch\(/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /automatedRemoteRun:\s*true/,
  /connectionAttempted:\s*true/,
  /ingestionStarted:\s*true/,
  /rowPayloadsPrinted:\s*true/,
  /scoreSourceRealEnabled:\s*true/,
  /secretsPrinted:\s*true/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/,
  /scoreSource:\s*"real"/,
  /publicDataSource:\s*"supabase"/
];

const forbiddenOutputPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL/,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /https:\/\/[a-z0-9-]+\.supabase\.co/i,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
  /\bservice[_ -]?role\b/i,
  /\banon[_ -]?key\b/i,
  /\btoken\s*[:=]\s*["']?[^"',\s}]+/i,
  /\bkeyPrefix\b/i,
  /\bkeySuffix\b/i,
  /\bkeyLength\b/i,
  /\bstock_id\b/,
  /\bstockId\b/,
  /\brawRows\b/,
  /\browPayload\b/i,
  /\brows\s*:\s*\[/,
  /\bselect\s+\*\s+from\b/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+[a-z_]+\s+set\b/i,
  /\bdelete\s+from\b/i,
  /\braw market data\b/i
];

const missing = requiredSourcePhrases
  .filter((phrase) => !requiredSource.includes(phrase))
  .map((phrase) => `${reportPath}: ${phrase}`);
const blocked = forbiddenSourcePatterns
  .filter((pattern) => pattern.test(reportSource))
  .map((pattern) => `${reportPath}: ${String(pattern)}`);

if (packageJson.scripts?.["report:project-progress-snapshot"] !== "node scripts/report-project-progress-snapshot.mjs") {
  missing.push(`${packagePath}: report:project-progress-snapshot`);
}

if (packageJson.scripts?.["check:project-progress-snapshot"] !== "node scripts/check-project-progress-snapshot.mjs") {
  missing.push(`${packagePath}: check:project-progress-snapshot`);
}

if (!reviewGate.includes("scripts/check-project-progress-snapshot.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-project-progress-snapshot.mjs`);
}

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

let output = null;
if (run.status !== 0) {
  blocked.push(`${reportPath}: reporter exited ${String(run.status)} ${run.stderr.trim()}`);
} else {
  for (const pattern of forbiddenOutputPatterns) {
    if (pattern.test(run.stdout)) {
      blocked.push(`${reportPath}: forbidden output pattern ${String(pattern)}`);
    }
  }

  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    blocked.push(`${reportPath}: reporter did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (output) {
  const expectedFalseFlags = [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "rowPayloadsPrinted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseWritesEnabled"
  ];

  if (output.mode !== "local_project_progress_snapshot") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }

  if (output.status !== "local_ready_remote_paused") {
    blocked.push(`output.status: ${String(output.status)}`);
  }

  if (output.safety?.publicDataSource !== "mock") {
    blocked.push(`output.safety.publicDataSource: ${String(output.safety?.publicDataSource)}`);
  }

  if (output.safety?.scoreSource !== "mock") {
    blocked.push(`output.safety.scoreSource: ${String(output.safety?.scoreSource)}`);
  }

  for (const flag of expectedFalseFlags) {
    if (output.safety?.[flag] !== false) {
      blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
    }
  }

  if (typeof output.project?.adjustedScore !== "number" || output.project.adjustedScore <= 0 || output.project.adjustedScore > 100) {
    blocked.push(`output.project.adjustedScore: ${String(output.project?.adjustedScore)}`);
  }

  if (output.runtime?.nextRemoteCommand !== "npm run db:readonly-validate") {
    blocked.push(`output.runtime.nextRemoteCommand: ${String(output.runtime?.nextRemoteCommand)}`);
  }

  if (output.runtimeRoute?.status !== "local_ready_remote_requires_separate_authorization") {
    blocked.push(`output.runtimeRoute.status: ${String(output.runtimeRoute?.status)}`);
  }

  if (output.runtimeRoute?.currentDefaultRoute !== "post_readonly_runtime_decision") {
    blocked.push(`output.runtimeRoute.currentDefaultRoute: ${String(output.runtimeRoute?.currentDefaultRoute)}`);
  }

  if (output.runtimeRoute?.separateRemoteTrigger !== "CEO explicitly names a bounded schema, freshness, quality, or source-depth gate") {
    blocked.push(`output.runtimeRoute.separateRemoteTrigger: ${String(output.runtimeRoute?.separateRemoteTrigger)}`);
  }

  const routeOptionIds = new Set((output.runtimeRoute?.routeOptions ?? []).map((item) => item.id));
  for (const id of ["post_readonly_runtime_decision", "schema_freshness_quality_gate"]) {
    if (!routeOptionIds.has(id)) {
      blocked.push(`output.runtimeRoute.routeOptions missing ${id}`);
    }
  }

  for (const routeOption of output.runtimeRoute?.routeOptions ?? []) {
    if (
      routeOption.approvedRemoteExecution === true ||
      routeOption.publicDataSource === "supabase" ||
      routeOption.scoreSource === "real"
    ) {
      blocked.push(`output.runtimeRoute.routeOptions.${String(routeOption.id)} has forbidden approval/source state`);
    }
  }

  if (output.rowCoverage?.readiness !== "local_ready_remote_paused") {
    blocked.push(`output.rowCoverage.readiness: ${String(output.rowCoverage?.readiness)}`);
  }

  if (output.freshness?.nextPublicDataSource !== "mock") {
    blocked.push(`output.freshness.nextPublicDataSource: ${String(output.freshness?.nextPublicDataSource)}`);
  }

  if (output.blockerExecutionQueue?.status !== "bounded_row_coverage_decision_ready") {
    blocked.push(`output.blockerExecutionQueue.status: ${String(output.blockerExecutionQueue?.status)}`);
  }

  if (output.cadenceAssessment?.verdict !== "recent_slices_too_fragmented") {
    blocked.push(`output.cadenceAssessment.verdict: ${String(output.cadenceAssessment?.verdict)}`);
  }

  if (output.cadenceAssessment?.nextExecutionMode !== "larger_mock_runtime_product_slice") {
    blocked.push(`output.cadenceAssessment.nextExecutionMode: ${String(output.cadenceAssessment?.nextExecutionMode)}`);
  }

  if (output.cadenceAssessment?.nextExecutionRatio !== "runtime product 70 / blocker closure 20 / governance 10") {
    blocked.push(`output.cadenceAssessment.nextExecutionRatio: ${String(output.cadenceAssessment?.nextExecutionRatio)}`);
  }

  if (output.runtimeWorkstreamIntegration?.status !== "pm_mainline_active_parallel_inputs_pending") {
    blocked.push(`output.runtimeWorkstreamIntegration.status: ${String(output.runtimeWorkstreamIntegration?.status)}`);
  }

  if (output.runtimeWorkstreamIntegration?.currentMainline !== "runtime_readiness_integration") {
    blocked.push(`output.runtimeWorkstreamIntegration.currentMainline: ${String(output.runtimeWorkstreamIntegration?.currentMainline)}`);
  }

  if (
    output.runtimeWorkstreamIntegration?.workMix?.pmRuntime !== 70 ||
    output.runtimeWorkstreamIntegration?.workMix?.a1Evidence !== 20 ||
    output.runtimeWorkstreamIntegration?.workMix?.a2PublicCopy !== 10 ||
    output.runtimeWorkstreamIntegration?.workMix?.iLaunchOps !== 0
  ) {
    blocked.push(`output.runtimeWorkstreamIntegration.workMix: ${JSON.stringify(output.runtimeWorkstreamIntegration?.workMix)}`);
  }

  if (
    output.runtimeWorkstreamIntegration?.publicDataSource !== "mock" ||
    output.runtimeWorkstreamIntegration?.scoreSource !== "mock"
  ) {
    blocked.push("output.runtimeWorkstreamIntegration sources must remain mock");
  }

  const workstreamIds = new Set((output.runtimeWorkstreamIntegration?.items ?? []).map((item) => item.id));
  for (const id of ["pm_runtime_mainline", "a1_evidence_handoff", "a2_public_copy_gate", "i_launch_operations_guard"]) {
    if (!workstreamIds.has(id)) {
      blocked.push(`output.runtimeWorkstreamIntegration.items missing ${id}`);
    }
  }

  for (const item of output.runtimeWorkstreamIntegration?.items ?? []) {
    if (item.approvedRemoteExecution === true || item.publicDataSource === "supabase" || item.scoreSource === "real") {
      blocked.push(`output.runtimeWorkstreamIntegration.items.${String(item.id)} has forbidden approval/source state`);
    }
  }

  const mandatoryCutpoints = new Set(output.cadenceAssessment?.mandatoryCutpoints ?? []);
  for (const cutpoint of [
    "before any Supabase connection attempt",
    "before any SQL execution",
    "before any market-data fetch or ingestion",
    "before any publicDataSource promotion",
    "before any scoreSource=real transition",
    "after any remote attempt post-run review"
  ]) {
    if (!mandatoryCutpoints.has(cutpoint)) {
      blocked.push(`output.cadenceAssessment.mandatoryCutpoints missing ${cutpoint}`);
    }
  }

  if (output.blockerExecutionQueue?.ceoLaneRatio !== "Data 45 / Engineering 35 / Legal-Investment 20") {
    blocked.push(`output.blockerExecutionQueue.ceoLaneRatio: ${String(output.blockerExecutionQueue?.ceoLaneRatio)}`);
  }

  const queueIds = new Set((output.blockerExecutionQueue?.items ?? []).map((item) => item.id));
  for (const id of ["data-quality-evidence", "source-rights-and-disclosure", "model-credibility"]) {
    if (!queueIds.has(id)) {
      blocked.push(`output.blockerExecutionQueue.items missing ${id}`);
    }
  }

  if (!Array.isArray(output.decisionNodes) || output.decisionNodes.length < 6) {
    blocked.push(`output.decisionNodes: expected at least 6 nodes, got ${String(output.decisionNodes?.length)}`);
  } else {
    const requiredNodeIds = [
      "local-verification",
      "row-coverage-readonly",
      "data-quality-evidence",
      "runtime-public-state",
      "source-rights-and-disclosure",
      "model-credibility"
    ];
    const observedNodeIds = new Set(output.decisionNodes.map((node) => node.id));

    for (const id of requiredNodeIds) {
      if (!observedNodeIds.has(id)) {
        blocked.push(`output.decisionNodes missing ${id}`);
      }
    }

    for (const node of output.decisionNodes) {
      if (node.approvedRemoteExecution === true || node.publicDataSource === "supabase" || node.scoreSource === "real") {
        blocked.push(`output.decisionNodes.${String(node.id)} has forbidden approval/source state`);
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
