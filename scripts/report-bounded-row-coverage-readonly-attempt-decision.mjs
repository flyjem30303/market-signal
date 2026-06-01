import { spawnSync } from "node:child_process";

const prerequisiteChecks = [
  {
    id: "row-coverage-evidence-acceptance",
    command: ["scripts/check-row-coverage-evidence-acceptance.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "equity-row-coverage-evidence-acceptance-gate",
    command: ["scripts/check-equity-row-coverage-evidence-acceptance-gate.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "row-coverage-second-attempt-final-local-preflight",
    command: ["scripts/check-row-coverage-second-attempt-final-local-preflight.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "row-coverage-second-attempt-sanitized-output-contract",
    command: ["scripts/check-row-coverage-second-attempt-sanitized-output-contract.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "row-coverage-second-attempt-output-sample-validation",
    command: ["scripts/check-row-coverage-second-attempt-output-sample-validation.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "row-coverage-second-attempt-post-run-acceptance-gate",
    command: ["scripts/check-row-coverage-second-attempt-post-run-acceptance-gate.mjs"],
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

const localReady = prerequisites.every((check) => check.ok);

const report = {
  mode: "bounded_row_coverage_readonly_attempt_decision",
  status: localReady ? "ready_for_explicit_one_attempt_decision" : "blocked_needs_local_repair",
  generatedAt: new Date().toISOString(),
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
  decisionBoundary: {
    allowedByThisGate: [
      "local readiness classification for one bounded readonly attempt",
      "accepted clean equity report-only sample as local decision-quality evidence",
      "sanitized output contract validation",
      "post-run review requirement confirmation",
      "CEO/PM decision packaging"
    ],
    stillRequiresExplicitExecutionRequest: [
      "run exactly one Supabase readonly row coverage attempt",
      "connect to Supabase",
      "use production credentials for a remote read",
      "change runtime readiness based on remote output"
    ],
    prohibited: [
      "SQL execution",
      "Supabase writes",
      "staging row writes",
      "daily_prices writes",
      "raw market data fetch or ingestion",
      "printing secrets",
      "printing row payloads or stock_id lists",
      "publicDataSource=supabase",
      "scoreSource=real",
      "row coverage points",
      "CP3_READY_NOW"
    ]
  },
  ceoRecommendation: localReady
    ? "approve only the decision packet readiness; execute remote readonly attempt only as a separately named action"
    : "repair local readiness failures before any remote attempt discussion",
  pmNextStep: localReady
    ? "keep runtime hardening moving, and when the CEO chooses, run one bounded readonly attempt with immediate post-run review"
    : "fix failed prerequisite checkers and rerun this decision gate"
};

console.log(JSON.stringify(report, null, 2));
