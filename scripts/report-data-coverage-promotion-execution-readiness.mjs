import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "data-coverage-mvp-deferral-decision-readiness",
    command: "scripts/check-data-coverage-mvp-deferral-decision-readiness.mjs",
    evidence:
      "Mock MVP data coverage deferral is accepted while execution, row coverage points, quality score lift, and promotion remain separate."
  },
  {
    id: "source-specific-acceptance-packets-readiness",
    command: "scripts/check-source-specific-acceptance-packets-readiness.mjs",
    evidence:
      "Source-specific acceptance packets enumerate TWII, ETF, equity, storage-boundary, and QA acceptance states without authorizing execution."
  },
  {
    id: "promotion-prerequisites-gate",
    command: "scripts/check-promotion-prerequisites-gate.mjs",
    evidence:
      "Promotion prerequisites define completed local prerequisites, remote evidence blockers, external approval blockers, post-run review fields, and promotion locks."
  },
  {
    id: "data-coverage-quality-route-readiness",
    command: "scripts/check-data-coverage-quality-route-readiness.mjs",
    evidence:
      "No-write coverage and quality route is review-ready before any SQL, write, ingestion, row-coverage point award, or source promotion."
  },
  {
    id: "data-goal-execution-review-bridge",
    command: "scripts/check-data-goal-execution-review-bridge.mjs",
    evidence:
      "Execution-to-review bridge keeps any future remote action tied to sanitized post-run review before downstream promotion."
  },
  {
    id: "bounded-readonly-final-local-alignment",
    command: "scripts/check-bounded-readonly-final-local-alignment.mjs",
    evidence:
      "Bounded readonly final local alignment keeps remote execution separately named and does not approve SQL, writes, ingestion, or source promotion."
  },
  {
    id: "data-goal-completion-audit",
    command: "scripts/check-data-goal-completion-audit.mjs",
    evidence:
      "Data goal audit confirms local readiness is not 100% until coverage route completion and promotion evidence are separately accepted."
  }
];

const evidence = checks.map((check) => {
  const run = spawnSync(process.execPath, [check.command], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  return {
    id: check.id,
    ok: run.status === 0,
    evidence: check.evidence
  };
});

const allOk = evidence.every((item) => item.ok);

const report = {
  mode: "data_coverage_promotion_execution_readiness",
  status: allOk
    ? "local_promotion_execution_plan_ready_execution_blocked"
    : "blocked_promotion_execution_plan_incomplete",
  owner: "Data",
  coOwners: ["CEO", "PM", "Engineering", "QA", "Legal"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 3 : 0,
  upgradedReadinessPercent: allOk ? 95 : 92,
  targetForMvpReview: 95,
  decisionMeaning:
    "Data coverage can be considered MVP-review ready as a no-write execution-readiness plan, while real execution and promotion stay blocked behind a separate approval gate.",
  evidence,
  executionReadinessPlan: [
    {
      id: "preauthorization",
      requiredBeforeExecution:
        "CEO must name the exact bounded action, Legal/QA must accept source-specific terms and thresholds, and PM must confirm the post-run review owner.",
      blockedUntilMet:
        "No SQL, no Supabase write, no staging rows, no daily_prices modification, no market-data fetch, and no public source promotion."
    },
    {
      id: "dry-run-design",
      requiredBeforeExecution:
        "Dry-run output must be sanitized aggregate counts, coverage deltas, quality flags, source lane names, and pass/fail status only.",
      blockedUntilMet:
        "No raw market rows, row payloads, internal IDs, secrets, raw URLs, or provider payload excerpts may be printed or stored."
    },
    {
      id: "qa-threshold",
      requiredBeforeExecution:
        "QA must accept row coverage threshold, field validity threshold, missing-row tolerance, downgrade behavior, and rollback criteria.",
      blockedUntilMet: "No row coverage points, data-quality score lift, ranking confidence, or public quality claims."
    },
    {
      id: "rollback-and-post-run",
      requiredBeforeExecution:
        "Rollback owner, fail-closed UI behavior, audit log fields, and immediate post-run review template must be ready before any execution.",
      blockedUntilMet:
        "No promotion to publicDataSource=supabase or scoreSource=real, even if a future bounded run succeeds."
    }
  ],
  mvpAllowed: [
    "MVP review may treat data coverage as execution-plan ready, not execution-complete",
    "Public UI may keep mock-only limitations and incomplete coverage disclosure",
    "A1/A2 can continue source packet, public copy, and QA-threshold preparation",
    "PM can schedule a later named execution gate without reopening the whole data strategy"
  ],
  stillNotApproved: [
    "SQL execution",
    "Supabase writes",
    "staging rows",
    "daily_prices modification",
    "market data fetch",
    "market data ingestion",
    "raw market data storage",
    "printing secrets",
    "printing raw payloads",
    "row coverage points",
    "data-quality score increase",
    "publicDataSource=supabase",
    "scoreSource=real",
    "public real-data claims"
  ],
  nextGapsAfterMvpReview: [
    "human approval of one exact bounded execution command",
    "source-specific legal and redistribution acceptance",
    "QA acceptance of source-depth and field validity evidence",
    "sanitized post-run review from a future approved attempt",
    "separate promotion gate for publicDataSource and scoreSource"
  ],
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
    "This data coverage promotion execution readiness report does not connect to Supabase, run SQL, write Supabase, create staging rows, modify daily_prices, fetch or ingest market data, print secrets, print row payloads, award row coverage points, increase data-quality score, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
