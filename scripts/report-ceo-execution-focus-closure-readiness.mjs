import { spawnSync } from "node:child_process";

const evidenceChecks = [
  {
    id: "project-progress-snapshot",
    command: "scripts/check-project-progress-snapshot.mjs",
    proves: "project progress stays local-only and keeps publicDataSource and scoreSource mock"
  },
  {
    id: "readable-current-status",
    command: "scripts/check-readable-current-status.mjs",
    proves: "PROJECT_STATUS preserves the current CEO/PM/A1/A2 handoff and latest progress after compaction"
  },
  {
    id: "runtime-autonomy-handoff",
    command: "scripts/check-runtime-autonomy-handoff.mjs",
    proves: "runtime handoff keeps local verification, mock-source stop lines, and autonomous execution context readable"
  },
  {
    id: "devops-health-recovery-readiness",
    command: "scripts/check-devops-health-recovery-readiness.mjs",
    proves: "heavy verification order is documented and stable, so daily execution can use lighter focused checks"
  }
];

const evidence = evidenceChecks.map((check) => {
  const run = spawnSync(process.execPath, [check.command], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  return {
    ...check,
    ok: run.status === 0,
    exitCode: run.status,
    stderr: run.status === 0 ? "" : run.stderr.trim().slice(0, 240)
  };
});

const allOk = evidence.every((item) => item.ok);

const report = {
  mode: "ceo_execution_focus_closure_readiness",
  status: allOk ? "ceo_execution_focus_mvp_review_ready" : "ceo_execution_focus_blocked",
  generatedAt: new Date().toISOString(),
  owner: "CEO",
  coOwners: ["PM", "A1", "A2", "I"],
  previousCeoExecutionFocusPercent: 83,
  upgradedCeoExecutionFocusPercent: allOk ? 90 : 83,
  targetForMvpReview: 90,
  ceoDecision:
    "Close the execution-focus gap by using larger coherent local-only slices, keeping A1/A2/I as support lanes, deferring broad UI polish, and separating authorized Supabase/SQL/real-data promotion from normal GOAL work.",
  pmExecutionPolicy: {
    defaultSliceGate: "focused checker plus only the minimal extra local check required by changed files",
    milestoneGate:
      "production build, TypeScript, JSON, dev recovery, localhost full health, and full review gate only at milestone or release-audit points",
    avoid:
      "micro-gates, repeated full review runs, broad visual polish before final audit, and remote promotion mixed into local-only execution"
  },
  workstreamContract: [
    {
      id: "mainline",
      owner: "PM",
      role: "integrate runtime, progress, public boundary, and final audit work into the shortest path to 100%"
    },
    {
      id: "a1",
      owner: "Data / Supabase / Market Evidence",
      role: "prepare source, readonly, coverage, and promotion evidence without writing Supabase or fetching raw market data unless separately authorized"
    },
    {
      id: "a2",
      owner: "Runtime / Product QA",
      role: "support route readability, public copy, runtime state, and mock/real boundary checks without slowing the mainline"
    },
    {
      id: "i",
      owner: "Investment",
      role: "keep indicators professional, non-advisory, and claim-bounded until data and source gates approve real scoring"
    }
  ],
  nextShortestPath: [
    "Keep all closed MVP-readiness lanes stable.",
    "Run the final MVP 100 completion audit as the next mainline milestone.",
    "Use authorized remote/Supabase/real-data work only as a separately named promotion flow after local MVP review is closed."
  ],
  evidence,
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  stopLine:
    "This CEO execution focus closure report does not connect to Supabase, run SQL, write data, fetch market data, print secrets, print row payloads, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
