import { spawnSync } from "node:child_process";

const a1Run = runJson("scripts/report-project-progress-snapshot.mjs");
const prerequisitesRun = runJson("scripts/report-promotion-prerequisites-gate.mjs");
const bridgeRun = runJson("scripts/report-mainline-readonly-packet-bridge.mjs");

const sourceGateReady =
  prerequisitesRun.decisionPacket?.canPrepareReadonlyDecisionPacket === true &&
  prerequisitesRun.decisionPacket?.publicDataSource === "mock" &&
  prerequisitesRun.decisionPacket?.scoreSource === "mock";

const bridgeReady =
  bridgeRun.status === "ready_to_present_not_execute" &&
  bridgeRun.safety?.publicDataSource === "mock" &&
  bridgeRun.safety?.scoreSource === "mock";

const intakeAccepted =
  a1Run.a1EvidenceIntake?.acceptanceDecision === "accepted_for_mainline_review" &&
  a1Run.a1EvidenceIntake?.publicDataSource === "mock" &&
  a1Run.a1EvidenceIntake?.scoreSource === "mock";

const report = {
  mode: "a1_market_evidence_handoff_packet",
  status:
    sourceGateReady && bridgeReady && intakeAccepted
      ? "ready_for_mainline_review_not_promotion"
      : "blocked_local_contract_missing",
  acceptedInput: {
    decision: a1Run.a1EvidenceIntake?.acceptanceDecision,
    input: a1Run.a1EvidenceIntake?.acceptedInput,
    intakeMode: "a1_evidence_intake_protocol"
  },
  sourceGate: {
    canPrepareDecisionPacket: prerequisitesRun.decisionPacket?.canPrepareReadonlyDecisionPacket === true,
    completedLocalItems: prerequisitesRun.localOnlyCompleted.length,
    externalApprovalBlockers: prerequisitesRun.externalApprovalBlockers.length,
    remoteEvidenceBlockers: prerequisitesRun.remoteEvidenceBlockers.length,
    status: prerequisitesRun.status
  },
  relatedMainlineBridge: {
    mode: bridgeRun.mode,
    status: bridgeRun.status,
    stillReviewOnly: bridgeRun.preexecutionPacket?.stillRequiresExplicitExecutionRequest === true
  },
  evidenceContext: {
    allowedForm: "sanitized aggregate summary for mainline review",
    forbiddenForm: "record-level payloads, identifiers, credentials, endpoint URLs, or executable remote instructions",
    reviewMeaning:
      "Mainline may read this packet as context, but it cannot use it to run an attempt, grant coverage, or change runtime source state."
  },
  publicDataSource: "mock",
  scoreSource: "mock",
  canExecuteRemoteAttempt: false,
  canAwardRowCoveragePoints: false,
  canPromotePublicDataSource: false,
  canSetScoreSourceReal: false,
  postRunReviewRequired: true,
  blockedPromotions: [
    "publicDataSource=supabase",
    "scoreSource=real",
    "row coverage points",
    "data-quality score lift",
    "readonly attempt execution"
  ],
  stopLine:
    "A1 handoff packet is local review context only; it does not connect to remote services, mutate stored market tables, fetch or ingest market data, print credentials, award coverage, promote publicDataSource=supabase, or set scoreSource=real."
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
