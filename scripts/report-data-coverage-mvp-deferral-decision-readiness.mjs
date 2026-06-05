import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "data-coverage-quality-route-readiness",
    command: "scripts/check-data-coverage-quality-route-readiness.mjs",
    evidence:
      "No-write coverage and quality route is review-ready before any SQL, write, ingestion, row-coverage point award, or source promotion."
  },
  {
    id: "data-goal-readiness",
    command: "scripts/check-data-goal-readiness.mjs",
    evidence:
      "Data-goal readiness accepts bounded readonly post-run review while keeping aggregate row coverage incomplete as the remaining blocker."
  },
  {
    id: "row-coverage-evidence-acceptance",
    command: "scripts/check-row-coverage-evidence-acceptance.mjs",
    evidence:
      "Row coverage evidence is accepted as next-decision material only and does not award row coverage points or runtime promotion."
  },
  {
    id: "source-specific-acceptance-packets-readiness",
    command: "scripts/check-source-specific-acceptance-packets-readiness.mjs",
    evidence:
      "Source-specific acceptance packets map TWII, ETF, equity, storage-boundary, and QA states without authorizing execution."
  },
  {
    id: "source-rights-mvp-deferral-decision-readiness",
    command: "scripts/check-source-rights-mvp-deferral-decision-readiness.mjs",
    evidence:
      "Source-rights deferral decision allows mock MVP review while keeping real source promotion separate."
  },
  {
    id: "mvp-launch-prd",
    command: "scripts/check-mvp-launch-prd.mjs",
    evidence:
      "MVP launch baseline supports mock-only launch review without approving real data promotion."
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
  mode: "data_coverage_mvp_deferral_decision_readiness",
  status: allOk
    ? "mock_mvp_launch_data_coverage_deferral_ready_promotion_blocked"
    : "blocked_data_coverage_mvp_deferral_incomplete",
  owner: "Data",
  coOwners: ["CEO", "PM", "Engineering", "QA", "Legal", "Investment"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 4 : 0,
  upgradedReadinessPercent: allOk ? 92 : 88,
  targetForMvpReview: 95,
  decisionMeaning:
    "MVP launch review may proceed with mock-only data coverage disclosure while aggregate row coverage, data-quality score lift, and real source promotion remain deferred to separate gates.",
  evidence,
  deferralDecisionMap: [
    {
      id: "mock-mvp-data-coverage",
      decision: "accepted_for_mock_mvp_review",
      allowedState: "Public UI may say row coverage is incomplete and mock-only while showing limitations and review status.",
      blockedState: "It must not award row coverage points, claim complete coverage, or imply production data is active."
    },
    {
      id: "backfill-ingestion-route",
      decision: "deferred_to_separate_execution_gate",
      allowedState: "Source-specific backfill, parser, QA, rollback, retention, and post-run review plans can be reviewed locally.",
      blockedState: "SQL, Supabase writes, staging rows, daily_prices modification, ingestion, and raw market storage remain blocked."
    },
    {
      id: "data-quality-score",
      decision: "deferred_until_coverage_and_qa_pass",
      allowedState: "Data-quality score contracts, row coverage evidence, and downgrade rules can stay visible as internal/readiness evidence.",
      blockedState: "Data-quality score lift, row coverage points, and public quality claims are not approved."
    },
    {
      id: "real-data-promotion",
      decision: "deferred_to_source_promotion_gate",
      allowedState: "Promotion prerequisites may list required source rights, QA, readonly/post-run review, and human acceptance.",
      blockedState: "publicDataSource=supabase and scoreSource=real remain blocked."
    }
  ],
  mvpAllowed: [
    "mock-only MVP review with data coverage limitations disclosed",
    "report-only coverage route and source-specific packet review",
    "fail-closed data quality and freshness wording",
    "post-MVP backfill / ingestion / promotion backlog",
    "runtime state that keeps publicDataSource and scoreSource mock"
  ],
  stillNotApproved: [
    "row coverage points",
    "data-quality score increase",
    "publicDataSource=supabase",
    "scoreSource=real",
    "SQL execution",
    "Supabase writes",
    "staging rows",
    "daily_prices modification",
    "market data fetch",
    "market data ingestion",
    "raw market data storage",
    "public real-data claims"
  ],
  nextGapsTo95: [
    "human acceptance of source-specific backfill route",
    "QA threshold acceptance for row coverage and field validity",
    "source-rights acceptance for any future source promotion",
    "separate execution approval for any SQL, staging, or ingestion work",
    "post-run review evidence before data-quality score lift"
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
    "This data coverage MVP deferral decision readiness report does not connect to Supabase, run SQL, write Supabase, create staging rows, modify daily_prices, fetch or ingest market data, print secrets, print row payloads, award row coverage points, increase data-quality score, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
