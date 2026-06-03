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
const expectedRuntimeDefaultRoute = "post_readonly_runtime_decision";

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
const readonlyBridgeRun = spawnSync(process.execPath, ["scripts/report-mainline-readonly-packet-bridge.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (readonlyBridgeRun.status !== 0) {
  throw new Error(`mainline readonly packet bridge failed: ${readonlyBridgeRun.stderr.trim()}`);
}

const readonlyBridge = JSON.parse(readonlyBridgeRun.stdout);

const lines = [
  "CEO Progress Brief",
  `Progress: ${snapshot.project.adjustedScore}%`,
  `Status: ${snapshot.status}`,
  `Lane ratio: ${snapshot.ceoDecision.currentLaneRatio}`,
  `Cadence: ${snapshot.cadenceAssessment.verdict} -> ${snapshot.cadenceAssessment.nextExecutionMode}`,
  `Slice size: ${snapshot.cadenceAssessment.targetSliceSize}`,
  `Workstream mix: PM ${snapshot.runtimeWorkstreamIntegration.workMix.pmRuntime}% / A1 ${snapshot.runtimeWorkstreamIntegration.workMix.a1Evidence}% / A2 ${snapshot.runtimeWorkstreamIntegration.workMix.a2PublicCopy}% / I ${snapshot.runtimeWorkstreamIntegration.workMix.iLaunchOps}%`,
  `Workstream status: ${snapshot.runtimeWorkstreamIntegration.status} / ${snapshot.runtimeWorkstreamIntegration.currentMainline}`,
  `Workstream queue: ${snapshot.runtimeWorkstreamIntegration.items.map((item) => `${item.id}:${item.status}`).join(", ")}`,
  `Runtime: ${snapshot.runtime.score}% / ${snapshot.runtime.status}`,
  `Runtime route: ${snapshot.runtimeRoute.currentDefaultRoute} / ${snapshot.runtimeRoute.status}`,
  `Remote trigger: ${snapshot.runtimeRoute.separateRemoteTrigger}`,
  `Route options: ${snapshot.runtimeRoute.routeOptions.map((item) => `${item.id}:${item.status}`).join(", ")}`,
  `Row coverage: ${snapshot.rowCoverage.readiness}`,
  `Freshness evidence: ${snapshot.freshness.latestEvidenceStatus}`,
  `Blocker queue: ${snapshot.blockerExecutionQueue.status} / ${snapshot.blockerExecutionQueue.ceoLaneRatio}`,
  `Queue items: ${snapshot.blockerExecutionQueue.items.map((item) => item.id).join(", ")}`,
  `A1 intake: ${snapshot.a1EvidenceIntake.acceptanceDecision} / ${snapshot.a1EvidenceIntake.currentA1GateStatus}`,
  `A1 verification: ${snapshot.a1EvidenceIntake.verificationOrder.map((item) => `${item.order}:${item.id}`).join(", ")}`,
  `Readonly bridge: ${readonlyBridge.status} / ${readonlyBridge.a1Intake.decision}`,
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
