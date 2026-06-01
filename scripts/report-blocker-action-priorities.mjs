import { spawnSync } from "node:child_process";

const reports = [
  {
    command: "scripts/report-data-quality-evidence-checklist.mjs",
    id: "data-quality-evidence"
  },
  {
    command: "scripts/report-source-rights-disclosure-checklist.mjs",
    id: "source-rights-and-disclosure"
  },
  {
    command: "scripts/report-model-credibility-checklist.mjs",
    id: "model-credibility"
  }
].map((report) => {
  const run = spawnSync(process.execPath, [report.command], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  if (run.status !== 0) {
    throw new Error(`${report.command} failed: ${run.stderr.trim()}`);
  }

  return {
    ...report,
    output: JSON.parse(run.stdout)
  };
});

const priorities = {
  mode: "local_blocker_action_priorities",
  status: "ready_for_parallel_local_execution",
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
  firstMove: {
    id: "source-rights-and-disclosure",
    owner: "Legal",
    reason: "Data field-validity is locally specified and QA-reviewed; source rights are now the highest-value blocker that can still move without a remote run.",
    command: "npm run report:source-rights-disclosure-local-review",
    targetSections: ["source-attribution", "redistribution-display-limits", "delay-incompleteness-disclosure"]
  },
  parallelMoves: [
    {
      id: "model-credibility",
      owner: "Investment",
      command: "npm run report:model-credibility-local-review",
      targetSections: ["score-purpose", "interpretation-downgrade-policy"]
    },
    {
      id: "data-quality-evidence",
      owner: "Data",
      command: "npm run report:data-quality-field-validity-qa-review",
      targetSections: ["field-validity-rules", "downgrade-behavior", "readonly-evidence-paused"]
    }
  ],
  laneStatus: reports.map((report) => ({
    id: report.id,
    owner: report.output.owner,
    status: report.output.status,
    pendingSections: report.output.requiredSections
      .filter((section) => section.status.includes("pending") || section.status.includes("waiting"))
      .map((section) => section.id),
    readyToUnblockWhen: report.output.readyToUnblockWhen
  })),
  stopRule: "Do not reopen remote readonly execution, ingestion, SQL, public source promotion, or scoreSource=real from this rollup.",
  ceoRecommendation:
    "Use this rollup as the PM execution order: Legal source-rights first, Investment credibility in parallel, Data holds the QA-reviewed field-validity spec while readonly evidence stays paused."
};

console.log(JSON.stringify(priorities, null, 2));
