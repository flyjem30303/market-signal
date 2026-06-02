import { spawnSync } from "node:child_process";

const localChecks = [
  {
    id: "bounded-row-coverage-readonly-attempt-decision",
    command: ["scripts/check-bounded-row-coverage-readonly-attempt-decision.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "row-coverage-bounded-readonly-attempt-post-run-review",
    command: ["scripts/check-row-coverage-bounded-readonly-attempt-post-run-review.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "post-equity-row-coverage-readonly-attempt-decision-packet",
    command: ["scripts/check-post-equity-row-coverage-readonly-attempt-decision-packet.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "post-equity-row-coverage-readonly-attempt-post-run-review",
    command: ["scripts/check-post-equity-row-coverage-readonly-attempt-post-run-review.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "public-runtime-boundary-coverage",
    command: ["scripts/check-public-runtime-boundary-coverage.mjs"],
    requiredStatus: "ok"
  },
  {
    id: "localhost-full-health",
    command: ["scripts/check-localhost-full-health.mjs"],
    requiredStatus: "ok"
  }
];

const checks = localChecks.map((check) => {
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

const allLocalChecksOk = checks.every((check) => check.ok);

const report = {
  mode: "bounded_readonly_readiness_recheck",
  status: allLocalChecksOk ? "local_ready_remote_still_separate" : "blocked_needs_local_repair",
  generatedAt: new Date().toISOString(),
  decision: {
    ceoRecommendation: allLocalChecksOk
      ? "local readiness remains sufficient for CEO to separately name a bounded readonly attempt"
      : "repair local re-check failures before discussing a remote attempt",
    pmNextStep: allLocalChecksOk
      ? "continue runtime work unless CEO explicitly names the next bounded readonly attempt"
      : "fix failed local checks and rerun this re-check",
    requiredExplicitAction: "CEO must separately name any Supabase readonly attempt before remote execution"
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
  checks,
  stillBlocked: [
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
  ],
  postRunReviewRequired: [
    "record exactly one attempt",
    "record sanitized aggregate status only",
    "record no secrets and no row payloads",
    "stop after the attempt regardless of success or blocked result",
    "do not promote runtime readiness from remote output without a later accepted gate"
  ]
};

console.log(JSON.stringify(report, null, 2));
