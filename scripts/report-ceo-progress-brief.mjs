import { spawnSync } from "node:child_process";

const snapshotRun = spawnSync(process.execPath, ["scripts/report-project-progress-snapshot.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (snapshotRun.status !== 0) {
  throw new Error(`project progress snapshot failed: ${snapshotRun.stderr.trim()}`);
}

const snapshot = JSON.parse(snapshotRun.stdout);
const expectedRuntimeDefaultRoute = "mock_runtime_hardening";

if (snapshot.runtimeRoute?.currentDefaultRoute !== expectedRuntimeDefaultRoute) {
  throw new Error("CEO progress brief runtime route boundary mismatch");
}

const blockedNodes = snapshot.decisionNodes.filter((node) => node.status === "blocked");
const waitingNodes = snapshot.decisionNodes.filter((node) => node.status === "waiting_explicit_remote_approval");
const readyNodes = snapshot.decisionNodes.filter((node) => node.status === "passed" || node.readiness === "ready");
const blockerResolutionRun = spawnSync(process.execPath, ["scripts/report-blocker-resolution-plan.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (blockerResolutionRun.status !== 0) {
  throw new Error(`blocker resolution plan failed: ${blockerResolutionRun.stderr.trim()}`);
}

const blockerResolution = JSON.parse(blockerResolutionRun.stdout);
const narrowPostReviewRun = spawnSync(process.execPath, ["scripts/report-narrow-approval-post-review-gate.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (narrowPostReviewRun.status !== 0) {
  throw new Error(`narrow approval post-review gate failed: ${narrowPostReviewRun.stderr.trim()}`);
}

const narrowPostReview = JSON.parse(narrowPostReviewRun.stdout);

const lines = [
  "CEO Progress Brief",
  `Progress: ${snapshot.project.adjustedScore}%`,
  `Status: ${snapshot.status}`,
  `Lane ratio: ${snapshot.ceoDecision.currentLaneRatio}`,
  `Cadence: ${snapshot.cadenceAssessment.verdict} -> ${snapshot.cadenceAssessment.nextExecutionMode}`,
  `Slice size: ${snapshot.cadenceAssessment.targetSliceSize}`,
  `Runtime: ${snapshot.runtime.score}% / ${snapshot.runtime.status}`,
  `Runtime route: ${snapshot.runtimeRoute.currentDefaultRoute} / ${snapshot.runtimeRoute.status}`,
  `Remote trigger: ${snapshot.runtimeRoute.separateRemoteTrigger}`,
  `Route options: ${snapshot.runtimeRoute.routeOptions.map((item) => `${item.id}:${item.status}`).join(", ")}`,
  `Row coverage: ${snapshot.rowCoverage.readiness}`,
  `Freshness evidence: ${snapshot.freshness.latestEvidenceStatus}`,
  `Blocker queue: ${snapshot.blockerExecutionQueue.status} / ${snapshot.blockerExecutionQueue.ceoLaneRatio}`,
  `Queue items: ${snapshot.blockerExecutionQueue.items.map((item) => item.id).join(", ")}`,
  `Unblock readiness: ${blockerResolution.unblockDecisionReadiness.status} / humanApproval=${String(blockerResolution.unblockDecisionReadiness.canRequestHumanApproval)}`,
  `Approval outcome: ${narrowPostReview.status}`,
  `Next meaningful gate: ${snapshot.ceoDecision.nextMeaningfulGate}`,
  "Safety: publicDataSource=mock, scoreSource=mock, sqlExecuted=false, connectionAttempted=false, supabaseWritesEnabled=false",
  `Ready nodes: ${readyNodes.map((node) => node.id).join(", ")}`,
  `Waiting nodes: ${waitingNodes.map((node) => node.id).join(", ")}`,
  `Blocked nodes: ${blockedNodes.map((node) => node.id).join(", ")}`,
  `Cadence adjustment: ${snapshot.cadenceAssessment.adjustment}`,
  `CEO recommendation: ${snapshot.ceoDecision.recommendation}`
];

console.log(lines.join("\n"));
