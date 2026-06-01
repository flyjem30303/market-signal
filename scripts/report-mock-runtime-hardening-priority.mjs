import { spawnSync } from "node:child_process";

const prerequisiteChecks = [
  {
    id: "bounded-row-coverage-readonly-attempt-decision",
    command: ["scripts/check-bounded-row-coverage-readonly-attempt-decision.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "project-progress-snapshot",
    command: ["scripts/check-project-progress-snapshot.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "ceo-progress-brief",
    command: ["scripts/check-ceo-progress-brief.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "localhost-full-health",
    command: ["scripts/check-localhost-full-health.mjs"],
    requiredStatus: "ok"
  }
];

const prerequisites = prerequisiteChecks.map((check) => {
  const run = spawnSync(process.execPath, check.command, {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  return {
    ...check,
    ok: run.status === 0,
    statusCode: run.status ?? 1
  };
});

const ready = prerequisites.every((check) => check.ok);

const report = {
  mode: "mock_runtime_hardening_priority",
  status: ready ? "runtime_hardening_selected" : "blocked_needs_local_repair",
  generatedAt: new Date().toISOString(),
  decision: {
    ceoChoice: "prioritize mock runtime hardening before Supabase row coverage attempt",
    rationale: [
      "bounded row coverage readonly decision is ready but requires a separately named remote action",
      "mock runtime hardening improves product usability and result interpretation immediately",
      "real data promotion still depends on source rights, model credibility, data quality, and public-claim gates"
    ],
    laneRatio: {
      mockRuntimeHardening: 70,
      supabaseReadonlyPreparation: 30
    },
    nextRuntimeSlice: [
      "clarify public mock/runtime boundary",
      "improve readiness state interpretation",
      "keep local health and review gates stable",
      "prepare UI to receive readonly evidence without promoting publicDataSource or scoreSource"
    ]
  },
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  prerequisites,
  stopRule:
    "Do not run SQL, do not write Supabase, do not fetch or ingest raw market data, do not print secrets, do not print row payloads, do not set publicDataSource=supabase, and do not set scoreSource=real.",
  pmNextStep: ready
    ? "execute a mock runtime hardening slice, then rerun build, localhost full health, and review gates"
    : "repair failed local checks before changing runtime UI or state"
};

console.log(JSON.stringify(report, null, 2));
