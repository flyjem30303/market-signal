import { spawnSync } from "node:child_process";

const planRun = spawnSync(process.execPath, ["scripts/report-blocker-resolution-plan.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (planRun.status !== 0) {
  throw new Error(`blocker resolution plan failed: ${planRun.stderr.trim()}`);
}

const plan = JSON.parse(planRun.stdout);

const queue = {
  mode: "local_blocker_execution_queue",
  status: "parallel_local_actions_ready_remote_paused",
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
  cadence: {
    ceoLaneRatio: "Data 50 / Legal 25 / Investment 25",
    pmRule: "advance one acceptance item per lane before reopening Supabase readonly execution",
    stopRule: "stop before SQL, Supabase writes, raw market data ingestion, public source promotion, or scoreSource=real"
  },
  executionQueue: [
    {
      id: "data-quality-evidence",
      owner: "Data",
      priority: 1,
      currentState: plan.blockers.find((blocker) => blocker.id === "data-quality-evidence")?.state ?? "unknown",
      nextCommand: "npm run report:data-quality-evidence-checklist",
      nextArtifact: "field validity and downgrade evidence checklist",
      readyToExecuteLocally: true,
      doneWhen: [
        "required market fields have documented validity rules",
        "downgrade behavior has QA acceptance criteria",
        "row coverage evidence can be referenced without row payloads",
        "data quality score threshold is explicit",
        "real-score candidacy remains blocked until review"
      ]
    },
    {
      id: "source-rights-and-disclosure",
      owner: "Legal",
      priority: 2,
      currentState:
        plan.blockers.find((blocker) => blocker.id === "source-rights-and-disclosure")?.state ?? "unknown",
      nextCommand: "npm run report:source-rights-disclosure-checklist",
      nextArtifact: "source rights and public disclosure checklist",
      readyToExecuteLocally: true,
      doneWhen: [
        "source attribution wording is documented",
        "redistribution and display limits are documented",
        "delay and incompleteness wording is approved for public UI",
        "non-advisory wording is approved",
        "public claim promotion remains blocked until legal review"
      ]
    },
    {
      id: "model-credibility",
      owner: "Investment",
      priority: 3,
      currentState: plan.blockers.find((blocker) => blocker.id === "model-credibility")?.state ?? "unknown",
      nextCommand: "npm run report:model-credibility-checklist",
      nextArtifact: "model credibility review checklist",
      readyToExecuteLocally: true,
      doneWhen: [
        "score purpose is approved as non-advisory",
        "formula documentation is complete enough for review",
        "backtest limits and sample period are disclosed",
        "downgrade policy is role-reviewed",
        "model output remains not approved for real scoring"
      ]
    }
  ],
  remoteWaitingQueue: [
    {
      id: "row-coverage-readonly",
      owner: "Data",
      state: plan.waiting.find((item) => item.id === "row-coverage-readonly")?.state ?? "unknown",
      unlockCondition: "explicit CEO or chairman instruction for exactly one bounded readonly attempt",
      localHold: "keep preflight, guarded runner, sanitized output contract, and post-run acceptance gate passing"
    }
  ],
  ceoRecommendation:
    "Proceed with the local execution queue in parallel. Do not spend more governance effort unless a queue item lacks acceptance criteria."
};

console.log(JSON.stringify(queue, null, 2));
