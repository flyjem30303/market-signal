import { spawnSync } from "node:child_process";

const a1Run = runJson("scripts/report-project-progress-snapshot.mjs");
const prerequisitesRun = runJson("scripts/report-promotion-prerequisites-gate.mjs");
const preexecutionRun = runJson("scripts/report-row-coverage-readonly-preexecution-packet.mjs");

const bridgeReady =
  a1Run.a1EvidenceIntake?.acceptanceDecision === "accepted_for_mainline_review" &&
  prerequisitesRun.decisionPacket?.canPrepareReadonlyDecisionPacket === true &&
  preexecutionRun.status === "ready_to_present_not_execute";

const report = {
  mode: "mainline_readonly_packet_bridge",
  status: bridgeReady ? "ready_to_present_not_execute" : "blocked_before_presentation",
  a1Intake: {
    acceptedInput: a1Run.a1EvidenceIntake?.acceptedInput,
    decision: a1Run.a1EvidenceIntake?.acceptanceDecision,
    gateStatus: a1Run.a1EvidenceIntake?.currentA1GateStatus
  },
  mainlineUse:
    "Use this bridge to present a bounded readonly decision packet only; do not execute the attempt from this report.",
  prerequisiteSummary: {
    externalApprovalBlockers: prerequisitesRun.externalApprovalBlockers.length,
    localOnlyCompleted: prerequisitesRun.localOnlyCompleted.length,
    remoteEvidenceBlockers: prerequisitesRun.remoteEvidenceBlockers.length
  },
  preexecutionPacket: {
    decisionQuestion: preexecutionRun.decisionQuestion,
    stillRequiresExplicitExecutionRequest:
      preexecutionRun.executionCommandPreview?.stillRequiresExplicitExecutionRequest === true,
    status: preexecutionRun.status
  },
  verificationOrder: a1Run.a1EvidenceIntake?.verificationOrder ?? [],
  safety: {
    connectionAttempted: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  blockedPromotions: [
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage points",
    "data-quality score lift",
    "readonly attempt execution"
  ],
  stopLine:
    "Mainline readonly packet bridge does not run SQL, connect to Supabase, write Supabase, fetch or ingest market data, print secrets, execute readonly attempts, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));

function runJson(script) {
  const run = spawnSync(process.execPath, [script], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });
  if (run.status !== 0) {
    throw new Error(`${script} failed: ${run.stderr.trim()}`);
  }
  return JSON.parse(run.stdout);
}
