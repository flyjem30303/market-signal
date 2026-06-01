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
const blockedNodeIds = new Set(snapshot.decisionNodes.filter((node) => node.status === "blocked").map((node) => node.id));
const waitingNodeIds = new Set(
  snapshot.decisionNodes.filter((node) => node.status === "waiting_explicit_remote_approval").map((node) => node.id)
);

const plan = {
  mode: "local_blocker_resolution_plan",
  status: "local_actions_ready_remote_paused",
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  waiting: [
    {
      id: "row-coverage-readonly",
      owner: "Data",
      state: waitingNodeIds.has("row-coverage-readonly") ? "waiting_explicit_remote_approval" : "not_currently_waiting",
      nextLocalMove: "Keep local preflight, guarded runner, sanitized output contract, post-run acceptance gate, and health-route alignment passing.",
      acceptanceCriteria: [
        "one active chairman or CEO instruction explicitly asks for the readonly attempt",
        "runner remains bounded to count-only evidence",
        "output remains sanitized",
        "no row coverage points are awarded inside the runner",
        "public data source and score source remain mock"
      ]
    }
  ],
  blockers: [
    {
      id: "data-quality-evidence",
      owner: "Data",
      state: blockedNodeIds.has("data-quality-evidence") ? "blocked" : "not_currently_blocked",
      nextLocalMove: "Keep report:data-quality-field-validity-qa-review passing and wait for bounded readonly row-coverage evidence before any score lift.",
      acceptanceCriteria: [
        "row coverage read evidence accepted after a bounded readonly run",
        "field validity rules remain locally specified and QA-reviewed",
        "data quality score reaches at least 80 without manual override",
        "QA review accepts downgrade behavior",
        "no public source or score-source promotion occurs"
      ]
    },
    {
      id: "source-rights-and-disclosure",
      owner: "Legal",
      state: blockedNodeIds.has("source-rights-and-disclosure") ? "blocked" : "not_currently_blocked",
      nextLocalMove: "Run report:source-rights-disclosure-local-review and prepare a human source-terms approval decision.",
      acceptanceCriteria: [
        "source attribution rules are locally reviewed",
        "redistribution and display limits are locally reviewed",
        "non-advisory wording remains blocked until explicit approval",
        "delay and incompleteness wording is ready for human approval",
        "public claim wording remains blocked until legal approval"
      ]
    },
    {
      id: "model-credibility",
      owner: "Investment",
      state: blockedNodeIds.has("model-credibility") ? "blocked" : "not_currently_blocked",
      nextLocalMove: "Run report:model-credibility-local-review and prepare an Investment approval decision for non-advisory interpretation only.",
      acceptanceCriteria: [
        "score purpose and non-advisory framing are locally reviewed",
        "health and risk score formulas are ready for human review",
        "backtest sample period and limitations are ready for human review",
        "downgrade rules remain role-reviewed and runtime-visible",
        "model output remains not approved for real scoring"
      ]
    }
  ],
  unblockDecisionReadiness: {
    status: "local_reviews_complete_external_approvals_pending",
    canRequestHumanApproval: true,
    cannotProceedToRealRuntimeBecause: [
      "row coverage readonly evidence has not been accepted",
      "source-specific rights have not been approved",
      "Investment has not approved public interpretation",
      "data quality score remains below the real-score threshold",
      "scoreSource=real remains explicitly blocked"
    ],
    nextDecisionPacket: "CEO can request a narrow human approval for Legal source terms and Investment non-advisory interpretation while Data waits for a bounded readonly attempt."
  },
  ceoRecommendation: "Move blockers in parallel locally: Legal 45, Investment 35, Data 20. Keep remote readonly execution paused until explicitly requested."
};

console.log(JSON.stringify(plan, null, 2));
